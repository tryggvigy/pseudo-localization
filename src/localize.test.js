import localize from './localize';

describe('localize', () => {
  test('accented', () => {
    expect(localize('abcd')).toBe('ȧƀƀƀƈƈƈḓḓḓ');
    // aeou are duplicated
    expect(localize('aeou')).toBe('ȧḗḗḗǿǿǿŭŭŭ');
    expect(localize('foo bar')).toBe('ƒƒǿǿǿǿǿǿ ƀƀƀȧȧȧřřř');
    expect(localize('CAPITAL_LETTERS')).toBe('ƇƇȦȦƤƤĪĪŦŦȦȦĿĿ_ĿĿḖḖŦŦŦŦḖḖŘŘŞŞ');
    // Everything except ASCII alphabet is passed through
    expect(localize('123,. n -~ðÞ')).toBe('123,. ƞƞ -~ðÞ');
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
    expect(localize('abcd', bidi)).toBe('‮ɐqɔp‬');
    expect(localize('aeou', bidi)).toBe('‮ɐǝon‬');
    expect(localize('foo bar', bidi)).toBe('‮ɟoo qɐɹ‬');
    expect(localize('CAPITAL_LETTERS', bidi)).toBe('‮Ↄ∀ԀI⊥∀⅂_⅂Ǝ⊥⊥ƎᴚS‬');
    expect(localize('123,. n -~ðÞ', bidi)).toBe('‮123,. u -~ðÞ‬');
    // formatting marks are not duplicated if already present
    expect(localize('‮ɟoo‬', bidi)).toBe('‮ɟoo‬');
  });
});
