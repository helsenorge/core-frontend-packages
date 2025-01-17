import { parse, subDays, addMinutes, subMinutes, format, setDefaultOptions } from 'date-fns';
import { nb } from 'date-fns/locale';

import LanguageLocales from '../constants/languages';
import * as dateUtils from '../date-fns-utils';

describe('date-fns-utils', () => {
  beforeEach(() => {
    setDefaultOptions({ locale: nb });
    process.env.TZ = 'Europe/Oslo';
    // eslint-disable-next-line no-console
    console.log('Current Timezone:', Intl.DateTimeFormat().resolvedOptions().timeZone);
  });

  describe('Når loadLocale kalles', () => {
    it('Så formatteres datoer med riktig locale', () => {
      const date = parse('19.05.2020 08:32', 'dd.MM.yyyy HH:mm', new Date());

      dateUtils.loadLocale(LanguageLocales.ENGLISH);
      expect(format(date, 'EEEE')).toEqual('Tuesday');

      dateUtils.loadLocale(LanguageLocales.NORWEGIAN);
      expect(format(date, 'EEEE')).toEqual('tirsdag');

      dateUtils.loadLocale(LanguageLocales.NORWEGIAN_NYNORSK);
      expect(format(date, 'EEEE')).toEqual('tysdag');

      dateUtils.loadLocale(LanguageLocales.SAMI_NORTHERN);
      expect(format(date, 'EEEE')).toEqual('maŋŋebárga');
    });
  });

  describe('Når safeParseJSON blir kalt', () => {
    describe('Når safeParseJSON blir kalt med en gyldig Date', () => {
      it('Så returneres datoen som en Date', () => {
        const result = dateUtils.safeParseJSON(new Date(Date.UTC(2000, 2, 15, 5, 20, 10, 123)));

        expect(result).toBeInstanceOf(Date);
        expect(result?.toISOString()).toEqual('2000-03-15T05:20:10.123Z');
      });
    });

    describe('Når safeParseJSON blir kalt med en gyldig streng', () => {
      it('Så returneres datoen som en Date', () => {
        const result = dateUtils.safeParseJSON('2000-03-15T05:20:10.123Z');

        expect(result).toBeInstanceOf(Date);
        expect(result?.toISOString()).toEqual('2000-03-15T05:20:10.123Z');
      });
    });

    describe('Når safeParseJSON blir kalt uten argument', () => {
      it('Så returneres undefined', () => {
        const result = dateUtils.safeParseJSON();

        expect(result).toBeUndefined();
      });
    });

    describe('Når safeParseJSON blir kalt med undefined', () => {
      it('Så returneres undefined', () => {
        const result = dateUtils.safeParseJSON(undefined);

        expect(result).toBeUndefined();
      });
    });

    describe('Når safeParseJSON blir kalt med null', () => {
      it('Så returneres undefined', () => {
        const result = dateUtils.safeParseJSON(null);

        expect(result).toBeUndefined();
      });
    });

    describe('Når safeParseJSON blir kalt med tom streng', () => {
      it('Så returneres undefined', () => {
        const result = dateUtils.safeParseJSON('');

        expect(result).toBeUndefined();
      });
    });

    describe('Når safeParseJSON blir kalt med ugyldig Date', () => {
      it('Så returneres undefined', () => {
        const result = dateUtils.safeParseJSON(new Date('x'));

        expect(result).toBeUndefined();
      });
    });

    describe('Når safeParseJSON blir kalt med en ugyldig streng', () => {
      it('Så returneres undefined', () => {
        const result = dateUtils.safeParseJSON('x');

        expect(result).toBeUndefined();
      });
    });
  });

  describe('Når safeFormatCET blir kalt', () => {
    describe('Når safeFormatCET blir kalt med en gyldig Date', () => {
      it('Så returneres formattert dato', () => {
        const result = dateUtils.safeFormatCET(new Date(Date.UTC(2000, 2, 15, 5, 20, 10, 123)), dateUtils.DateFormat.LongDateTime);

        expect(result).toEqual('15. mars 2000 kl. 06:20');
      });
    });

    describe('Når safeFormatCET blir kalt med en gyldig Date og custom format', () => {
      it('Så returneres formattert dato', () => {
        const result = dateUtils.safeFormatCET(new Date(Date.UTC(2000, 2, 15, 5, 20, 10, 123)), 'PP');

        expect(result).toEqual('15. mars 2000');
      });
    });

    describe('Når safeFormatCET blir kalt med en gyldig streng', () => {
      it('Så returneres formattert dato', () => {
        const result = dateUtils.safeFormatCET('2000-03-15T05:20:10.123Z', dateUtils.DateFormat.LongDateTime);

        expect(result).toEqual('15. mars 2000 kl. 06:20');
      });
    });

    describe('Når safeFormatCET blir kalt med undefined dato', () => {
      it('Så returneres tom streng', () => {
        const result = dateUtils.safeFormatCET(undefined, dateUtils.DateFormat.LongDateTime);

        expect(result).toEqual('');
      });
    });

    describe('Når safeFormatCET blir kalt med null', () => {
      it('Så returneres tom streng', () => {
        const result = dateUtils.safeFormatCET(null, dateUtils.DateFormat.LongDateTime);

        expect(result).toEqual('');
      });
    });

    describe('Når safeFormatCET blir kalt med tom streng', () => {
      it('Så returneres tom streng', () => {
        const result = dateUtils.safeFormatCET('', dateUtils.DateFormat.LongDateTime);

        expect(result).toEqual('');
      });
    });

    describe('Når safeFormatCET blir kalt med ugyldig Date', () => {
      it('Så returneres tom streng', () => {
        const result = dateUtils.safeFormatCET(new Date('x'), dateUtils.DateFormat.LongDateTime);

        expect(result).toEqual('');
      });
    });

    describe('Når safeFormatCET blir kalt med en ugyldig streng', () => {
      it('Så returneres tom streng', () => {
        const result = dateUtils.safeFormatCET('x', dateUtils.DateFormat.LongDateTime);

        expect(result).toEqual('');
      });
    });
  });

  describe('Når toCentralEuropeanTime blir kalt med vintertid', () => {
    it('Så returneres tidspunkt med én time forskjell', () => {
      const date = parse('12.01.2020 09:05', 'dd.MM.yyyy HH:mm', new Date());

      const result = dateUtils.toCentralEuropeanTime(date);

      expect(result.toISOString()).toEqual('2020-01-12T08:05:00.000Z');
    });
  });

  describe('Når toCentralEuropeanTime blir kalt med sommertid', () => {
    it('Så returneres tidspunkt med to timer forskjell', () => {
      const date = parse('12.07.2020 09:05', 'dd.MM.yyyy HH:mm', new Date());

      const result = dateUtils.toCentralEuropeanTime(date);

      expect(result.toISOString()).toEqual('2020-07-12T07:05:00.000Z');
    });
  });

  describe('Når formatCET blir kalt ', () => {
    it('Så returneres formattert dato', () => {
      const date = parse('12.01.2020 09:05', 'dd.MM.yyyy HH:mm', new Date());

      const result = dateUtils.formatCET(date, dateUtils.DateFormat.LongDateTime);

      expect(result).toEqual('12. januar 2020 kl. 09:05');
    });
  });

  describe('Når longDate blir kalt med dato uten tidspunkt', () => {
    it('Så returnerer den en lang dato format (Måned DD, YYYY)', () => {
      const a = parse('22.05.2020', 'dd.MM.yyyy', new Date());
      expect(dateUtils.longDate(a)).toEqual('22. mai 2020');
    });
  });

  describe('Når longDate blir kalt med dato med tidspunkt', () => {
    it('Så returnerer den en lang dato format (Måned DD, YYYY)', () => {
      const a = parse('22.05.2020 09:05', 'dd.MM.yyyy HH:mm', new Date());
      expect(dateUtils.longDate(a)).toEqual('22. mai 2020 kl. 09:05');
    });
  });

  describe('Når longDateTime blir kalt', () => {
    it('Så returnerer den langt datoformat med klokkeslett', () => {
      const a = parse('22.05.2020 09:05', 'dd.MM.yyyy HH:mm', new Date());
      expect(dateUtils.longDateTime(a)).toEqual('22. mai 2020 kl. 09:05');
    });
  });

  describe('Når longDateNumbersClock blir kalt', () => {
    it('Så returnerer den en long dato format med klokken (Day DD. Måned YYYY klokken HH:mm)', () => {
      const a = parse('22.05.2020 09:05', 'dd.MM.yyyy HH:mm', new Date());
      expect(dateUtils.longDateNumbersClock(a)).toEqual('fredag 22. mai 2020 kl. 09:05');
    });
  });

  describe('Når mediumDate blir kalt', () => {
    it('Så returnerer den en medium dato format (DD. Mån YYYY HH:mm)', () => {
      const a = parse('22.05.2020 09:05', 'dd.MM.yyyy HH:mm', new Date());
      expect(dateUtils.mediumDate(a)).toEqual('22. mai 2020 09:05');
    });
  });

  describe('Når mediumDateNumbers blir kalt', () => {
    it('Så returnerer den en medium dato kun med tall (dd.MM.yyyy HH:mm)', () => {
      const a = parse('22.05.2020 09:05', 'dd.MM.yyyy HH:mm', new Date());
      expect(dateUtils.mediumDateNumbers(a)).toEqual('22.05.2020 09:05');
    });
  });

  describe('Når shortDate blir kalt', () => {
    it('Så returnerer den en short dato format (DD. Mån YYYY)', () => {
      const a = parse('05.11.2020', 'dd.MM.yyyy', new Date());
      expect(dateUtils.shortDate(a)).toEqual('5. nov. 2020');
    });
  });

  describe('Når shortDateFullMonth blir kalt', () => {
    it('Så returnerer den en short dato format med full måned (D. Måned YYYY)', () => {
      const a = parse('05.11.2020', 'dd.MM.yyyy', new Date());
      expect(dateUtils.shortDateFullMonth(a)).toEqual('5. november 2020');
    });
  });

  describe('Når shortDateNumbers blir kalt', () => {
    it('Så returnerer den en short dato format (dd.MM.yyyy)', () => {
      const a = parse('05.11.2020', 'dd.MM.yyyy', new Date());
      expect(dateUtils.shortDateNumbers(a)).toEqual('05.11.2020');
    });
  });

  describe('Når timeOfDay blir kalt med et tidspunkt i begynnelsen av dagen', () => {
    it('Så returnerer den tom streng', () => {
      const a = parse('05.11.2020 00:00', 'dd.MM.yyyy HH:mm', new Date());
      expect(dateUtils.timeOfDay(a)).toEqual('');
    });
  });

  describe('Når timeOfDay blir kalt med et tidspunkt senere på dagen', () => {
    it('Så returnerer den tidspunkt', () => {
      const a = parse('05.11.2020 09:08', 'dd.MM.yyyy HH:mm', new Date());
      expect(dateUtils.timeOfDay(a)).toEqual('09:08');
    });
  });

  describe('Når monthYear blir kalt', () => {
    it('Så returnerer den full måned med år', () => {
      const a = parse('05.11.2020', 'dd.MM.yyyy', new Date());
      expect(dateUtils.monthYear(a)).toEqual('November 2020');
    });
  });

  describe('Når shortMonthYear blir kalt', () => {
    it('Så returnerer den kort måned med år', () => {
      const a = parse('05.11.2020', 'dd.MM.yyyy', new Date());
      expect(dateUtils.shortMonthYear(a)).toEqual('Nov 2020');
    });
  });

  describe('Når monthRange blir kalt med 2 forskjellige måneder', () => {
    it('Så returnerer den range med full måned og år', () => {
      const a = parse('22.05.2020', 'dd.MM.yyyy', new Date());
      const b = parse('23.08.2020', 'dd.MM.yyyy', new Date());
      expect(dateUtils.monthRange(a, b)).toEqual(
        `Mai 2020${String.fromCharCode(160) + String.fromCharCode(8211) + String.fromCharCode(160)}August 2020`
      );
    });
  });

  describe('Når monthRange blir kalt med samme måned', () => {
    it('Så returnerer den samme måned med full måned og år', () => {
      const a = parse('22.05.2020', 'dd.MM.yyyy', new Date());
      const b = parse('23.05.2020', 'dd.MM.yyyy', new Date());
      expect(dateUtils.monthRange(a, b)).toEqual('Mai 2020');
    });
  });

  describe('Når timeRangeBetween blir kalt med 2 like tidspunkter', () => {
    it('Så returnerer den formattert dato', () => {
      const a = parse('22.05.2020 08:32', 'dd.MM.yyyy HH:mm', new Date());
      const b = parse('22.05.2020 08:32', 'dd.MM.yyyy HH:mm', new Date());
      expect(dateUtils.timeRangeBetween(a, b)).toEqual(`22. mai 2020 kl. 08:32`);
    });
  });

  describe('Når timeRangeBetween blir kalt med 2 forskjellige tidspunkter', () => {
    it('Så returnerer den range med full dag og range', () => {
      const a = parse('22.05.2020 08:32', 'dd.MM.yyyy HH:mm', new Date());
      const b = parse('22.05.2020 12:54', 'dd.MM.yyyy HH:mm', new Date());
      expect(dateUtils.timeRangeBetween(a, b)).toEqual(`22. mai 2020, mellom kl. 08:32 og 12:54`);
    });
  });

  describe('Når timeRange blir kalt med 2 like tidspunkter', () => {
    it('Så returnerer den formattert dato', () => {
      const a = parse('22.05.2020 08:32', 'dd.MM.yyyy HH:mm', new Date());
      const b = parse('22.05.2020 08:32', 'dd.MM.yyyy HH:mm', new Date());
      expect(dateUtils.timeRange(a, b)).toEqual(`22. mai 2020 kl. 08:32`);
    });
  });

  describe('Når timeRange blir kalt med 2 forskjellige tidspunkter', () => {
    it('Så returnerer den range med full måned og år', () => {
      const a = parse('22.05.2020 08:32', 'dd.MM.yyyy HH:mm', new Date());
      const b = parse('22.05.2020 12:54', 'dd.MM.yyyy HH:mm', new Date());
      expect(dateUtils.timeRange(a, b)).toEqual(`22. mai 2020 kl. 08:32 - 12:54`);
    });
  });

  describe('Når longTimeRange blir kalt med bare ett tidspunkt', () => {
    it('Så returnerer den formattert dato', () => {
      const a = parse('22.05.2020 08:32', 'dd.MM.yyyy HH:mm', new Date());
      expect(dateUtils.longTimeRange(a)).toEqual(`Fredag 22. mai 2020 kl. 08:32`);
    });
  });

  describe('Når longTimeRange blir kalt med 2 forskjellige tidspunkter', () => {
    it('Så returnerer den range med full måned og år', () => {
      const a = parse('22.05.2020 08:32', 'dd.MM.yyyy HH:mm', new Date());
      const b = parse('22.05.2020 12:54', 'dd.MM.yyyy HH:mm', new Date());
      expect(dateUtils.longTimeRange(a, b)).toEqual(`Fredag 22. mai 2020 kl. 08:32 - 12:54`);
    });
  });

  describe('Når isBeforeDay blir kalt', () => {
    it('Så returnerer den true hvis den ene datoen er før den andre og false hvis ikke', () => {
      const a = parse('22.05.2020', 'dd.MM.yyyy', new Date());
      const b = parse('22.05.2020', 'dd.MM.yyyy', new Date());
      const c = parse('23.05.2020', 'dd.MM.yyyy', new Date());

      expect(dateUtils.isBeforeDay(a, b)).toBeFalsy();
      expect(dateUtils.isBeforeDay(a, c)).toBeTruthy();
    });
  });

  describe('Når isBeforeDay blir kalt med forskjellige tidspunkter samme dag ', () => {
    it('Så returnerer den false', () => {
      const a = parse('22.05.2020 08:00', 'dd.MM.yyyy HH:mm', new Date());
      const b = parse('22.05.2020 08:10', 'dd.MM.yyyy HH:mm', new Date());

      expect(dateUtils.isBeforeDay(a, b)).toBeFalsy();
    });
  });

  describe('Når isAfterDay blir kalt', () => {
    it('Så returnerer den true hvis den ene datoen er etter den andre og false hvis ikke', () => {
      const a = parse('22.05.2020', 'dd.MM.yyyy', new Date());
      const b = parse('22.05.2020', 'dd.MM.yyyy', new Date());
      const c = parse('21.05.2020', 'dd.MM.yyyy', new Date());

      expect(dateUtils.isAfterDay(a, b)).toBeFalsy();
      expect(dateUtils.isAfterDay(a, c)).toBeTruthy();
    });
  });

  describe('Når isAfterDay blir kalt med forskjellige tidspunkter samme dag ', () => {
    it('Så returnerer den false', () => {
      const a = parse('22.05.2020 08:00', 'dd.MM.yyyy HH:mm', new Date());
      const b = parse('22.05.2020 08:10', 'dd.MM.yyyy HH:mm', new Date());

      expect(dateUtils.isAfterDay(a, b)).toBeFalsy();
    });
  });

  describe('Når isAfter blir kalt med et tidspunkt før i dag', () => {
    it('Så returnerer den false', () => {
      const a = subMinutes(new Date(), 1);
      expect(dateUtils.isAfter(a)).toBeFalsy();
    });
  });

  describe('Når isAfter blir kalt med et tidspunkt etter i dag', () => {
    it('Så returnerer den false', () => {
      const a = addMinutes(new Date(), 1);
      expect(dateUtils.isAfter(a)).toBeTruthy();
    });
  });

  describe('Når isBefore blir kalt med et tidspunkt før i dag', () => {
    it('Så returnerer den true', () => {
      const a = subMinutes(new Date(), 1);
      expect(dateUtils.isBefore(a)).toBeTruthy();
    });
  });

  describe('Når isBefore blir kalt med et tidspunkt etter i dag', () => {
    it('Så returnerer den false', () => {
      const a = addMinutes(new Date(), 1);
      expect(dateUtils.isBefore(a)).toBeFalsy();
    });
  });

  describe('Når isAfterToday blir kalt med en dato før i dag', () => {
    it('Så returnerer den false', () => {
      const a = parse('23.05.2010', 'dd.MM.yyyy', new Date());
      expect(dateUtils.isAfterToday(a)).toBeFalsy();
    });
  });

  describe('Når isAfterToday blir kalt med en dato etter i dag', () => {
    it('Så returnerer den true', () => {
      const a = parse('23.05.2100', 'dd.MM.yyyy', new Date());
      expect(dateUtils.isAfterToday(a)).toBeTruthy();
    });
  });
  describe('Når isBeforeToday blir kalt med en dato før i dag', () => {
    it('Så returnerer den true', () => {
      const a = parse('23.05.2010', 'dd.MM.yyyy', new Date());
      expect(dateUtils.isBeforeToday(a)).toBe(true);
    });
  });

  describe('Når isBeforeToday blir kalt med en dato etter i dag', () => {
    it('Så returnerer den false', () => {
      const a = parse('23.05.2100', 'dd.MM.yyyy', new Date());
      expect(dateUtils.isBeforeToday(a)).toBe(false);
    });
  });

  describe('Når isInclusivelyBeforeDay blir kalt', () => {
    it('Så returnerer den true hvis den ene datoen er på samme dag eller før den andre og false hvis ikke', () => {
      const a = parse('22.05.2020', 'dd.MM.yyyy', new Date());
      const b = parse('22.05.2020', 'dd.MM.yyyy', new Date());
      const c = parse('23.05.2020', 'dd.MM.yyyy', new Date());

      expect(dateUtils.isInclusivelyBeforeDay(a, b)).toBeTruthy();
      expect(dateUtils.isInclusivelyBeforeDay(a, c)).toBeTruthy();
      expect(dateUtils.isInclusivelyBeforeDay(c, a)).toBeFalsy();
    });
  });

  describe('Når isBeforeMinDate blir kalt', () => {
    it('Så returnerer den true hvis det ene tidspunktet er før det andre og false hvis det er likt eller etter', () => {
      const a = parse('22.05.2020 12:00', 'dd.MM.yyyy HH:mm', new Date());
      const b = parse('22.05.2020 12:00', 'dd.MM.yyyy HH:mm', new Date());
      const c = parse('23.05.2020 18:00', 'dd.MM.yyyy HH:mm', new Date());

      expect(dateUtils.isBeforeMinDate(a, b)).toBeFalsy();
      expect(dateUtils.isBeforeMinDate(a, c)).toBeTruthy();
      expect(dateUtils.isBeforeMinDate(c, a)).toBeFalsy();
    });
  });

  describe('Når isInclusivelyAfterDay blir kalt', () => {
    it('Så returnerer den true hvis den ene datoen er på samme dag eller etter den andre og false hvis ikke', () => {
      const a = parse('22.05.2020', 'dd.MM.yyyy', new Date());
      const b = parse('22.05.2020', 'dd.MM.yyyy', new Date());
      const c = parse('23.05.2020', 'dd.MM.yyyy', new Date());

      expect(dateUtils.isInclusivelyAfterDay(a, b)).toBeTruthy();
      expect(dateUtils.isInclusivelyAfterDay(a, c)).toBeFalsy();
      expect(dateUtils.isInclusivelyAfterDay(c, a)).toBeTruthy();
    });
  });

  describe('Når isAfterMaxDate blir kalt', () => {
    it('Så returnerer den true hvis det ene tidspunktet er etter det andre og false hvis det er likt eller etter', () => {
      const a = parse('22.05.2020 12:00', 'dd.MM.yyyy HH:mm', new Date());
      const b = parse('22.05.2020 12:00', 'dd.MM.yyyy HH:mm', new Date());
      const c = parse('23.05.2020 18:00', 'dd.MM.yyyy HH:mm', new Date());

      expect(dateUtils.isAfterMaxDate(a, b)).toBeFalsy();
      expect(dateUtils.isAfterMaxDate(a, c)).toBeFalsy();
      expect(dateUtils.isAfterMaxDate(c, a)).toBeTruthy();
    });
  });

  describe('Når isDotNetMinDate blir kalt med dotnets 0-dato', () => {
    it('Så returnerer den true', () => {
      const a = parse('01.01.0001 00:00', 'dd.MM.yyyy HH:mm', new Date());

      expect(dateUtils.isDotNetMinDate(a)).toBe(true);
    });
  });

  describe('Når isDotNetMinDate blir kalt med en dato etter dotnets 0-dato', () => {
    it('Så returnerer den false', () => {
      const a = parse('01.01.0001 00:01', 'dd.MM.yyyy HH:mm', new Date());

      expect(dateUtils.isDotNetMinDate(a)).toBe(false);
    });
  });

  describe('Når isEarlierToday blir kalt', () => {
    it('Så returnerer den true når dato er tidligere på dagen', () => {
      const date = subMinutes(new Date(), 1);

      expect(dateUtils.isEarlierToday(date)).toEqual(true);
    });

    it('Så returnerer den false når dato er senere på dagen', () => {
      const date = addMinutes(new Date(), 1);

      expect(dateUtils.isEarlierToday(date)).toEqual(false);
    });

    it('Så returnerer den false når dato er i går', () => {
      const yesterday = subDays(new Date(), -1);

      expect(dateUtils.isEarlierToday(yesterday)).toEqual(false);
    });
  });
});
