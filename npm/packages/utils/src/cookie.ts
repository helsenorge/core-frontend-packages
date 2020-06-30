/**
 * Check if cookie exist, and also if it has value
 * @param cookieName navn på cookie
 * @param onClickOutside value
 */
export function hasCookie(cookieName: string, value?: string | boolean): boolean {
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
}

export function getSuffix(cookieName: string): string {
  let suffix = '';
  if (window.HN.Rest.__Environment__) {
    suffix = '_' + window.HN.Rest.__Environment__;
  }
  return cookieName + suffix;
}

export function getCookieSuffix(): boolean {
  return getCustomCookieWithSuffix('MH_LoggedIn') || getCustomCookieWithSuffix('MH_SessionId');
}

export function getCustomCookieWithSuffix(cookieName: string): boolean {
  return hasCookie(getSuffix(cookieName));
}

export function setCookie(name: string, value: string | boolean = ''): void {
  document.cookie = `${name}=${value};path=/;`;
}

export function deleteCookie(name: string): void {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
}

export function getCookieValue(name: string): string | number | boolean | undefined {
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
}
