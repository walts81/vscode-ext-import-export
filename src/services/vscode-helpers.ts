import * as vscode from 'vscode';

export class VsCodeHelpers {
  reloadWindow() {
    return vscode.commands.executeCommand('workbench.action.reloadWindow');
  }

  showInformationMessage(message: string);
  showInformationMessage<T extends string | vscode.MessageItem>(message: string, ...items: T[]);
  showInformationMessage<T extends string | vscode.MessageItem>(
    message: string,
    options?: vscode.MessageOptions,
    ...items: string[] | T[]
  ) {
    return vscode.window.showInformationMessage(message, options, ...(items as any));
  }

  showErrorMessage(message: string);
  showErrorMessage<T extends string | vscode.MessageItem>(message: string, ...items: T[]);
  showErrorMessage<T extends string | vscode.MessageItem>(
    message: string,
    options?: vscode.MessageOptions,
    ...items: string[] | T[]
  ) {
    return vscode.window.showErrorMessage(message, options, ...(items as any));
  }

  showOpenDialog(options: vscode.OpenDialogOptions): Thenable<vscode.Uri[] | undefined> {
    return vscode.window.showOpenDialog(options);
  }

  showSaveDialog(options: vscode.SaveDialogOptions): Thenable<vscode.Uri | undefined> {
    return vscode.window.showSaveDialog(options);
  }

  showInputBox(options?: vscode.InputBoxOptions, token?: vscode.CancellationToken): Thenable<string | undefined> {
    return vscode.window.showInputBox(options, token);
  }
}

export default new VsCodeHelpers();
