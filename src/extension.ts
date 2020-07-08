// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import exportExtensions from './commands/export-extensions';
import importExtensions from './commands/import-extensions';
import removeExtensions from './commands/remove-extensions';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	//console.log('Congratulations, your extension "vscode-ext-import-export" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	// let disposable = vscode.commands.registerCommand('vscode-ext-import-export.helloWorld', () => {
	// 	// The code you place here will be executed every time your command is executed

	// 	// Display a message box to the user
	// 	vscode.window.showInformationMessage('Hello World from vscode-ext-import-export!');
	// });

	const exportToJson = vscode.commands.registerCommand('extension.exportExtensions', () => exportExtensions(context));
	const importFromJson = vscode.commands.registerCommand('extension.importExtensions', () => importExtensions(context));
	const removeInstalledExtensions = vscode.commands.registerCommand('extension.removeExtensions', () => removeExtensions(context));

	context.subscriptions.push(exportToJson);
	context.subscriptions.push(importFromJson);
	context.subscriptions.push(removeInstalledExtensions);
}

// this method is called when your extension is deactivated
export function deactivate() {}
