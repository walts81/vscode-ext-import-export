import { ExtensionMetadata } from './extension-metadata';

export interface ExtensionInformation {
  metadata: ExtensionMetadata;
  name: string;
  publisher: string;
  version: string;
}
