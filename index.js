const psuedoLocalizeString = require("./localize");

const pseudoLocalization = (() => {
  const opts = {
    blacklistedNodeNames: ["STYLE"]
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

  const isNonEmptyString = (str) => str && typeof str === 'string';

  const pseudoLocalize = (element) => {
    const textNodesUnderElement = textNodesUnder(element);
    for (let textNode of textNodesUnderElement) {
      const nodeValue = textNode.nodeValue;
      if(isNonEmptyString(nodeValue)) {
        textNode.nodeValue = psuedoLocalizeString(nodeValue, opts);
      }
    }
  };

  const domMutationCallback = mutationsList => {
    for (var mutation of mutationsList) {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        // Turn the observer off while performing dom manipulation to prevent
        // infinite dom mutation callback loops
        observer.disconnect();
        // For every node added, recurse down it's subtree and convert
        // all children as well.
        mutation.addedNodes.forEach(pseudoLocalize);
        observer.observe(document.body, observerConfig);
      } else if (mutation.type === "characterData") {
        // Turn the observer off while performing dom manipulation to prevent
        // infinite dom mutation callback loops
        observer.disconnect();
        const nodeValue = mutation.target;
        if (isNonEmptyString(nodeValue)) {
          // The target will always be a text node so it can be converted
          // directly.
          mutation.target.nodeValue = psuedoLocalizeString(
            nodeValue
          );
        }
        
        observer.observe(document.body, observerConfig);
      }
    }
  };

  // Observe dom update and pseudo localize changed nodes.
  const observer = new MutationObserver(domMutationCallback);
  const observerConfig = {
    characterData: true,
    childList: true,
    subtree: true
  };

  const start = (
    options = {
      strategy: "accented",
      blacklistedNodeNames: opts.blacklistedNodeNames
    }
  ) => {
    opts.blacklistedNodeNames = options.blacklistedNodeNames;
    opts.strategy = options.strategy;
    pseudoLocalize(document.body);
    observer.observe(document.body, observerConfig);
  };

  const stop = () => {
    observer.disconnect();
  };

  return {
    start,
    stop,
    localize: psuedoLocalizeString
  };
})();

module.exports = pseudoLocalization;
