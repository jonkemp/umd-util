const fs = require('fs');
const path = require('path');
const assert = require('assert');
const tempDirectory = require('temp-dir');
const beautify = require('js-beautify').js;
const umdify = require('./index.js');

describe('umdify', () => {
    it('should return a umd compatible script', () => {
        const beautifyOptions = { indent_size: 2, space_in_empty_paren: true };

        umdify(tempDirectory, path.join('test', 'browser.js'), {
            globalAlias: 'test'
        });

		const code = fs.readFileSync(path.join(tempDirectory, 'test', 'browser.js'), 'utf-8');
		const compare = fs.readFileSync(path.join(__dirname, 'test', 'fixture', 'browser.js'), 'utf-8');

		assert.equal(beautify(code, beautifyOptions), beautify(compare, beautifyOptions));
    });
});
