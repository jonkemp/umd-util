const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const umdify = require('umd');
const writeFileAtomic = require('write-file-atomic');

const readFile = promisify(fs.readFile);

module.exports = async (moduleName, filePath, options) => {
	const destination = options.destination || 'umd';
	const commonJS = options.commonJS || false;
	const umdFilePath = path.join(destination, filePath);
	const fileContent = await readFile(filePath, 'utf8');
	const output = umdify(moduleName, fileContent, commonJS);

	await writeFileAtomic(umdFilePath, output);
};
