# pseudo-localization

Inspired by https://medium.com/netflix-techblog/pseudo-localization-netflix-12fff76fbcbe

`pseudo-localization` is a script that performs [pseudolocalization](https://en.wikipedia.org/wiki/Pseudolocalization) agains the DOM. 

[Demo here](https://tryggvigy.github.io/pseudo-localization/hamlet.html). Changing text in text nodes, adding or removing trees of elements will all trigger a pseudolocalization run on all the new text added to the dom. You can try it using the devtools.

## Installation

### Through npm
```
npm install pseudo-localization
```

### Raw script (without npm)
Copy paste the script in it's entirty from [here](https://github.com/tryggvigy/pseudo-localization/blob/master/hamlet.html#L8873-L9029) and use as you wish.


## Usage

### import or require the npm module

`pseudo-localization` is just a script and can be invoked like so:

```js
const pseudoLocalization = require('psuedo-localization'); 

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
       <h1>I will get pseudo localizad along with everything else under document.body!</h1>
      <main>
    );
  }
}
```

## Why?
To catch localization problems like:
- Translated text that is significantly longer than the source language, and does not fit within the UI constraints, or which causes text breaks at awkward positions.
- Font glyphs that are significantly larger than, or possess diacritic marks not found in, the source language, and which may be cut off vertically.
- Languages for which the reading order is not left-to-right, which is especially problematic for user input.
- Application code that assumes all characters fit into a limited character set, such as ASCII or ANSI, which can produce actual logic bugs if left uncaught.

Below you can see vertical cutoff, caught by psuedolocalization in action.

| English  | Pseudo Language |
| ------------- | ------------- |
| <img width="559" alt="screen shot 2018-08-12 at 1 23 18 pm" src="https://user-images.githubusercontent.com/2373958/44001651-21f32b42-9e36-11e8-80eb-5b88e8fd9b13.png"> | <img width="661" alt="after" src="https://user-images.githubusercontent.com/2373958/44001656-2fba7780-9e36-11e8-8924-69c849a3b48c.png"> |

## Support
Works in all evergreen browsers.
