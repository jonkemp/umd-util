import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { temporaryDirectory } from 'tempy';
import pkg from 'js-beautify';
import umdify from './index.mjs';
import { fileURLToPath } from 'url';

const { js: beautify } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const genericTest = async (options, fixtureFilename) => {
	const compare = fs.readFileSync(path.join(path.dirname(import.meta.url), 'fixture', fixtureFilename), 'utf-8');
	const assertContents = contents => {
		try {
			assert.equal(contents, compare, `Wrapped file content is different from test template ${fixtureFilename}`);
		} catch(e) {
			console.log(e);
			process.exit(0);
		}
	};
	const tempDirectory = temporaryDirectory();

	options.destination = tempDirectory;
	await umdify('fixture/foo.js', options);

	const actual = fs.readFileSync(path.join(tempDirectory, 'fixture/foo.js'), 'utf-8');

	assertContents(actual);
};

describe('umdify', () => {
	describe('amd', () => {
		it('should return a umd compatible script', () => {
			genericTest(
				{
					templateName: 'amd',
					exports() {
						return 'Foo.Bar';
					}
				},
				'amd/testExports.js'
			);

			genericTest(
				{
					templateName: 'amd',
					namespace() {
						return 'Foo.Bar';
					}
				},
				'amd/testNamespace.js'
			);

			genericTest(
				{
					templateName: 'amd',
					dependencies() {
						return [
							'm0',
							{
								name: 'm1',
								amd: 'm1amd',
								cjs: 'm1cjs',
								global: 'm1glob',
								param: 'm1param'
							},
							{
								name: 'm2',
								amd: 'm2amd',
								cjs: 'm2cjs',
								global: 'm2glob',
								param: 'm2param'
							}
						];
					}
				},
				'amd/testWithDependencies.js'
			);

			genericTest(
				{
					templateName: 'amd'
				},
				'amd/testWithoutDependencies.js'
			);
		});
	});

	describe('amdCommonWeb', () => {
		it('should return a umd compatible script', () => {
			genericTest(
				{
					templateName: 'amdCommonWeb',
					exports() {
						return 'Foo';
					}
				},
				'amdCommonWeb/testExports.js'
			);

			genericTest(
				{
					templateName: 'amdCommonWeb',
					exports() {
						return {
							FooFunc: 'Foo',
							FooLength: 'Foo.length'
						};
					}
				},
				'amdCommonWeb/testExportsMap.js'
			);

			genericTest(
				{
					templateName: 'amdCommonWeb',
					namespace() {
						return 'Foo.Bar';
					}
				},
				'amdCommonWeb/testNamespace.js'
			);

			genericTest(
				{
					templateName: 'amdCommonWeb',
					dependencies() {
						return [
							'm0',
							{
								name: 'm1',
								amd: 'm1amd',
								cjs: 'm1cjs',
								global: 'm1glob',
								param: 'm1param'
							},
							{
								name: 'm2',
								amd: 'm2amd',
								cjs: 'm2cjs',
								global: 'm2glob',
								param: 'm2param'
							}
						];
					}
				},
				'amdCommonWeb/testWithDependencies.js'
			);

			genericTest(
				{
					templateName: 'amdCommonWeb'
				},
				'amdCommonWeb/testWithoutDependencies.js'
			);
		});
	});

	describe('amdWeb', () => {
		it('should return a umd compatible script', () => {
			genericTest(
				{
					templateName: 'amdWeb',
					exports() {
						return 'Foo.Bar';
					}
				},
				'amdWeb/testExports.js'
			);

			genericTest(
				{
					templateName: 'amdWeb',
					namespace() {
						return 'Foo.Bar';
					}
				},
				'amdWeb/testNamespace.js'
			);

			genericTest(
				{
					templateName: 'amdWeb',
					dependencies() {
						return [
							'm0',
							{
								name: 'm1',
								amd: 'm1amd',
								cjs: 'm1cjs',
								global: 'm1glob',
								param: 'm1param'
							},
							{
								name: 'm2',
								amd: 'm2amd',
								cjs: 'm2cjs',
								global: 'm2glob',
								param: 'm2param'
							}
						];
					}
				},
				'amdWeb/testWithDependencies.js'
			);

			genericTest(
				{
					templateName: 'amdWeb'
				},
				'amdWeb/testWithoutDependencies.js'
			);
		});
	});

	describe('common', () => {
		it('should return a umd compatible script', () => {
			genericTest(
				{
					templateName: 'common',
					exports() {
						return {
							FooBar: 'Foo.Bar'
						};
					}
				},
				'common/testExports.js'
			);

			genericTest(
				{
					templateName: 'common',
					dependencies() {
						return [
							'm0',
							{
								name: 'm1',
								amd: 'm1amd',
								cjs: 'm1cjs',
								global: 'm1glob',
								param: 'm1param'
							},
							{
								name: 'm2',
								amd: 'm2amd',
								cjs: 'm2cjs',
								global: 'm2glob',
								param: 'm2param'
							}
						];
					}
				},
				'common/testWithDependencies.js'
			);

			genericTest(
				{
					templateName: 'common'
				},
				'common/testWithoutDependencies.js'
			);
		});
	});

	describe('node', () => {
		it('should return a umd compatible script', () => {
			genericTest(
				{
					templateName: 'node',
					exports() {
						return 'Foo.Bar';
					}
				},
				'node/testExports.js'
			);

			genericTest(
				{
					templateName: 'node',
					dependencies() {
						return [
							'm0',
							{
								name: 'm1',
								amd: 'm1amd',
								cjs: 'm1cjs',
								global: 'm1glob',
								param: 'm1param'
							},
							{
								name: 'm2',
								amd: 'm2amd',
								cjs: 'm2cjs',
								global: 'm2glob',
								param: 'm2param'
							}
						];
					}
				},
				'node/testWithDependencies.js'
			);

			genericTest(
				{
					templateName: 'node'
				},
				'node/testWithoutDependencies.js'
			);
		});
	});

	describe('umd / returnExports', () => {
		it('should return a umd compatible script', () => {
			genericTest(
				{
					exports() {
						return 'Foo.Bar';
					}
				},
				'returnExports/testExports.js'
			);

			genericTest(
				{
					namespace() {
						return 'Foo.Bar';
					}
				},
				'returnExports/testNamespace.js'
			);

			genericTest(
				{
					dependencies() {
						return [
							'm0',
							{
								name: 'm1',
								amd: 'm1amd',
								cjs: 'm1cjs',
								global: 'm1glob',
								param: 'm1param'
							},
							{
								name: 'm2',
								amd: 'm2amd',
								cjs: 'm2cjs',
								global: 'm2glob',
								param: 'm2param'
							}
						];
					}
				},
				'returnExports/testWithDependencies.js'
			);

			genericTest(
				{},
				'returnExports/testWithoutDependencies.js'
			);

			genericTest(
				{
					templateName: 'amdNodeWeb'
				},
				'returnExports/testWithoutDependencies.js'
			);
		});
	});

	describe('web', () => {
		it('should return a umd compatible script', () => {
			genericTest(
				{
					templateName: 'web',
					exports() {
						return 'Foo.Bar';
					}
				},
				'web/testExports.js'
			);

			genericTest(
				{
					templateName: 'web',
					namespace() {
						return 'Foo.Bar';
					}
				},
				'web/testNamespace.js'
			);

			genericTest(
				{
					templateName: 'web',
					dependencies() {
						return [
							'm0',
							{
								name: 'm1',
								amd: 'm1amd',
								cjs: 'm1cjs',
								global: 'm1glob',
								param: 'm1param'
							},
							{
								name: 'm2',
								amd: 'm2amd',
								cjs: 'm2cjs',
								global: 'm2glob',
								param: 'm2param'
							}
						];
					}
				},
				'web/testWithDependencies.js'
			);

			genericTest(
				{
					templateName: 'web'
				},
				'web/testWithoutDependencies.js'
			);
		});
	});
});

describe('templateSource', () => {
	it('should return a umd compatible script', () => {
		const compare = fs.readFileSync(path.join(__dirname, 'fixture', 'templateSource/testTemplateSource.js'), 'utf-8');
		const beautifyOptions = {
			indent_with_tabs: true
		};
		const assertContents = contents => {
			try {
				assert.equal(beautify(contents, beautifyOptions), beautify(compare, beautifyOptions), 'Wrapped file content is different from test template web/testExports.js');
			} catch(e) {
				console.log(e);
				process.exit(0);
			}
		};
		const tempDirectory = temporaryDirectory();

		umdify.sync('fixture/foo.js', {
			templateSource: `(function(f) {
	if (typeof exports === "object" && typeof module !== "undefined") {
		module.exports = f()
	} else if (typeof define === "function" && define.amd) {
		define([], f)
	} else {
		var g;
		if (typeof window !== "undefined") {
			g = window
		} else if (typeof global !== "undefined") {
			g = global
		} else if (typeof self !== "undefined") {
			g = self
		} else {
			g = this
		}
		g.<%= namespace %> = f()
	}
})(function() {
	var define, module, exports;
	module = {
		exports: (exports = {})
	};

	<%= contents %>

	return module.exports;
});`,
			namespace() {
				return 'Foo.Bar';
			},
			destination: tempDirectory
		});

		const actual = fs.readFileSync(path.join(tempDirectory, 'fixture/foo.js'), 'utf-8');

		assertContents(actual);
	});
});

describe('umdify.sync', () => {
	it('should return a umd compatible script', () => {
		const compare = fs.readFileSync(path.join(__dirname, 'fixture', 'web/testExports.js'), 'utf-8');
		const assertContents = contents => {
			try {
				assert.equal(contents, compare, 'Wrapped file content is different from test template web/testExports.js');
			} catch(e) {
				console.log(e);
				process.exit(0);
			}
		};
		const tempDirectory = temporaryDirectory();

		umdify.sync('fixture/foo.js', {
			templateName: 'web',
			exports() {
				return 'Foo.Bar';
			},
			destination: tempDirectory
		});

		const actual = fs.readFileSync(path.join(tempDirectory, 'fixture/foo.js'), 'utf-8');

		assertContents(actual);
	});
});
