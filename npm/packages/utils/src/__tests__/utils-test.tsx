import React from 'react';

import { mount, shallow } from 'enzyme';

import { setCookie, hasCookie, getCookieSuffix, getCustomCookieWithSuffix, deleteCookie, getCookieValue } from '../cookie';
import CustomTag from '../custom-tag';
import { todaysDate, toDate, getMonthName } from '../date-utils';

interface ResourcesWithMonthNames {
  monthNameApril: string;
  monthNameAugust: string;
  monthNameDecember: string;
  monthNameFebruary: string;
  monthNameJanuary: string;
  monthNameJuly: string;
  monthNameJune: string;
  monthNameMarch: string;
  monthNameMay: string;
  monthNameNovember: string;
  monthNameOctober: string;
  monthNameSeptember: string;
}

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

describe('Custom-tag', () => {
  const wrapper = mount(<CustomTag tagName="h1" />);
  describe('Gitt at Customtag har tagName h1 ', () => {
    it('Så innholder wrapper h1', () => {
      expect(wrapper.html()).toContain('<h1></h1>');
    });
  });
});

describe('date-utils', () => {
  describe('gitt at todayDate blir kalt', () => {
    let realDate;
    realDate = Date;
    const currentDate = new Date('2019-05-14T11:01:58.135Z');
    global.Date = class extends Date {
      constructor(date) {
        if (date) {
          return super(date);
        }

        return currentDate;
      }
    };
    it('Så returenerer den dagens dato', () => {
      expect(todaysDate()).toBe('2019-4-14');
      global.Date = realDate;
    });
  });

  describe('gitt at toDate blir kalt', () => {
    it('Så returneres Dato som DatoObjekt', () => {
      let date = toDate(new Date('04.20.2020'));
      let d = new Date(new Date('04.20.2020'));
      expect(date).toMatchObject(d);
    });
  });
  describe('gitt at getMonthName blir kalt', () => {
    it('Så returneres måneden', () => {
      expect(getMonthName(new Date('04-20-2020'), { monthNameApril: 'April' } as ResourcesWithMonthNames)).toBe('april');
    });
  });
});
