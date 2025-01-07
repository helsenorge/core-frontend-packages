import { invalidNodes, isValid } from './string-utils';

type ValidationRule = 'letter' | 'digit' | 'whitespace' | 'control' | 'punctuation' | 'separator' | 'disable-suspect';

type ValidationResponse = string | boolean;

const isLetter = (char: string): boolean => /\p{L}/u.test(char);

const isDigit = (char: string): boolean => /\d/.test(char);

const isWhiteSpace = (char: string): boolean => /\s/.test(char);

const isControl = (char: string): boolean => /\p{C}/u.test(char);

const isPunctuation = (char: string): boolean => /\p{P}/u.test(char);

const isSeparator = (char: string): boolean => /\p{Z}/u.test(char);

/**
 * Validerer en tekst mot en liste med regler
 * @param value tekst som skal valideres
 * @param validationRules liste med regler som definerer hvilke tegn som er tilatt
 * @param allowChars liste med egne tegn som er tillatt
 * @returns true hvis teksten er gyldig, ellers en string med ugyldige tegn
 */
export const validateString = (value: string, validationRules: ValidationRule[], allowChars: string[] = []): ValidationResponse => {
  if (!validationRules.includes('disable-suspect') && !isValid(value)) {
    return invalidNodes(value).join(', ');
  }
  return handleCharValidation(value, validationRules, allowChars);
};

const handleCharValidation = (value: string, validationRules: ValidationRule[], allowChars: string[]): ValidationResponse => {
  const invalidChars = [];
  for (const c of value.split('')) {
    if (validationRules.includes('letter') && isLetter(c)) {
      continue;
    }
    if (validationRules.includes('digit') && isDigit(c)) {
      continue;
    }
    if (validationRules.includes('whitespace') && isWhiteSpace(c)) {
      continue;
    }
    if (validationRules.includes('control') && isControl(c)) {
      continue;
    }
    if (validationRules.includes('punctuation') && isPunctuation(c)) {
      continue;
    }
    if (validationRules.includes('separator') && isSeparator(c)) {
      continue;
    }
    if (allowChars.length > 0 && allowChars.includes(c)) {
      continue;
    }

    invalidChars.push(c);
  }
  return invalidChars.length > 0 ? invalidChars.join(', ') : true;
};
