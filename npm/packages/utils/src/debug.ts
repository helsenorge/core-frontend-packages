/**
 * Sjekker om man en cookie har en value
 * @param cookieName navn på cookie
 * @param onClickOutside value
 */

declare const HN: { Debug?: boolean };

window.HN = window.HN || {};

export function isDebug() {
  return !!HN.Debug;
}
