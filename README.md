# umd-util [![Build Status](https://travis-ci.com/jonkemp/umd-util.svg?branch=master)](https://travis-ci.com/jonkemp/umd-util)

> Export JavaScript files in UMD (Universal Module Definition) format.

[Universal Module Definition (UMD)](https://github.com/umdjs/umd) modules are capable of working everywhere, be it in the client, on the server or elsewhere. The UMD pattern typically attempts to offer compatibility with the most popular script loaders of the day (e.g RequireJS amongst others).

## Features

- Small utility script to export files in UMD format.
- Supports npm scripts.
- Task managers not required. 😄


## Install

Install with [npm](https://npmjs.org/package/umd-util)

```
$ npm install umd-util
```


## Usage

```js
const umdify = require('umd-util');

umdify('dist', 'index.js');
//=> dist/index.js
```


## API

### umdify(directory, path)

#### directory

Type: `string`
Default: `umd`

Write files to this directory.

#### path

Type: `string`
Default: `none`

Path to the file.

## License

MIT
