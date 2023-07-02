import * as vscode from 'vscode';

import { createTestFile } from './createTestFile';

export function goToOrFromTest(extensionContext: vscode.ExtensionContext, sourceUri: vscode.Uri): Thenable<vscode.Uri> {
    if (isTestFile(extensionContext, sourceUri)) {
        const destinationUri = goToSource(extensionContext, sourceUri);
        return Promise.resolve(destinationUri);
    } else {
        return goToTest(extensionContext, sourceUri);
    }
}

export function isTestFile(extensionContext: vscode.ExtensionContext, sourceUri: vscode.Uri): boolean {
    const workspaceState = extensionContext.workspaceState;

    // if entry found that links this file to a source file
    // then the file is a test file
    if (workspaceState.get(`test-to-source-map:${sourceUri.path}`)) {
        return true;
    }

    return matchesTestFilePattern(sourceUri);
}

export function goToSource(extensionContext: vscode.ExtensionContext, sourceUri: vscode.Uri): vscode.Uri {
    const workspaceState = extensionContext.workspaceState;
    const destinationPath = workspaceState.get(`test-to-source-map:${sourceUri.path}`) as string;
    if (destinationPath) {
        const destinationUri = vscode.Uri.file(destinationPath);
        return destinationUri;
    }
    vscode.window.showErrorMessage('Could not find a source file for this test file.');
    return sourceUri;
}

export function goToTest(extensionContext: vscode.ExtensionContext, sourceUri: vscode.Uri): Thenable<vscode.Uri> {
    const workspaceState = extensionContext.workspaceState;
    const destinationPath = workspaceState.get(`source-to-test-map:${sourceUri.path}`) as string;
    if (destinationPath) {
        const destinationUri = vscode.Uri.file(destinationPath);
        return Promise.resolve(destinationUri);
    }

    return createTestFile(sourceUri).then(async destinationUri => {
        await workspaceState.update(`source-to-test-map:${sourceUri.path}`, destinationUri.path);
        await workspaceState.update(`test-to-source-map:${destinationUri.path}`, sourceUri.path);
        return destinationUri;
    });
}

export function matchesTestFilePattern(sourceUri: vscode.Uri): boolean {
    const config = vscode.workspace.getConfiguration('createTestFile');
    const isTestFileMatchers = config.get('isTestFileMatchers') as string[];

    const sourcePath = sourceUri.path;
    return isTestFileMatchers.some((matcher: string) => {
        const regex = new RegExp(matcher);
        return regex.test(sourcePath);
    });
}
