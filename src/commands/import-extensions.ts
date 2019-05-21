import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import { Environment, pluginService } from './../services';
import { ExtensionInformation } from './../models';

export default (context: vscode.ExtensionContext) => {
  const env = new Environment(context);
  vscode.window
    .showOpenDialog({
      canSelectMany: false,
      filters: {
        JSON: ['json'],
      },
    })
    .then(uris => {
      return new Promise<any>((resolve, reject) => {
        fs.readFile(uris[0].path, 'utf8', (err, data) => {
          if (!!err) {
            vscode.window.showErrorMessage('Could not read JSON file');
            reject(err);
            return;
          }
          vscode.window.showInformationMessage('Installing extensions...');
          const json: { plugins: ExtensionInformation[] } = JSON.parse(data);
          pluginService
            .installExtensions(env.osType, json.plugins, vscode.window.showInformationMessage)
            .then(x => {
              vscode.window.showInformationMessage('Finished installing extensions. Please reload VS Code.',
                { modal: true }, 'Reload')
                .then(answer => answer === 'Reload' ? vscode.commands.executeCommand('workbench.action.reloadWindow').then(() => resolve(x)) : resolve());
            })
            .catch(err => {
              vscode.window.showErrorMessage('There was a problem installing extensions').then(() => reject(err));
            });
        });
      });
    });
};
