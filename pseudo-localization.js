const map = {
  a: "àáâãäåāăąǻȁȃ",
  A: "ÀÁÂÃÄÅĀĂĄǺȀȂ",
  b: "ƀƂƃƄƅɓ",
  B: "ßƁɃʙ",
  c: "çćĉċč",
  C: "ÇĆĈĊČ",
  d: "ďđð",
  D: "ĎĐƉƊ",
  e: "ēĕėęěȅȇ",
  E: "ĒĔĖĘĚȄȆ",
  f: "ƒ",
  F: "Ƒ",
  g: "ĝğġģ",
  G: "ĜĞĠĢ",
  h: "ĥħ",
  H: "ĤĦ",
  I: "ĨĪĬĮİ",
  i: "ĩīĭįı",
  J: "ĵ",
  j: "Ĵ",
  K: "ĶƘϏ",
  k: "ķĸƙ",
  l: "ĺļľŀł",
  L: "ĹĻĽĿŁ",
  N: "ŃŅŇŊƝ",
  n: "ńņňŉŋƞกี้",
  o: "ōŏőơ",
  O: "ŌŎŐƠ",
  P: "Ƥ",
  p: "ƥƿþ",
  Q: "ǪǬ",
  q: "ǫǭɋ",
  r: "ŕŗř",
  R: "ŔŖŘƦ",
  S: "ŚŜŞŠ",
  s: "śŝşšȿ",
  T: "ŢŤŦ",
  t: "ţťŧ",
  v: "ѷ",
  U: "ŨŪŬŮŰŲ",
  u: "ũūŭůűųม้",
  w: "ŵผึ้",
  W: "Ŵ",
  Y: "ŶŸƳȲɎ",
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

export function pseudoLocalization() {
  const allTextNodes = textNodesUnder(document.body);
  for (let textNode of allTextNodes) {
    let pseudoLocalizedText = "";
    for (let c of textNode.nodeValue) {
      if (map[c]) {
        pseudoLocalizedText +=
          map[c][Math.floor(Math.random() * map[c].length)];
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

    textNode.nodeValue = "[" + pseudoLocalizedText + "]";
  }
}

const isAllWs = node => !/[^\t\n\r ]/.test(node.textContent);
// A comment node or a text node, all ws
const isIgnorable = node =>
  node.nodeType == 8 || (node.nodeType == 3 && isAllWs(node));

function textNodesUnder(el) {
  let n;
  const a = [];
  const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, node => {
    if (isIgnorable(node)) return NodeFilter.FILTER_REJECT;
    return NodeFilter.FILTER_ACCEPT;
  });
  while ((n = walk.nextNode())) a.push(n);
  return a;
}
