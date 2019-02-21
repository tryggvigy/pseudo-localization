import pseudoLocalizeString from './localize.js';

/**
 * export the underlying pseudo localization function so this import style
 *  import { localize } from 'pseudo-localization';
 * can be used.
 */
export { default as localize } from './localize.js';

const pseudoLocalization = (() => {
  const opts = {
    blacklistedNodeNames: ['STYLE'],
  };

  // Observer for dom updates. Initialization is defered to make parts
  // of the API safe to use in non-browser environments like nodejs
  let observer = null;
  const observerConfig = {
    characterData: true,
    childList: true,
    subtree: true,
  };

  const textNodesUnder = element => {
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      node => {
        const isAllWhitespace = !/[^\s]/.test(node.nodeValue);
        if (isAllWhitespace) return NodeFilter.FILTER_REJECT;

        const isBlacklistedNode = opts.blacklistedNodeNames.includes(
          node.parentElement.nodeName
        );
        if (isBlacklistedNode) return NodeFilter.FILTER_REJECT;

        return NodeFilter.FILTER_ACCEPT;
      }
    );

    let currNode;
    const textNodes = [];
    while ((currNode = walker.nextNode())) textNodes.push(currNode);
    return textNodes;
  };

  const isNonEmptyString = str => str && typeof str === 'string';

  const pseudoLocalize = element => {
    const textNodesUnderElement = textNodesUnder(element);
    for (let textNode of textNodesUnderElement) {
      const nodeValue = textNode.nodeValue;
      if (isNonEmptyString(nodeValue)) {
        textNode.nodeValue = pseudoLocalizeString(nodeValue, opts);
      }
    }
  };

  const domMutationCallback = mutationsList => {
    for (let mutation of mutationsList) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        // Turn the observer off while performing dom manipulation to prevent
        // infinite dom mutation callback loops
        observer.disconnect();
        // For every node added, recurse down it's subtree and convert
        // all children as well
        mutation.addedNodes.forEach(pseudoLocalize);
        observer.observe(document.body, observerConfig);
      } else if (mutation.type === 'characterData') {
        const nodeValue = mutation.target.nodeValue;
        const isBlacklistedNode = opts.blacklistedNodeNames.includes(
          mutation.target.parentElement.nodeName
        );
        if (isNonEmptyString(nodeValue) && !isBlacklistedNode) {
          // Turn the observer off while performing dom manipulation to prevent
          // infinite dom mutation callback loops
          observer.disconnect();
          // The target will always be a text node so it can be converted
          // directly
          mutation.target.nodeValue = pseudoLocalizeString(nodeValue, opts);
          observer.observe(document.body, observerConfig);
        }
      }
    }
  };

  const start = ({
    strategy = 'accented',
    blacklistedNodeNames = opts.blacklistedNodeNames,
  } = {}) => {
    opts.blacklistedNodeNames = blacklistedNodeNames;
    opts.strategy = strategy;
    // Pseudo localize the DOM
    pseudoLocalize(document.body);
    // Start observing the DOM for changes and run
    // pseudo localization on any added text nodes
    observer = new MutationObserver(domMutationCallback);
    observer.observe(document.body, observerConfig);
  };

  const stop = () => {
    observer && observer.disconnect();
  };

  return {
    start,
    stop,
    localize: pseudoLocalizeString,
  };
})();

export default pseudoLocalization;
