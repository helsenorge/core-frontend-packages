import { setCookie, hasCookie, getCookieSuffix, getCustomCookieWithSuffix, deleteCookie, getCookieValue } from '../cookie';

describe('Cookie', () => {
  setCookie('test', 'cookie');
  setCookie('MH_LoggedIn_st', 'test');
  setCookie('testRandomvalue', 'testetstest');
  setCookie('customcookie_st', 'whatever');
  setCookie('slettecookie', 'value');

  describe('Gitt at cookie settes', () => {
    it('Så er cookie i dokument test=cookie ', () => {
      expect(document.cookie).toBe('test=cookie; MH_LoggedIn_st=test; testRandomvalue=testetstest; customcookie_st=whatever');
    });
  });

  describe('Gitt at cookie kan hentes', () => {
    setCookie('test', 'cookie');
    it('Så er hasCookie sant', () => {
      expect(hasCookie('test', 'cookie')).toBe(true);
    });
  });

  describe('Gitt at cookie finnes men value kan være hva som helst', () => {
    setCookie('test', 'cookie');
    it('Så er hasCookie sant', () => {
      expect(hasCookie('testRandomvalue')).toBe(true);
    });
  });
  describe('Gitt at cookie har MH_LoggedIn satt', () => {
    window.HN = { Rest: { __Environment__: 'st' } };
    it('Så er getCookieSuffix sant', () => {
      expect(getCookieSuffix()).toBe(true);
    });
  });

  describe('Gitt at cookie har ikke satt MH_SessionId satt men MH_LoggedIn satt', () => {
    it('Så er getCookieSuffix sant', () => {
      expect(getCookieSuffix()).toBe(true);
    });
  });
  describe('Gitt at cookie custom cookie er satt', () => {
    window.HN = { Rest: { __Environment__: 'st' } };
    it('Så er getCustomCookieWithSuffix sant', () => {
      expect(getCustomCookieWithSuffix('customcookie')).toBe(true);
    });
  });

  describe('Gitt at cookie slettes', () => {
    deleteCookie('slettecookie');
    it('Så er er hasCookie false', () => {
      expect(hasCookie('slettecookie')).toBe(false);
    });
  });

  describe('Gitt at testRandomvalue har value', () => {
    it('Så returnerer getCookieValue testetstest ', () => {
      expect(getCookieValue('testRandomvalue')).toBe('testetstest');
    });
  });
  describe('Gitt at MH_LoggedIn_st har value', () => {
    it('Så returnerer MH_LoggedIn_st test ', () => {
      expect(getCookieValue('MH_LoggedIn')).toBe('test');
    });
  });
});
