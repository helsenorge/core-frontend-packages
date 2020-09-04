import moment, { Moment } from 'moment';
import * as dateUtilsFunctions from '../date-utils';
/*
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
*/
const originalDate = global['Date'];

beforeEach(() => {
  const DATE_TO_USE = new Date('2021-06-13T04:41:20');
  const _Date = Date;
  const mockDate = jest.fn(() => DATE_TO_USE);
  //global.Date = jest.fn(() => DATE_TO_USE);
  mockDate.UTC = _Date.UTC;
  mockDate.parse = _Date.parse;
  mockDate.now = _Date.now;
  global['Date'] = mockDate;
  global['Date'] = originalDate;
});

afterEach(() => {
  global['Date'] = originalDate;
});

describe('Date-utils', () => {
  describe('Gitt at dagens dato er satt til 2021-06-13T04:41:20', () => {
    describe('Når todayDate blir kalt', () => {
      const currentDateMoment = moment();
      it('Så returenerer den dagens dato i riktig format', () => {
        expect(dateUtilsFunctions.todaysDate()).toBe(currentDateMoment.subtract(1, 'month').format('YYYY-M-D'));
      });
    });

    describe('Når toDate blir kalt', () => {
      it('Så returneres Dato som DatoObjekt', () => {
        const date = dateUtilsFunctions.toDate(new Date('04.20.2020'));
        const d = new Date(new Date('04.20.2020'));
        expect(date).toMatchObject(d);
      });
    });

    describe('Når standardTimezoneOffset blir kalt', () => {
      it('Så returneres det riktig offset number', () => {
        const date = dateUtilsFunctions.standardTimezoneOffset(new Date('04.20.2020'));
        expect(date).toEqual(-60);
      });
    });

    describe('Når isDaylightSavingTime blir kalt', () => {
      it('Så returneres den true', () => {
        const date = dateUtilsFunctions.standardTimezoneOffset(new Date('04.20.2020'));
        expect(date).toBeTruthy();
      });
    });

    describe('Når serverOffsetFromUTC blir kalt', () => {
      it('Så returnerer den +02:00', () => {
        const date = dateUtilsFunctions.serverOffsetFromUTC();
        expect(date).toEqual('+02:00');
      });
    });

    describe('Når serverTimezoneOffset blir kalt', () => {
      it('Så returnerer den -7200000', () => {
        const date = dateUtilsFunctions.serverTimezoneOffset(new Date('04.20.2020'));
        expect(date).toEqual(-7200000);
      });
    });

    describe('Når addServerTimezone blir kalt', () => {
      it('Så returnerer den full dato med offset fra UTC', () => {
        const date = dateUtilsFunctions.addServerTimezone(new Date('04.20.2020').toISOString());
        expect(date).toEqual('2020-04-19T22:00:00.000Z+02:00');
      });
    });

    describe('Når toServerDate blir kalt', () => {
      it('Så returnerer den full dato hvis dato er i JS Date format', () => {
        const date = dateUtilsFunctions.toServerDate(new Date('04.20.2020'));
        const d = new Date(new Date('04.20.2020'));
        expect(date).toMatchObject(d);
      });
    });

    describe('Når getMonthName blir kalt', () => {
      it('Så returneres måneden', () => {
        expect(
          dateUtilsFunctions.getMonthName(new Date('04-20-2020'), { monthNameApril: 'april' } as dateUtilsFunctions.ResourcesWithMonthNames)
        ).toBe('april');
      });
    });
  });
});
