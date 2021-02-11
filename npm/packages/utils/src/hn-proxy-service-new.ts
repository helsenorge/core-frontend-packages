import { trackError } from './adobe-analytics';
import { TjenesterUrl, parseParams, addParams, OperationResponse, ParamsObj } from './hn-service';
import * as DateUtils from './date-utils';
import { warn } from './logger';

declare const HN: {
  Rest: {
    __TjenesterApiUrl__: string;
    __AnonymousHash__: string;
    __AuthenticatedHash__: string;
    __TjenesteType__: string;
    __TimeStamp__: string;
    __HendelseLoggType__: string;
  };
};
type RequestParamArrayType = string | number;
type RequestParamType = Record<string, string | number | boolean | Array<RequestParamArrayType>>;
// ProxyOperationResponse returneres bare ved feil fra proxy-tjenester
export interface ProxyErrorResponse extends Response {
  code: string;
  errorCategory: number;
  message: string;
}

/**
 * Returnerer proxy url med MinHelse baseUrl og proxynavnet
 * @param proxyName navn på api-et/løsningsområdet. Eks pasientjournal eller velgbehandlingssted
 * @param endpoint  path for endepunktet inkludert versjon. Eks: api/v1/Behandlinger eller v1/Behandlinger
 */
const getProxyEnvironmentPath = (proxyName: string, endpoint: string): string => {
  return `${TjenesterUrl()}/proxy/${proxyName}/${endpoint}`;
};

/**
 * Returnerer default params som trengs i en vanlig request
 */
const getDefaultRequestParams = (): Record<string, string> => {
  return {
    HNAnonymousHash: HN.Rest.__AnonymousHash__,
    HNAuthenticatedHash: HN.Rest.__AuthenticatedHash__,
    HNTjeneste: HN.Rest.__TjenesteType__,
    HNTimeStamp: HN.Rest.__TimeStamp__,
    'X-hn-hendelselogg': HN.Rest.__HendelseLoggType__,
  };
};

/**
 * Returnerer Headers som trengs i en vanlig request
 * @param type optional content-type - default er json
 */
export const createHeaders = (type = 'application/json'): Headers => {
  const headers: Headers = new Headers(getDefaultRequestParams());
  headers.append('Accept', type);
  headers.append('Content-Type', type);
  return headers;
};

/**
 * Returnerer JSON error objekt - f.eks '{ "Code":"EHAPI-100000", "Message":"Teknisk feil", "ErrorCategory": 0}'
 * @param html ErrorMsg i html
 */
export const getErrorFromHTML = (html: string): JSON | null => {
  const first = html.indexOf('{');
  const last = html.lastIndexOf('}');
  const everything = html.substring(first, last + 1);
  if (everything === '') {
    return null;
  }
  return JSON.parse(everything);
};

/**
 * Returnerer full query string basert på parametrene sendt som argument '?param1=value&param2=value'
 * @param params parametere som sendes med som query string
 */
const createQueryString = (params: RequestParamType): string => {
  return (
    '?' +
    Object.keys(params)
      .map((key: string) => {
        return Array.isArray(params[key])
          ? (params[key] as Array<RequestParamArrayType>).map((x: RequestParamArrayType) => `${key}=${x}`).join('&')
          : `${key}=${params[key]}`;
      })
      .join('&')
  );
};

/**
 * Sjekker status på en Response og returnerer en Promise avhengig av status
 * @param response Response objektet fra HTTP request
 */
const checkStatus = <T>(response: Response): Promise<T | null> => {
  const contentType: string | null = response.headers.get('content-type');
  if (contentType && contentType.indexOf('application/json') !== -1) {
    if (response.status === 204) {
      return new Promise(resolve => resolve(null));
    }
    if (response.ok) {
      return response.json();
    }
    return response.json().then((err: Response) => {
      if (
        (err as ProxyErrorResponse).code === 'SEC-110000' &&
        document.location &&
        document.location.href.indexOf('autosignout=1') === -1
      ) {
        // redirect dersom token er utgått eller ugyldig
        window.location.href = `${TjenesterUrl()}/auth/autosignout`;
      }
      throw err;
    });
  }
  throw {
    Message: 'Det har skjedd en teknisk feil. Prøv igjen senere.',
  };
};

/**
 * baseCrud som brukes for å fetche. Logger eventuelle nettverksfeil med warn().
 * @param method
 * @param proxyName navn på api-et/løsningsområdet. Eks pasientjournal eller velgbehandlingssted
 * @param endpoint  path for endepunktet inkludert versjon. Eks: api/v1/Behandlinger eller v1/Behandlinger
 * @param params parametere som sendes med som query string
 * @param data
 * @throws {Error} Dersom det skjedde en feil under fetch-kallet
 */
const baseCrud = <T, R>(method: string, proxyName: string, endpoint: string, params?: RequestParamType, data?: R): Promise<T | null> => {
  const queryString = params && Object.keys(params).length > 0 ? createQueryString(params) : '';
  const baseUrl = getProxyEnvironmentPath(proxyName, endpoint);
  const requestBody = data ? { body: JSON.stringify(data) } : {};
  const apiUrl = baseUrl + queryString;
  return fetch(apiUrl, {
    ...requestBody,
    method,
    credentials: 'include',
    headers: createHeaders(),
  })
    .then((response: Response) => checkStatus<T>(response as Response))
    .catch(err => {
      trackError('level1');
      if (err == 'TypeError: Failed to fetch') {
        warn(`Kall til følgende URL feilet: ${apiUrl}. Mottok ingen respons fra tjenesten.`);
        throw {
          Message: 'Det har skjedd en teknisk feil. Prøv igjen senere.',
        };
      } else {
        throw err;
      }
    });
};

/**
 * get method
 * @param proxyName navn på api-et/løsningsområdet. Eks pasientjournal eller velgbehandlingssted
 * @param endpoint  path for endepunktet inkludert versjon. Eks: api/v1/Behandlinger eller v1/Behandlinger
 * @param params parametere som sendes med som query string
 */
export const get = <T extends Response | {}>(proxyName: string, endpoint: string, params?: RequestParamType): Promise<T | null> => {
  return baseCrud<T, {}>('get', proxyName, endpoint, params);
};

/**
 * post method
 * @param proxyName navn på api-et/løsningsområdet. Eks pasientjournal eller velgbehandlingssted
 * @param endpoint  path for endepunktet inkludert versjon. Eks: api/v1/Behandlinger eller v1/Behandlinger
 * @param params parametere som sendes med som query string
 * @param data
 */
export const post = <T extends Response | {}, R>(
  proxyName: string,
  endpoint: string,
  data?: R,
  params?: RequestParamType
): Promise<T | null> => {
  return baseCrud<T, R>('post', proxyName, endpoint, params, data);
};

/**
 * put method
 * @param proxyName navn på api-et/løsningsområdet. Eks pasientjournal eller velgbehandlingssted
 * @param endpoint  path for endepunktet inkludert versjon. Eks: api/v1/Behandlinger eller v1/Behandlinger
 * @param params parametere som sendes med som query string
 * @param data
 */
export const put = <T extends Response | {}, R>(
  proxyName: string,
  endpoint: string,
  data?: R,
  params?: RequestParamType
): Promise<T | null> => {
  return baseCrud<T, R>('put', proxyName, endpoint, params, data);
};

/**
 * remove method
 * @param proxyName navn på api-et/løsningsområdet. Eks pasientjournal eller velgbehandlingssted
 * @param endpoint  path for endepunktet inkludert versjon. Eks: api/v1/Behandlinger eller v1/Behandlinger
 * @param params parametere som sendes med som query string
 * @param data
 */
export const remove = <T extends Response | {}, R>(
  proxyName: string,
  endpoint: string,
  data?: R,
  params?: RequestParamType
): Promise<T | null> => {
  return baseCrud<T, R>('delete', proxyName, endpoint, params, data);
};

/**
 * Konkatenerer url-lenke basert på environment, proxy, url, request params og custom params
 * @param proxyName navn på api-et/løsningsområdet. Eks pasientjournal eller velgbehandlingssted
 * @param endpoint  path for endepunktet inkludert versjon. Eks: api/v1/Behandlinger eller v1/Behandlinger
 * @param params parametere som sendes med som query string
 */
export const link = (proxyName: string, endpoint: string, params?: RequestParamType): string => {
  return getProxyEnvironmentPath(proxyName, endpoint) + createQueryString({ ...getDefaultRequestParams(), ...params });
};

/**
 * Fetch for nedlasting av filer
 * @param proxyName navn på api-et/løsningsområdet. Eks pasientjournal eller velgbehandlingssted
 * @param endpoint  path for endepunktet inkludert versjon. Eks: api/v1/Behandlinger eller v1/Behandlinger
 * @param params parametere som sendes med som query string
 */
export const download = (proxyName: string, endpoint: string, params?: ParamsObj): Promise<OperationResponse | void> => {
  let url = getProxyEnvironmentPath(proxyName, endpoint) + parseParams(addParams(params), true);
  const headers = createHeaders();
  headers.set('Content-Type', 'multipart/form-data');

  return new Promise(function(resolve, reject) {
    fetch(url, {
      method: 'get',
      credentials: 'include',
      headers,
    })
      .then(function(res) {
        const contentDisposition = res.headers.get('content-disposition');
        const match =
          contentDisposition && contentDisposition.match(/filename="(.+)"/) ? contentDisposition.match(/filename="(.+)"/) : false;
        let fileName = 'nedlasting-' + DateUtils.todaysDate() + '-helseNorge';
        if (match) {
          fileName = match[1];
        }
        const blobPromise = res.blob();
        return { blobPromise, fileName };
      })
      .then(function(respObj) {
        const fileName = respObj.fileName;

        respObj.blobPromise.then(function(blob) {
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, fileName);
            resolve();
          } else {
            const a = document.createElement('a');
            document.body.appendChild(a);
            url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = fileName;
            a.click();
            window.URL.revokeObjectURL(url);
            resolve();
          }
        });
      })
      .catch(function(responseHtml: string) {
        if (responseHtml === '401') {
          document.location.reload(true);
        } else {
          console.error('responseHtml', responseHtml);
          const errorResponse = getErrorFromHTML(responseHtml);
          let response;
          if (errorResponse && ((errorResponse as unknown) as OperationResponse).ErrorMessage) {
            response = errorResponse;
          } else {
            response = {
              ErrorMessage: {
                Title:
                  typeof errorResponse === 'string' || errorResponse instanceof String ? errorResponse : 'Det har skjedd en teknisk feil.',
                Body: '',
              },
            };
          }
          trackError('level1');
          reject(response);
        }
      });
  });
};
