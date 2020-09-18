import { trackError } from './adobe-analytics';

/**
 * Returnerer __CmsContentApiUrl__ fra window.HN.Rest
 */
export const getContentApiUrl = (): string => {
  return !!window.HN && !!window.HN.Rest && !!window.HN.Rest.__CmsContentApiUrl__ ? window.HN.Rest.__CmsContentApiUrl__ : '';
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
 * Lager fetch call mot Content API'et. Returnerer en HTTP Response
 * @param cmd command strengen som sendes mot API'et
 * @param params object med parameters { param1 : 'myparam1', param2: 'myparam2'}
 */
export const get = (cmd: string, params?: object): Promise<{} | Response | undefined> => {
  return fetch(getContentApiUrl() + '/contentapi/internal/v1/' + cmd + parseParams(params), {
    method: 'get',
    credentials: 'omit', // Må settes til omit for å kunne bruke wildcard for domener i CORS
    headers: createHeaders(),
  }).then(checkStatus);
};
