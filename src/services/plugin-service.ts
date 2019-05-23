import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import * as path from 'path';
import { ExtensionInformation, ExtensionMetadata, OsType } from './../models';
const myExtName = 'extension-import-export';

export class PluginService {
  async installExtensions(osType: OsType, list: ExtensionInformation[], notify?: (msg: string) => void) {
    const missing = this.getMissingExtensions(list);
    if (missing.length === 0) {
      return Promise.resolve([]);
    }

    await this.installCli(osType, missing, notify);
  }

  getMissingExtensions(list: ExtensionInformation[]) {
    const hashset = {};
    const localList = this.getInstalledExtensions('Both');
    const missingList: ExtensionInformation[] = [];
    for (const ext of localList) {
      if (hashset[ext.name] == null) {
        hashset[ext.name] = ext;
      }
    }

    for (const ext of list) {
      if (hashset[ext.name] == null) {
        missingList.push(ext);
      }
    }
    return missingList;
  }

  getInstalledExtensions(extType: 'Extensions' | 'Themes' | 'Both') {
    const list: ExtensionInformation[] = [];
    for (const ext of vscode.extensions.all) {
      if (ext.packageJSON.isBuiltin === true || ext.packageJSON.name === myExtName) {
        continue;
      }

      if (extType === 'Extensions' && this.isTheme(ext)) {
        continue;
      }

      if (extType === 'Themes' && !this.isTheme(ext)) {
        continue;
      }

      const meta = ext.packageJSON.__metadata || {
        id: ext.packageJSON.uuid,
        publisherId: ext.id,
        publisherDisplayName: ext.packageJSON.publisher,
      };
      const data: ExtensionMetadata = {
        galleryApiUrl: meta.galleryApiUrl,
        id: meta.id,
        downloadUrl: meta.downloadUrl,
        publisherId: meta.publisherId,
        publisherDisplayName: meta.publisherDisplayName,
        date: meta.date,
      };
      const info: ExtensionInformation = {
        metadata: data,
        name: ext.packageJSON.name,
        publisher: ext.packageJSON.publisher,
        version: ext.packageJSON.version,
      };
      list.push(info);
    }
    return list;
  }

  async deleteExtensions(extType: 'Extensions' | 'Themes' | 'Both', extensionFolder: string) {
    const exts = this.getInstalledExtensions(extType);
    if (exts.length === 0) {
      return Promise.resolve();
    }

    for (const ext of exts) {
      await this.deleteExtension(ext, extensionFolder);
    }
  }

  private async deleteExtension(ext: ExtensionInformation, extensionFolder: string) {
    const dest = path.join(extensionFolder, `${ext.publisher}.${ext.name}-${ext.version}`);
    try {
      await fs.remove(dest);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  private async installCli(osType: OsType, list: ExtensionInformation[], notify?: (msg: string) => void) {
    const exec = require('child_process').exec;
    let myExt: string = process.argv0;
    const osPathInfo = this.getOsPathInfo(osType);
    myExt = '"' + myExt.substr(0, myExt.lastIndexOf(osPathInfo.codeLastFolder)) + osPathInfo.codeCliPath + '"';
    for (const ext of list) {
      const name = ext.publisher + '.' + ext.name;
      const cli = `${myExt} --install-extension ${name}`;
      try {
        await new Promise<any>(resolve => {
          exec(cli, (err, stdout, stderr) => {
            if (!stdout && (err || stderr)) {
              if (notify) {
                notify(err || stderr);
              }
            } else {
              if (notify) {
                notify(stdout);
              }
            }
            resolve();
          });
        });
      } catch (err) {
        console.log(err);
      }
    }
  }

  private getOsPathInfo(osType: OsType) {
    if (osType === OsType.windows) {
      return { codeLastFolder: 'Code', codeCliPath: 'bin/code' };
    } else if (osType === OsType.linux) {
      return { codeLastFolder: 'code', codeCliPath: 'bin/code' };
    } else if (osType === OsType.mac) {
      return { codeLastFolder: 'Frameworks', codeCliPath: 'Resources/app/bin/code' };
    }
    return { codeLastFolder: '', codeCliPath: '' };
  }

  private isTheme(ext: vscode.Extension<any>) {
    if (ext.packageJSON.categories && ext.packageJSON.categories.length > 0) {
      for (let i = 0; i < ext.packageJSON.categories.length; i++) {
        const cat = ext.packageJSON.categories[i].toLowerCase();
        if (cat === 'themes') {
          return true;
        }
      }
    }
    return false;
  }
}

export default new PluginService();
