import { describe, test, expect } from 'vitest';

import { getUrlHostname, isHttps, normalizePath, normalizeQuery } from '../url';

if (typeof window !== 'undefined') {
  const oldWindowLocation = window.location;

  delete (window as Partial<Window>).location;

  window.location = Object.defineProperties<string & Location>({} as string & Location, {
    ...Object.getOwnPropertyDescriptors(oldWindowLocation),

    protocol: {
      writable: true,
      value: 'http:',
    },
  });
}

describe('getUrlHostname', () => {
  describe('Gitt at domene er www.helsenorge.no', () => {
    describe('Når getUrlHostname kalles ', () => {
      test('Så returnerer den www.helsenorge.no', () => {
        const result = getUrlHostname('https://www.helsenorge.no');
        expect(result).toBe('www.helsenorge.no');
      });
    });
  });
  describe('Gitt at url er ugyldig', () => {
    describe('Når getUrlHostname kalles', () => {
      test('Så returnerer den undefined', () => {
        const result = getUrlHostname('httpnrk.no');
        expect(result).toBeUndefined();
      });
    });
  });
});

describe('isHttps', () => {
  describe('Gitt at nettsiden bruker http', () => {
    describe('Når isHttps kalles', () => {
      test('Så returnerer den false', () => {
        const originalProtocol = window.location.protocol;
        window.location.protocol = 'http:';

        expect(isHttps()).toBe(false);

        window.location.protocol = originalProtocol;
      });
    });
  });
  describe('Gitt at nettsiden bruker https', () => {
    describe('Når isHttps kalles', () => {
      test('Så returnerer den true', () => {
        const originalProtocol = window.location.protocol;
        window.location.protocol = 'https:';

        expect(isHttps()).toBe(true);

        window.location.protocol = originalProtocol;
      });
    });
  });
});
describe('normalizePath', () => {
  describe('Gitt at path ikke starter med /', () => {
    describe('Når normalizePath kalles', () => {
      test('Så returnerer den path med / foran', () => {
        expect(normalizePath('test')).toBe('/test');
      });
    });
  });

  describe('Gitt at path slutter med /', () => {
    describe('Når normalizePath kalles', () => {
      test('Så returnerer den path uten / på slutten', () => {
        expect(normalizePath('/test/')).toBe('/test');
      });

      test('Så returnerer den rotsiden uendret', () => {
        expect(normalizePath('/')).toBe('/');
      });
    });
  });
});

describe('normalizeQuery', () => {
  describe('Gitt at query ikke starter med ?', () => {
    describe('Når normalizeQuery kalles', () => {
      test('Så returnerer den query med ? foran', () => {
        expect(normalizeQuery('key=value')).toBe('?key=value');
      });
    });
  });

  describe('Gitt at query slutter med &', () => {
    describe('Når normalizeQuery kalles', () => {
      test('Så returnerer den query uten & på slutten', () => {
        expect(normalizeQuery('?key=value&')).toBe('?key=value');
      });
    });
  });
});
