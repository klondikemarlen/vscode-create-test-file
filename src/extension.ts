// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import { cleanCacheCommand, findTestCommand, createTestCommand, goOrToFromTestCommand } from './commands';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	context.subscriptions.push(cleanCacheCommand(context));
	context.subscriptions.push(goOrToFromTestCommand(context));
	context.subscriptions.push(createTestCommand());
    context.subscriptions.push(findTestCommand());
}

// This method is called when your extension is deactivated
// eslint-disable-next-line @typescript-eslint/no-empty-function
export function deactivate() {
	// clean up cache files?
}
