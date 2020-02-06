const fs = require('fs');
const path = require('path');
const makeDir = require('make-dir');
const { promisify } = require('util');
const umdify = require('umd');
const writeFileAtomic = require('write-file-atomic');

const readFile = promisify(fs.readFile);

module.exports = async (moduleName, src, options) => {
	const dest = options.destination || 'umd';
	const commonJS = options.commonJS || false;
	const umdFile = path.join(dest, src);
	const fileContent = await readFile(src, 'utf8');
	const output = umdify(moduleName, fileContent, commonJS);

	await makeDir(path.dirname(umdFile));
	await writeFileAtomic(umdFile, output);
};
