import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
// import * as myExtension from '../../extension';
import { testPath } from '../createTest';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Sample test', () => {
		assert.strictEqual(-1, [1, 2, 3].indexOf(5));
		assert.strictEqual(-1, [1, 2, 3].indexOf(0));
	});

	//////////////////////////////////////////////////////////////////////////////////
	// TODO: migrate files such that these tests pass
	describe('testPath', () => {
		it('creates test file from windows path in same folder', () => {
			const srcPath = '/c:/Users/bob/code/app/foo.rb';
			const nameTemplate = '{filename}_spec';

			const expected = '/c:/Users/bob/code/app/foo_spec.rb';
			assert.equal(expected, testPath(srcPath, nameTemplate));
		});

		it('remaps windows path if mapping argument provided', () => {
			const srcPath = '/c:/Users/bob/code/app/Foo.cs';
			const nameTemplate = 'Test{filename}';
			const pathMapper = { pathPattern: 'app(/?.*)', testFilePath: 'spec$1' };

			const expected = '/c:/Users/bob/code/spec/TestFoo.cs';
			assert.equal(expected, testPath(srcPath, nameTemplate, pathMapper));
		});
	});
});