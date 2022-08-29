import moment from 'moment';
import * as dateUtilsFunctions from '../date-utils';
import { isDaylightSavingTime } from '../date-utils';

describe('Date-utils', () => {
  const now = new Date();
  const isDayLightSaving = isDaylightSavingTime(now);

  describe('Når todayDate blir kalt', () => {
    const currentDateMoment = moment();
    it('Så returenerer den dagens dato i riktig format', () => {
      expect(dateUtilsFunctions.todaysDate()).toBe(currentDateMoment.format('YYYY-M-D'));
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
    it('Så returnerer den +01:00', () => {
      const date = dateUtilsFunctions.serverOffsetFromUTC();

      if (isDayLightSaving) {
        expect(date).toEqual('+02:00');
      } else {
        expect(date).toEqual('+01:00');
      }
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

      if (isDayLightSaving) {
        expect(date).toEqual('2020-04-19T22:00:00.000Z+02:00');
      } else {
        expect(date).toEqual('2020-04-19T22:00:00.000Z+01:00');
      }
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

      if (isDayLightSaving) {
        expect(date).toEqual('2020-04-20T00:00:00');
      } else {
        expect(date).toEqual('2020-04-19T23:00:00');
      }
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

      if (isDayLightSaving) {
        expect(date).toEqual('2020-04-13T01:00:00');
      } else {
        expect(date).toEqual('2020-04-13T00:00:00');
      }
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

  describe('Når getHoursFromTimeString blir kalt med undefined dato', () => {
    it('Så returnerer den tom streng', () => {
      const date = dateUtilsFunctions.getHoursFromTimeString(undefined, ':');
      expect(date).toEqual('');
    });
  });

  describe('Når getHoursFromTimeString blir kalt med en timeString med feil separator', () => {
    it('Så returnerer den opprinnelig strengen', () => {
      const date = dateUtilsFunctions.getHoursFromTimeString('12-52', ':');
      expect(date).toEqual('12-52');
    });
  });

  describe('Når getHoursFromTimeString blir kalt med en timeString', () => {
    it('Så returnerer den riktig antall timer', () => {
      const date = dateUtilsFunctions.getHoursFromTimeString('12:52', ':');
      expect(date).toEqual('12');
    });
  });

  describe('Når getMinutesFromTimeString blir kalt med undefined dato', () => {
    it('Så returnerer den tom streng', () => {
      const date = dateUtilsFunctions.getMinutesFromTimeString(undefined, ':');
      expect(date).toEqual('');
    });
  });

  describe('Når getMinutesFromTimeString blir kalt med en timeString med feil separator', () => {
    it('Så returnerer den undefined', () => {
      const date = dateUtilsFunctions.getMinutesFromTimeString('12-52', ':');
      expect(date).toEqual(undefined);
    });
  });

  describe('Når getMinutesFromTimeString blir kalt med en timeString', () => {
    it('Så returnerer den riktig antall timer', () => {
      const date = dateUtilsFunctions.getMinutesFromTimeString('12:52', ':');
      expect(date).toEqual('52');
    });
  });

  describe('Når beforeToday blir kalt med en gammel dato', () => {
    it('Så returnerer den true', () => {
      const date = dateUtilsFunctions.beforeToday(new Date('2010-04-13T12:42:00.000'));
      expect(date).toBeTruthy();
    });
  });

  describe('Når beforeToday blir kalt med en dato langt frem', () => {
    it('Så returnerer den false', () => {
      const date = dateUtilsFunctions.beforeToday(new Date('2080-04-13T12:42:00.000'));
      expect(date).toBeFalsy();
    });
  });

  describe('Når beforeNow blir kalt med en gammel dato', () => {
    it('Så returnerer den true', () => {
      const date = dateUtilsFunctions.beforeNow(new Date('2010-04-13T12:42:00.000'));
      expect(date).toBeTruthy();
    });
  });

  describe('Når beforeNow blir kalt med dagens dato et par timer tilbake i tid', () => {
    it('Så returnerer den true', () => {
      const d = new Date();
      d.setHours(d.getHours() - 2);
      const date = dateUtilsFunctions.beforeNow(new Date(d));
      expect(date).toBeTruthy();
    });
  });

  describe('Når beforeNow blir kalt med en dato langt frem', () => {
    it('Så returnerer den false', () => {
      const date = dateUtilsFunctions.beforeNow(new Date('2080-04-13T12:42:00.000'));
      expect(date).toBeFalsy();
    });
  });

  describe('Når afterToday blir kalt med en gammel dato', () => {
    it('Så returnerer den false', () => {
      const date = dateUtilsFunctions.afterToday(new Date('2010-04-13T12:42:00.000'));
      expect(date).toBeFalsy();
    });
  });

  describe('Når afterToday blir kalt med en dato langt frem', () => {
    it('Så returnerer den true', () => {
      const date = dateUtilsFunctions.afterToday(new Date('2080-04-13T12:42:00.000'));
      expect(date).toBeTruthy();
    });
  });

  describe('Når isToday blir kalt med en dato langt frem', () => {
    it('Så returnerer den true', () => {
      const date = dateUtilsFunctions.isToday(new Date());
      expect(date).toBeTruthy();
    });
  });

  describe('Når earlierToday blir kalt med dagens dato et par minutter tilbake i tid', () => {
    it('Så returnerer den true', () => {
      const d = new Date();
      d.setMinutes(d.getMinutes() - 2);
      const date = dateUtilsFunctions.earlierToday(d);
      expect(date).toBeTruthy();
    });
  });

  describe('Når isBefore blir kalt med 2 forksjelloige datoer', () => {
    it('Så returnerer den eriktig verdi', () => {
      const a = new Date('2080-04-13T12:42:00.000');
      const b = new Date('2080-04-16T12:42:00.000');
      const before = dateUtilsFunctions.isBefore(a, b);
      const after = dateUtilsFunctions.isBefore(b, a);
      expect(before).toBeTruthy();
      expect(after).toBeFalsy();
    });
  });
});
