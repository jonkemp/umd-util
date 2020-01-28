const fs = require('fs');
const path = require('path');
const assert = require('assert');
const tempDirectory = require('temp-dir');
const beautify = require('js-beautify').js;
const umdify = require('./index.js');

describe('umdify', () => {
    it('should return a umd compatible script from a module with browser globals', () => {
        const beautifyOptions = {
			indent_with_tabs: true
		};

        umdify('test', tempDirectory, path.join('test', 'browser.js'));

		const code = fs.readFileSync(path.join(tempDirectory, 'test', 'browser.js'), 'utf-8');
		const compare = fs.readFileSync(path.join(__dirname, 'test', 'fixture', 'browser.js'), 'utf-8');

		assert.equal(beautify(code, beautifyOptions), beautify(compare, beautifyOptions));
	});

	it('should return a umd compatible script from a CommonJS module', () => {
        const beautifyOptions = {
			indent_with_tabs: true
		};

        umdify('myFunc', tempDirectory, path.join('test', 'cjs.js'), true);

		const code = fs.readFileSync(path.join(tempDirectory, 'test', 'cjs.js'), 'utf-8');
		const compare = fs.readFileSync(path.join(__dirname, 'test', 'fixture', 'cjs.js'), 'utf-8');

		assert.equal(beautify(code, beautifyOptions), beautify(compare, beautifyOptions));
    });
});
