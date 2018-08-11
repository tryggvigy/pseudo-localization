const map = {
  a: "àáâãäåāăąǻȁȃ",
  A: "ÀÁÂÃÄÅĀĂĄǺȀȂ",
  b: "ƀƂƃƄƅɓ",
  B: "ßƁɃʙβ",
  c: "çćĉċč",
  C: "ÇĆĈĊČ",
  d: "ďđðδ",
  D: "ĎĐƉƊ",
  e: "èēĕėęěȅȇ",
  E: "ĒĔĖĘĚȄȆÉ",
  f: "ƒ",
  F: "Ƒ",
  g: "ĝğġģϱ",
  G: "ĜĞĠĢ",
  h: "ĥħλ",
  H: "ĤĦ",
  I: "ĨĪĬĮİÍ",
  i: "ĩīĭįıï",
  J: "ĵ",
  j: "Ĵ",
  K: "ĶƘϏ",
  k: "ķĸƙ",
  l: "ĺļľŀłℓ",
  L: "ĹĻĽĿŁ£",
  m: "₥",
  N: "ŃŅŇŊƝ",
  n: "ńņňŉŋƞกี้ñ",
  o: "ōŏőơô",
  O: "ŌŎŐƠÓ",
  P: "Ƥ",
  p: "ƥƿþ",
  Q: "ǪǬ",
  q: "ǫǭɋ",
  r: "ŕŗř",
  R: "ŔŖŘƦ",
  S: "ŚŜŞŠ§",
  s: "śŝşšȿƨ",
  T: "ŢŤŦ",
  t: "ţťŧƭ†",
  v: "ѷƲ",
  U: "ŨŪŬŮŰŲÛ",
  u: "ũūŭůűųม้ú",
  w: "ŵผึ้",
  W: "Ŵ",
  Y: "ŶŸƳȲɎ¥ÝⓎ",
  y: "ŷƴȳɏ",
  Z: "ŹŻŽƵ",
  z: "źżžƶ"
};

const explosionSymbols = [
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten"
];

const textNodesUnder = element => {
  let n;
  const a = [];
  const walk = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    node => {
      if (isIgnorable(node)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  );
  while ((n = walk.nextNode())) a.push(n);
  return a;
};

const pseudoLocalization = element => {
  const allTextNodes = textNodesUnder(element);
  for (let textNode of allTextNodes) {
    textNode.nodeValue = getPseudoTextOfTextNode(textNode);
  }
};

const getPseudoTextOfTextNode = textNode => {
  let pseudoLocalizedText = "";
  for (let c of textNode.nodeValue) {
    if (map[c]) {
      pseudoLocalizedText += map[c][Math.floor(Math.random() * map[c].length)];
    } else pseudoLocalizedText += c;
  }

  const explodeRatio = 1.4;
  const explodedTextLength = Math.ceil(
    textNode.nodeValue.length * explodeRatio
  );
  let i = 0;
  while (pseudoLocalizedText.length < explodedTextLength) {
    pseudoLocalizedText += " " + explosionSymbols[i++];
  }

  return "[" + pseudoLocalizedText + "]";
};

const isAllWs = node => !/[^\t\n\r ]/.test(node.textContent);
// A comment node or a text node, all ws
const isIgnorable = node =>
  node.nodeType == 8 || (node.nodeType == 3 && isAllWs(node));

// Observe dom update and pseudo localize changed nodes.
const observer = new MutationObserver(domMutationCallback);
const observerConfig = {
  characterData: true,
  childList: true,
  subtree: true
};

function domMutationCallback(mutationsList) {
  console.log(mutationsList);
  for (var mutation of mutationsList) {
    if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
      // Turn the observer off while performing dom manipulation to prevent
      // infinite dom mutation callback loops
      observer.disconnect();
      // For every node added, recurse down it's subtree and convert
      // all children as well.
      mutation.addedNodes.forEach(pseudoLocalization);
      observer.observe(document.body, observerConfig);
    } else if (mutation.type === "characterData") {
      // Turn the observer off while performing dom manipulation to prevent
      // infinite dom mutation callback loops
      observer.disconnect();
      // The target will always be a text node so it can be converted
      // directly.
      mutation.target.nodeValue = getPseudoTextOfTextNode(mutation.target);
      observer.observe(document.body, observerConfig);
    }
  }
}

export function start() {
  pseudoLocalization(document.body);
  observer.observe(document.body, observerConfig);
}

export function stop() {
  observer.disconnect();
}
