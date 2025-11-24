/*import { HNCoreFileUploadNPMJS } from '../types/Resources';

import LanguageLocales from '@helsenorge/core-utils/constants/languages';
import { getModifiedResourcesForTest } from '@helsenorge/framework-utils/resources';

import defaultResources from './HN.Core.FileUpload.NPM.JS.nb-NO.json';

type ResourceItem = { [key: string]: string } | Record<string, string>;

const defaultResourceName = 'HN.Core.FileUpload.NPM.JS.nb-NO';

export function getResources(projectName: string, language: LanguageLocales = LanguageLocales.NORWEGIAN): Promise<ResourceItem> {
  if (projectName === defaultResourceName && language === LanguageLocales.NORWEGIAN) {
    return Promise.resolve(defaultResources);
  }

  return import(`./${projectName}.${language}.json`);
}

export function getResourcesTestHelper(): HNCoreFileUploadNPMJS {
  return getModifiedResourcesForTest(defaultResources) as HNCoreFileUploadNPMJS;
}*/
