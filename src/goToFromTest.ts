import * as vscode from 'vscode';

export function goToOrFromTest(context: vscode.ExtensionContext, srcUri: vscode.Uri): Thenable<vscode.Uri> {

    return Promise.resolve(srcUri);
}

// Cache lookup
//
// context.workspaceState:
