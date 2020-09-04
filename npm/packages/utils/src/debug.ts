/**
 * Returnerer Debug verdien på window.HN objekt, eller false
 */

declare const HN: { Debug?: boolean };

window.HN = window.HN || {};

export const isDebug = (): boolean => {
  return !!HN.Debug;
};
