import * as assert from 'assert';

import { testPath } from '../../createTestFile';


suite('testPath', () => {
	test('creates test file from windows path in same folder', () => {
		const srcPath = '/c:/Users/bob/code/app/foo.rb';
		const nameTemplate = '{filename}_spec';

		const expected = '/c:/Users/bob/code/app/foo_spec.rb';
		assert.equal(expected, testPath(srcPath, nameTemplate));
	});

	test('remaps windows path if mapping argument provided', () => {
		const srcPath = '/c:/Users/bob/code/app/Foo.cs';
		const nameTemplate = 'Test{filename}';
		const pathMapper = { pathPattern: 'app(/?.*)', testFilePathPattern: 'spec$1' };

		const expected = '/c:/Users/bob/code/spec/TestFoo.cs';
		assert.equal(expected, testPath(srcPath, nameTemplate, pathMapper));
	});

	test('supports remaps relative to project folder', () => {
		const srcPath = 'data/examples/example.rb';
		const nameTemplate = '{filename}_spec';
		const pathMapper = { pathPattern: '/?(.*)', testFilePathPattern: 'spec/$1' };
		const expected = 'spec/data/examples/example_spec.rb';
		assert.equal(expected, testPath(srcPath, nameTemplate, pathMapper));
	});
});
