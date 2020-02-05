const fs = require('fs');
const path = require('path');
const assert = require('assert');
const tempDirectory = require('temp-dir');
const beautify = require('js-beautify').js;
const umdify = require('./index.js');

describe('umdify', () => {
    it('should return a umd compatible script from a module with browser globals', async () => {
        const beautifyOptions = {
			indent_with_tabs: true
		};

        await umdify('test', path.join('test', 'browser.js'), {
			destination: tempDirectory
		});

		const code = fs.readFileSync(path.join(tempDirectory, 'test', 'browser.js'), 'utf-8');
		const compare = fs.readFileSync(path.join(__dirname, 'test', 'fixture', 'browser.js'), 'utf-8');

		assert.equal(beautify(code, beautifyOptions), beautify(compare, beautifyOptions));
	});

	it('should return a umd compatible script from a CommonJS module', async () => {
        const beautifyOptions = {
			indent_with_tabs: true
		};

        await umdify('myFunc', path.join('test', 'cjs.js'), {
			commonJS: true,
			destination: tempDirectory
		});

		const code = fs.readFileSync(path.join(tempDirectory, 'test', 'cjs.js'), 'utf-8');
		const compare = fs.readFileSync(path.join(__dirname, 'test', 'fixture', 'cjs.js'), 'utf-8');

		assert.equal(beautify(code, beautifyOptions), beautify(compare, beautifyOptions));
    });
});
