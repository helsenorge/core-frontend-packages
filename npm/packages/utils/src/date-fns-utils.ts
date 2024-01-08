import {
  setDefaultOptions,
  format as formatDF,
  isEqual as isEqualDF,
  isSameDay as isSameDayDF,
  isBefore as isBeforeDF,
  isAfter as isAfterDF,
  differenceInWeeks as differenceInWeeksDF,
  startOfDay as startOfDayDF,
  isSameMonth as isSameMonthDF,
} from 'date-fns';
import { nb } from 'date-fns/locale';

import { capitalize as ucfirst } from './string-utils';

/**
 * Vanlige datoformater brukt på helsenorge.no
 *
 * Eksemplene viser formattert dato med norsk bokmål (nb) locale
 */
export enum DateFormat {
  /** 02:08 */
  Time = 'p',

  /** 09.02.2023 */
  ShortDate = 'P',

  /** 09.02.2023 02:08 */
  ShortDateTime = 'Pp',

  /** 9. feb. 2023 */
  MediumDate = 'PP',

  /** 9. feb. 2023 02:08 */
  MediumDateTime = 'PPp',

  /** 9. februar 2023  */
  LongDate = 'PPP',

  /** 9. februar 2023 kl. 02:08  */
  LongDateTime = 'PPPp',

  /** torsdag 9. februar 2023 kl. 02:08 */
  LongDateWeekdayTime = 'PPPPp',

  /** feb. 2023 */
  ShortMonthYear = 'MMM yyyy',

  /** februar 2023  */
  MonthYear = 'MMMM yyyy',
}

/**
 * Initialiserer date-fns med norsk bokmål locale
 */
export const initialize = (): void => setDefaultOptions({ locale: nb });

/**
 * Returnerer en lang dato format (Måned DD, YYYY) basert på en Date
 * @param a - Dato som skal konverteres
 */
export const longDate = (date: Date): string => {
  const startOfDay = startOfDayDF(date);

  return isEqualDF(date, startOfDay) ? formatDF(date, DateFormat.LongDate) : formatDF(date, DateFormat.LongDateTime);
};

/**
 * Returnerer en long dato format med klokken (Day DD. Måned YYYY klokken HH:mm) basert på en Date
 * @param date Dato som skal konverteres
 */
export const longDateNumbersClock = (date: Date): string => formatDF(date, DateFormat.LongDateWeekdayTime);

/**
 * Returnerer en medium dato format (DD. Mån YYYY HH:mm) basert på en Date
 * @param date Dato som skal konverteres
 */
export const mediumDate = (date: Date): string => formatDF(date, DateFormat.MediumDateTime);

/**
 * Returnerer en medium dato format kun med tall (DD.MM.YYYY HH:mm)) basert på en Date
 * @param date Dato som skal konverteres
 */
export const mediumDateNumbers = (date: Date): string => formatDF(date, DateFormat.ShortDateTime);

/**
 * Returnerer en medium dato format med kl. (DD.MM.YYYY kl. HH:mm) basert på en Date
 * @param date Dato som skal konverteres
 */
export const mediumDateNumbersClock = (date: Date): string => formatDF(date, DateFormat.ShortDateTime);

/**
 * Returnerer en short dato format (DD. Mån YYYY) basert på en Date
 * @param date Dato som skal konverteres
 */
export const shortDate = (date: Date): string => formatDF(date, DateFormat.MediumDate);

/**
 * Returnerer en short dato format med full måned (D. Måned YYYY) basert på en Date
 * @param date Dato som skal konverteres
 */
export const shortDateFullMonth = (date: Date): string => formatDF(date, DateFormat.LongDate);

/**
 * Returnerer en short dato format (DD.MM.YYYY) basert på en Date
 * @param date Dato som skal konverteres
 */
export const shortDateNumbers = (date: Date): string => formatDF(date, DateFormat.ShortDate);

/**
 * Returnerer dato med riktig AM/PM og prefix
 * @param date Dato som skal sjekkes
 * @param prefix - Tekst før formattert dato
 */
export const timeOfDay = (start: Date, prefix = ''): string => {
  let value = '';
  const startOfDay = startOfDayDF(start);
  if (!isEqualDF(start, startOfDay)) {
    value = prefix + formatDF(start, DateFormat.Time);
  }
  return value;
};

/**
 * Returnerer full måned med år (Måned YYYY)
 * @param date Dato som skal konverteres
 */
export const monthYear = (date: Date): string => ucfirst(formatDF(date, DateFormat.MonthYear));

/**
 * Returnerer kort måned med år (Mån YYYY)
 * @param date Dato som skal konverteres
 */
export const shortMonthYear = (date: Date): string => ucfirst(formatDF(date, DateFormat.ShortMonthYear).replace('.', ''));

/**
 * Returnerer range med full måned og år (Måned YYYY – Måned YYYY)
 * @param start Startdato
 * @param end Sluttdato
 */
export const monthRange = (start: Date, end: Date): string => {
  let range: string;
  if (isSameMonthDF(start, end)) {
    range = ucfirst(formatDF(start, DateFormat.MonthYear));
  } else {
    range =
      ucfirst(formatDF(start, DateFormat.MonthYear)) +
      String.fromCharCode(160) +
      String.fromCharCode(8211) +
      String.fromCharCode(160) +
      ucfirst(formatDF(end, DateFormat.MonthYear));
  }
  return range;
};

/**
 * Returnerer range mellom 2 klokkeslett (Måned DD, YYYY, mellom kl. H:mm AM og HH:mm PM)
 * Forutsetter at begge tidspunktene er på samme dag
 *
 * @param start Startdato
 * @param end Sluttdato
 * @param betweenText ", mellom kl. "
 * @param andText "og"
 */
export const timeRangeBetween = (start: Date, end: Date, between = ', mellom kl. ', andText = ' og '): string => {
  let range: string;

  if (isEqualDF(start, end)) {
    range = formatDF(start, DateFormat.LongDateTime);
  } else {
    range = formatDF(start, DateFormat.MediumDate) + between + formatDF(start, DateFormat.Time) + andText + formatDF(end, DateFormat.Time);
  }
  return range;
};

/**
 * Returnerer range mellom 2 klokkeslett med bindestrekk (Måned DD, YYYY, H:mm AM - HH:mm PM)
 * Forutsetter at begge tidspunktene er på samme dag
 * @param start Startdato
 * @param end Sluttdato
 */
export const timeRange = (start: Date, end: Date): string => {
  let range: string;

  if (isEqualDF(start, end)) {
    range = formatDF(start, DateFormat.LongDateTime);
  } else {
    range = formatDF(start, DateFormat.LongDateTime) + ' - ' + formatDF(end, DateFormat.Time);
  }
  return range;
};

/**
 * Returnerer range mellom 2 klokkeslett med full dag måned og år (Day DD. Måned YYYY, kl. HH:mm AM - HH:mm PM)
 * Forutsetter at begge tidspunktene er på samme dag
 * @param start Startdato
 * @param end Sluttdato
 */
export const longTimeRange = (start: Date, end?: Date): string => {
  let range = formatDF(start, DateFormat.LongDateWeekdayTime);

  if (end) {
    range = range + ' - ' + formatDF(end, DateFormat.Time);
  }

  return ucfirst(range);
};

/**
 * Returnerer true hvis dato a er før dato b
 * @param a Dato som skal sammenlignes
 * @param b Dato som skal sammenlignes
 */
export const isBeforeDay = (a: Date, b: Date): boolean => isBeforeDF(a.setHours(0, 0, 0, 0), b.setHours(0, 0, 0, 0));

/**
 * Returnerer true hvis dato a er etter dato b
 * @param a Dato som skal sammenlignes
 * @param b Dato som skal sammenlignes
 */
export const isAfterDay = (a: Date, b: Date): boolean => isAfterDF(a.setHours(0, 0, 0, 0), b.setHours(0, 0, 0, 0));

/**
 * Returnerer true hvis dato a er på samme dag eller etter dato b
 * @param a Dato som skal sammenlignes
 * @param b Dato som skal sammenlignes
 */
export const isInclusivelyAfterDay = (a: Date, b: Date): boolean => isSameDayDF(a, b) || isAfterDay(a, b);

/**
 * Returnerer true hvis input (inkludert minutter) er etter nåtid
 * @param date Dato som skal sammenlignes
 */
export const isAfter = (date: Date): boolean => isAfterDF(date, new Date());

/**
 * Returnerer true hvis input er etter dagens dato
 * Forskjell med 'isAfter' er at denne tar utgangspunkt i dager
 * @param date Dato som skal sammenlignes
 */
export const isAfterToday = (date: Date): boolean => isAfterDF(date.setHours(0, 0, 0, 0), new Date().setHours(0, 0, 0, 0));

/**
 * Sammenligner to datoer og returnerer true hvis den første datoen er etter den andre (fungerer også med tid)
 * @param a - Date
 * @param max - maksimum dato grense
 */
export const isAfterMaxDate = (a: Date, b: Date | undefined): boolean => !!b && isAfterDF(a, b);

/**
 * Returnerer true hvis dato a er på samme dag eller før dato b
 * @param a Dato som skal sammenlignes
 * @param b Dato som skal sammenlignes
 */
export const isInclusivelyBeforeDay = (a: Date, b: Date): boolean => isSameDayDF(a, b) || isBeforeDay(a, b);

/**
 * Returnerer true hvis input  (inkludert minutter) er før nåtid
 * @param date Dato som skal sammenlignes
 */
export const isBefore = (date: Date): boolean => isBeforeDF(date, new Date());

/**
 * Returnerer true hvis input er før dagens dato
 * Forskjell med 'isBefore' er at denne tar utgangspunkt i dager
 * @param date Dato som skal sammenlignes
 */
export const isBeforeToday = (date: Date): boolean => isBeforeDF(date.setHours(0, 0, 0, 0), new Date().setHours(0, 0, 0, 0));

/**
 * Sammenligner to datoer og returnerer true hvis den første datoen er før den andre (fungerer også med tid)
 * @param date - Date
 * @param min - minimum dato grense
 */
export const isBeforeMinDate = (a: Date, b: Date | undefined): boolean => !!b && isBeforeDF(a, b);

/**
 * Returnerer true hvis input er dagens dato og tid er tidligere enn nåtid
 * @param date Dato som skal sammenlignes
 */
export const isEarlierToday = (date: Date): boolean => {
  const now = new Date();

  return isSameDayDF(date, now) && isBeforeDF(date, now);
};

/**
 * Returnerer antall uker mellom to datoer
 * @param a - Date startdato (first week)
 * @param b - Date sluttdato (last week)
 */
export const numberOfWeeksInMonth = (a: Date, b: Date): number => differenceInWeeksDF(b, a);

/**
 * Returnerer true hvis input er lik 0001-01-01T00:00:00
 * @param date Dato som skal sammenlignes
 */
export const isDotNetMinDate = (date: Date): boolean => isEqualDF(date, new Date('0001-01-01T00:00:00'));
