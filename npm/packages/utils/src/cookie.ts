/**
 * Sjekker om cookie finnes og om den har verdi
 * @param cookieName navn på cookie
 * @param value cookie verdi
 */
export const hasCookie = (cookieName: string, value?: string | boolean): boolean => {
  const cookie: string = document.cookie;
  if (cookie === undefined) {
    return false;
  }

  if (value === undefined) {
    return cookie.split('; ').find(e => e.split('=')[0] === cookieName) !== undefined;
  }

  const cookieValue: string = '; '.concat(document.cookie);
  const parts: Array<string> = cookieValue.split('; '.concat(cookieName).concat('='));

  if (parts.length === 2) {
    const lastPart: string | undefined = parts.pop();
    return lastPart ? lastPart.split(';').shift() === value.toString() : false;
  }
  return false;
};

/**
 * Sjekker...
 * @param cookieName navn på cookie
 */
export const getSuffix = (cookieName: string): string => {
  let suffix = '';
  if (window.HN.Rest.__Environment__) {
    suffix = '_' + window.HN.Rest.__Environment__;
  }
  return cookieName + suffix;
};

/**
 * Sjekker...
 * @param cookieName navn på cookie
 */
export const getCustomCookieWithSuffix = (cookieName: string): boolean => {
  return hasCookie(getSuffix(cookieName));
};

/**
 * Sjekker...
 */
export const getCookieSuffix = (): boolean => {
  return getCustomCookieWithSuffix('MH_LoggedIn') || getCustomCookieWithSuffix('MH_SessionId');
};

/**
 * Setter en cookie med van + verdi
 * @param cookieName navn på cookie
 * @param value cookie verdi
 */
export const setCookie = (name: string, value: string | boolean = ''): void => {
  document.cookie = `${name}=${value};path=/;`;
};

/**
 * Sletter en cookie basert på navnet
 * @param cookieName navn på cookie
 */
export const deleteCookie = (name: string): void => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
};

/**
 * Henter verdien til en cookie basert på navnet
 * @param cookieName navn på cookie
 */
export const getCookieValue = (name: string): string | number | boolean | undefined => {
  const cookie = hasCookie(name);
  const cookieWithSuffix = getCustomCookieWithSuffix(name);

  if (!cookie && !cookieWithSuffix) {
    return undefined;
  }
  const cookieName = cookieWithSuffix ? getSuffix(name) : name;

  return document.cookie
    .split('; ')
    .find(e => e.split('=')[0] === cookieName)
    ?.split('=')[1];
};

/**
 * Returnerer domenenavnet uten subdomene, f.eks. "helsenorge.no" dersom domenet er "www.helsenorge.no" eller "tjenester.helsenorge.no"
 * @returns domenenavn for bruk i cookie
 */
export const getHostnameWithoutSubdomain = (): string => window.location.hostname.substr(window.location.hostname.indexOf('.') + 1);
