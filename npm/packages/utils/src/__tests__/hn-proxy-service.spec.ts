import { getErrorFromHTML, get, post, put, remove, link } from '../hn-proxy-service';

window.HN = window.HN || {};
window.HN.Rest = window.HN.Rest || {};
window.HN.Rest.__TjenesterApiUrl__ = 'https://proxy.test.nhn.no';
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
      get('lorem/ipsum', 'proxyName', { testParam: 3 });
      expect(fetchMock).toHaveBeenCalledTimes(1);

      expect(fetchMock.mock.calls[0][0]).toBe('https://proxy.test.nhn.no/proxy/proxyName/api/v1/lorem/ipsum?testParam=3');
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
      post('lorem/ipsum', 'proxyName', { data: 'mydata' }, { testParam: 3 });
      expect(fetchMock).toHaveBeenCalledTimes(2);

      expect(fetchMock.mock.calls[1][0]).toBe('https://proxy.test.nhn.no/proxy/proxyName/api/v1/lorem/ipsum?testParam=3');
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
      put('lorem/ipsum', 'proxyName', { data: 'mydata' }, { testParam: 3 });
      expect(fetchMock).toHaveBeenCalledTimes(3);

      expect(fetchMock.mock.calls[2][0]).toBe('https://proxy.test.nhn.no/proxy/proxyName/api/v1/lorem/ipsum?testParam=3');
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
      remove('lorem/ipsum', 'proxyName', { data: 'mydata' }, { testParam: 3 });
      expect(fetchMock).toHaveBeenCalledTimes(4);

      expect(fetchMock.mock.calls[3][0]).toBe('https://proxy.test.nhn.no/proxy/proxyName/api/v1/lorem/ipsum?testParam=3');
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

describe('Gitt at en proxy link skal genereres', () => {
  describe('Når link ikke har noen ekstra request parameter', () => {
    it('Så skal link med headers som parameter returneres', () => {
      const fullUrl = link('MinHelse/testtest', 'testProxyTest');
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
      const fullUrl = link('url', 'p', params);
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
      const fullUrl = link('url', 'p', params);
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
      const fullUrl = link('url', 'p', params);
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
      const fullUrl = link('url', 'p', params);
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
      const fullUrl = link('url', 'p', params);
      expect(fullUrl).toBe(
        'https://proxy.test.nhn.no/proxy/p/api/v1/url?HNAnonymousHash=hash1&HNAuthenticatedHash=hash2&HNTjeneste=tjeneste&HNTimeStamp=time&X-hn-hendelselogg=logg&Filtere=a&Filtere=b&Filtere=c'
      );
    });
  });
});
