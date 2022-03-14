# 発音 hatsuon

> Japanese pitch accent tools

[![npm](https://img.shields.io/npm/v/hatsuon.svg?style=flat-square)](https://www.npmjs.com/package/hatsuon)
[![npm](https://img.shields.io/npm/dt/hatsuon.svg?style=flat-square)](https://npm-stat.com/charts.html?package=hatsuon&from=2016-04-01)
[![Travis branch](https://img.shields.io/travis/DJTB/hatsuon/master.svg?style=flat-square)](https://travis-ci.com/DJTB/hatsuon)
[![Codecov branch](https://img.shields.io/codecov/c/github/DJTB/hatsuon/master.svg?style=flat-square)](https://codecov.io/github/DJTB/hatsuon)
<br />
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)](http://commitizen.github.io/cz-cli/)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Code of Conduct](https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square)](./code_of_conduct.md)

## Why?

Japanese dictionaries often display the pitch accent of a word with a single number that determines where the pitch falls. This can be difficult to mentally visualize without counting through the [mora](<https://en.wikipedia.org/wiki/Mora_(linguistics)#Japanese>) of the word. This library provides useful tools for generating pitch patterns which can then be easily displayed via SVG.

## Installation

```sh
npm install --save hatsuon
```

## Demo

[Visualization Example](https://djtb.github.io/hatsuon)

## Usage

```js
import hatsuon from 'hatsuon';

hatsuon({ reading: 'ちゅうがっこう', pitchNum: 3 });
// =>
{
  reading: 'ちゅうがっこう',
  pitchNum: 3,
  morae: ['ちゅ', 'う', 'が', 'っ', 'こ', 'う'],
  // low, high, high, low, low, low, low*
  // *following particle (は、が, の etc) pitch
  pattern: [0, 1, 1, 0, 0, 0, 0],
  patternName: '中高', // nakadaka
}
```

Extra available utils (see source for documentation):

```js
import {
  isDigraph,
  getMorae,
  getMoraCount,
  makePitchPattern,
  getPitchPatternName,
  getPitchNumFromPattern,
} from 'hatsuon/dist/utils';
```

## Related

[WanaKana](https://github.com/WaniKani/WanaKana) : Japanese romaji <-> kana transliteration library

## Contributors

Thanks goes to these people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->

<!-- prettier-ignore -->
| [<img src="https://avatars3.githubusercontent.com/u/5353151?s=100" width="100px;"/><br /><sub><b>Duncan Bay</b></sub>](https://github.com/DJTB)<br />[💻](https://github.com/DJTB/hatsuon/commits?author=DJTB "Code") [📖](https://github.com/DJTB/hatsuon/commits?author=DJTB "Documentation") [🚇](#infra-DJTB "Infrastructure (Hosting, Build-Tools, etc)") [🎨](#design-DJTB "Design") |
| :---: |

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!

## License

MIT &copy; [Duncan Bay](https://github.com/DJTB)
