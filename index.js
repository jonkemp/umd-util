const fs = require('fs');
const path = require('path');
const makeDir = require('make-dir');
const umdify = require('libumd');

module.exports = (fileDir, filePath, options) => {
	try {
		const dir = fileDir || 'umd';
		const getPath = _filePath => path.join(dir, _filePath);
		const umdFilePath = getPath(filePath);
		const fileContent = fs.readFileSync(filePath, 'utf8');
		makeDir.sync(path.dirname(umdFilePath));
		fs.writeFileSync(umdFilePath, umdify(fileContent, options));
	} catch (error) {
		throw new Error(error);
	}
};
