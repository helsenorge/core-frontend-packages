import { useCallback, useEffect, useRef, useState } from 'react';

import { safeStableStringify } from './string-utils';

export interface UseQueryOptions<TData, TArgs extends unknown[]> {
  /** Nøkkel som identifiserer forespørselen (påvirker caching/deduplisering). */
  queryKey: string | readonly unknown[];
  /** Asynkron funksjon som henter data. Får AbortSignal som første argument. */
  queryFn: AsyncQueryFn<TArgs, TData>;
  /** Kjør automatisk når nøkkel/argumenter endrer seg */
  enabled?: boolean;
  /** Millisekunder data regnes som ferske; 0 betyr alltid utdatert */
  staleTime?: number;
  /** Behold forrige data mens ny henting pågår. NB! Gjelder bruk av refetch, ikke når nøkkel har endret seg. */
  keepPreviousData?: boolean;
  /** Kalles når data har blitt hentet */
  onSuccess?: (data: TData) => void;
  /** Kalles ved feil */
  onError?: (err: unknown) => void;
  /** Argumenter som sendes til den asynkrone funksjonen */
  args?: TArgs;
  /**
   * Valgfri funksjon for å slå sammen ny data med eksisterende når fetchNext brukes
   */
  merge?: (oldData: TData | undefined, newData: TData) => TData;
  /**
   * Data å vise mens ny nøkkel/argumenter hentes og det ikke finnes cache for den nøkkelen ennå.
   * Kan være en verdi eller en funksjon som får forrige viste data og nåværende kontekst.
   */
  placeholderData?: TData | ((prevData: TData | undefined, ctx: { queryKey: string | readonly unknown[]; args: TArgs }) => TData);
}

export interface LocalQueryResult<TData, TArgs extends unknown[] = []> {
  /**
   * Rådata for gjeldende nøkkel/argumenter. Undefined mens lasting pågår eller før første svar.
   */
  data: TData | undefined;
  /**
   * Siste feil kastet av den asynkrone funksjonen (hvis noen). Nullstilles ved vellykket ny henting.
   */
  error: unknown;
  /**
   * True mens en forespørsel for gjeldende nøkkel/argumenter er i gang.
   */
  isLoading: boolean;
  /**
   * Praktisk flagg som er true når det finnes en feil (error !== undefined).
   */
  isError: boolean;
  /**
   * Tidspunkt (ms) når data sist ble oppdatert med suksess.
   */
  dataUpdatedAt: number | undefined;
  /**
   * Om cachet data regnes som utdatert i henhold til `staleTime`.
   * Utdatert data returneres fortsatt, men automatisk refetch kan skje.
   */
  isStale: boolean;
  /**
   * Manuelt trigge refetch, uavhengig av ferskhet (respekterer deduplisering og abort-regler).
   */
  refetch: () => void;
  /**
   * Avledet status: 'idle' (aldri hentet), 'loading', 'success' eller 'error'.
   */
  status: 'idle' | 'loading' | 'success' | 'error';
  /** Hent neste «side» ved å gi eksplisitte args; resultatet merges inn i eksisterende data hvis merge er satt. */
  fetchNext: (nextArgs: TArgs) => void;
}

export type AsyncQueryFn<TArgs extends unknown[], TData> = (signal: AbortSignal, ...args: TArgs) => Promise<TData>;

interface CacheEntry<TData> {
  state: {
    data?: TData;
    error?: unknown;
    updatedAt?: number;
    loading: boolean;
  };
  promise?: Promise<unknown>;
  abort?: AbortController;
}

/**
 * useQuery er en React-hook for å hente og cache asynkrone data.
 *
 * - Lokal cache per input (kun i denne komponent-instansen), med mulighet for å sette hvor lenge data anses som ferskt
 * - Deduplisering av forespørsler som allerede er i gang
 * - Avbryter requests som ikke trengs mer fordi input er endret
 * - Ignorerer requests som kommer for sent tilbake (input er endret i mens)
 * - Manuell refetch
 * - Mulig å beholde forrige data mens ny hentes
 * - Støtte for paginering/infinite scroll ved å kunne nye resultater inn i gamle
 * - Støtte for placeholderdata mens data lastes
 *
 * @param options Objekt med options, se UseQueryOptions
 */
export function useQuery<TData, TArgs extends unknown[] = []>(options: UseQueryOptions<TData, TArgs>): LocalQueryResult<TData, TArgs> {
  const {
    queryKey,
    queryFn,
    enabled = true,
    staleTime = 0,
    keepPreviousData = true,
    onSuccess,
    onError,
    args = [] as unknown as TArgs,
    merge: mergeFn,
    placeholderData,
  } = options;

  const keyString = Array.isArray(queryKey) ? safeStableStringify(queryKey) : String(queryKey);

  const cacheRef = useRef<Map<string, CacheEntry<TData>>>(new Map());
  const requestIdRef = useRef(0);
  const [, forceRender] = useState({});
  const prevDataRef = useRef<TData | undefined>(undefined);

  const getEntry = useCallback((): CacheEntry<TData> => {
    let entry = cacheRef.current.get(keyString);
    if (!entry) {
      entry = { state: { loading: false } };
      cacheRef.current.set(keyString, entry);
    }
    return entry;
  }, [keyString]);

  const isFresh = useCallback(
    (entry: CacheEntry<TData>): boolean => {
      if (!entry.state.updatedAt) {
        return false;
      }
      if (staleTime === 0) {
        return false;
      }
      return Date.now() - entry.state.updatedAt < staleTime;
    },
    [staleTime]
  );

  const startFetch = useCallback(
    (manual = false, overrideArgs?: TArgs, mergeMode = false) => {
      if (!enabled && !manual) {
        return;
      }
      const entry = getEntry();

      if (!manual && isFresh(entry)) {
        return;
      }

      // Dedupliser requests
      if (entry.promise) {
        return;
      }

      if (!manual && entry.state.error && entry.state.updatedAt) {
        const timeSinceError = Date.now() - entry.state.updatedAt;
        if (timeSinceError < staleTime) {
          return; // Don't retry errors within staleTime window
        }
      }

      const currentRequestId = ++requestIdRef.current;

      // Avbryt forrige forespørsel
      // @todo Dette fører til en AbortError, som må håndteres av oss spesielt siden vi nok ikke vil logge dette
      if (entry.abort) entry.abort.abort();
      const abort = new AbortController();
      entry.abort = abort;

      // Lag placeholder-data
      const usedArgs = overrideArgs ?? args;
      let placeholder: TData | undefined;
      if (entry.state.data === undefined && placeholderData !== undefined) {
        placeholder =
          typeof placeholderData === 'function'
            ? (placeholderData as (prev: TData | undefined, ctx: { queryKey: string | readonly unknown[]; args: TArgs }) => TData)(
                prevDataRef.current,
                { queryKey, args: usedArgs }
              )
            : placeholderData;
      }

      const preserved = keepPreviousData ? entry.state.data : undefined;
      entry.state = {
        ...entry.state,
        loading: true,
        error: undefined,
        data: preserved !== undefined ? preserved : placeholder,
      };
      forceRender({});

      const p = queryFn(abort.signal, ...usedArgs)
        .then(data => {
          if (abort.signal.aborted || currentRequestId !== requestIdRef.current) {
            // Ignorer avbrutte og foreldede forespørsler
            return data;
          }
          // Slå sammen data fra flere forespørsler
          const nextData = mergeMode && mergeFn ? mergeFn(entry.state.data, data) : data;
          entry.state = {
            data: nextData,
            error: undefined,
            updatedAt: Date.now(),
            loading: false,
          };
          prevDataRef.current = nextData;
          onSuccess?.(data);

          return data;
        })
        .catch(err => {
          if (abort.signal.aborted || currentRequestId !== requestIdRef.current) {
            return;
          }
          entry.state = {
            ...entry.state,
            error: err,
            updatedAt: Date.now(),
            loading: false,
          };
          onError?.(err);
        })
        .finally(() => {
          if (entry.promise === p) {
            entry.promise = undefined;
            forceRender({});
          }
        });

      entry.promise = p;
    },
    [getEntry, enabled, keepPreviousData, queryFn, args, onSuccess, onError, isFresh, mergeFn, placeholderData, queryKey, staleTime]
  );

  useEffect(() => {
    startFetch();
  }, [keyString, startFetch]);

  useEffect(() => {
    const mapRef = cacheRef.current;
    return (): void => {
      mapRef.forEach(e => e.abort?.abort());
    };
  }, []);

  const refetch = useCallback(() => startFetch(true), [startFetch]);
  const fetchNext = useCallback((nextArgs: TArgs) => startFetch(true, nextArgs, true), [startFetch]);

  const entry = getEntry();
  const data = entry.state.data;
  const isStale = !isFresh(entry);

  let status: LocalQueryResult<TData, TArgs>['status'] = 'idle';
  if (entry.state.loading) status = 'loading';
  else if (entry.state.error) status = 'error';
  else if (entry.state.data !== undefined) status = 'success';

  return {
    data,
    error: entry.state.error,
    isLoading: entry.state.loading,
    isError: entry.state.error !== undefined,
    dataUpdatedAt: entry.state.updatedAt,
    isStale,
    refetch,
    status,
    fetchNext,
  };
}
