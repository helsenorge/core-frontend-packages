import { describe, test, expect } from 'vitest';

import { getUrlHostname, isHttps, normalizePath, normalizeQuery, tryCreateUrl } from '../url';

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

describe('tryCreateUrl', () => {
  describe('Gitt at URL er www.helsenorge.no', () => {
    describe('Når tryCreateUrl kalles ', () => {
      test('Så returnerer den en URL-objekt', () => {
        const result = tryCreateUrl('https://www.helsenorge.no');
        expect(result).toBeInstanceOf(URL);
        expect(result?.href).toBe('https://www.helsenorge.no/');
      });
    });
  });
  describe('Gitt at URL er ugyldig', () => {
    describe('Når tryCreateUrl kalles ', () => {
      test('Så returnerer den undefined', () => {
        const result = tryCreateUrl('httpnrk.no');
        expect(result).toBeUndefined();
      });
    });
  });
});

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

  describe('Gitt at path er en tom streng', () => {
    describe('Når normalizePath kalles', () => {
      test('Så returnerer den /', () => {
        expect(normalizePath('')).toBe('/');
      });
    });
  });

  describe('Gitt at path allerede er normalisert', () => {
    describe('Når normalizePath kalles', () => {
      test('Så returnerer den path uendret', () => {
        expect(normalizePath('/base/path')).toBe('/base/path');
      });
    });
  });

  describe('Gitt at path inneholder doble skråstreker', () => {
    describe('Når normalizePath kalles', () => {
      test('Så kollapser den doble skråstreker', () => {
        expect(normalizePath('//a//b//')).toBe('/a/b');
      });

      test('Så kollapser den mange skråstreker', () => {
        expect(normalizePath('///a///')).toBe('/a');
      });
    });
  });

  describe('Gitt at path har flere segmenter', () => {
    describe('Når normalizePath kalles', () => {
      test('Så beholder den alle segmenter', () => {
        expect(normalizePath('/base/nested/path/sub')).toBe('/base/nested/path/sub');
      });

      test('Så fjerner den avsluttende skråstrek', () => {
        expect(normalizePath('a/b/')).toBe('/a/b');
      });
    });
  });

  describe('Gitt at normalizePath kalles med flere argumenter', () => {
    describe('Når normalizePath kalles', () => {
      test('Så slår den sammen to segmenter', () => {
        expect(normalizePath('base', 'path')).toBe('/base/path');
      });

      test('Så slår den sammen flere segmenter', () => {
        expect(normalizePath('a', 'b', 'c', 'd')).toBe('/a/b/c/d');
      });

      test('Så ignorerer den undefined-argumenter', () => {
        expect(normalizePath(undefined, 'a', undefined, 'b')).toBe('/a/b');
      });

      test('Så ignorerer den tomme strenger', () => {
        expect(normalizePath('', 'a', '', 'b')).toBe('/a/b');
      });

      test('Så håndterer den segmenter som allerede inneholder skråstreker', () => {
        expect(normalizePath('/base/nested/', '/path/sub')).toBe('/base/nested/path/sub');
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
