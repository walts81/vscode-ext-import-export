import * as os from 'os';
import * as path from 'path';
import * as vscode from 'vscode';
import { OsType } from './../models';

export class Environment {
  isInsiders = false;
  isOss = false;
  isPortable = false;
  homeDir = '';
  PATH = '';
  osType: OsType;
  USER_FOLDER = '';
  extensionFolder = '';

  constructor(private context: vscode.ExtensionContext) {
    this.isInsiders = /insiders/.test(this.context.asAbsolutePath(''));
    this.isPortable = process.env.VSCODE_PORTABLE ? true : false;
    this.isOss = /\boss\b/.test(this.context.asAbsolutePath(''));
    const isXdg = !this.isInsiders && process.platform === 'linux' && !!process.env.XDG_DATA_HOME;
    this.homeDir = isXdg
      ? process.env.XDG_DATA_HOME
      : process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'];
    const configSuffix = `${isXdg ? '' : '.'}vscode${this.isInsiders ? '-insiders' : this.isOss ? '-oss' : ''}`;

    if (this.isPortable) {
      this.PATH = process.env.VSCODE_PORTABLE;
      if (process.platform === 'darwin') {
        this.osType = OsType.mac;
      } else if (process.platform === 'linux') {
        this.osType = OsType.linux;
      } else if (process.platform === 'win32') {
        this.osType = OsType.windows;
      } else {
        this.osType = OsType.linux;
      }
      this.USER_FOLDER = this.PATH.concat('/user-data/User/');
      this.extensionFolder = this.PATH.concat('/extensions/');
    } else {
      if (process.platform === 'darwin') {
        this.PATH = `${process.env.HOME}/Library/Application Support`;
        this.osType = OsType.mac;
      } else if (process.platform === 'linux') {
        this.PATH = isXdg && !!process.env.XDG_CONFIG_HOME ? process.env.XDG_CONFIG_HOME : `${os.homedir()}/.config`;
        this.osType = OsType.linux;
      } else if (process.platform === 'win32') {
        this.PATH = process.env.APPDATA;
        this.osType = OsType.windows;
      } else {
        this.PATH = '/var/local';
        this.osType = OsType.linux;
      }
      this.USER_FOLDER = this.PATH.concat('/User/');
      this.extensionFolder = path.join(this.homeDir, configSuffix, 'extensions');
    }
  }
}
