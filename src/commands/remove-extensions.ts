import * as vscode from 'vscode';
import { Environment, pluginService } from './../services';

export default (context: vscode.ExtensionContext) => {
  vscode.window
    .showInformationMessage(
      'Are you sure you want to remove ALL installed extensions?',
      {
        modal: true,
      },
      'Yes',
      'No'
    )
    .then((answer: 'Yes' | 'No') => {
      if (answer === 'Yes') {
        vscode.window.showInformationMessage('Removing ALL installed extensions...');
        const env = new Environment(context);
        return pluginService.deleteExtensions(env.extensionFolder).then(() => {
          return vscode.window.showInformationMessage('Finished removing ALL previously installed extensions. Please reload VS Code', {
            modal: true
          }, 'Reload').then(answer => answer === 'Reload' ? vscode.commands.executeCommand('workbench.action.reloadWindow') : Promise.resolve());
        });
      }
    });
};
