/* prettier-ignore */
const ACCENTED_MAP = {
  a: 'ȧ', A: 'Ȧ', b: 'ƀ', B: 'Ɓ', c: 'ƈ', C: 'Ƈ', d: 'ḓ', D: 'Ḓ', e: 'ḗ', E: 'Ḗ',
  f: 'ƒ', F: 'Ƒ', g: 'ɠ', G: 'Ɠ', h: 'ħ', H: 'Ħ', i: 'ī', I: 'Ī', j: 'ĵ', J: 'Ĵ',
  k: 'ķ', K: 'Ķ', l: 'ŀ', L: 'Ŀ', m: 'ḿ', M: 'Ḿ', n: 'ƞ', N: 'Ƞ', o: 'ǿ', O: 'Ǿ',
  p: 'ƥ', P: 'Ƥ', q: 'ɋ', Q: 'Ɋ', r: 'ř', R: 'Ř', s: 'ş', S: 'Ş', t: 'ŧ', T: 'Ŧ',
  v: 'ṽ', V: 'Ṽ', u: 'ŭ', U: 'Ŭ', w: 'ẇ', W: 'Ẇ', x: 'ẋ', X: 'Ẋ', y: 'ẏ', Y: 'Ẏ',
  z: 'ẑ', Z: 'Ẑ',
};

/* prettier-ignore */
const BIDI_MAP = {
  a: 'ɐ', A: '∀', b: 'q', B: 'Ԑ', c: 'ɔ', C: 'Ↄ', d: 'p', D: 'ᗡ', e: 'ǝ', E: 'Ǝ',
  f: 'ɟ', F: 'Ⅎ', g: 'ƃ', G: '⅁', h: 'ɥ', H: 'H', i: 'ı', I: 'I', j: 'ɾ', J: 'ſ',
  k: 'ʞ', K: 'Ӽ', l: 'ʅ', L: '⅂', m: 'ɯ', M: 'W', n: 'u', N: 'N', o: 'o', O: 'O',
  p: 'd', P: 'Ԁ', q: 'b', Q: 'Ò', r: 'ɹ', R: 'ᴚ', s: 's', S: 'S', t: 'ʇ', T: '⊥',
  u: 'n', U: '∩', v: 'ʌ', V: 'Ʌ', w: 'ʍ', W: 'M', x: 'x', X: 'X', y: 'ʎ', Y: '⅄',
  z: 'z', Z: 'Z',
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

export type Strategy = 'accented' | 'bidi';

export type PseudoLocalizeStringOptions = {
  /**
   * The strategy to employ.
   * - `accented`:
   *   In Accented English all Latin letters are replaced by accented
   *   Unicode counterparts which don't impair the readability of the content.
   *   This allows developers to quickly test if any given string is being
   *   correctly displayed in its 'translated' form.  Additionally, simple
   *   heuristics are used to make certain words longer to better simulate the
   * experience of international users.
   * - `bidi`:
   *  Bidi English is a fake [RTL](https://developer.mozilla.org/en-US/docs/Glossary/rtl) locale.
   *  All words are surrounded by
   *  Unicode formatting marks forcing the RTL directionality of characters.
   *  In addition, to make the reversed text easier to read, individual
   *  letters are flipped.
   */
  strategy?: Strategy;
};

/**
 * Pseudo-localizes a string using a specified strategy.
 *
 * @example
 * pseudoLocalizeString('orange'); // 'ǿǿřȧȧƞɠḗḗ'
 * pseudoLocalizeString('orange', {strategy: 'bidi'}); // 'ǝƃuɐɹo'
 */
export const pseudoLocalizeString = (
  string: string,
  { strategy = 'accented' }: PseudoLocalizeStringOptions = {}
): string => {
  const opts = strategies[strategy];

  let pseudoLocalizedText = '';
  for (const character of string) {
    if (character in opts.map) {
      const char = character as keyof typeof opts.map;
      const cl = char.toLowerCase();
      // duplicate "a", "e", "o" and "u" to emulate ~30% longer text
      if (
        opts.elongate &&
        (cl === 'a' || cl === 'e' || cl === 'o' || cl === 'u')
      ) {
        pseudoLocalizedText += opts.map[char] + opts.map[char];
      } else pseudoLocalizedText += opts.map[char];
    } else pseudoLocalizedText += character;
  }

  // Add pre/postfix if the string does not already contain them respectively.
  const prefix = pseudoLocalizedText.startsWith(opts.prefix) ? '' : opts.prefix;
  const postfix = pseudoLocalizedText.endsWith(opts.postfix)
    ? ''
    : opts.postfix;

  return prefix + pseudoLocalizedText + postfix;
};
