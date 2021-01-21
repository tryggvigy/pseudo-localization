const ACCENTED_MAP = {
  a: 'ȧ',
  A: 'Ȧ',
  b: 'ƀ',
  B: 'Ɓ',
  c: 'ƈ',
  C: 'Ƈ',
  d: 'ḓ',
  D: 'Ḓ',
  e: 'ḗ',
  E: 'Ḗ',
  f: 'ƒ',
  F: 'Ƒ',
  g: 'ɠ',
  G: 'Ɠ',
  h: 'ħ',
  H: 'Ħ',
  i: 'ī',
  I: 'Ī',
  j: 'ĵ',
  J: 'Ĵ',
  k: 'ķ',
  K: 'Ķ',
  l: 'ŀ',
  L: 'Ŀ',
  m: 'ḿ',
  M: 'Ḿ',
  n: 'ƞ',
  N: 'Ƞ',
  o: 'ǿ',
  O: 'Ǿ',
  p: 'ƥ',
  P: 'Ƥ',
  q: 'ɋ',
  Q: 'Ɋ',
  r: 'ř',
  R: 'Ř',
  s: 'ş',
  S: 'Ş',
  t: 'ŧ',
  T: 'Ŧ',
  v: 'ṽ',
  V: 'Ṽ',
  u: 'ŭ',
  U: 'Ŭ',
  w: 'ẇ',
  W: 'Ẇ',
  x: 'ẋ',
  X: 'Ẋ',
  y: 'ẏ',
  Y: 'Ẏ',
  z: 'ẑ',
  Z: 'Ẑ',
};

const BIDI_MAP = {
  a: 'ɐ',
  A: '∀',
  b: 'q',
  B: 'Ԑ',
  c: 'ɔ',
  C: 'Ↄ',
  d: 'p',
  D: 'ᗡ',
  e: 'ǝ',
  E: 'Ǝ',
  f: 'ɟ',
  F: 'Ⅎ',
  g: 'ƃ',
  G: '⅁',
  h: 'ɥ',
  H: 'H',
  i: 'ı',
  I: 'I',
  j: 'ɾ',
  J: 'ſ',
  k: 'ʞ',
  K: 'Ӽ',
  l: 'ʅ',
  L: '⅂',
  m: 'ɯ',
  M: 'W',
  n: 'u',
  N: 'N',
  o: 'o',
  O: 'O',
  p: 'd',
  P: 'Ԁ',
  q: 'b',
  Q: 'Ò',
  r: 'ɹ',
  R: 'ᴚ',
  s: 's',
  S: 'S',
  t: 'ʇ',
  T: '⊥',
  u: 'n',
  U: '∩',
  v: 'ʌ',
  V: 'Ʌ',
  w: 'ʍ',
  W: 'M',
  x: 'x',
  X: 'X',
  y: 'ʎ',
  Y: '⅄',
  z: 'z',
  Z: 'Z',
};

const strategies = {
  accented: {
    prefix: '',
    postfix: '',
    map: ACCENTED_MAP,
    elongate: true,
  },
  bidi: {
    // Surround words with Unicode formatting marks forcing
    // right-to-left directionality of characters
    prefix: '\u202e',
    postfix: '\u202c',
    map: BIDI_MAP,
    elongate: false,
  },
};

// Reference for ratios https://www.w3.org/International/articles/article-text-size
const expansionRatio = {
  10: 2.5,
  20: 1.9,
  30: 1.7,
  40: 1.5,
  50: 1.5,
  60: 1.6,
  70: 1.6,
  over70: 1.3,
};

const isAlpha = character => {
  return /[a-zA-Z]/.test(character);
};

const textExpander = (string, numDuplicateChars = 0, expansionRatio = 1) => {
  let expandedText = '';
  let count = 0;
  const repeatTimes = Math.ceil(expansionRatio);
  let maxIndex = numDuplicateChars + string.length;

  for (const c of string) {
    if (isAlpha(c) && count < numDuplicateChars) {
      expandedText += c.repeat(repeatTimes);
      count += repeatTimes - 1;
    } else {
      expandedText += c;
    }
  }

  return expandedText.substring(0, maxIndex);
};

const textExpansionHandler = (string, toBeExpanded) => {
  const strLen = string.length;
  const ratioKey = Math.ceil(strLen / 10) * 10;
  const ratio =
    ratioKey > 70 ? expansionRatio.over70 : expansionRatio[ratioKey];
  const numDuplicateChars = Math.ceil(strLen * ratio) - strLen;

  if (toBeExpanded) return textExpander(string, numDuplicateChars, ratio);
  else return textExpander(string);
};

const pseudoLocalizeString = (string, { strategy = 'accented' } = {}) => {
  let opts = strategies[strategy];
  let Expandedstring = textExpansionHandler(string, opts.elongate);

  let pseudoLocalizedText = '';

  for (let character of Expandedstring) {
    if (opts.map[character]) {
      pseudoLocalizedText += opts.map[character];
    } else pseudoLocalizedText += character;
  }

  // If this string is from the DOM, it should already contain the pre- and postfix
  if (
    pseudoLocalizedText.startsWith(opts.prefix) &&
    pseudoLocalizedText.endsWith(opts.postfix)
  ) {
    return pseudoLocalizedText;
  }

  return opts.prefix + pseudoLocalizedText + opts.postfix;
};

export default pseudoLocalizeString;
