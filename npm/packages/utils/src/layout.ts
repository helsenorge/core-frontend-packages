/*  This file has been converted to TypeScript
 When making changes to this file please make them
 in the file with a .ts or .tsx extension located in
 the Common/src/toolkit folder structure
 Then run the command "npm run build-toolkit" to generate the jsx file
 Please check both files into TFS */

import LayoutConstants from './constants/layout';

export default {
  isOneToTwoColumn: function(): boolean {
    return window.matchMedia(`screen and (max-width: ${LayoutConstants.ONE_TO_TWO_COLUMN})`).matches;
  },
  isTwoToThreeColumn: function(): boolean {
    return window.matchMedia(`screen and (max-width: ${LayoutConstants.TWO_TO_THREE_COLUMN})`).matches;
  },
  isThreeTwoFourColumn: function(): boolean {
    return window.matchMedia(`screen and (max-width: ${LayoutConstants.THREE_TO_FOUR_COLUMN})`).matches;
  },
  isXsToSm: function(): boolean {
    return window.matchMedia(`screen and (max-width: ${LayoutConstants.XS_TO_SM})`).matches;
  },
  isSmToMd: function(): boolean {
    return window.matchMedia(`screen and (max-width: ${LayoutConstants.SM_TO_MD})`).matches;
  },
  isMdToLg: function(): boolean {
    return window.matchMedia(`screen and (max-width: ${LayoutConstants.MD_TO_LG})`).matches;
  },
};
