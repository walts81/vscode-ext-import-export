import { ExtensionContext } from 'vscode';
import * as fs from 'fs-extra';
import { Environment, pluginService, vscodeHelpers } from './../services';
import { ExtensionInformation } from './../models';

export default (context: ExtensionContext) => {
  const env = new Environment(context);
  vscodeHelpers
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
            vscodeHelpers.showErrorMessage('Could not read JSON file');
            reject(err);
            return;
          }
          vscodeHelpers.showInformationMessage('Installing extensions...');
          const json: { plugins: ExtensionInformation[] } = JSON.parse(data);
          pluginService
            .installExtensions(env.osType, json.plugins, vscodeHelpers.showInformationMessage)
            .then(x => {
              vscodeHelpers
                .showInformationMessage('Finished installing extensions. Please reload VS Code.', 'Reload')
                .then(answer =>
                  answer === 'Reload' ? vscodeHelpers.reloadWindow().then(() => resolve(x)) : resolve()
                );
            })
            .catch(err => {
              vscodeHelpers.showErrorMessage('There was a problem installing extensions').then(() => reject(err));
            });
        });
      });
    });
};
