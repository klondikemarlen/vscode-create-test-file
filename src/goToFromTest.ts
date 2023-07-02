import * as vscode from 'vscode';

import { createTestFile } from './createTestFile';
import { TEST_TO_SOURCE_MAP_KEY, SOURCE_TO_TEST_MAP_KEY } from './cacheKeyConstants';

type PathMap = { [path: string]: string };

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
    if (pathExistsInCache(workspaceState, TEST_TO_SOURCE_MAP_KEY, sourceUri.path)) {
        return true;
    }

    return matchesTestFilePattern(sourceUri);
}

export function goToSource(extensionContext: vscode.ExtensionContext, sourceUri: vscode.Uri): vscode.Uri {
    const workspaceState = extensionContext.workspaceState;
    const sourcePath = sourceUri.path;
    const destinationPath = getPathFromCache(workspaceState, TEST_TO_SOURCE_MAP_KEY, sourcePath);
    if (destinationPath) {
        const destinationUri = vscode.Uri.file(destinationPath);
        return destinationUri;
    }
    vscode.window.showErrorMessage(`Could not find a source file for the test file: ${sourcePath}`);
    return sourceUri;
}

export function goToTest(extensionContext: vscode.ExtensionContext, sourceUri: vscode.Uri): Thenable<vscode.Uri> {
    const workspaceState = extensionContext.workspaceState;
    const sourcePath = sourceUri.path;
    const destinationPath = getPathFromCache(workspaceState, SOURCE_TO_TEST_MAP_KEY, sourcePath);
    if (destinationPath) {
        const destinationUri = vscode.Uri.file(destinationPath);
        return Promise.resolve(destinationUri);
    }

    return createTestFile(sourceUri).then((destinationUri) => {
        const destinationPath = destinationUri.path;
        return updateCache(workspaceState, sourcePath, destinationPath).then(
            () => destinationUri
        );
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

export function updateCache(workspaceState: vscode.Memento, sourcePath: string, testPath: string): Thenable<void> {
    const sourceToTestMap = workspaceState.get(SOURCE_TO_TEST_MAP_KEY, {}) as PathMap;
    sourceToTestMap[sourcePath] = testPath;
    return workspaceState.update(SOURCE_TO_TEST_MAP_KEY, sourceToTestMap).then(() => {
        const testToSourceMap = workspaceState.get(TEST_TO_SOURCE_MAP_KEY, {}) as PathMap;
        testToSourceMap[testPath] = sourcePath;
        return workspaceState.update(TEST_TO_SOURCE_MAP_KEY, testToSourceMap);
    });
}

export function pathExistsInCache(workspaceState: vscode.Memento, key: string, path: string): boolean {
    const cache = workspaceState.get(key, {}) as PathMap;
    return path in cache;
}

export function getPathFromCache(workspaceState: vscode.Memento, key: string, path: string): string {
    const cache = workspaceState.get(key, {}) as PathMap;
    return cache[path];
}
