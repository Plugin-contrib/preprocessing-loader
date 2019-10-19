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
![npm](https://img.shields.io/npm/dm/preprocessing-loader)
[![Build Status](https://travis-ci.org/anikethsaha/preprocessing-loader.svg?branch=master)](https://travis-ci.org/anikethsaha/preprocessing-loader)
[![Coverage Status](https://coveralls.io/repos/github/anikethsaha/preprocessing-loader/badge.svg?branch=master)](https://coveralls.io/github/anikethsaha/preprocessing-loader?branch=master)


> ## This is an experimental project and still in development. Use it on your own risk!


# preprocessing-loader

[![Edit webpack-prepossessing-loader](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/webpack-prepossessing-loader-b6boi?fontsize=14)

This is a simple loader, it will simply pre process few of the code which wont effect the normal execution of the program in the run time.
It will pre process codes like these

```js
const a = 123;
var whatsTheNumber = a;
```

Now this will convert into the following

```js
const a = 123;
var whatsTheNumber = 123;
```

Why ? as `a` is `const` and its value will not change in the rest of the program, We can simply change all those variables which are assign using `a` with `a`'s value that is `123`

> in future release, this line `const a = 123` will be removed from the output file as it doesnt have anything to do with the program after compiling using this loader

Another example can be,

```js
const dumyFN = () => {
  return 'demo';
};

console.log(dumyFN());
```

This code will convert into the following

```js
console.log('demo');
```

Preprocessing few codes like this increases the run time of the program as the program doesn't need to jump from one part to another to get the value of the variable.

As of now, the support for pre processing is very limited with this loader, for example

```js
const obj = {
  prop1: () => {
    return 'value';
  }
};
```

This can be converted into this

```js
const obj = {
  prop1: 'value'
};
```

but this loader doesnt support this.
_Support of this will be added in future_.
function bodies where the return statements are wrapped with other statements like another function or if-statement or callbacks are not supported by this loader as of now. _Support of this will be added in future_

### What it does ? using code example

#### Input


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

#### Output

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


## Related
- [`Babel/minify`](https://github.com/babel/minify/) got some number of babel plugins which are used for code optimization.
  - `babel-plugin-minify-constant-folding`, `babel-plugin-minify-dead-code-elimination` somewhat does the same job in better way 
- `v8` does this kind of code optimizations too using graphs (CFG)
- google's closure compiler for javascript does this too with other optimizations features as well at a awesome level
- There are other minifiers or code optimization libraries are present too which implements these approaches as well 

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
