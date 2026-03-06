import type { HNCoreFileUploadNPMJS } from '../../resources/Resources';

import { LanguageLocales } from '@helsenorge/designsystem-react';

import enGB from '../../resources/HN.Core.FileUpload.NPM.JS.en-GB.json';
import nbNO from '../../resources/HN.Core.FileUpload.NPM.JS.nb-NO.json';
import nnNO from '../../resources/HN.Core.FileUpload.NPM.JS.nn-NO.json';
import seNO from '../../resources/HN.Core.FileUpload.NPM.JS.se-NO.json';

export const getResources = (language: LanguageLocales): HNCoreFileUploadNPMJS => {
  switch (language) {
    case LanguageLocales.ENGLISH:
      return enGB;
    case LanguageLocales.NORWEGIAN_NYNORSK:
      return nnNO;
    case LanguageLocales.SAMI_NORTHERN:
      return seNO;
    case LanguageLocales.NORWEGIAN:
    default:
      return nbNO;
  }
};
