import { trackError } from './adobe-analytics';
declare const HN: {
  Rest: {
    __MinHelseUrl__: string;
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
const getBaseUrl = (): string => {
  return HN.Rest.__MinHelseUrl__ !== undefined && HN.Rest.__MinHelseUrl__ !== null ? HN.Rest.__MinHelseUrl__ : '';
};
const getProxyEnvironmentPath = (proxyName: string): string => {
  return `${getBaseUrl()}/proxy/${proxyName}/api/v1/`;
};
const getDefaultRequestParams = (): Record<string, string> => {
  return {
    HNAnonymousHash: HN.Rest.__AnonymousHash__,
    HNAuthenticatedHash: HN.Rest.__AuthenticatedHash__,
    HNTjeneste: HN.Rest.__TjenesteType__,
    HNTimeStamp: HN.Rest.__TimeStamp__,
    'X-hn-hendelselogg': HN.Rest.__HendelseLoggType__,
  };
};
const createHeaders = (type = 'application/json'): Headers => {
  const headers: Headers = new Headers(getDefaultRequestParams());
  headers.append('Accept', type);
  headers.append('Content-Type', type);
  return headers;
};
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
      if ((err as ProxyErrorResponse).code === 'SEC-110000') {
        // redirect dersom token er utgått eller ugyldig
        window.location.href = `${getBaseUrl()}/auth/autosignout`;
      }
      throw err;
    });
  }
  throw {
    Message: 'Det har skjedd en teknisk feil. Prøv igjen senere.',
  };
};
const baseCrud = <T, R>(method: string, url: string, proxyName: string, params?: RequestParamType, data?: R): Promise<T | null> => {
  const queryString = params && Object.keys(params).length > 0 ? createQueryString(params) : '';
  const baseUrl = getProxyEnvironmentPath(proxyName);
  const requestBody = data ? { body: JSON.stringify(data) } : {};
  return fetch(baseUrl + url + queryString, {
    ...requestBody,
    method,
    credentials: 'include',
    headers: createHeaders(),
  })
    .then((response: Response) => checkStatus<T>(response as Response))
    .catch(err => {
      trackError('level1');
      if (err == 'TypeError: Failed to fetch') {
        throw {
          Message: 'Det har skjedd en teknisk feil. Prøv igjen senere.',
        };
      } else {
        throw err;
      }
    });
};
export const get = <T extends Response | {}>(url: string, proxyName: string, params?: RequestParamType): Promise<T | null> => {
  return baseCrud<T, {}>('get', url, proxyName, params);
};
export const post = <T extends Response, R>(url: string, proxyName: string, data: R, params?: RequestParamType): Promise<T | null> => {
  return baseCrud<T, R>('post', url, proxyName, params, data);
};
export const put = <T extends Response, R>(url: string, proxyName: string, data?: R, params?: RequestParamType): Promise<T | null> => {
  return baseCrud<T, R>('put', url, proxyName, params, data);
};
export const remove = <T extends Response, R>(url: string, proxyName: string, data?: R, params?: RequestParamType): Promise<T | null> => {
  return baseCrud<T, R>('delete', url, proxyName, params, data);
};
export const link = (url: string, proxyName: string, params?: RequestParamType): string => {
  return getProxyEnvironmentPath(proxyName) + url + createQueryString({ ...getDefaultRequestParams(), ...params });
};
