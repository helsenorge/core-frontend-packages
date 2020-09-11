import { theme } from '@helsenorge/designsystem-react';

export default {
  isNullToXs: function(): boolean {
    return window.matchMedia(`screen and (max-width: ${theme.breakpoints.null})`).matches;
  },
  isXsToSm: function(): boolean {
    return window.matchMedia(`screen and (max-width: ${theme.breakpoints.sm})`).matches;
  },
  isSmToMd: function(): boolean {
    return window.matchMedia(`screen and (max-width: ${theme.breakpoints.md})`).matches;
  },
  isMdToLg: function(): boolean {
    return window.matchMedia(`screen and (max-width: ${theme.breakpoints.lg})`).matches;
  },
  isLgToXl: function(): boolean {
    return window.matchMedia(`screen and (max-width: ${theme.breakpoints.xl})`).matches;
  },
};
