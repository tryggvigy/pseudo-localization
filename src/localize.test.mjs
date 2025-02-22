import test from 'node:test';
import { strict as assert } from 'node:assert';
import { pseudoLocalizeString as localize } from './localize.mjs';

test('accented', () => {
  assert.equal(localize('abcd'), 'ȧȧƀƈḓ');
  // aeou are duplicated
  assert.equal(localize('aeou'), 'ȧȧḗḗǿǿŭŭ');
  assert.equal(localize('foo bar'), 'ƒǿǿǿǿ ƀȧȧř');
  assert.equal(localize('CAPITAL_LETTERS'), 'ƇȦȦƤĪŦȦȦĿ_ĿḖḖŦŦḖḖŘŞ');
  // Everything except ASCII alphabet is passed through
  assert.equal(localize('123,. n -~ðÞ'), '123,. ƞ -~ðÞ');
});

test('bidi', () => {
  /**
   * @type {{ strategy: 'bidi' }}
   */
  const bidi = {
    strategy: 'bidi',
  };

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
  assert.equal(localize('abcd', bidi), '‮ɐqɔp‬');
  assert.equal(localize('aeou', bidi), '‮ɐǝon‬');
  assert.equal(localize('foo bar', bidi), '‮ɟoo qɐɹ‬');
  assert.equal(localize('CAPITAL_LETTERS', bidi), '‮Ↄ∀ԀI⊥∀⅂_⅂Ǝ⊥⊥ƎᴚS‬');
  assert.equal(localize('123,. n -~ðÞ', bidi), '‮123,. u -~ðÞ‬');
  // formatting marks are not duplicated if already present
  assert.equal(localize('‮ɟoo‬', bidi), '‮ɟoo‬');
});
