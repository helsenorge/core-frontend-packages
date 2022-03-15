/**
 * debounce limits time a function can be executed
 * @param func function to debounce
 * @param wait wait for x time
 * @param immediate run now
 */
/* eslint-disable @typescript-eslint/no-this-alias, prefer-rest-params */

export function debounce(func: Function, wait: number, immediate?: boolean): () => void {
  let timeout: ReturnType<typeof setTimeout> | null;

  return function (): void {
    const context: Function = this,
      args: IArguments = arguments,
      later: () => void = (): void => {
        timeout = null;
        if (!immediate) {
          func.apply(context, args);
        }
      },
      callNow = immediate && !timeout;

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) {
      func.apply(context, args);
    }
  };
}

/* eslint-enable @typescript-eslint/no-this-alias, prefer-rest-params */
