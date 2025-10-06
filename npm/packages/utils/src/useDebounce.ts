import { useCallback, useEffect, useRef } from 'react';

/**
 * Debounce en funksjon
 * @param func Funksjon som skal debounces
 * @param wait Debounce-forsinkelsen i millisekunder
 * @returns En debounced versjon av funksjonen
 */
export function useDebounce<A = unknown, R = void>(func: (args: A) => R | Promise<R>, wait: number): (args: A) => void {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const funcRef = useRef(func);

  useEffect(() => {
    funcRef.current = func;
  }, [func]);

  useEffect(() => {
    return (): void => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const debounced = useCallback(
    (args: A) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        funcRef.current(args);
      }, wait);
    },
    [wait]
  );

  return debounced;
}
