/**
 * Sjekker om en streng er null, undefined eller tom
 * @param s - streng som skal sjekkes
 */
export const isEmpty = (string: string | undefined | null): boolean => {
  if (string && string.trim) string = string.trim();
  return string === '' || string === null || string === undefined;
};

/**
 * Sjekker om en streng har invalid characters
 * @param s - streng som skal sjekkes
 */
export const hasInvalidCharacters = (s: string): boolean => {
  return /[""!#¤%=?`´^¨~*:;£${[\]}|§€><\|]/.test(s);
};

/** Returnerer en streng med uppercase på første bokstav
 * @param s - streng å konvertere
 */
export const capitalize = (s: string): string => {
  const capitalized: string = s.charAt(0).toUpperCase() + s.substring(1);
  return capitalized;
};

/** Returnerer en streng uten uppercase på første bokstav
 * @param s - streng å konvertere
 */
export const decapitalize = (s: string): string => {
  const decapitalized: string = s.charAt(0).toLowerCase() + s.substring(1);
  return decapitalized;
};

/** Returns true if the input corresponds with a norwegian phone number format
 * @param phoneNumber - string or number of the phone number
 */
export const isNorwegianPhoneNumber = (phoneNumber: string | number): boolean => {
  const regexString = '^(0047|[+]47)?[4|9][0-9]{7,7}$';
  return new RegExp(regexString, 'i').test(phoneNumber.toString().replace(new RegExp(' ', 'g'), ''));
};

/** Returns a new string where plaeholders {number} have been replaced by items
 * ex: 'my string {0} ' where 0 will be replaced by the first element in  args array
 * Note: The order of elements in string decide what order it should be replaced, not number!
 * @param s - string to format
 * @param args is a array in order you want them replaced ex: ['foo', 'bar']
 * @param allowEmptyStrings if '' is allowed or not
 */
export const format = (s: string, args: string[], allowEmptyStrings?: boolean): string => {
  return s.replace(/{(\d+)}/g, function replace(match: string, number: number): string {
    if (allowEmptyStrings) {
      return args[number];
    }
    return args[number] ? args[number] : match;
  });
};
