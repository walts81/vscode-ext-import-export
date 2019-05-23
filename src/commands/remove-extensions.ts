import { ExtensionContext } from 'vscode';
import { Environment, pluginService, vscodeHelpers } from './../services';
import { ExtensionTypeChoice } from './../models';

export default (context: ExtensionContext) => {
  const choices: ExtensionTypeChoice[] = [
    { order: 1, title: 'Extensions', validOption: true },
    { order: 2, title: 'Themes', validOption: true },
    { order: 3, title: 'Both', validOption: true },
  ];
  vscodeHelpers.showInformationMessage('Which extensions do you want to export?', ...choices).then(answer1 => {
    if (answer1.validOption !== true) {
      return;
    }
    const word = answer1.title === 'Themes' ? 'themes' : 'extensions';
    vscodeHelpers
      .showInformationMessage(`Are you sure you want to remove ALL installed ${word}?`, 'Yes', 'No')
      .then((answer2: 'Yes' | 'No') => {
        if (answer2 === 'Yes') {
          vscodeHelpers.showInformationMessage('Removing ALL installed extensions...');
          const env = new Environment(context);
          return pluginService.deleteExtensions(answer1.title as any, env.extensionFolder).then(() => {
            return vscodeHelpers
              .showInformationMessage(
                'Finished removing ALL previously installed extensions. Please reload VS Code',
                'Reload'
              )
              .then(answer => (answer === 'Reload' ? vscodeHelpers.reloadWindow() : Promise.resolve()));
          });
        }
      });
  });
};
