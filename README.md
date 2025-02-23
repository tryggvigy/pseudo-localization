<sub>Inspired by pseudo-localization at [Netflix](https://medium.com/netflix-techblog/pseudo-localization-netflix-12fff76fbcbe) and [Firefox](https://reviewboard.mozilla.org/r/248606/diff/2#index_header).</sub>

# Pseudo-Localization

Pseudo-localization helps developers test UI elements for localization issues before actual translations are available. This package transforms text into a pseudo-language to simulate real-world localization challenges.

## Preview

| English                                                                                                                 | Pseudo Language                                                                                                                  |
| ----------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| ![English example](https://user-images.githubusercontent.com/2373958/44001651-21f32b42-9e36-11e8-80eb-5b88e8fd9b13.png) | ![Pseudo-localized example](https://user-images.githubusercontent.com/2373958/44311352-2a29fb00-a3e6-11e8-88ed-5485697f7a40.png) |

### [Live Demo](https://tryggvigy.github.io/pseudo-localization/hamlet.html)

See it in action on [https://tryggvigy.github.io/pseudo-localization/hamlet.html](https://tryggvigy.github.io/pseudo-localization/hamlet.html)

Changes to the DOM trigger pseudo-localization in real time. Try modifying text nodes or adding/removing elements via DevTools.

---

## Why Use This?

Pseudo-localization helps detect issues such as:

- **Text Overflow** – Translations are often longer than the original text, which may cause UI breaking.
- **Font Rendering** – Certain languages have larger glyphs or diacritics that may be cut off.
- **Right-to-Left (RTL) Support** – Ensures proper layout handling for RTL languages.
- **Hardcoded Strings** – Identifies untranslated or hardcoded text that should be localized.

---

## Installation

### Via npm

```sh
npm install pseudo-localization
```

### Manual Installation

Copy the files from [`src`](https://github.com/tryggvigy/pseudo-localization/blob/master/src) and use them directly.

---

## Usage

### `pseudoLocalizeString`

Transform individual strings:

```js
import { pseudoLocalizeString } from 'pseudo-localization';

console.log(pseudoLocalizeString('hello')); // ħḗḗŀŀǿǿ
console.log(pseudoLocalizeString('hello', { strategy: 'bidi' })); // oʅʅǝɥ
```

Use-case: Ensure text is passing through a translation function.

```js
import translate from './my-translation-lib';
const _ = (key) => pseudoLocalizeString(translate(key, navigator.language));

console.log(_('Some Localized Text')); // Şǿǿḿḗḗ Ŀǿǿƈȧȧŀīẑḗḗḓ Ŧḗḗẋŧ
```

---

### `pseudo-localization/dom`

Automatically localize the entire page or parts of the DOM.

#### React Example

```jsx
import React, { useEffect } from 'react';
import { PseudoLocalizeDom } from 'pseudo-localization/dom';

function Page() {
  useEffect(() => PseudoLocalizeDom.start(), []);
  return <h1>This text will be pseudo-localized!</h1>;
}
```

---

## Strategies

Pseudo-localization supports two strategies:

### 1. Accented (`accented`)

Expands text and replaces Latin letters with accented Unicode counterparts.

```js
pseudoLocalization.start({ strategy: 'accented' });
```

Example output: **Ȧȧƈƈḗḗƞŧḗḗḓ Ḗḗƞɠŀīīşħ**

![Accented example](https://user-images.githubusercontent.com/2373958/44311259-62303e80-a3e4-11e8-884a-54c77416b922.png)

---

### 2. Bidirectional (`bidi`)

Simulates an RTL language by reversing words and using right-to-left Unicode formatting.

```js
pseudoLocalization.start({ strategy: 'bidi' });
```

Example output: **ɥsıʅƃuƎ ıpıԐ**

![Bidi example](https://user-images.githubusercontent.com/2373958/44311263-770cd200-a3e4-11e8-97e4-9a1896bd5975.png)

---

## API Reference

### `pseudoLocalizeString(str: string, options?: Options): string`

- `str`: String to localize.
- `options.strategy`: `'accented'` (default) or `'bidi'`.

### `PseudoLocalizeDom.start(options?: DomOptions): StopFn`

Pseudo-localizes the page and watches for DOM changes.

```js
import { PseudoLocalizeDom } from 'pseudo-localization/dom';
const stop = new PseudoLocalizeDom().start();
// Stop pseudo-localization later
stop();
```

#### `DomOptions`

- `strategy`: `'accented'` or `'bidi'`.
- `blacklistedNodeNames`: Nodes to ignore (default: `['STYLE']`).
- `root`: Root element for localization (default: `document.body`).

---

## CLI Usage

A command-line interface (CLI) is available for quick testing and automation.

```sh
npx pseudo-localization ./path/to/file.json

# Pipe a string
echo "hello world" | npx pseudo-localization

# Direct input
npx pseudo-localization -i "hello world"
```

### CLI Options

```
pseudo-localization [src] [options]

Positionals:
  src  Input file or STDIN

Options:
  -o, --output  Output file (defaults to STDOUT)
  --strategy    Localization strategy (accented or bidi)
  --help        Show help
  --version     Show version
```

---

## Browser Compatibility

Works in all modern browsers.

---

By using pseudo-localization, you can catch UI issues early, ensuring your app is truly localization-ready!
