import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('extension activates without crashing', () => {
		const extension = vscode.extensions.getExtension('klondikemarlen.create-test-file');

		assert.ok(extension !== undefined, "Extension is undefined");
		const typedExtension = extension as vscode.Extension<any>;

		assert.doesNotThrow(() => {
			typedExtension.activate();
		});
	});
});
