import * as vscode from 'vscode';

export interface ExtensionTypeChoice extends vscode.MessageItem {
  validOption: boolean;
  order: number;
}
