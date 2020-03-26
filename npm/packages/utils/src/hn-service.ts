import 'whatwg-fetch';
import { trackError } from './adobe-analytics';
import * as DateUtils from './date-utils';

/* eslint-disable @typescript-eslint/no-explicit-any */

enum RepresentasjonforholdType {
  InnloggetBruker = 0,
  Fullmakt = 1,
  Foreldrerepresentasjon = 2,
  Saksbehandler = 3,
  SaksbehandlerFullmakt = 4,
}

enum ReservasjonStatusType {
  Reservert = 0,
  Trukket = 1,
}

enum StatusKodeType {
  Reservert = 1,
  IkkeReservert = 2,
  Samtykket = 3,
  IkkeSamtykket = 4,
  TilgangsbegrensningOpprettet = 5,
  TilgangsbegrensningFjernet = 6,
}

enum ReservasjonType {
  None = 0,
  InnsynPasientjournal = 1,
  InnsynMinHelse = 4,
  KommunaltPasientOgBrukerregisterDirekteIdentifiserbare = 5,
  RepresentasjonAvBarn = 6,
  KommunaltPasientOgBrukerregisterGamle = 7,
  KommunaltPasientOgBrukerregisterAndreFormal = 8,
  Fastlegeordningen = 9,
}
interface Reservasjon {
  ReservasjonType: ReservasjonType;
  PersonvernInnstillingDefinisjonGuid: any;
  Opprettet: string;
  ReservertAvFornavn: string;
  ReservertAvEtternavn: string;
  RepresentasjonforholdType: RepresentasjonforholdType;
  StatusType: ReservasjonStatusType;
  StatusKodeType: StatusKodeType;
  ErAktiv: boolean;
}

enum HttpStatusCode {
  Continue = 100,
  SwitchingProtocols = 101,
  OK = 200,
  Created = 201,
  Accepted = 202,
  NonAuthoritativeInformation = 203,
  NoContent = 204,
  ResetContent = 205,
  PartialContent = 206,
  MultipleChoices = 300,
  MovedPermanently = 301,
  Redirect = 302,
  SeeOther = 303,
  NotModified = 304,
  UseProxy = 305,
  Unused = 306,
  TemporaryRedirect = 307,
  BadRequest = 400,
  Unauthorized = 401,
  PaymentRequired = 402,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
  NotAcceptable = 406,
  ProxyAuthenticationRequired = 407,
  RequestTimeout = 408,
  Conflict = 409,
  Gone = 410,
  LengthRequired = 411,
  PreconditionFailed = 412,
  RequestEntityTooLarge = 413,
  RequestUriTooLong = 414,
  UnsupportedMediaType = 415,
  RequestedRangeNotSatisfiable = 416,
  ExpectationFailed = 417,
  UpgradeRequired = 426,
  InternalServerError = 500,
  NotImplemented = 501,
  BadGateway = 502,
  ServiceUnavailable = 503,
  GatewayTimeout = 504,
  HttpVersionNotSupported = 505,
}
interface TextMessage {
  Title: string;
  Body: string;
}
export interface OperationResponse extends Response {
  StatusCode: HttpStatusCode;
  InformationMessage: TextMessage;
  WarningMessage: TextMessage;
  ErrorMessage: TextMessage;
  RedirectUrl: string;
}

const minHelsePath = '/api/v1/MinHelse/';
const portalPath = '/api/v1/Portal/';
const openCmd = 'HelseNorge/';
const uploadCmd = 'Upload/';

// A hack for the Redux DevTools Chrome extension.
declare global {
  interface Window {
    HN?: any;
  }
}

declare const HN: {
  Rest: any;
  Commands: any;
  PortalCommands: any;
  Page: any;
};

declare const TextDecoder: any;

window.HN = window.HN || {};
window.HN.Rest = window.HN.Rest || {};
window.HN.Commands = window.HN.Commands || {};
window.HN.PortalCommands = window.HN.PortalCommands || {};

export function usePasientensLegemiddelliste() {
  return HN.Rest.__PasientensLegemiddelliste__ !== undefined && HN.Rest.__PasientensLegemiddelliste__ !== null
    ? HN.Rest.__PasientensLegemiddelliste__
    : false;
}

export function useVerticalUrl() {
  return HN.Rest.__VerticalUrl__ !== undefined && HN.Rest.__VerticalUrl__ !== null ? HN.Rest.__VerticalUrl__ : false;
}

export function isAuthorized() {
  return HN.Rest.__Authorized__ !== undefined && HN.Rest.__Authorized__ !== null ? HN.Rest.__Authorized__ : false;
}

export function hashIsAuthorized() {
  return HN.Rest.__HashIsAuthorized__ !== undefined && HN.Rest.__HashIsAuthorized__ !== null ? HN.Rest.__HashIsAuthorized__ : false;
}

export function useBetaTjeneste() {
  return HN.Rest.__ApiHelseNorgeDisabled__ !== undefined && HN.Rest.__ApiHelseNorgeDisabled__ !== null
    ? !HN.Rest.__ApiHelseNorgeDisabled__
    : false;
}

export function getTjenesteUrl() {
  return HN.Rest.__TjensterUrl__ !== undefined && HN.Rest.__TjensterUrl__ !== null ? HN.Rest.__TjensterUrl__ : '';
}

export function getMinHelseUrl() {
  return HN.Rest.__MinHelseUrl__ !== undefined && HN.Rest.__MinHelseUrl__ !== null ? HN.Rest.__MinHelseUrl__ : '';
}

export function getAssetsUrl() {
  return HN.Page.__Assets__ !== undefined && HN.Page.__Assets__ !== null ? HN.Page.__Assets__ : '';
}

export function getPasientreiserUrl() {
  return HN.Rest.__MinHelseUrl__ !== undefined && HN.Rest.__MinHelseUrl__ !== null ? `${HN.Rest.__MinHelseUrl__}/pasientreiser` : '';
}

export function getHelsenorgeUrl() {
  return HN.Rest.__HelseNorgeUrl__ !== undefined && HN.Rest.__HelseNorgeUrl__ !== null ? HN.Rest.__HelseNorgeUrl__ : '';
}

export function isSkjemautfyller() {
  return HN.Page.__Path__ !== undefined && HN.Page.__Path__ !== null && HN.Page.__Path__ === 'skjemautfyller';
}

export function isMHLoggedIn() {
  return getCookie('MH_LoggedIn') !== null ? true : false;
}

function getCookie(name: string) {
  const re = new RegExp(name + '=([^;]+)');
  const value = re.exec(document.cookie);
  return value !== null ? unescape(value[1]) : null;
}

function getAutoCommand(): string {
  return isAuthorized() === true ? HN.Commands : HN.PortalCommands;
}

function getMinHelseEnvironmentPath(): string {
  return getMinHelseUrl() + minHelsePath;
}

function getPortalEnvironmentPath(): string {
  return getTjenesteUrl() + portalPath;
}

export function getMinHelseOpenEnvironmentPath() {
  return getMinHelseUrl() + minHelsePath + openCmd;
}

function getAutoPath(): string {
  return isAuthorized() === true ? getMinHelseEnvironmentPath() : getPortalEnvironmentPath();
}

function canCallAutoService(): boolean {
  return (isAuthorized() === true && hashIsAuthorized() === true) || (isAuthorized() === false && hashIsAuthorized() === false);
}

function createHeaders(type = 'application/json'): Headers {
  const headers: Headers = new Headers();
  headers.append('Accept', type);
  headers.append('Content-Type', type);
  if (!!HN.Rest?.__AuthenticatedHash__ && !!HN.Rest?.__AnonymousHash__) {
    headers.append('HNAnonymousHash', HN.Rest.__AnonymousHash__);
    headers.append('HNAuthenticatedHash', HN.Rest.__AuthenticatedHash__);
    headers.append('HNTimeStamp', HN.Rest.__TimeStamp__);
    headers.append('HNTjeneste', HN.Rest.__TjenesteType__);
    headers.append('x-hn-hendelselogg', HN.Rest.__HendelseLoggType__);
  } else {
    headers.append('X-HN-CSRF-Token', HN.Rest.__CSRF_Token__);
    headers.append('X-HN-CSRF-Timestamp', HN.Rest.__CSRF_Timestamp__);
  }

  return headers;
}

function createPortalHeaders(type = 'application/json'): Headers {
  const headers: Headers = new Headers();
  headers.append('Accept', type);
  headers.append('Content-Type', type);
  return headers;
}

export function parseParams(params: any, withQuery?: boolean): string {
  if (params && typeof params === 'object') {
    let first = true;
    return (
      `${withQuery ? '?' : ''}` +
      Object.keys(params).reduce((previous: string, key: string) => {
        if (params.hasOwnProperty(key) && typeof params[key] !== 'function') {
          if (first) {
            first = false;
            return `${previous}${key}=${params[key]}`;
          }
          return `${previous}&${key}=${params[key]}`;
        }
        return '';
      }, '')
    );
  }
  return '';
}

export function addParams(params: any) {
  params['HNAnonymousHash'] = HN.Rest.__AnonymousHash__;
  params['HNAuthenticatedHash'] = HN.Rest.__AuthenticatedHash__;
  params['HNTjeneste'] = HN.Rest.__TjenesteType__;
  params['HNTimeStamp'] = HN.Rest.__TimeStamp__;
  params['X-hn-hendelselogg'] = HN.Rest.__HendelseLoggType__;
  return params;
}

function checkStatus<T extends OperationResponse>(response: Response): Promise<T> | Promise<any> | undefined {
  const contentType: string | null = response.headers.get('content-type');
  if (contentType && contentType.indexOf('application/json') !== -1) {
    if (response.status === 204) {
      return undefined;
    }
    if (response.ok) {
      return response.json();
    }
    return response.json().then((err: OperationResponse) => {
      if (response.status === 403 && err.RedirectUrl) {
        window.location.href = err.RedirectUrl;
      }
      trackError('level1');
      throw err;
    });
  }
  throw {
    ErrorMessage: {
      Title: 'Det har skjedd en teknisk feil.',
      Body: 'Prøv igjen senere.',
    },
    status: response.status,
  };
}

export function get<T extends OperationResponse>(cmd: string, params?: any): Promise<T> {
  if (!params) {
    const cmdKey = '__' + cmd + '__';
    if (HN.Commands.hasOwnProperty(cmdKey)) {
      return Promise.resolve(HN.Commands[cmdKey]);
    }
  }

  const headers = createHeaders();
  return fetch(getMinHelseEnvironmentPath() + cmd + parseParams(params, true), {
    method: 'get',
    credentials: 'include',
    headers,
  }).then(checkStatus);
}

export function getPortal<T extends OperationResponse>(cmd: string, params?: any): Promise<T> {
  if (!params) {
    const cmdKey = '__' + cmd + '__';
    if (HN.PortalCommands.hasOwnProperty(cmdKey)) {
      return Promise.resolve(HN.PortalCommands[cmdKey]);
    }
  }
  const headers = createPortalHeaders();
  return fetch(getPortalEnvironmentPath() + cmd + parseParams(params, true), {
    method: 'get',
    credentials: 'include',
    headers,
  }).then(checkStatus);
}

export function getVBS<T>(cmd: string, params?: any): Promise<T> {
  const headers = createHeaders();
  const vbsRestUrl = `${window.location.origin}/_vti_bin/VBS/vbsrest.svc/`;
  return fetch(vbsRestUrl + cmd + parseParams(params, true), {
    method: 'get',
    credentials: 'include',
    headers,
  }).then(checkStatus);
}

export function getAuto<T extends OperationResponse>(cmd: string, params?: {}): Promise<T> {
  if (canCallAutoService()) {
    if (!params) {
      const cmdKey = '__' + cmd + '__';
      const commands = getAutoCommand();
      if (commands.hasOwnProperty(cmdKey)) {
        return Promise.resolve(commands[cmdKey]);
      }
    }
    const headers = createHeaders();
    return fetch(getAutoPath() + cmd + parseParams(params, true), {
      method: 'get',
      credentials: 'include',
      headers,
    }).then(checkStatus);
  } else {
    return Promise.resolve(new Response(undefined, { status: 401 })).then(checkStatus);
  }
}

export function getXml(cmd: string, params?: any): Promise<any> {
  return fetch(getMinHelseEnvironmentPath() + cmd + parseParams(params, true), {
    method: 'get',
    credentials: 'include',
    headers: createHeaders('application/xml'),
  }).then((response: any) => {
    if (response.body) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      return getXmlResult(reader, decoder, '');
    } else {
      return response.text();
    }
  });
}

function getXmlResult(reader: any, decoder: any, partialXmlResult: string): string {
  let xmlResult = partialXmlResult;
  return reader.read().then((result: any) => {
    if (result.done) {
      return xmlResult;
    }
    xmlResult += decoder.decode(result.value || new Uint8Array(0), {
      stream: !result.done,
    });
    return getXmlResult(reader, decoder, xmlResult);
  });
}

function crud<T extends OperationResponse>(method: string, cmd: string, data?: any, params?: any): Promise<T> {
  return fetch(getMinHelseEnvironmentPath() + cmd + parseParams(params, true), {
    method,
    credentials: 'include',
    headers: createHeaders(),
    body: JSON.stringify(data),
  })
    .then((response: Response) => checkStatus<T>(response))
    .catch(err => {
      trackError('level1');
      if (err == 'TypeError: Failed to fetch') {
        throw {
          ErrorMessage: {
            Title: 'Det har skjedd en teknisk feil.',
            Body: 'Prøv igjen senere.',
          },
        };
      } else {
        throw err;
      }
    });
}

function crudAuto<T extends OperationResponse>(method: string, cmd: string, data?: any, params?: any, forcePortal?: boolean): Promise<T> {
  return fetch((forcePortal ? getPortalEnvironmentPath() : getAutoPath()) + cmd + parseParams(params, true), {
    method,
    credentials: 'include',
    headers: createHeaders(),
    body: JSON.stringify(data),
  })
    .then((response: Response) => checkStatus<T>(response))
    .catch(err => {
      trackError('level1');
      if (err == 'TypeError: Failed to fetch') {
        throw {
          ErrorMessage: {
            Title: 'Det har skjedd en teknisk feil.',
            Body: 'Prøv igjen senere.',
          },
        };
      } else {
        throw err;
      }
    });
}

export function postAuto<T extends OperationResponse>(cmd: string, data?: any, params?: any, forcePortal?: boolean): Promise<T> {
  return crudAuto<T>('post', cmd, data, params, forcePortal);
}

export function post<T extends OperationResponse>(cmd: string, data?: any, params?: any): Promise<T> {
  return crud<T>('post', cmd, data, params);
}

export function put<T extends OperationResponse>(cmd: string, data?: any, params?: any): Promise<T> {
  return crud<T>('put', cmd, data, params);
}

export function remove<T extends OperationResponse>(cmd: string, data?: any, params?: any): Promise<T> {
  return crud<T>('delete', cmd, data, params);
}

export function uploadFile(cmd: string, data: any, params: any): Promise<any> {
  const headers = createHeaders();
  headers.set('Content-Type', 'multipart/form-data');
  return fetch(getMinHelseEnvironmentPath() + uploadCmd + cmd + parseParams(params, true), {
    method: 'post',
    credentials: 'include',
    cache: 'no-cache',
    body: data,
    headers: headers,
  }).then((response: Response) => {
    headers.set('Content-Type', 'application/json');
    return checkStatus(response);
  });
}

export function tokenLifetime(): number {
  return HN.Rest.__TokenLifetime__;
}

export function updateHashValues(anonymousHash: string, authenticatedHash: string, timestamp: string): void {
  HN.Rest.__AnonymousHash__ = anonymousHash;
  HN.Rest.__AuthenticatedHash__ = authenticatedHash;
  HN.Rest.__TimeStamp__ = timestamp;
}

function getErrorFromHTML(html: string) {
  const first = html.indexOf('{');
  const last = html.lastIndexOf('}');
  const everything = html.substring(first, last + 1);
  if (everything === '') {
    return null;
  }
  return JSON.parse(everything);
}

export function link(cmd: any, params?: any) {
  return getMinHelseOpenEnvironmentPath() + cmd + parseParams(addParams(params), true);
}

export function open(cmd: string, params?: any) {
  const url = getMinHelseOpenEnvironmentPath() + cmd + parseParams(addParams(params), true);
  window.open(url);
}

/** Generic download function to fetch and download files
 * VARIABLES:
 * cmd : What type of file to download (used in the URL for fetching the file from server)
 * params(optional): Parametres used for authentication and hashing.
 *
 */
export function download(cmd: string, params?: any): Promise<OperationResponse> {
  let url = getMinHelseEnvironmentPath() + cmd + parseParams(addParams(params), true);
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
      .catch(function(responseHtml) {
        if (responseHtml === '401') {
          document.location.reload(true);
        } else {
          console.error('responseHtml', responseHtml);
          const errorResponse = getErrorFromHTML(responseHtml);
          let response;
          if (errorResponse && errorResponse.ErrorMessage) {
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
}

export function getReservasjoner(): Array<Reservasjon> {
  if (HN.Commands.__GetTjenesterMedTilgang__ !== undefined && HN.Commands.__GetTjenesterMedTilgang__ !== null) {
    return HN.Commands.__GetTjenesterMedTilgang__.Reservasjoner as Array<Reservasjon>;
  }
  return [] as Array<Reservasjon>;
}

/* eslint-enable @typescript-eslint/no-explicit-any */
