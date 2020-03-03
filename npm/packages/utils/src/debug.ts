declare const HN: { Debug?: boolean };

window.HN = window.HN || {};

export function isDebug() {
  return !!HN.Debug;
}
