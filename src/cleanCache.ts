import * as vscode from 'vscode';

import { TEST_TO_SOURCE_MAP_KEY, SOURCE_TO_TEST_MAP_KEY } from './cacheKeyConstants';

export function cleanCache(extensionContext: vscode.ExtensionContext): Thenable<Boolean> {
    const workspaceState = extensionContext.workspaceState;
    return workspaceState
        .update(TEST_TO_SOURCE_MAP_KEY, undefined)
        .then(() => workspaceState.update(SOURCE_TO_TEST_MAP_KEY, undefined))
        .then(() => true);
}
