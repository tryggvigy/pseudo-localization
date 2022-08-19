<sub>Inspired by pseudo-localization at [Netflix](https://medium.com/netflix-techblog/pseudo-localization-netflix-12fff76fbcbe) and [Firefox](https://reviewboard.mozilla.org/r/248606/diff/2#index_header)</sub>

# pseudo-localization

| English  | Pseudo Language |
| ------------- | ------------- |
| <img width="559" alt="screen shot 2018-08-12 at 1 23 18 pm" src="https://user-images.githubusercontent.com/2373958/44001651-21f32b42-9e36-11e8-80eb-5b88e8fd9b13.png"> | <img width="661" alt="after" src="https://user-images.githubusercontent.com/2373958/44311352-2a29fb00-a3e6-11e8-88ed-5485697f7a40.png"> |

---

[![Edit pseudo-localization-react](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/1q7n08or4j)

`pseudo-localization` is a script that performs [pseudolocalization](https://en.wikipedia.org/wiki/Pseudolocalization) against the DOM or individual strings.

[Demo here](https://tryggvigy.github.io/pseudo-localization/hamlet.html). Changing text nodes and adding or removing trees of elements will trigger a pseudo-localization run on all the new text added to the DOM. Try it yourself by changing text or adding/removing elements using the devtools.

## Installation

### Through npm
```
npm install pseudo-localization
```

### Raw script (without npm)
Copy paste the files in [`src`](https://github.com/tryggvigy/pseudo-localization/blob/master/src) and use as you wish. It's not a lot of code.


# Usage

### import or require the npm module

`pseudo-localization` can be used like so:

```js
import pseudoLocalization from 'pseudo-localization';
// Or using CommonJS
// const pseudoLocalization = require('pseudo-localization').default;

pseudoLocalization.start();

pseudoLocalization.isEnabled() // true

// Later, if needed
pseudoLocalization.stop();

pseudoLocalization.isEnabled() // false

```

To use `pseudo-localization` in React, Vue, Ember or anything else, hook the `start` and `stop` methods into your libraries
component lifecycles. In React for example:

```js
import React from 'react';
import pseudoLocalization from 'pseudo-localization';

class PseudoLocalization extends React.Component {
  componentDidMount() {
    pseudoLocalization.start();
  }
  componentWillUnmount() {
    pseudoLocalization.stop();
  }
}

// And use it

class Page extends React.Component {
  render() {
    return (
      <main>
       <PseudoLocalization />
       <h1>I will get pseudo localized along with everything else under document.body!</h1>
      <main>
    );
  }
}
```

Using hooks? Here's an example:

```jsx
import React from 'react';
import pseudoLocalization from 'pseudo-localization';

function PseudoLocalization() {
  React.useEffect(() => {
    pseudoLocalization.start();

    return () => {
      pseudoLocalization.stop()
    };
  }, []);
}

// And use it

function Page() {
  return (
    <main>
      <PseudoLocalization />
      <h1>I will get pseudo localized along with everything else under document.body!</h1>
    <main>
  );
}
```

You can also call the underlying `localize` function to pseudo-localize any string. This is useful for non-browser environments like nodejs.


```js
import { localize } from 'pseudo-localization';
// Or using CommonJS
// const { localize } = require('pseudo-localization');

console.log(localize('hello')); // --> ħḗḗŀŀǿǿ
console.log(localize('hello', { strategy: 'bidi' })); // --> oʅʅǝɥ
```

A good use-case for `localize` is testing that strings are _actually_ being localized and not hard coded.

```js
import { localize } from 'pseudo-localization';
import translate from './my-translation-lib';

// Pseudo localize every string returned from your normal translation function.
const _ = key => localize(translate(key, navigator.language));

_('Some Localized Text'); // Şǿǿḿḗḗ Ŀǿǿƈȧȧŀīẑḗḗḓ Ŧḗḗẋŧ
// Or, in React for example
const Header = () => <h1>{_('Localized Header Text')}</h1>;
```

Any strings that do not pass through the translation function will now stand out in the UI because the will not be pseudo-localized.

## Strategies
`pseudo-localization` supports two strategies:

1. accented
2. bidi

### accented - Ȧȧƈƈḗḗƞŧḗḗḓ Ḗḗƞɠŀīīşħ

Usage: `pseudoLocalization.start({ strategy: 'accented' });` or simply `pseudoLocalization.start();`.

In Accented English all Latin letters are replaced by accented
Unicode counterparts which don't impair the readability of the content.
This allows developers to quickly test if any given string is being
correctly displayed in its 'translated' form.  Additionally, simple
heuristics are used to make certain words longer to better simulate the
experience of international users.

<img width="622" alt="screen shot 2018-08-19 at 18 48 29" src="https://user-images.githubusercontent.com/2373958/44311259-62303e80-a3e4-11e8-884a-54c77416b922.png">


### bidi - ɥsıʅƃuƎ ıpıԐ

Usage: `pseudoLocalization.start({ strategy: 'bidi' });`.

Bidi English is a fake [RTL](https://developer.mozilla.org/en-US/docs/Glossary/rtl) locale.  All words are surrounded by
Unicode formatting marks forcing the RTL directionality of characters.
In addition, to make the reversed text easier to read, individual
letters are flipped.

<img width="602" alt="screen shot 2018-08-19 at 18 45 49" src="https://user-images.githubusercontent.com/2373958/44311263-770cd200-a3e4-11e8-97e4-9a1896bd5975.png">


## Why?
To catch localization problems like:
- Translated text that is significantly longer than the source language, and does not fit within the UI constraints, or which causes text breaks at awkward positions.
- Font glyphs that are significantly larger than, or possess diacritic marks not found in, the source language, and which may be cut off vertically.
- Languages for which the reading order is not left-to-right, which is especially problematic for user input.
- Application code that assumes all characters fit into a limited character set, such as ASCII or ANSI, which can produce actual logic bugs if left uncaught.

In addition, the pseudo-localization process may uncover places where an element should be localizable, but is hard coded in a source language.

## Docs
`pseudo-localization` exports three functions.
- `pseudoLocalization.start(options)`
- `pseudoLocalization.stop()`
- `pseudoLocalization.localize(string, options)`

### `pseudoLocalization.start(options)`
Pseudo localizes the page and watched the DOM for additions/updates to continuously pseudo localize new content.

Accepts an `options` object as an argument. Here are the keys in the `options` object.

#### `strategy` - default (`'accented'`)
The pseudo localization strategy to use when transforming strings. Accepted values are `accented` or `bidi`.

#### `blacklistedNodeNames` - default (`['STYLE']`)
An array of [Node.nodeName](https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeName) strings that will be ignored when localizing. This is useful for skipping `<style>`, `<text>` svg nodes or other nodes that potentially doesn't make sense to apply pseudo localization to. `<style>` is skipped by default when `blacklistedNodeNames` is not provided.

### `pseudoLocalization.stop()`
Stops watching the DOM for additions/updates to continuously pseudo localize new content.

### `pseudoLocalization.localize(string, options)`
Accepts a string to apply pseudo localization to. Returns the pseudo localized version on the string.
This function is used by `pseudoLocalization.start` internally.

Accepts an `options` object as an argument. Here are the keys in the `options` object.

#### `strategy` - default (`'accented'`)
The pseudo localization strategy to use when transforming strings. Accepted values are `accented` or `bidi`.

## CLI Interface
For easy scripting a CLI interface is exposed. The interface supports raw input, JSON files, and CommonJS modules.

```bash
npx pseudo-localization ./path/to/file.json

# pass in a JS transpiled ES module or an exported CJS module
npx pseudo-localization ./path/to/file

# pass in JSON files through STDIN
cat ./path/to/file.json | npx pseudo-localization --strategy bidi

# pass a string via a pipe
echo hello world | npx pseudo-localization

# direct input pseudo-localization
npx pseudo-localization -i "hello world"
```

CLI Options:

```
pseudo-localization [src] [options]

Pseudo localize a string, JSON file, or a JavaScript object

Positionals:
  src  The source as a path or from STDIN                               [string]

Options:
  -o, --output  Writes output to STDOUT by default. Optionally specify a JSON
                file to write the pseudo-localizations to               [string]
  -i, --input   Pass in direct input to pseudo-localization                 [string]
  --debug       Print out all stack traces and other debug info        [boolean]
  --pretty      Pretty print JSON output                               [boolean]
  --strategy    Set the strategy for localization
                             [choices: "accented", "bidi"] [default: "accented"]
  --help        Show help                                              [boolean]
  --version     Show version number                                    [boolean]
```

## Support
Works in all evergreen browsers.
