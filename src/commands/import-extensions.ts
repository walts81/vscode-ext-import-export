import { ExtensionContext } from 'vscode';
import * as fs from 'fs-extra';
import { Environment, getSafePath, pluginService, vscodeHelpers } from '../services';
import { ExtensionInformation } from './../models';

const readFile = (env: Environment, path: string): Promise<{ plugins: ExtensionInformation[] }> => {
  return new Promise((resolve, reject) => {
    const pathToUse = getSafePath(env, path);
    fs.readFile(pathToUse, 'utf8', (err, data) => {
      if (!!err) {
        vscodeHelpers.showErrorMessage('Could not read JSON file').then(() => reject(err));
      } else {
        resolve(JSON.parse(data));
      }
    });
  });
};

export default async (context: ExtensionContext) => {
  const env = new Environment(context);
  const uris = await vscodeHelpers.showOpenDialog({
    canSelectMany: false,
    filters: { JSON: ['json'] },
  });
  if (!uris || uris.length < 1) {
    return;
  }
  const json = await readFile(env, uris[0].path);
  try {
    await pluginService.installExtensions(env.osType, json.plugins, vscodeHelpers.showInformationMessage);
    const answer = await vscodeHelpers.showInformationMessage(
      'Finished installing extensions. Please reload VS Code.',
      'Reload'
    );
    if (answer === 'Reload') {
      vscodeHelpers.reloadWindow();
    }
  } catch (err) {
    await vscodeHelpers.showErrorMessage('There was a problem installing extensions');
    throw err;
  }
};
