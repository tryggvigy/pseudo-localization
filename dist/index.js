import pseudoLocalizeString from './localize.js';
/**
 * export the underlying pseudo localization function so this import style
 *  import { localize } from 'pseudo-localization';
 * can be used.
 */
export { default as localize } from './localize.js';
const pseudoLocalization = (() => {
    const mutationObserverOpts = {
        blacklistedNodeNames: ['STYLE'],
    };
    const opts = {
        strategy: 'accented',
    };
    // Indicates whether the pseudo-localization is currently enabled.
    let enabled = false;
    // Observer for dom updates. Initialization is defered to make parts
    // of the API safe to use in non-browser environments like nodejs
    let observer = null;
    const observerConfig = {
        characterData: true,
        childList: true,
        subtree: true,
    };
    const textNodesUnder = (element) => {
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, node => {
            const isAllWhitespace = node.nodeValue && !/[^\s]/.test(node.nodeValue);
            if (isAllWhitespace) {
                return NodeFilter.FILTER_REJECT;
            }
            const isBlacklistedNode = node.parentElement &&
                mutationObserverOpts.blacklistedNodeNames.includes(node.parentElement.nodeName);
            if (isBlacklistedNode) {
                return NodeFilter.FILTER_REJECT;
            }
            return NodeFilter.FILTER_ACCEPT;
        });
        let currNode;
        const textNodes = [];
        while ((currNode = walker.nextNode()))
            textNodes.push(currNode);
        return textNodes;
    };
    const isNonEmptyString = (str) => !!str && typeof str === 'string';
    const pseudoLocalize = (element) => {
        const textNodesUnderElement = textNodesUnder(element);
        for (let textNode of textNodesUnderElement) {
            const nodeValue = textNode.nodeValue;
            if (isNonEmptyString(nodeValue)) {
                textNode.nodeValue = pseudoLocalizeString(nodeValue, opts);
            }
        }
    };
    const domMutationCallback = mutationsList => {
        if (!observer) {
            return;
        }
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // Turn the observer off while performing dom manipulation to prevent
                // infinite dom mutation callback loops
                observer.disconnect();
                // For every node added, recurse down it's subtree and convert
                // all children as well
                mutation.addedNodes.forEach(pseudoLocalize);
                observer.observe(document.body, observerConfig);
            }
            else if (mutation.type === 'characterData') {
                const nodeValue = mutation.target.nodeValue;
                const isBlacklistedNode = !!mutation.target.parentElement &&
                    mutationObserverOpts.blacklistedNodeNames.includes(mutation.target.parentElement.nodeName);
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
    const isEnabled = () => {
        return enabled;
    };
    const start = ({ strategy = 'accented', blacklistedNodeNames = mutationObserverOpts.blacklistedNodeNames, } = {}) => {
        if (isEnabled()) {
            console.error('pseudo-localization is already enabled');
            return;
        }
        mutationObserverOpts.blacklistedNodeNames = blacklistedNodeNames;
        opts.strategy = strategy;
        // Pseudo localize the DOM
        pseudoLocalize(document.body);
        // Start observing the DOM for changes and run
        // pseudo localization on any added text nodes
        observer = new MutationObserver(domMutationCallback);
        observer.observe(document.body, observerConfig);
        enabled = true;
    };
    const stop = () => {
        if (!isEnabled()) {
            console.error('pseudo-localization is already disabled');
            return;
        }
        observer && observer.disconnect();
        enabled = false;
    };
    return {
        start,
        stop,
        isEnabled,
        localize: pseudoLocalizeString,
    };
})();
export default pseudoLocalization;
