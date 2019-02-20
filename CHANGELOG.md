##1.3.0
- Allow blacklisting nodes ([#9](https://github.com/tryggvigy/pseudo-localization/pull/9))

## 1.2.0
- Expose `localize` function

## 1.1.5
- Fix typo in README
- Set MIT as license in package.json

## 1.1.4
- Update explanatory picture in README.md

## 1.1.3
- Add support for bidirectional text
  - `pseudoLocalization.start({ strategy: 'bidi' });`
- Changed several things to improve legibility
  - Removed `[]` surrounding each string. horizontal Cutoff should be relatively easy to spot without those.
  - Stop using `one two three ...` to elongagate the string by ~30-40% and instead duplicate letters withing the string itself.
  - Tidy up pseudo language symbols maps to contain more legibile symbols
- Make pseudo language deterministic. Always use the same pseudo symbol for the same english letter.
