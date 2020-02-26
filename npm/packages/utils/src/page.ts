export type callback = () => void;

export function registerBlock(start: callback): void {
  if (!window.HN.MinHelse.hasOwnProperty("Queue")) {
    window.HN.MinHelse.Queue = [];
    start();
  } else {
    const queue: Array<callback> = window.HN.MinHelse.Queue as Array<callback>;
    queue.push(start);
  }
}

export function register(start: callback): void {
  if (!window.HN.MinHelse.hasOwnProperty("Queue")) {
    start();
  } else {
    const queue: Array<callback> = window.HN.MinHelse.Queue as Array<callback>;
    queue.push(start);
  }
}
/* eslint-disable @typescript-eslint/no-explicit-any */
declare const HN: any;
/* eslint-enable @typescript-eslint/no-explicit-any */

window.HN = window.HN || {};
window.HN.MinHelse = window.HN.MinHelse || {};
window.HN.Page = window.HN.Page || {};

export function getPath(): string {
  return HN.Page.__Path__;
}
export function getVersion(): string {
  return HN.Page.__Version__;
}
export function getAssets(): string {
  return HN.Page.__Assets__;
}
