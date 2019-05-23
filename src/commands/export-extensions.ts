import { ExtensionContext } from 'vscode';
import * as fs from 'fs-extra';
import { pluginService, vscodeHelpers } from './../services';
import { ExtensionTypeChoice } from './../models';

export default (context: ExtensionContext) => {
  const choices: ExtensionTypeChoice[] = [
    { order: 1, title: 'Extensions', validOption: true },
    { order: 2, title: 'Themes', validOption: true },
    { order: 3, title: 'Both', validOption: true },
  ];
  vscodeHelpers.showInformationMessage('Which extensions do you want to export?', ...choices).then(answer => {
    if (answer.validOption !== true) {
      return;
    }
    vscodeHelpers
      .showSaveDialog({
        filters: {
          JSON: ['json'],
        },
      })
      .then(uri => {
        return new Promise<any>((resolve, reject) => {
          const exts = pluginService.getInstalledExtensions(answer.title as any);
          if (exts.length > 0) {
            vscodeHelpers.showInformationMessage('Exporting ALL installed extensions to JSON...');
            const json = JSON.stringify({ plugins: exts });
            fs.writeFile(uri.path, json, err => {
              if (!!err) {
                vscodeHelpers.showErrorMessage('An error occurred exporting extensions to JSON');
                reject(err);
              } else {
                vscodeHelpers
                  .showInformationMessage('Finished exporting ALL installed extensions to JSON')
                  .then(() => resolve());
              }
            });
          } else {
            const word = (answer as any) === 'Themes' ? 'themes' : 'extensions';
            vscodeHelpers.showInformationMessage(`No ${word} found`);
          }
        });
      });
  });
};
