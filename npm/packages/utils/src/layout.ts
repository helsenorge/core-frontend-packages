import { theme } from '@helsenorge/designsystem-react';

export default {
  isNullToXs: function(): boolean {
    return window.matchMedia(`screen and (max-width: ${theme.breakpoints.xs}px)`).matches;
  },
  isXsToSm: function(): boolean {
    return window.matchMedia(`screen and (max-width: ${theme.breakpoints.sm}px)`).matches;
  },
  isSmToMd: function(): boolean {
    return window.matchMedia(`screen and (max-width: ${theme.breakpoints.md}px)`).matches;
  },
  isMdToLg: function(): boolean {
    return window.matchMedia(`screen and (max-width: ${theme.breakpoints.lg}px)`).matches;
  },
  isLgToXl: function(): boolean {
    return window.matchMedia(`screen and (max-width: ${theme.breakpoints.xl}px)`).matches;
  },
};
