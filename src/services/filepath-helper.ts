import { Environment } from '.';
import { OsType } from '../models';

export const getSafePath = (env: Environment, path: string) => {
  let pathToUse = env.osType === OsType.windows ? path.replace(/\//g, '\\') : path;
  const ix = pathToUse.indexOf(':');
  if (ix > -1) {
    pathToUse = pathToUse.substr(ix + 1);
  }
  return pathToUse;
};
