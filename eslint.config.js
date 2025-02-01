import globals from 'globals';
import js from '@eslint/js';

/** @type {import('eslint').Linter.Config[]} */
export default [
	{
		...js.configs.recommended,
	},
	{
		languageOptions: {
			ecmaVersion: 2018,
			sourceType: 'module'
		},
		rules: {
			'indent': [
				'error',
				'tab'
			],
			'linebreak-style': [
				'error',
				'unix'
			],
			'no-param-reassign': 'error',
			'quotes': [
				'error',
				'single'
			],
			'semi': [
				'error',
				'always'
			]
		}
	},
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
				...globals.mocha,
			}
		}
	},
];
