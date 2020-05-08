import React from 'react';

import { mount, shallow } from 'enzyme';

import { setCookie, hasCookie } from '../cookie';
import CustomTag from '../custom-tag';
import {
  todaysDate,
  toDate,
  getMonthName,
  toServerDate,
  getFormattedDateString,
  addDifference,
  toLocalISOString,
  toLocalISOStringUsingDateTimezoneOffset,
  dateToString,
  timeToString,
  beforeToday,
  beforeNow,
  isToday,
  afterToday,
  earlierToday,
  isBefore,
  isDotNetMinDate,
} from '../date-utils';

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
  describe('Gitt at cookie settes', () => {
    it('Så er cookie i dokument test=cookie ', () => {
      expect(document.cookie).toBe('test=cookie');
    });
  });

  describe('Gitt at cookie kan hentes', () => {
    it('Så er hasCookie sant', () => {
      expect(hasCookie('test', 'cookie')).toBe(true);
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
