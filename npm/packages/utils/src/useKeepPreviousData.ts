import { useRef, useEffect } from 'react';

/**
 * Ta vare på forrige data når data er undefined.
 * Nyttig for å unngå "blinking" i UI når data lastes inn på nytt.
 *
 * @param data - Den nåværende dataen som kan være undefined.
 * @returns Den nåværende dataen hvis den ikke er undefined, ellers den forrige dataen.
 */
function useKeepPreviousData<T>(data: T | undefined): T | undefined {
  const ref = useRef<T | undefined>(data);

  useEffect(() => {
    if (data !== undefined) {
      ref.current = data;
    }
  }, [data]);

  // eslint-disable-next-line react-hooks/refs -- @todo Må rettes opp i
  return data !== undefined ? data : ref.current;
}

export default useKeepPreviousData;
