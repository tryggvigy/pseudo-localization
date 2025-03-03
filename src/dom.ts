import {
  pseudoLocalizeString,
  type PseudoLocalizeStringOptions,
} from './localize.ts';

function isNonEmptyString(str: string | null | undefined): str is string {
  return !!str && typeof str === 'string';
}

type StartOptions = PseudoLocalizeStringOptions & {
  /**
   * Node tags to ignore in pseudo-localization.
   *
   * @default ['STYLE']
   */
  blacklistedNodeNames?: string[];
  /**
   * The element to pseudo-localize text within.
   *
   * @default document.body
   */
  root?: Node;
};

type StopFn = () => void;

/**
 * A container for pseudo-localization of the DOM.
 *
 * @example
 * new PseudoLocalizeDom().start();
 */
export class PseudoLocalizeDom {
  /**
   * Indicates which elements the pseudo-localization is currently running on.
   */
  #enabledOn = new WeakSet<Node>();

  /**
   * Start pseudo-localizing the DOM.
   *
   * Returns a stop function to disable pseudo-localization.
   */
  start({
    strategy = 'accented',
    blacklistedNodeNames = ['STYLE'],
    root,
  }: StartOptions = {}): StopFn {
    const rootEl = root ?? document.body;

    if (this.#enabledOn.has(rootEl)) {
      console.warn(
        `Start aborted. pseudo-localization is already enabled on`,
        rootEl
      );
      return () => {};
    }

    const observerConfig = {
      characterData: true,
      childList: true,
      subtree: true,
    };

    const textNodesUnder = (node: Node) => {
      const walker = document.createTreeWalker(
        node,
        NodeFilter.SHOW_TEXT,
        (node) => {
          const isAllWhitespace =
            node.nodeValue && !/[^\s]/.test(node.nodeValue);
          if (isAllWhitespace) {
            return NodeFilter.FILTER_REJECT;
          }

          const isBlacklistedNode =
            node.parentElement &&
            blacklistedNodeNames.includes(node.parentElement.nodeName);
          if (isBlacklistedNode) {
            return NodeFilter.FILTER_REJECT;
          }

          return NodeFilter.FILTER_ACCEPT;
        }
      );

      let currNode;
      const textNodes = [];
      while ((currNode = walker.nextNode())) textNodes.push(currNode);
      return textNodes;
    };

    const pseudoLocalize = (node: Node) => {
      const textNodesUnderElement = textNodesUnder(node);
      for (const textNode of textNodesUnderElement) {
        const nodeValue = textNode.nodeValue;
        if (isNonEmptyString(nodeValue)) {
          textNode.nodeValue = pseudoLocalizeString(nodeValue, { strategy });
        }
      }
    };

    // Pseudo localize the DOM
    pseudoLocalize(document.body);

    // Start observing the DOM for changes and run
    // pseudo localization on any added text nodes
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // Turn the observer off while performing dom manipulation to prevent
          // infinite dom mutation callback loops
          observer.disconnect();
          // For every node added, recurse down it's subtree and convert
          // all children as well
          mutation.addedNodes.forEach(pseudoLocalize.bind(this));
          observer.observe(document.body, observerConfig);
        } else if (mutation.type === 'characterData') {
          const nodeValue = mutation.target.nodeValue;
          const isBlacklistedNode =
            !!mutation.target.parentElement &&
            blacklistedNodeNames.includes(
              mutation.target.parentElement.nodeName
            );
          if (isNonEmptyString(nodeValue) && !isBlacklistedNode) {
            // Turn the observer off while performing dom manipulation to prevent
            // infinite dom mutation callback loops
            observer.disconnect();
            // The target will always be a text node so it can be converted
            // directly
            mutation.target.nodeValue = pseudoLocalizeString(nodeValue, {
              strategy,
            });
            observer.observe(document.body, observerConfig);
          }
        }
      }
    });

    observer.observe(document.body, observerConfig);
    this.#enabledOn.add(rootEl);

    const stop = () => {
      if (!this.#enabledOn.has(rootEl)) {
        console.warn(
          'Stop aborted. pseudo-localization is not running on',
          rootEl
        );
        return;
      }
      observer.disconnect();
      this.#enabledOn.delete(rootEl);
    };
    return stop;
  }
}
