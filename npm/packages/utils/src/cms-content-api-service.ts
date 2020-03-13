import { trackError } from './adobe-analytics';

declare global {
  interface Window {
    HN?: {
      Rest?: {
        __CmsContentApiUrl__: string;
      };
    };
  }
}

function getContentApiUrl() {
  return !!window.HN && !!window.HN.Rest && !!window.HN.Rest.__CmsContentApiUrl__ ? window.HN.Rest.__CmsContentApiUrl__ : '';
}

function createHeaders() {
  const headers = new Headers();
  headers.append('Accept', 'application/json');
  headers.append('Content-Type', 'application/json');
  return headers;
}

function parseParams(params?: object) {
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
}

function checkStatus(response: Response) {
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
}

export function get(cmd: string, params?: object) {
  return fetch(getContentApiUrl() + '/contentapi/internal/v1/' + cmd + parseParams(params), {
    method: 'get',
    credentials: 'include',
    headers: createHeaders(),
  }).then(checkStatus);
}
