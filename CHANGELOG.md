##2.3.5

- Add isEnabled boolean to `pseudo-localization`
- prevent calling start/stop if pseudo-localization is already enabled/disabled

```tsx
const [enabled, setEnabled] = React.useState(pseudoLocalization.isEnabled());

<input
  value={enabled}
  onChange={event => {
    const selected = event.target.checked;
    if (selected) {
      setEnabled(true);
      pseudoLocalization.start();
    } else {
      setEnabled(false);
      pseudoLocalization.stop();
      window.location.reload();
    }
  }}
/>;
```

##2.1.0

- Adding CLI interface

##2.0.2

- Fix a bug where blacklisted nodes would get pseudo-localized when mutated in the DOM

##2.0.1

- Mention in package.json description that `pseudo-localization` works with nodejs.

##2.0.0

- Safeguard childlist mutations and empty strings https://github.com/tryggvigy/pseudo-localization/pull/12
  - Fixes https://github.com/tryggvigy/pseudo-localization/issues/6 and https://github.com/tryggvigy/pseudo-localization/issues/11
- Fix a bug where DOM mutation localizations did not respect the strategy specified https://github.com/tryggvigy/pseudo-localization/pull/16
- Refactor internals to use import/export ES modules https://github.com/tryggvigy/pseudo-localization/pull/16
  - **BREAKING** `require` usage will have to change from
    ```js
    const pseudoLocalization = require('pseudo-localization');
    ```
    to
    ```js
    const pseudoLocalization = require('pseudo-localization').default;
    ```
- Transform to "not dead" browsers through babel https://github.com/tryggvigy/pseudo-localization/pull/16
  - Fixes https://github.com/tryggvigy/pseudo-localization/issues/8

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
