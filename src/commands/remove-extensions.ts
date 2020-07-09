import { ExtensionContext } from 'vscode';
import { Environment, pluginService, vscodeHelpers } from './../services';
import { ExtensionTypeChoice } from './../models';

export default async (context: ExtensionContext) => {
  const choices: ExtensionTypeChoice[] = [
    { order: 1, title: 'Extensions', validOption: true },
    { order: 2, title: 'Themes', validOption: true },
    { order: 3, title: 'Both', validOption: true },
  ];
  const answer1 = await vscodeHelpers.showInformationMessage('Which extensions do you want to export?', ...choices);
  if (answer1.validOption !== true) {
    return;
  }
  const word =
    answer1.title === 'Themes'
      ? 'ALL installed themes'
      : answer1.title === 'Extensions'
      ? 'installed extensions'
      : 'ALL installed extensions';
  const answer2 = await vscodeHelpers.showInformationMessage(`Are you sure you want to remove ${word}?`, 'Yes', 'No');
  if (answer2 === 'Yes') {
    vscodeHelpers.showInformationMessage(`Removing ${word}...`);
    const env = new Environment(context);
    await pluginService.deleteExtensions(answer1.title, env.extensionFolder);
    const answer = await vscodeHelpers.showInformationMessage(
      `Finished removing ${word}. Please reload VS Code.`,
      'Reload'
    );
    if (answer === 'Reload') {
      vscodeHelpers.reloadWindow();
    }
  }
};
