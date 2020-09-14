import moment from 'moment';
import * as momentUtilsFunctions from '../moment-utils';

describe('Moment-utils', () => {
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

  describe('Når timeOfDay blir kalt med et tidspunkt midt på dagen', () => {
    it('Så returnerer den dato med riktig am/PM og prefix', () => {
      const a = moment('05.11.2020 12:45', 'DD.MM.YYYY HH:mm');
      expect(momentUtilsFunctions.timeOfDay(a, 'myprefix > ')).toEqual('myprefix > 12:45 PM');
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
});
