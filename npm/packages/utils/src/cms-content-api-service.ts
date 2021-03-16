import { trackError } from './adobe-analytics';
import { warn } from './logger';
import { getHelsenorgeUrl } from './hn-service';

/**
 * Returnerer __CmsContentApiUrl__ fra window.HN.Rest
 */
export const getContentApiUrl = (): string => {
  return !!window.HN && !!window.HN.Rest && !!window.HN.Rest.__CmsContentApiUrl__ ? window.HN.Rest.__CmsContentApiUrl__ : '';
};

/**
 * Returnerer __CmsContentApiPreviewUrl__ fra window.HN.Rest
 */
export const getContentApiPreviewUrl = (): string => {
  return !!window.HN && !!window.HN.Rest && !!window.HN.Rest.__CmsContentApiPreviewUrl__ ? window.HN.Rest.__CmsContentApiPreviewUrl__ : '';
};

/**
 * Returnerer true dersom URLen man står på inneholder content-api-preview=true
 */
export const enableContentApiPreview = (): boolean => {
  return !!window && window.location.href.indexOf('content-api-preview=true') !== -1;
};

/**
 * Oppretter ny Header objekt med Accept og Content-type satt til application/json
 */
export const createHeaders = (): Headers => {
  const headers = new Headers();
  headers.append('Accept', 'application/json');
  headers.append('Content-Type', 'application/json');
  return headers;
};

/**
 * Returnerer en url-friendly string param (format '?param1=myparam1&partam2=myparam2')
 * @param params object med parameters { param1 : 'myparam1', param2: 'myparam2'}
 */
export const parseParams = (params?: object): string => {
  if (params) {
    return (
      `?` +
      Object.keys(params).reduce((previous, key, index) => {
        if (params.hasOwnProperty(key)) {
          return `${previous}${index > 0 ? '&' : ''}${key}=${params[key]}`;
        }
        return '';
      }, '')
    );
  }
  return '';
};

/**
 * Sjekker status på en Response og returnerer en Promise avhengig av status
 * @param response Response objektet fra HTTP request
 */
export const checkStatus = (response: Response): Promise<{}> | undefined => {
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.indexOf('application/json') !== -1) {
    if (response.status === 204) {
      return undefined;
    }
    if (response.ok) {
      return response.json();
    }
    return response.json().then(err => {
      trackError('level1');
      throw err;
    });
  }
};

/**
 * Henter JSON fra content-apiet med fetch(). Returnerer et Promise.
 * Logger eventuelle feil med warn().
 * @param cmd command strengen som sendes mot content-apiet
 * @param params object med parameters { param1 : 'myparam1', param2: 'myparam2'}
 * @throws {Error} Dersom det skjedde en feil under henting av data fra content-apiet.
 */
export const get = (endpoint: string, params?: object): Promise<{} | Response | undefined> => {
  const preview = enableContentApiPreview();
  const hostName = preview ? getContentApiPreviewUrl() : getContentApiUrl();
  const credentials = preview ? 'include' : 'omit';
  const headers = createHeaders();
  if (preview) {
    headers.append('X-Preview', 'true');
  }
  const apiUrl = hostName + '/contentapi/internal/v1/' + endpoint + parseParams(params);
  return fetch(apiUrl, {
    method: 'get',
    credentials: credentials, // Må settes til omit for å kunne bruke wildcard for domener i CORS
    headers: headers,
  })
    .then(checkStatus)
    .catch(error => {
      if (error == 'TypeError: Failed to fetch') {
        warn(`Kall til content-apiet feilet: ${apiUrl}. Mottok ingen respons fra tjenesten.`);
      } else {
        warn(`Kall til content-apiet feilet: ${apiUrl}. Feilmelding: ${JSON.stringify(error)}`);
      }

      throw error;
    });
};

/**
 * Henter JSON fra Helsenorge-proxy (samme domene som content-apiet) med fetch().
 * Skal kun benyttes for åpne api-kall til tjenester der det er satt opp proxy (SOT).
 * Returnerer et Promise.
 * Logger eventuelle feil med warn().
 * @param cmd command strengen som sendes mot content-apiet
 * @param params object med parameters { param1 : 'myparam1', param2: 'myparam2'}
 * @throws {Error} Dersom det skjedde en feil under henting av data fra content-apiet.
 */

export const getHelsenorgeProxy = (endpoint: string, proxyName: string, params?: object): Promise<{} | Response | undefined> => {
  const apiUrl = getHelsenorgeUrl() + '/proxy/' + proxyName + '/api/v1/' + endpoint + parseParams(params);
  return fetch(apiUrl, {
    method: 'get',
    credentials: 'omit', // Må settes til omit for å kunne bruke wildcard for domener i CORS
    headers: createHeaders(),
  })
    .then(r => checkStatus(r as Response))
    .catch(error => {
      if (error == 'TypeError: Failed to fetch') {
        warn(`Kall til helsenorge proxy: ${apiUrl}. Mottok ingen respons fra tjenesten.`);
      } else {
        warn(`Kall til helsenorge proxy feilet: ${apiUrl}. Feilmelding: ${JSON.stringify(error)}`);
      }

      throw error;
    });
};
