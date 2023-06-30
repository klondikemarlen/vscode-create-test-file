import * as assert from 'assert';
import * as vscode from 'vscode';

import * as path from 'path';
import * as fs from 'fs';

import { createTestFile, testPath } from '../../createTestFile';

const WORKSPACE_ROOT = process.env.workspaceRoot as string;

suite('createTestFile', () => {
	suite('when only the name template is set', () => {
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

		test('performs a simple file name replacement', async () => {
			const examplePath = path.join(WORKSPACE_ROOT, 'example.rb');
			const originalUri = vscode.Uri.file(examplePath);

			const newUri = await createTestFile(originalUri);
			const expected = path.join(WORKSPACE_ROOT, 'example.test.rb');
			assert.equal(expected, newUri.path);
			assert.ok(fs.existsSync(newUri.path));
		});
	});

	suite('when name template is set, and path map is set to a simple pattern', () => {
		setup(async () => {
			const config = vscode.workspace.getConfiguration(
				'createTestFile',
			);
			await config.update('nameTemplate', '{filename}.test');
			await config.update('pathMaps', [
				{
					"pathPattern": "/?(.*)",
					"testFilePathPattern": "spec/$1"
                },
			]);
			await config.update('languages', {});

			const testFileExamplePath = path.join(WORKSPACE_ROOT, 'spec/example.test.rb');
			fs.unlink(testFileExamplePath, error => null);
		});

		test('creates the appropriate folder and performs the file name replacement', async () => {
			const examplePath = path.join(WORKSPACE_ROOT, 'example.rb');
			const originalUri = vscode.Uri.file(examplePath);

			const newUri = await createTestFile(originalUri);
			const expected = path.join(WORKSPACE_ROOT, 'spec/example.test.rb');
			assert.equal(expected, newUri.path);
			assert.ok(fs.existsSync(newUri.path));
		});
	});

	suite('when name template is set, and languages has a name template override', () => {
		setup(async () => {
			const config = vscode.workspace.getConfiguration(
				'createTestFile',
			);
			await config.update('nameTemplate', '{filename}.test');
			await config.update('pathMaps', []);
			await config.update('languages', {
				// eslint-disable-next-line @typescript-eslint/naming-convention
				"[ruby]": {
					// eslint-disable-next-line @typescript-eslint/naming-convention
					"createTestFile.nameTemplate": "{filename}_spec"
				}
			});

			const testFileExamplePath = path.join(WORKSPACE_ROOT, 'example_spec.rb');
			fs.unlink(testFileExamplePath, error => null);
		});

		test('prefers the language specific the file name replacement', async () => {
			const examplePath = path.join(WORKSPACE_ROOT, 'example.rb');
			const originalUri = vscode.Uri.file(examplePath);

			const newUri = await createTestFile(originalUri);
			const expected = path.join(WORKSPACE_ROOT, 'example_spec.rb');
			assert.equal(expected, newUri.path);
			assert.ok(fs.existsSync(newUri.path));
		});
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
