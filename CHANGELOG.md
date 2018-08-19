## 1.1.4
- Update explanatory picture in README.md

## 1.1.3
- Add support for bidirectional text
  - `pseudoLocalization.start({ strategy: 'bidi' });`
- Changed several things to improve legibility
  - Removed `[]` surrounding each string. horizontal Cutoff should be relatively easy to spot without those.
  - Stop using `one two three ...` to elongagate the string by ~30-40% and instead duplicate letters withing the string itself.
  - Tidy up psuedo language symbols maps to contain more legibile symbols
- Make pseudo language deterministic. Always use the same pseudo symbol for the same english letter.