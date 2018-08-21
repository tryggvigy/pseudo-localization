<sub>Inspired by pseudo-localization at [Netflix](https://medium.com/netflix-techblog/pseudo-localization-netflix-12fff76fbcbe) and [Firefox](https://reviewboard.mozilla.org/r/248606/diff/2#index_header)</sub>

# pseudo-localization

| English  | Pseudo Language |
| ------------- | ------------- |
| <img width="559" alt="screen shot 2018-08-12 at 1 23 18 pm" src="https://user-images.githubusercontent.com/2373958/44001651-21f32b42-9e36-11e8-80eb-5b88e8fd9b13.png"> | <img width="661" alt="after" src="https://user-images.githubusercontent.com/2373958/44311352-2a29fb00-a3e6-11e8-88ed-5485697f7a40.png"> |

---

`pseudo-localization` is a script that performs [pseudolocalization](https://en.wikipedia.org/wiki/Pseudolocalization) against the DOM. 

[Demo here](https://tryggvigy.github.io/pseudo-localization/hamlet.html). Changing text nodes and adding or removing trees of elements will trigger a pseudolocalization run on all the new text added to the DOM. Try it using the devtools.

## Installation

### Through npm
```
npm install pseudo-localization
```

### Raw script (without npm)
Copy paste the script in it's entirty from [here](https://github.com/tryggvigy/pseudo-localization/blob/master/hamlet.html#L8873-L9029) and use as you wish.


# Usage

### import or require the npm module

`pseudo-localization` is just a script and can be invoked like so:

```js
const pseudoLocalization = require('pseudo-localization'); 

pseudoLocalization.start();

// Later, if needed
pseudoLocalization.stop();
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

Bidi English is a fake RTL locale.  All words are surrounded by
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


## Support
Works in all evergreen browsers.
