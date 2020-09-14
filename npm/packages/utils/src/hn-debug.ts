/**
 * Returnerer Debug verdien på window.HN objekt, eller false
 */

declare const HN: { Debug?: boolean };

window.HN = window.HN || {};

/**
 * Returnerer Debug fra HN objektet
 */
export const isDebug = (): boolean => {
  return !!HN.Debug;
};
