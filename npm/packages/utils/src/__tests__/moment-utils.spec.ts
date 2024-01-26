import moment from 'moment';

import * as momentUtilsFunctions from '../moment-utils';

describe('Moment-utils', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('Når toDate blir kalt', () => {
    it('Så returnerer den tilsvarende JS dato ', () => {
      const a = moment('22.05.2020', 'DD.MM.YYYY');
      const expectedDate = new Date('2020-05-21T22:00:00.000Z');
      expect(momentUtilsFunctions.toDate(a)).toEqual(expectedDate);
    });
  });

  describe('Når longDate blir kalt', () => {
    it('Så returnerer den en lang dato format  (Måned DD, YYYY)', () => {
      const a = moment('22.05.2020', 'DD.MM.YYYY');
      expect(momentUtilsFunctions.longDate(a)).toEqual('May 22, 2020');
    });
  });

  describe('Når longDateNumbersClock blir kalt', () => {
    it('Så returnerer den en long dato format med klokken (Day DD. Måned YYYY klokken HH:mm)', () => {
      const a = moment('22.05.2020', 'DD.MM.YYYY');
      expect(momentUtilsFunctions.longDateNumbersClock(a)).toEqual('Friday 22. May 2020 klokken 00:00');
    });
  });

  describe('Når mediumDate blir kalt', () => {
    it('Så returnerer den en medium dato format  (DD. Mån YYYY HH:mm)', () => {
      const a = moment('05.11.2020', 'DD.MM.YYYY');
      expect(momentUtilsFunctions.mediumDate(a)).toEqual('05. Nov 2020 00:00');
    });
  });

  describe('Når mediumDateNumbers blir kalt', () => {
    it('Så returnerer den en medium dato kun med tall (DD.MM.YYYY HH:mm)', () => {
      const a = moment('22.05.2020', 'DD.MM.YYYY');
      expect(momentUtilsFunctions.mediumDateNumbers(a)).toEqual('22.05.2020 00:00');
    });
  });

  describe('Når mediumDateNumbersClock blir kalt', () => {
    it('Så returnerer den en medium dato format med kl.  (DD.MM.YYYY kl. HH:mm)', () => {
      const a = moment('22.05.2020', 'DD.MM.YYYY');
      expect(momentUtilsFunctions.mediumDateNumbersClock(a)).toEqual('22.05.2020 kl. 00:00');
      expect(momentUtilsFunctions.mediumDateNumbersClock(a, '---')).toEqual('22.05.2020---kl. 00:00');
    });
  });

  describe('Når shortDate blir kalt', () => {
    it('Så returnerer den en short dato format (DD. Mån YYYY)', () => {
      const a = moment('05.11.2020', 'DD.MM.YYYY');
      expect(momentUtilsFunctions.shortDate(a)).toEqual('05. Nov 2020');
    });
  });

  describe('Når shortDateFullMonth blir kalt', () => {
    it('Så returnerer den en short dato format med full måned (D. Måned YYYY)', () => {
      const a = moment('05.11.2020', 'DD.MM.YYYY');
      expect(momentUtilsFunctions.shortDateFullMonth(a)).toEqual('5. November 2020');
    });
  });

  describe('Når shortDateNb blir kalt', () => {
    it('Så returnerer den en short dato format med kort måned (D. Mån YYYY)', () => {
      const a = moment('05.11.2020', 'DD.MM.YYYY');
      expect(momentUtilsFunctions.shortDateNb(a)).toEqual('5. Nov 2020');
    });
  });

  describe('Når shortDateNumbers blir kalt', () => {
    it('Så returnerer den en short dato format (DD.MM.YYYY)', () => {
      const a = moment('05.11.2020', 'DD.MM.YYYY');
      expect(momentUtilsFunctions.shortDateNumbers(a)).toEqual('05.11.2020');
    });
  });

  describe('Når timeOfDay blir kalt med et tidspunkt i begynnelsen av dagen', () => {
    it('Så returnerer den tom streng', () => {
      const a = moment('05.11.2020 00:00', 'DD.MM.YYYY HH:mm');
      expect(momentUtilsFunctions.timeOfDay(a)).toEqual('');
    });
  });

  describe('Når monthYear blir kalt', () => {
    it('Så returnerer den full måned med år', () => {
      const a = moment('05.11.2020', 'DD.MM.YYYY');
      expect(momentUtilsFunctions.monthYear(a)).toEqual('November 2020');
    });
  });

  describe('Når shortMonthYear blir kalt', () => {
    it('Så returnerer den kort måned med år', () => {
      const a = moment('05.11.2020', 'DD.MM.YYYY');
      expect(momentUtilsFunctions.shortMonthYear(a)).toEqual('Nov 2020');
    });
  });

  describe('Når monthRange blir kalt med 2 forskjellige måneder', () => {
    it('Så returnerer den range med full måned og år', () => {
      const a = moment('22.05.2020', 'DD.MM.YYYY');
      const b = moment('23.08.2020', 'DD.MM.YYYY');
      expect(momentUtilsFunctions.monthRange(a, b)).toEqual(
        `May 2020${String.fromCharCode(160) + String.fromCharCode(8211) + String.fromCharCode(160)}August 2020`
      );
    });
  });

  describe('Når monthRange blir kalt med samme måned', () => {
    it('Så returnerer den samme måned med full måned og år', () => {
      const a = moment('22.05.2020', 'DD.MM.YYYY');
      const b = moment('23.05.2020', 'DD.MM.YYYY');
      expect(momentUtilsFunctions.monthRange(a, b)).toEqual('May 2020');
    });
  });

  describe('Når timeRangeBetween blir kalt med 2 forskjellige tidspunkter', () => {
    it('Så returnerer den range med full dag og range', () => {
      const a = moment('22.05.2020 08:32', 'DD.MM.YYYY HH.mm');
      const b = moment('22.05.2020 12:54', 'DD.MM.YYYY HH:mm');
      expect(momentUtilsFunctions.timeRangeBetween(a, b)).toEqual(`May 22, 2020, mellom kl. 8:32 AM og 12:54 PM`);
    });
  });

  describe('Når timeRange blir kalt med 2 forskjellige tidspunkter', () => {
    it('Så returnerer den range med full måned og år', () => {
      const a = moment('22.05.2020 08:32', 'DD.MM.YYYY HH.mm');
      const b = moment('22.05.2020 12:54', 'DD.MM.YYYY HH:mm');
      expect(momentUtilsFunctions.timeRange(a, b)).toEqual(`May 22, 2020 8:32 AM - 12:54 PM`);
    });
  });

  describe('Når longTimeRange blir kalt med 2 forskjellige tidspunkter', () => {
    it('Så returnerer den range med full måned og år', () => {
      const a = moment('22.05.2020 08:32', 'DD.MM.YYYY HH.mm');
      const b = moment('22.05.2020 12:54', 'DD.MM.YYYY HH:mm');
      expect(momentUtilsFunctions.longTimeRange(a, b)).toEqual(`Friday 22. May 2020, kl. 08:32 - 12:54 PM`);
    });
  });

  describe('Når isSameDay blir kalt', () => {
    it('Så returnerer den true hvis datoene er på samme dag og false hvis ikke', () => {
      const a = moment('22.05.2020', 'DD.MM.YYYY');
      const b = moment('22.05.2020', 'DD.MM.YYYY');
      const c = moment('23.05.2020', 'DD.MM.YYYY');

      expect(momentUtilsFunctions.isSameDay(a, b)).toBeTruthy();
      expect(momentUtilsFunctions.isSameDay(a, c)).toBeFalsy();
    });
  });

  describe('Når isBeforeDay blir kalt', () => {
    it('Så returnerer den true hvis den ene datoen er før den andre og false hvis ikke', () => {
      const a = moment('22.05.2020', 'DD.MM.YYYY');
      const b = moment('22.05.2020', 'DD.MM.YYYY');
      const c = moment('23.05.2020', 'DD.MM.YYYY');

      expect(momentUtilsFunctions.isBeforeDay(a, b)).toBeFalsy();
      expect(momentUtilsFunctions.isBeforeDay(a, c)).toBeTruthy();
    });
  });

  describe('Når isAfter blir kalt med en dato før i dag', () => {
    it('Så returnerer den false', () => {
      const a = moment('23.05.2010', 'DD.MM.YYYY');
      expect(momentUtilsFunctions.isAfter(a)).toBeFalsy();
    });
  });

  describe('Når isAfter blir kalt med en dato etter i dag', () => {
    it('Så returnerer den false', () => {
      const a = moment('23.05.2100', 'DD.MM.YYYY');
      expect(momentUtilsFunctions.isAfter(a)).toBeTruthy();
    });
  });

  describe('Når isAfterToday blir kalt med en dato før i dag', () => {
    it('Så returnerer den false', () => {
      const a = moment('23.05.2010', 'DD.MM.YYYY');
      expect(momentUtilsFunctions.isAfterToday(a)).toBeFalsy();
    });
  });

  describe('Når isAfterToday blir kalt med en dato etter i dag', () => {
    it('Så returnerer den false', () => {
      const a = moment('23.05.2100', 'DD.MM.YYYY');
      expect(momentUtilsFunctions.isAfterToday(a)).toBeTruthy();
    });
  });

  describe('Når isInclusivelyBeforeDay blir kalt', () => {
    it('Så returnerer den true hvis den ene datoen er på samme dag eller før den andre og false hvis ikke', () => {
      const a = moment('22.05.2020', 'DD.MM.YYYY');
      const b = moment('22.05.2020', 'DD.MM.YYYY');
      const c = moment('23.05.2020', 'DD.MM.YYYY');

      expect(momentUtilsFunctions.isInclusivelyBeforeDay(a, b)).toBeTruthy();
      expect(momentUtilsFunctions.isInclusivelyBeforeDay(a, c)).toBeTruthy();
      expect(momentUtilsFunctions.isInclusivelyBeforeDay(c, a)).toBeFalsy();
    });
  });

  describe('Når isBeforeMinDate blir kalt', () => {
    it('Så returnerer den true hvis det ene tidspunktet er før det andre og false hvis det er likt eller etter', () => {
      const a = moment('22.05.2020 12:00', 'DD.MM.YYYY HH:mm');
      const b = moment('22.05.2020 12:00', 'DD.MM.YYYY HH:mm');
      const c = moment('23.05.2020 18:00', 'DD.MM.YYYY HH:mm');

      expect(momentUtilsFunctions.isBeforeMinDate(a, b)).toBeFalsy();
      expect(momentUtilsFunctions.isBeforeMinDate(a, c)).toBeTruthy();
      expect(momentUtilsFunctions.isBeforeMinDate(c, a)).toBeFalsy();
    });
  });

  describe('Når isInclusivelyAfterDay blir kalt', () => {
    it('Så returnerer den true hvis den ene datoen er på samme dag eller etter den andre og false hvis ikke', () => {
      const a = moment('22.05.2020', 'DD.MM.YYYY');
      const b = moment('22.05.2020', 'DD.MM.YYYY');
      const c = moment('23.05.2020', 'DD.MM.YYYY');

      expect(momentUtilsFunctions.isInclusivelyAfterDay(a, b)).toBeTruthy();
      expect(momentUtilsFunctions.isInclusivelyAfterDay(a, c)).toBeFalsy();
      expect(momentUtilsFunctions.isInclusivelyAfterDay(c, a)).toBeTruthy();
    });
  });

  describe('Når isAfterMaxDate blir kalt', () => {
    it('Så returnerer den true hvis det ene tidspunktet er etter det andre og false hvis det er likt eller etter', () => {
      const a = moment('22.05.2020 12:00', 'DD.MM.YYYY HH:mm');
      const b = moment('22.05.2020 12:00', 'DD.MM.YYYY HH:mm');
      const c = moment('23.05.2020 18:00', 'DD.MM.YYYY HH:mm');

      expect(momentUtilsFunctions.isAfterMaxDate(a, b)).toBeFalsy();
      expect(momentUtilsFunctions.isAfterMaxDate(a, c)).toBeFalsy();
      expect(momentUtilsFunctions.isAfterMaxDate(c, a)).toBeTruthy();
    });
  });

  describe('Når numberOfWeeksInMonth blir kalt', () => {
    it('Så returnerer den riktig antall uker', () => {
      const a = moment('01.05.2020', 'DD.MM.YYYY');
      const b = moment('29.05.2020', 'DD.MM.YYYY');

      expect(momentUtilsFunctions.numberOfWeeksInMonth(a, b)).toEqual(4);
    });
  });
});
