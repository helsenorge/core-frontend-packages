import {
  getErrorFromHTML,
  get,
  post,
  put,
  remove,
  link,
  erTjenester,
  createHeaders,
  erHelsenorge,
  getTjenesterUrl,
  getHelsenorgeUrl,
} from '../hn-proxy-service';
import * as mockLogger from '../logger';

jest.mock('../logger.ts', () => ({
  warn: jest.fn(),
}));

window.HN = window.HN || {};
window.HN.Rest = window.HN.Rest || {};
window.HN.Rest.__TjenesterUrl__ = 'https://proxy.test.nhn.no';
window.HN.Rest.__AnonymousHash__ = 'hash1';
window.HN.Rest.__AuthenticatedHash__ = 'hash2';
window.HN.Rest.__TjenesteType__ = 'tjeneste';
window.HN.Rest.__TimeStamp__ = 'time';
window.HN.Rest.__HendelseLoggType__ = 'logg';

//TO-DO mangler test for download method

describe('Gitt at det har skjedd en Error i en av de hn-proxy-service methodene', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('Når getErrorFromHTML kalles', () => {
    it('Så parses den riktig fra JSON til ErrorMessage', () => {
      const dummyHtml = '{ "Code":"EHAPI-100000", "Message":"Teknisk feil", "ErrorCategory": 0}';
      const jsonReturn = getErrorFromHTML(dummyHtml);
      expect(jsonReturn.Code).toBe('EHAPI-100000');
      expect(jsonReturn.Message).toBe('Teknisk feil');
      expect(jsonReturn.ErrorCategory).toBe(0);
    });
  });
});

describe('Gitt at baseCrud er definert', () => {
  const fetchMock = jest.spyOn(global, 'fetch');

  describe('Når get kalles get', () => {
    it('Så kalles det fetch med riktig argumenter', () => {
      get('tokenserviceinternal', 'v1/ActiveTokens', { testParam: 3 });
      expect(fetchMock).toHaveBeenCalledTimes(1);

      expect(fetchMock.mock.calls[0][0]).toBe('https://proxy.test.nhn.no/proxy/tokenserviceinternal/v1/ActiveTokens?testParam=3');
      expect(fetchMock.mock.calls[0][1].credentials).toBe('include');
      expect(fetchMock.mock.calls[0][1].headers).toEqual({
        _headers: {
          accept: ['application/json'],
          'content-type': ['application/json'],
          hnanonymoushash: ['hash1'],
          hnauthenticatedhash: ['hash2'],
          hntimestamp: ['time'],
          hntjeneste: ['tjeneste'],
          'x-hn-hendelselogg': ['logg'],
        },
      });
      expect(fetchMock.mock.calls[0][1].method).toBe('get');
    });
  });

  describe('Når get kalles post', () => {
    it('Så kalles det fetch med riktig argumenter', () => {
      post('tokenserviceinternal', 'api/v1/ActiveTokens', { data: 'mydata' }, { testParam: 3 });
      expect(fetchMock).toHaveBeenCalledTimes(2);

      expect(fetchMock.mock.calls[1][0]).toBe('https://proxy.test.nhn.no/proxy/tokenserviceinternal/api/v1/ActiveTokens?testParam=3');
      expect(fetchMock.mock.calls[1][1].credentials).toBe('include');
      expect(fetchMock.mock.calls[1][1].headers).toEqual({
        _headers: {
          accept: ['application/json'],
          'content-type': ['application/json'],
          hnanonymoushash: ['hash1'],
          hnauthenticatedhash: ['hash2'],
          hntimestamp: ['time'],
          hntjeneste: ['tjeneste'],
          'x-hn-hendelselogg': ['logg'],
        },
      });
      expect(fetchMock.mock.calls[1][1].method).toBe('post');
    });
  });

  describe('Når get kalles put', () => {
    it('Så kalles det fetch med riktig argumenter', () => {
      put('tokenserviceinternal', 'api/v1/ActiveTokens', { data: 'mydata' }, { testParam: 3 });
      expect(fetchMock).toHaveBeenCalledTimes(3);

      expect(fetchMock.mock.calls[2][0]).toBe('https://proxy.test.nhn.no/proxy/tokenserviceinternal/api/v1/ActiveTokens?testParam=3');
      expect(fetchMock.mock.calls[2][1].credentials).toBe('include');
      expect(fetchMock.mock.calls[2][1].headers).toEqual({
        _headers: {
          accept: ['application/json'],
          'content-type': ['application/json'],
          hnanonymoushash: ['hash1'],
          hnauthenticatedhash: ['hash2'],
          hntimestamp: ['time'],
          hntjeneste: ['tjeneste'],
          'x-hn-hendelselogg': ['logg'],
        },
      });
      expect(fetchMock.mock.calls[2][1].method).toBe('put');
    });
  });

  describe('Når get kalles remove', () => {
    it('Så kalles det fetch med riktig argumenter', () => {
      remove('tokenserviceinternal', 'api/v1/ActiveTokens', { data: 'mydata' }, { testParam: 3 });
      expect(fetchMock).toHaveBeenCalledTimes(4);

      expect(fetchMock.mock.calls[3][0]).toBe('https://proxy.test.nhn.no/proxy/tokenserviceinternal/api/v1/ActiveTokens?testParam=3');
      expect(fetchMock.mock.calls[3][1].credentials).toBe('include');
      expect(fetchMock.mock.calls[3][1].headers).toEqual({
        _headers: {
          accept: ['application/json'],
          'content-type': ['application/json'],
          hnanonymoushash: ['hash1'],
          hnauthenticatedhash: ['hash2'],
          hntimestamp: ['time'],
          hntjeneste: ['tjeneste'],
          'x-hn-hendelselogg': ['logg'],
        },
      });
      expect(fetchMock.mock.calls[3][1].method).toBe('delete');
    });
  });
});

describe('gitt at get kalles', () => {
  const fetchMock = jest.spyOn(global, 'fetch');
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('Når fetch ikke klarer å koble til på grunn av nettverksfeil', () => {
    it('Så kastes det en exception, og det logges en warning', async () => {
      fetchMock.mockRejectedValueOnce(new TypeError('Failed to fetch'));

      try {
        await get('tokenserviceinternal', 'v1/ActiveTokens', { testParam: 3 });
      } catch (error) {
        expect(error).toEqual({
          Message: 'Det har skjedd en teknisk feil. Prøv igjen senere.',
        });
      }

      expect(mockLogger.warn).toHaveBeenCalledTimes(1);
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'Kall til følgende URL feilet: https://proxy.test.nhn.no/proxy/tokenserviceinternal/v1/ActiveTokens?testParam=3. Mottok ingen respons fra tjenesten.'
      );
    });
  });

  describe('Når fetch klarer å hente, men APIet svarer med en feilmelding', () => {
    it('Så kastes det en exception, men det logges ikke en warning', async () => {
      const mockErrorResponse = {
        error: {
          message: 'Fant ikke siden',
        },
      };
      const response = new Response(JSON.stringify(mockErrorResponse), {
        headers: createHeaders(),
        status: 404,
        statusText: 'Not found',
      });
      const mockFetchPromise = Promise.resolve(response);
      jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise);

      try {
        await get('tokenserviceinternal', 'v1/ActiveTokens');
      } catch (error) {
        expect(error).toEqual(mockErrorResponse);
      }

      expect(mockLogger.warn).toHaveBeenCalledTimes(0);
    });
  });
});

describe('Gitt at en proxy link skal genereres', () => {
  describe('Når link ikke har noen ekstra request parameter', () => {
    it('Så skal link med headers som parameter returneres', () => {
      const fullUrl = link('testProxyTest', 'api/v1/MinHelse/testtest');
      expect(fullUrl).toBe(
        'https://proxy.test.nhn.no/proxy/testProxyTest/api/v1/MinHelse/testtest?HNAnonymousHash=hash1&HNAuthenticatedHash=hash2&HNTjeneste=tjeneste&HNTimeStamp=time&X-hn-hendelselogg=logg'
      );
    });
  });

  describe('Når parameter er string', () => {
    it('Så skal link med string som parameter returneres', () => {
      const params = {
        Sok: 'fastlege',
      };
      const fullUrl = link('p', 'api/v1/url', params);
      expect(fullUrl).toBe(
        'https://proxy.test.nhn.no/proxy/p/api/v1/url?HNAnonymousHash=hash1&HNAuthenticatedHash=hash2&HNTjeneste=tjeneste&HNTimeStamp=time&X-hn-hendelselogg=logg&Sok=fastlege'
      );
    });
  });

  describe('Når parameter er number', () => {
    it('Så skal link med number som parameter returneres', () => {
      const params = {
        maxCount: 3,
      };
      const fullUrl = link('p', 'api/v1/url', params);
      expect(fullUrl).toBe(
        'https://proxy.test.nhn.no/proxy/p/api/v1/url?HNAnonymousHash=hash1&HNAuthenticatedHash=hash2&HNTjeneste=tjeneste&HNTimeStamp=time&X-hn-hendelselogg=logg&maxCount=3'
      );
    });
  });

  describe('Når parameter er boolean', () => {
    it('Så skal link med boolean som parameter returneres', () => {
      const params = {
        VisLegerUtenVenteliste: true,
      };
      const fullUrl = link('p', 'api/v1/url', params);
      expect(fullUrl).toBe(
        'https://proxy.test.nhn.no/proxy/p/api/v1/url?HNAnonymousHash=hash1&HNAuthenticatedHash=hash2&HNTjeneste=tjeneste&HNTimeStamp=time&X-hn-hendelselogg=logg&VisLegerUtenVenteliste=true'
      );
    });
  });

  describe('Når parameter er array med numbers (f. eks enums)', () => {
    it('Så skal link med flere parametere returneres', () => {
      const params = {
        Filtere: [1, 2, 4],
      };
      const fullUrl = link('p', 'api/v1/url', params);
      expect(fullUrl).toBe(
        'https://proxy.test.nhn.no/proxy/p/api/v1/url?HNAnonymousHash=hash1&HNAuthenticatedHash=hash2&HNTjeneste=tjeneste&HNTimeStamp=time&X-hn-hendelselogg=logg&Filtere=1&Filtere=2&Filtere=4'
      );
    });
  });

  describe('Når parameter er array med strings', () => {
    it('Så skal link med flere parametere returneres', () => {
      const params = {
        Filtere: ['a', 'b', 'c'],
      };
      const fullUrl = link('p', 'api/v1/url', params);
      expect(fullUrl).toBe(
        'https://proxy.test.nhn.no/proxy/p/api/v1/url?HNAnonymousHash=hash1&HNAuthenticatedHash=hash2&HNTjeneste=tjeneste&HNTimeStamp=time&X-hn-hendelselogg=logg&Filtere=a&Filtere=b&Filtere=c'
      );
    });
  });
});

describe('erTjenester', () => {
  const tjenesterUrl = 'https://tjenester.helsenorge.utvikling';
  const helsenorgeUrl = 'https://helsenorge.no';

  beforeEach(() => {
    window.HN = {};
    window.HN.Rest = {};
    window.HN.Rest.__TjenesterUrl__ = tjenesterUrl;
  });

  describe('Når en bruker besøker en side på helsenorge.no', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'location', {
        writable: true,
        value: {
          origin: helsenorgeUrl,
        },
      });
    });
    it('Så returneres false', () => {
      expect(erTjenester()).toBeFalsy();
    });
  });

  describe('Når en bruker besøker en side på tjenester.helsenorge.no', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'location', {
        writable: true,
        value: {
          origin: tjenesterUrl,
        },
      });
    });
    it('Så returneres true', () => {
      expect(erTjenester()).toBeTruthy();
    });
  });
});

describe('erHelsenorge', () => {
  const tjenesterUrl = 'https://tjenester.helsenorge.utvikling';
  const helsenorgeUrl = 'https://helsenorge.no';

  beforeEach(() => {
    window.HN = {};
    window.HN.Rest = {};
    window.HN.Rest.__HelseNorgeUrl__ = helsenorgeUrl;
  });

  describe('Når en bruker besøker en side på helsenorge.no', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'location', {
        writable: true,
        value: {
          origin: helsenorgeUrl,
        },
      });
    });
    it('Så returneres true', () => {
      expect(erHelsenorge()).toBeTruthy();
    });
  });

  describe('Når en bruker besøker en side på tjenester.helsenorge.no', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'location', {
        writable: true,
        value: {
          origin: tjenesterUrl,
        },
      });
    });
    it('Så returneres true', () => {
      expect(erHelsenorge()).toBeFalsy();
    });
  });
});

describe('getTjenesterUrl', () => {
  const tjenesterUrl = 'https://tjenesterUrl.no';
  const undefinedUrl = '';

  describe('Når tjenesterApiUrl er definert', () => {
    it('Så returneres adressen til API sin adresse', () => {
      const HN = {
        Rest: {
          __TjenesterUrl__: tjenesterUrl,
        },
      };
      const originalWindowHN = global.window['HN'];
      global.window['HN'] = HN;
      const apiUrl = getTjenesterUrl();
      expect(apiUrl).toBe(tjenesterUrl);
      global.window['HN'] = originalWindowHN;
    });
  });

  describe('Når tjenesterApiUrl ikke er definert', () => {
    it('Så returneres en tom streng', () => {
      const HN = {
        Rest: {
          __TjenesterUrl__: undefined,
        },
      };
      const originalWindowHN = global.window['HN'];
      global.window['HN'] = HN;
      const apiUrl = getTjenesterUrl();
      expect(apiUrl).toBe(undefinedUrl);
      global.window['HN'] = originalWindowHN;
    });
  });
});

describe('getHelsenorgeUrl', () => {
  const helsenorgeUrl = 'https://helsenorge.no';
  const undefinedhelsenorgeUrl = '';

  describe('Når getHelsenorgeUrl er definert', () => {
    it('Så returneres adressen til API sin adresse', () => {
      const HN = {
        Rest: {
          __HelseNorgeUrl__: helsenorgeUrl,
        },
      };
      const originalWindowHN = global.window['HN'];
      global.window['HN'] = HN;
      const apiUrl = getHelsenorgeUrl();
      expect(apiUrl).toBe(helsenorgeUrl);
      global.window['HN'] = originalWindowHN;
    });
  });

  describe('Når getHelsenorgeUrl ikke er definert', () => {
    it('Så returneres en tom streng', () => {
      const HN = {
        Rest: {
          __HelseNorgeUrl__: undefined,
        },
      };
      const originalWindowHN = global.window['HN'];
      global.window['HN'] = HN;
      const apiUrl = getHelsenorgeUrl();
      expect(apiUrl).toBe(undefinedhelsenorgeUrl);
      global.window['HN'] = originalWindowHN;
    });
  });
});
