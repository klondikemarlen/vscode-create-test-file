import * as assert from 'assert';
import * as vscode from 'vscode';

import * as path from 'path';
import * as fs from 'fs';

import { createTestFile, testPath } from '../../createTestFile';

const WORKSPACE_ROOT = process.env.workspaceRoot as string;

suite('createTestFile', () => {
	setup(async () => {
		const config = vscode.workspace.getConfiguration(
			'createTestFile',
		);
		await config.update('nameTemplate', '{filename}.test');
		await config.update('pathMaps', []);
		await config.update('languages', {});

		const testFileExamplePath = path.join(WORKSPACE_ROOT, 'example.test.rb');
		fs.unlink(testFileExamplePath, error => null);
	});

	test('should create the appropriate a test file', async () => {
		const examplePath = path.join(WORKSPACE_ROOT, './example.rb');
		const originalUri = vscode.Uri.file(examplePath);

		const newUri = await createTestFile(originalUri);
		const expected = path.join(WORKSPACE_ROOT, './example.test.rb');
		assert.equal(expected, newUri.path);
	});
});


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
