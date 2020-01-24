# umd-util [![Build Status](https://travis-ci.com/jonkemp/umd-util.svg?branch=master)](https://travis-ci.com/jonkemp/umd-util)

> Export JavaScript files in UMD (Universal Module Definition) format.

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
