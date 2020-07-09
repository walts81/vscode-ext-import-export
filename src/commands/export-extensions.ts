import { ExtensionContext } from 'vscode';
import * as fs from 'fs-extra';
import { ExtensionTypeChoice } from '../models';
import { vscodeHelpers, pluginService, Environment, getSafePath } from '../services';

const writeFile = (env: Environment, path: string, json: string, word: string) => {
  return new Promise((resolve, reject) => {
    const pathToUse = getSafePath(env, path);
    fs.writeFile(pathToUse, json, err => {
      if (!!err) {
        vscodeHelpers.showErrorMessage(`An error occurred exporting ${word} to JSON`).then(() => reject(err));
      } else {
        vscodeHelpers.showInformationMessage(`Finished exporting ${word} to JSON`).then(() => resolve());
      }
    });
  });
};

export default async (context: ExtensionContext) => {
  const choices: ExtensionTypeChoice[] = [
    { order: 1, title: 'Extensions', validOption: true },
    { order: 2, title: 'Themes', validOption: true },
    { order: 3, title: 'Both', validOption: true },
  ];
  const answer = await vscodeHelpers.showInformationMessage('Which extensions do you want to export?', ...choices);
  if (answer.validOption !== true) {
    return;
  }
  const uri = await vscodeHelpers.showSaveDialog({ filters: { JSON: ['json'] } });
  if (!uri) {
    return;
  }
  const exts = pluginService.getInstalledExtensions(answer.title as any);
  if (exts.length > 0) {
    const word =
      answer.title === 'Themes'
        ? 'ALL installed themes'
        : answer.title === 'Extensions'
        ? 'installed extensions'
        : 'ALL installed extensions';
    vscodeHelpers.showInformationMessage(`Exporting ${word} to JSON`);
    const env = new Environment(context);
    const json = JSON.stringify({ plugins: exts });
    await writeFile(env, uri.path, json, word);
  } else {
    const word = answer.title === 'Themes' ? 'themes' : 'extensions';
    await vscodeHelpers.showInformationMessage(`No ${word} found`);
  }
};
