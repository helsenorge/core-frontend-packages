/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
declare const HN: any;

window.HN = window.HN || {};
window.HN.MinHelse = window.HN.MinHelse || {};
window.HN.Page = window.HN.Page || {};

export type callback = () => void;

/**
 * Returnerer __Path__ fra HN.Page objektet
 */
export const getPath = (): string => {
  return HN.Page.__Path__;
};
/**
 * Returnerer __Version__ fra HN.Page objektet
 */
export const getVersion = (): string => {
  return HN.Page.__Version__;
};
/**
 * Returnerer __Assets__ fra HN.Page objektet
 */
export const getAssets = (): string => {
  return HN.Page.__Assets__;
};

/**
 * Returnerer __Assets__ fra HN.Page objektet - eller tom string hvis den ikke finnes
 */
export const getAssetsUrl = (): string => {
  return HN.Page.__Assets__ !== undefined && HN.Page.__Assets__ !== null ? HN.Page.__Assets__ : '';
};

/**
 * Oppdaterer __Path__ key på HN.Page objektet
 * @param newPath verdien som settes i __Path__
 */
export const setPath = (newPath: string): void => {
  HN.Page.__Path__ = newPath;
};

/**
 * Sjekker eksisterende Queue på HN.MinHelse objektet og pusher cb methoden i Queuen
 * @param start callback som pushes i Queue
 */
export const registerBlock = (start: callback): void => {
  if (!window.HN.MinHelse.hasOwnProperty('Queue')) {
    window.HN.MinHelse.Queue = [];
    start();
  } else {
    const queue: Array<callback> = window.HN.MinHelse.Queue as Array<callback>;
    queue.push(start);
  }
};

/**
 * Sjekker eksisterende Queue på HN.MinHelse objektet og pusher cb methoden i Queuen
 * Forskjell med registerBlock er at den  oppretter en tom array i Queue hvis den ikke eksisterer fra før av
 * @param start callback som pushes i Queue
 */
export const register = (start: callback): void => {
  if (!window.HN.MinHelse.hasOwnProperty('Queue')) {
    start();
  } else {
    const queue: Array<callback> = window.HN.MinHelse.Queue as Array<callback>;
    queue.push(start);
  }
};
