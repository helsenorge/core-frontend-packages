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
    return true;
  }

  const cookieValue: string = '; '.concat(document.cookie);
  const parts: Array<string> = cookieValue.split('; '.concat(cookieName).concat('='));
  if (parts.length === 2) {
    const lastPart: string | undefined = parts.pop();
    return lastPart ? lastPart.split(';').shift() === value.toString() : false;
  }
  return false;
}

export function setCookie(name: string, value: string | boolean = ''): void {
  document.cookie = `${name}=${value};path=/;`;
}
