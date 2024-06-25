/* This is a custom interface to be able to access and typecheck path on Events */
export interface WebComponentEvent<T extends EventTarget> extends Event {
  target: T;
  tagName: string;
  path: {
    find: (fn: (e: WebComponentEvent<T>) => boolean) => { id: string };
  };
}

/* This is a util to get the event target, wether it comes from the lightDOM or shadowDOM - this requires the Shadow DOM to be of type 'open' */
export const getEventTarget = (e: Event): EventTarget => e.composedPath()[0];
