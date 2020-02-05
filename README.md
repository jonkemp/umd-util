# umd-util [![Build Status](https://travis-ci.com/jonkemp/umd-util.svg?branch=master)](https://travis-ci.com/jonkemp/umd-util)

> Export JavaScript files in UMD (Universal Module Definition) format.

[Universal Module Definition (UMD)](https://github.com/umdjs/umd) modules are capable of working everywhere, be it in the client, on the server or elsewhere. The UMD pattern typically attempts to offer compatibility with the most popular script loaders of the day (e.g RequireJS amongst others).

## Features

- Small utility script to export files in UMD format.
- Supports CommonJS format.
- Task managers not required. 😄


## Install

Install with [npm](https://npmjs.org/package/umd-util)

```
$ npm install umd-util
```


## Usage

```js
const umdify = require('umd-util');

// browser format
umdify('moduleName', 'index.js', {
	destination: 'dist'
});
//=> dist/index.js

// CommonJS format
umdify('moduleName', 'index.js', {
	commonJS: true,
	destination: 'umd'
});
//=> umd/index.js
```


## API

### umdify(name, source, options?)

#### name

Type: `string`  
Default: `none`

The name of the module.

#### source

Type: `string`  
Default: `none`

File to export.

#### options

Type: `object`

##### destination

Type: `string`  
Default: `umd`

Destination directory.

##### commonJS

Type: `boolean`  
Default: `false`

CommonJS export.

## License

MIT
