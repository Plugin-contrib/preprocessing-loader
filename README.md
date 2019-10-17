<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200" src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
</div>

[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
[![cover][cover]][cover-url]
[![size][size]][size-url]

> ## This is an experimental project and still in development. Use it on your own risk!

# preprocessing-loader

[![Edit webpack-prepossessing-loader](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/webpack-prepossessing-loader-b6boi?fontsize=14)

## Getting Started

To begin, you'll need to install `preprocessing-loader`:

```console
$ npm install preprocessing-loader --save-dev
```

<!-- isLoader ? use(this) : delete(isPlugin) -->

Then add the loader to your `webpack` config. For example:

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /.ext$/,
        use: [
          {
            loader: 'preprocessing-loader',
            options: { ...options }
          }
        ]
      }
    ]
  }
};
```

And run `webpack` via your preferred method.

## Options

### `[option]`

As of now, no options are available

<!--

Type: `[type|other-type]`
Default: `[type|null]`

[ option description ]


**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        loader: `preprocessing-loader`,
        options: {
          [option]: ''
        }
      }
    ]
  }
};
```

-->

## Examples

**webpack.config.js**

```js
module.exports = {
  entry: 'index.js',
  output: {
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'preprocessing-loader'
          }
        ]
      }
    ]
  }
};
```

**index.js**

```js
// Source code here...
const v = 5;
const z = 'a';
function hello(x) {
  console.log('hellox', x);
}
const tests = 5 + 2;
const afn = () => {
  return v;
};
const fn = function() {
  return 'fn';
};
var a = v;
let a2 = z;
const fn2 = function() {
  return a2;
};
hello(v);
hello(z);

const he = {
  // Not supportable
  what: () => {
    return 'qwe';
  }
};

const fntest = he.what(); //  needs to cover this !!!

console.log('fntest', fntest);
console.log('tests', tests);
console.log('fn', fn());
console.log('afn', afn());
console.log('fn2', fn2());
hello(afn());
console.log('v', v);
```

**bundle.js**

```js
// Bundle code here...
function hello(x) {
  console.log('hellox', x);
}

var a = 5;
let a2 = 'a';

const fn2 = function() {
  return a2;
};

hello(5);
hello('a');
const he = {
  // Not supportable
  what: () => {
    return 'qwe';
  }
};
const fntest = he.what(); //  needs to cover this !!!

console.log('fntest', fntest);
console.log('tests', 7);
console.log('fn', 'fn');
console.log('afn', 5);
console.log('fn2', fn2());
hello(5);
console.log('v', 5);
```

## Contributing

Please take a moment to read our contributing guidelines if you haven't yet done so.

[CONTRIBUTING](./.github/CONTRIBUTING.md)

## License

[MIT](./LICENSE)

[npm]: https://img.shields.io/npm/v/preprocessing-loader.svg
[npm-url]: https://npmjs.com/package/preprocessing-loader
[node]: https://img.shields.io/node/v/preprocessing-loader.svg
[node-url]: https://nodejs.org
[deps]: https://david-dm.org/anikethsaha/preprocessing-loader.svg
[deps-url]: https://david-dm.org/anikethsaha/preprocessing-loader
[cover]: https://codecov.io/gh/anikethsaha/preprocessing-loader/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/anikethsaha/preprocessing-loader
[chat]: https://img.shields.io/badge/gitter-webpack%2Fwebpack-brightgreen.svg
[size]: https://badgen.net/bundlephobia/min/preprocessing-loader
[size-url]: https://badgen.net/bundlephobia/min/preprocessing-loader
