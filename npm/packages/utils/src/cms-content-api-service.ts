import { trackError } from './adobe-analytics';

function getContentApiUrl(): string {
  return !!window.HN && !!window.HN.Rest && !!window.HN.Rest.__CmsContentApiUrl__ ? window.HN.Rest.__CmsContentApiUrl__ : '';
}

function createHeaders(): Headers {
  const headers = new Headers();
  headers.append('Accept', 'application/json');
  headers.append('Content-Type', 'application/json');
  return headers;
}

function parseParams(params?: object): string {
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

function checkStatus(response: Response): Promise<{}> | undefined {
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

export function get(cmd: string, params?: object): Promise<{} | Response | undefined> {
  return fetch(getContentApiUrl() + '/contentapi/internal/v1/' + cmd + parseParams(params), {
    method: 'get',
    credentials: 'omit', // Må settes til omit for å kunne bruke wildcard for domener i CORS
    headers: createHeaders(),
  }).then(checkStatus);
}
