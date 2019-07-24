import { pseudoLocalizeString } from './pseudoLocalizeString';

describe('localize', () => {
  test('accented', () => {
    expect(pseudoLocalizeString('abcd')).toBe('ȧȧƀƈḓ');
    // aeou are duplicated
    expect(pseudoLocalizeString('aeou')).toBe('ȧȧḗḗǿǿŭŭ');
    expect(pseudoLocalizeString('foo bar')).toBe('ƒǿǿǿǿ ƀȧȧř');
    expect(pseudoLocalizeString('CAPITAL_LETTERS')).toBe('ƇȦȦƤĪŦȦȦĿ_ĿḖḖŦŦḖḖŘŞ');
    // Everything except ASCII alphabet is passed through
    expect(pseudoLocalizeString('123,. n -~ðÞ')).toBe('123,. ƞ -~ðÞ');
  });

  test('bidi', () => {
    const bidi = { strategy: 'bidi' };

    /**
     * There are invisivle unicode formatting marks
     * surrounding each output. For example
     *
     * "‮ɐqɔp‬" is actually "\u202e" + "ɐqɔp" + "\u202c"
     *
     * The presense of the formatting marks cause most UIs
     * (likely including your text editor) to render the
     * string backwards, if you will, or from right-to-left.
     */
    expect(pseudoLocalizeString('abcd', bidi)).toBe('‮ɐqɔp‬');
    expect(pseudoLocalizeString('aeou', bidi)).toBe('‮ɐǝon‬');
    expect(pseudoLocalizeString('foo bar', bidi)).toBe('‮ɟoo qɐɹ‬');
    expect(pseudoLocalizeString('CAPITAL_LETTERS', bidi)).toBe(
      '‮Ↄ∀ԀI⊥∀⅂_⅂Ǝ⊥⊥ƎᴚS‬'
    );
    expect(pseudoLocalizeString('123,. n -~ðÞ', bidi)).toBe('‮123,. u -~ðÞ‬');
    // formatting marks are not duplicated if already present
    expect(pseudoLocalizeString('‮ɟoo‬', bidi)).toBe('‮ɟoo‬');
  });
});
