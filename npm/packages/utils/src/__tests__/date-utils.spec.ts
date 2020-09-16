import moment from 'moment';
import * as dateUtilsFunctions from '../date-utils';

const originalDate = global['Date'];

beforeEach(() => {
  const DATE_TO_USE = new Date('2021-06-13T04:41:20');
  const _Date = Date;
  const mockDate = jest.fn(() => DATE_TO_USE);
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

    describe('Når toLocalISOString blir kalt', () => {
      it('Så returnerer den dato i ISO format', () => {
        const date = dateUtilsFunctions.toLocalISOString(new Date('04.20.2020'));
        expect(date).toEqual('2020-04-20T00:00:00');
      });
    });

    describe('Når addDifference blir kalt', () => {
      it('Så returnerer den dato med forskjellstillegg i ISO format', () => {
        const a = new Date('2020-04-13T00:00:00.000');
        const b = new Date('2020-04-13T04:00:00.000');
        const c = new Date('2020-04-13T05:00:00.000');

        const date = dateUtilsFunctions.addDifference(
          dateUtilsFunctions.toLocalISOString(a),
          dateUtilsFunctions.toLocalISOString(b),
          dateUtilsFunctions.toLocalISOString(c)
        );
        expect(date).toEqual('2020-04-13T01:00:00');
      });
    });

    describe('Når getMonthNameFromMonthNumber blir kalt', () => {
      it('Så returnerer den riktig month', () => {
        const resourcesMock: dateUtilsFunctions.ResourcesWithMonthNames = {
          monthNameApril: 'apr',
          monthNameAugust: 'aug',
          monthNameDecember: 'dec',
          monthNameFebruary: 'feb',
          monthNameJanuary: 'jan',
          monthNameJuly: 'jul',
          monthNameJune: 'jun',
          monthNameMarch: 'mar',
          monthNameMay: 'mai',
          monthNameNovember: 'nov',
          monthNameOctober: 'okt',
          monthNameSeptember: 'sep',
        };
        const month0 = dateUtilsFunctions.getMonthNameFromMonthNumber(0, resourcesMock);
        expect(month0).toEqual(resourcesMock.monthNameJanuary);
        const month1 = dateUtilsFunctions.getMonthNameFromMonthNumber(1, resourcesMock);
        expect(month1).toEqual(resourcesMock.monthNameFebruary);
        const month2 = dateUtilsFunctions.getMonthNameFromMonthNumber(2, resourcesMock);
        expect(month2).toEqual(resourcesMock.monthNameMarch);
        const month3 = dateUtilsFunctions.getMonthNameFromMonthNumber(3, resourcesMock);
        expect(month3).toEqual(resourcesMock.monthNameApril);
        const month4 = dateUtilsFunctions.getMonthNameFromMonthNumber(4, resourcesMock);
        expect(month4).toEqual(resourcesMock.monthNameMay);
        const month5 = dateUtilsFunctions.getMonthNameFromMonthNumber(5, resourcesMock);
        expect(month5).toEqual(resourcesMock.monthNameJune);
        const month6 = dateUtilsFunctions.getMonthNameFromMonthNumber(6, resourcesMock);
        expect(month6).toEqual(resourcesMock.monthNameJuly);
        const month7 = dateUtilsFunctions.getMonthNameFromMonthNumber(7, resourcesMock);
        expect(month7).toEqual(resourcesMock.monthNameAugust);
        const month8 = dateUtilsFunctions.getMonthNameFromMonthNumber(8, resourcesMock);
        expect(month8).toEqual(resourcesMock.monthNameSeptember);
        const month9 = dateUtilsFunctions.getMonthNameFromMonthNumber(9, resourcesMock);
        expect(month9).toEqual(resourcesMock.monthNameOctober);
        const month10 = dateUtilsFunctions.getMonthNameFromMonthNumber(10, resourcesMock);
        expect(month10).toEqual(resourcesMock.monthNameNovember);
        const month11 = dateUtilsFunctions.getMonthNameFromMonthNumber(11, resourcesMock);
        expect(month11).toEqual(resourcesMock.monthNameDecember);
        const month12 = dateUtilsFunctions.getMonthNameFromMonthNumber(12, resourcesMock);
        expect(month12).toEqual('');
      });
    });

    describe('Når getMonthName blir kalt', () => {
      it('Så returner den riktig måned string', () => {
        expect(
          dateUtilsFunctions.getMonthName(new Date('04-20-2020'), { monthNameApril: 'april' } as dateUtilsFunctions.ResourcesWithMonthNames)
        ).toBe('april');
      });
    });

    describe('Når getFormattedDateString blir kalt', () => {
      it('Så returnerer den riktig dato med riktig måned', () => {
        const month = dateUtilsFunctions.getFormattedDateString('2020-04-13', {
          monthNameApril: 'april',
        } as dateUtilsFunctions.ResourcesWithMonthNames);
        expect(month).toEqual('13. april 2020');
      });
    });

    describe('Når dateToString blir kalt', () => {
      it('Så returnerer den riktig dato med riktig måned', () => {
        const month = dateUtilsFunctions.dateToString('2020-04-13', {
          monthNameApril: 'april',
        } as dateUtilsFunctions.ResourcesWithMonthNames);
        expect(month).toEqual('13. april 2020');
      });
    });

    describe('Når timeToString blir kalt', () => {
      it('Så returnerer den riktig time string', () => {
        const date = dateUtilsFunctions.timeToString(new Date('2020-04-13T12:42:00.000'));
        expect(date).toEqual('12:42');
      });
    });
  });
});
