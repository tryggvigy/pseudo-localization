const pseudoLocalization = (() => {
  const ACCENTED_MAP = {
    a: "ȧ",
    A: "Ȧ",
    b: "ƀ",
    B: "Ɓ",
    c: "ƈ",
    C: "Ƈ",
    d: "ḓ",
    D: "Ḓ",
    e: "ḗ",
    E: "Ḗ",
    f: "ƒ",
    F: "Ƒ",
    g: "ɠ",
    G: "Ɠ",
    h: "ħ",
    H: "Ħ",
    i: "ī",
    I: "Ī",
    j: "ĵ",
    J: "Ĵ",
    k: "ķ",
    K: "Ķ",
    l: "ŀ",
    L: "Ŀ",
    m: "ḿ",
    M: "Ḿ",
    n: "ƞ",
    N: "Ƞ",
    o: "ǿ",
    O: "Ǿ",
    p: "ƥ",
    P: "Ƥ",
    q: "ɋ",
    Q: "Ɋ",
    r: "ř",
    R: "Ř",
    s: "ş",
    S: "Ş",
    t: "ŧ",
    T: "Ŧ",
    v: "ṽ",
    V: "Ṽ",
    u: "ŭ",
    U: "Ŭ",
    w: "ẇ",
    W: "Ẇ",
    x: "ẋ",
    X: "Ẋ",
    y: "ẏ",
    Y: "Ẏ",
    z: "ẑ",
    Z: "Ẑ"
  };

  const BIDI_MAP = {
    a: "ɐ",
    A: "∀",
    b: "q",
    B: "Ԑ",
    c: "ɔ",
    C: "Ↄ",
    d: "p",
    D: "ᗡ",
    e: "ǝ",
    E: "Ǝ",
    f: "ɟ",
    F: "Ⅎ",
    g: "ƃ",
    G: "⅁",
    h: "ɥ",
    H: "H",
    i: "ı",
    I: "I",
    j: "ɾ",
    J: "ſ",
    k: "ʞ",
    K: "Ӽ",
    l: "ʅ",
    L: "⅂",
    m: "ɯ",
    M: "W",
    n: "u",
    N: "N",
    o: "o",
    O: "O",
    p: "d",
    P: "Ԁ",
    q: "b",
    Q: "Ò",
    r: "ɹ",
    R: "ᴚ",
    s: "s",
    S: "S",
    t: "ʇ",
    T: "⊥",
    u: "n",
    U: "∩",
    v: "ʌ",
    V: "Ʌ",
    w: "ʍ",
    W: "M",
    x: "x",
    X: "X",
    y: "ʎ",
    Y: "⅄",
    z: "z",
    Z: "Z"
  };

  let opts = {
    prefix: "",
    postfix: "",
    map: ACCENTED_MAP,
    elongate: true
  };

  const textNodesUnder = element => {
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      node => {
        const isAllWhitespace = !/[^\s]/.test(node.nodeValue);
        if (isAllWhitespace) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    );

    let currNode;
    const textNodes = [];
    while ((currNode = walker.nextNode())) textNodes.push(currNode);
    return textNodes;
  };

  const psuedoLocalizeString = string => {
    let pseudoLocalizedText = "";
    for (let character of string) {
      if (opts.map[character]) {
        const cl = character.toLowerCase();
        // duplicate "a", "e", "o" and "u" to emulate ~30% longer text
        if (
          opts.elongate &&
          (cl === "a" || cl === "e" || cl === "o" || cl === "u")
        ) {
          pseudoLocalizedText += opts.map[character] + opts.map[character];
        } else pseudoLocalizedText += opts.map[character];
      } else pseudoLocalizedText += character;
    }

    // If this string is from the DOM, it should already contain the pre- and postfix.
    if (
      pseudoLocalizedText.startsWith(opts.prefix) &&
      pseudoLocalizedText.endsWith(opts.postfix)
    ) {
      return pseudoLocalizedText;
    }
    return opts.prefix + pseudoLocalizedText + opts.postfix;
  };

  const pseudoLocalize = element => {
    const textNodesUnderElement = textNodesUnder(element);
    for (let textNode of textNodesUnderElement) {
      textNode.nodeValue = psuedoLocalizeString(textNode.nodeValue);
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
        // The target will always be a text node so it can be converted
        // directly.
        mutation.target.nodeValue = psuedoLocalizeString(
          mutation.target.nodeValue
        );
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

  const start = (options = { strategy: "accented" }) => {
    if (options.strategy === "bidi") {
      // Surround words with Unicode formatting marks forcing
      // the RTL directionality of characters.
      opts.prefix = "\u202e";
      opts.postfix = "\u202c";
      opts.map = BIDI_MAP;
      opts.elongate = false;
    }

    pseudoLocalize(document.body);
    observer.observe(document.body, observerConfig);
  };

  const stop = () => {
    observer.disconnect();
  };

  return {
    start,
    stop
  };
})();

module.exports = pseudoLocalization;
