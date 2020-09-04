import moment from 'moment';
import * as momentUtilsFunctions from '../moment-utils';

describe('Moment-utils', () => {
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
