import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import { pluginService } from './../services';

export default (context: vscode.ExtensionContext) => {
  const exts = pluginService.getInstalledExtensions();
  vscode.window
    .showSaveDialog({
      filters: {
        JSON: ['json'],
      },
    })
    .then(uri => {
      return new Promise<any>((resolve, reject) => {
        vscode.window.showInformationMessage('Exporting ALL installed extensions to JSON...');
        const json = JSON.stringify({ plugins: exts });
        fs.writeFile(uri.path, json, err => {
          if (!!err) {
            vscode.window.showErrorMessage('An error occurred exporting extensions to JSON');
            reject(err);
          } else {
            vscode.window.showInformationMessage('Finished exporting ALL installed extensions to JSON').then(() => resolve());
          }
        });
      });
    });
};
