import * as vscode from 'vscode';

import { goToOrFromTest } from './goToFromTest';
import { createTestFile, findTestFile } from './createTestFile';

const NO_URI_ERROR = (action: string): string => {
    return `Cannot ${action} spec file. File must be open in editor or selected in file explorer.`;
};

export function goOrToFromTestCommand(extensionContext: vscode.ExtensionContext): vscode.Disposable {
    return vscode.commands.registerCommand('vscode-create-test-file.goToOrFromTest', (uri) => {
        const sourceUri = ensureUri(uri);

        if (!sourceUri) {
            vscode.window.showErrorMessage(NO_URI_ERROR('go to or from'));
            return;
        }

        goToOrFromTest(extensionContext, sourceUri).then((destinationUri) => {
            vscode.window.showTextDocument(destinationUri);
        });
    });
}

export function createTestCommand(): vscode.Disposable {
    return vscode.commands.registerCommand('vscode-create-test-file.createTestFile', (uri) => {
        let srcUri = ensureUri(uri);

        if (!srcUri) {
            vscode.window.showErrorMessage(NO_URI_ERROR('create'));
        }

        createTestFile(srcUri).then((testUri) => {
            vscode.window.showTextDocument(testUri);
        });
    });
}

export function findTestCommand(): vscode.Disposable {
    return vscode.commands.registerCommand('vscode-create-test-file.findTestFile', (uri) => {
        let srcUri = ensureUri(uri);

        if (srcUri) {
            findTestFile(srcUri).then(
                testDocument => vscode.window.showTextDocument(testDocument),
                _ex => vscode.window.showErrorMessage(`Unable to find test file matching ${srcUri.path}.`)
            );
        } else {
            vscode.window.showErrorMessage(NO_URI_ERROR('find'));
        }
    });
}

function ensureUri(uri: any): any {
    if (typeof uri === 'undefined') {
        if (vscode.window.activeTextEditor) {
            uri = vscode.window.activeTextEditor.document.uri;
        }
    }
    return uri;
}
