import moment, { Moment, MomentInput } from 'moment';

import { capitalize } from './string-utils';

/**
 * Initialiserer Moment med norsk locale og riktig LongDate formats
 */
export const initialize = (): void => {
  moment.locale('nb');
  const language: moment.LocaleSpecification = {
    monthsShort: 'jan._feb._mars_april_mai_juni_juli_aug._sep._okt._nov._des.'.split('_'),
    longDateFormat: {
      LT: 'HH:mm',
      LTS: 'HH:mm:ss',
      L: 'DD.MM.YYYY',
      LL: 'D. MMMM YYYY',
      LLL: 'D. MMMM YYYY, [kl.] HH:mm',
      LLLL: 'dddd D. MMMM YYYY, [kl.] HH:mm',
    },
  };
  moment.updateLocale('nb', language);
};

/**
 * Returnerer JS Dato basert på en MomentInput
 * @param a - MomentInput som skal konverteres
 */
export const toDate = (a: MomentInput): Date => {
  const start: moment.Moment = moment(a);
  return start.toDate();
};

/**
 * Returnerer en lang dato format (Måned DD, YYYY) basert på en MomentInput
 * @param a - MomentInput som skal konverteres
 */
export const longDate = (a: MomentInput): string => {
  const start: moment.Moment = moment(a);
  const startOfDay: moment.Moment = moment(a).startOf('day');
  return start.isSame(startOfDay) ? start.format('ll') : start.format('lll');
};

/**
 * Returnerer en long dato format med klokken (Day DD. Måned YYYY klokken HH:mm) basert på en MomentInput
 * @param a - MomentInput som skal konverteres
 */
export const longDateNumbersClock = (time: MomentInput, separator = ' '): string => {
  const start: moment.Moment = moment(time);
  return start.format(`dddd DD. MMMM YYYY${separator}[klokken] HH:mm`);
};

/**
 * Returnerer en medium dato format (DD. Mån YYYY HH:mm) basert på en MomentInput
 * @param a - MomentInput som skal konverteres
 */
export const mediumDate = (a: MomentInput): string => {
  const start: moment.Moment = moment(a);
  return start.format('DD. MMM YYYY HH:mm');
};

/**
 * Returnerer en medium dato format kun med tall (DD.MM.YYYY HH:mm)) basert på en MomentInput
 * @param a - MomentInput som skal konverteres
 */
export const mediumDateNumbers = (a: MomentInput): string => {
  const start: moment.Moment = moment(a);
  return start.format('DD.MM.YYYY HH:mm');
};

/**
 * Returnerer en medium dato format med kl. (DD.MM.YYYY kl. HH:mm) basert på en MomentInput
 * @param a - MomentInput som skal konverteres
 */
export const mediumDateNumbersClock = (a: MomentInput, separator = ' '): string => {
  const start: moment.Moment = moment(a);
  return start.format(`DD.MM.YYYY${separator}[kl.] HH:mm`);
};

/**
 * Returnerer en short dato format (DD. Mån YYYY) basert på en MomentInput
 * @param a - MomentInput som skal konverteres
 */
export const shortDate = (time: MomentInput): string => {
  const start: moment.Moment = moment(time);
  return start.format('DD. MMM YYYY');
};

/**
 * Returnerer en short dato format med full måned (D. Måned YYYY) basert på en MomentInput
 * @param a - MomentInput som skal konverteres
 */
export const shortDateFullMonth = (a: MomentInput): string => {
  const start: moment.Moment = moment(a);
  return start.format('D. MMMM YYYY');
};

/**
 * Returnerer en short dato format (D. Mån YYYY) basert på en MomentInput
 * @param a - MomentInput som skal konverteres
 */
export const shortDateNb = (a: MomentInput): string => {
  const start: moment.Moment = moment(a);
  return start.format('D. MMM YYYY');
};

/**
 * Returnerer en short dato format (DD.MM.YYYY) basert på en MomentInput
 * @param a - MomentInput som skal konverteres
 */
export const shortDateNumbers = (a: MomentInput): string => {
  const start: moment.Moment = moment(a);
  return start.format('DD.MM.YYYY');
};

/**
 * Returnerer dato med riktig AM/PM og prefix
 * @param a - MomentInput som skal sjekkes
 */
export const timeOfDay = (a: MomentInput, prefix = ''): string => {
  let value = '';
  const start: moment.Moment = moment(a);
  const startOfDay: moment.Moment = moment(a).startOf('day');
  if (!start.isSame(startOfDay)) {
    value = prefix + start.format('LT');
  }
  return value;
};

/**
 * Returnerer full måned med år (Måned YYYY)
 * @param a - MomentInput som skal konverteres
 */
export const monthYear = (a: MomentInput): string => {
  const start: moment.Moment = moment(a);
  return capitalize(start.format('MMMM YYYY'));
};

/**
 * Returnerer kort måned med år (Mån YYYY)
 * @param a - MomentInput som skal konverteres
 */
export const shortMonthYear = (a: MomentInput): string => {
  const start: moment.Moment = moment(a);
  return capitalize(start.format('MMM YYYY').replace('.', ''));
};

/**
 * Returnerer range med full måned og år (Måned YYYY – Måned YYYY)
 * @param a - startdato i Moment format
 * @param b - sluttdato i Moment format
 */
export const monthRange = (a: MomentInput, b: MomentInput): string => {
  let range: string;
  const start: moment.Moment = moment(a);
  const end: moment.Moment = moment(b);

  if (start.isSame(end, 'month')) {
    range = capitalize(start.format('MMMM YYYY'));
  } else {
    range =
      capitalize(start.format('MMMM YYYY')) +
      String.fromCharCode(160) +
      String.fromCharCode(8211) +
      String.fromCharCode(160) +
      capitalize(end.format('MMMM YYYY'));
  }
  return range;
};

/**
 * Returnerer range mellom 2 klokkeslett (Måned DD, YYYY, mellom kl. H:mm AM og HH:mm PM)
 * Forutsetter at begge tidspunktene er på samme dag
 * @param a - startdato i Moment format
 * @param b - sluttdato i Moment format
 */
export const timeRangeBetween = (a: MomentInput, b: MomentInput): string => {
  let range: string;
  const start: moment.Moment = moment(a);
  const end: moment.Moment = moment(b);

  if (start.isSame(end)) {
    range = start.format('lll');
  } else {
    range = start.format('ll') + ', mellom kl. ' + start.format('LT') + ' og ' + end.format('LT');
  }
  return range;
};

/**
 * Returnerer range mellom 2 klokkeslett med bindestrekk (Måned DD, YYYY, H:mm AM - HH:mm PM)
 * Forutsetter at begge tidspunktene er på samme dag
 * @param a - startdato i Moment format
 * @param b - sluttdato i Moment format
 */
export const timeRange = (first: MomentInput, last: MomentInput): string => {
  let range: string;
  const start: moment.Moment = moment(first);
  const end: moment.Moment = moment(last);

  if (start.isSame(end)) {
    range = start.format('lll');
  } else {
    range = start.format('lll') + ' - ' + end.format('LT');
  }
  return range;
};

/**
 * Returnerer range mellom 2 klokkeslett med full dag måned og år (Day DD. Måned YYYY, kl. HH:mm AM - HH:mm PM)
 * Forutsetter at begge tidspunktene er på samme dag
 * @param a - startdato i Moment format
 * @param b - sluttdato i Moment format
 */
export const longTimeRange = (startInput: MomentInput, endInput?: MomentInput): string => {
  const start: moment.Moment = moment(startInput);
  const end: moment.Moment = moment(endInput);
  let range = start.format('dddd D. MMMM YYYY, [kl.] HH:mm');

  if (endInput) {
    range = range + ' - ' + end.format('LT');
  }

  return capitalize(range);
};

/**
 * Returnerer true hvis datoene er på samme dag
 * @param a MomentInput som skal sammenlignes
 * @param b MomentInput som skal sammenlignes
 */
export const isSameDay = (a: MomentInput, b: MomentInput): boolean => {
  if (!moment.isMoment(a) || !moment.isMoment(b)) return false;
  // Compare least significant, most likely to change units first
  // Moment's isSame clones moment inputs and is a tad slow
  return a.date() === b.date() && a.month() === b.month() && a.year() === b.year();
};

/**
 * Returnerer true hvis dato a er før dato b
 * @param a MomentInput som skal sammenlignes
 * @param b MomentInput som skal sammenlignes
 */
export const isBeforeDay = (a: MomentInput, b: MomentInput): boolean => {
  if (!moment.isMoment(a) || !moment.isMoment(b)) return false;
  const aYear = a.year();
  const aMonth = a.month();
  const bYear = b.year();
  const bMonth = b.month();
  const isSameYear = aYear === bYear;
  const isSameMonth = aMonth === bMonth;
  if (isSameYear && isSameMonth) return a.date() < b.date();
  if (isSameYear) return aMonth < bMonth;
  return aYear < bYear;
};

/**
 * Returnerer true hvis dato a er etter dato b
 * @param a MomentInput som skal sammenlignes
 * @param b MomentInput som skal sammenlignes
 */
export const isAfterDay = (a: MomentInput, b: MomentInput): boolean => {
  if (!moment.isMoment(a) || !moment.isMoment(b)) return false;
  return !isBeforeDay(a, b) && !isSameDay(a, b);
};

/**
 * Returnerer true hvis dato a er på samme dag eller etter dato b
 * @param a MomentInput som skal sammenlignes
 * @param b MomentInput som skal sammenlignes
 */
export const isInclusivelyAfterDay = (a: MomentInput, b: MomentInput): boolean => {
  if (!moment.isMoment(a) || !moment.isMoment(b)) return false;
  return !isBeforeDay(a, b);
};

/**
 * Returnerer true hvis input (inkludert minutter) er etter nåtid
 * @param a MomentInput som skal sammenlignes
 */
export const isAfter = (a: MomentInput): boolean => {
  const now: moment.Moment = moment();
  return moment(a).isAfter(now);
};

/**
 * Returnerer true hvis input er etter dagens dato
 * Forskjell med 'isAfter' er at denne tar utgangspunkt i dager
 * @param a MomentInput som skal sammenlignes
 */
export const isAfterToday = (a: MomentInput): boolean => {
  return moment(a).diff(new Date(), 'days') > 0;
};

/**
 * Sammenligner to datoer og returnerer true hvis den første datoen er etter den andre (fungerer også med tid)
 * @param a - moment dato
 * @param max - maksimum dato grense
 */
export const isAfterMaxDate = (a: moment.Moment, b: moment.Moment | undefined): boolean => !!(b && a.isAfter(b));

/**
 * Returnerer true hvis dato a er på samme dag eller før dato b
 * @param a MomentInput som skal sammenlignes
 * @param b MomentInput som skal sammenlignes
 */
export const isInclusivelyBeforeDay = (a: MomentInput, b: MomentInput): boolean => {
  if (!moment.isMoment(a) || !moment.isMoment(b)) return false;
  return !isAfterDay(a, b);
};

/**
 * Returnerer true hvis input  (inkludert minutter) er før nåtid
 * @param a MomentInput som skal sammenlignes
 */
export const isBefore = (a: MomentInput): boolean => {
  const now: moment.Moment = moment();
  return moment(a).isBefore(now);
};

/**
 * Returnerer true hvis input er før dagens dato
 * Forskjell med 'isBefore' er at denne tar utgangspunkt i dager
 * @param a MomentInput som skal sammenlignes
 */
export const isBeforeToday = (a: MomentInput): boolean => {
  return moment(a).diff(moment(), 'days') < 0;
};

/**
 * Sammenligner to datoer og returnerer true hvis den første datoen er før den andre (fungerer også med tid)
 * @param a - moment dato
 * @param min - minimum dato grense
 */
export const isBeforeMinDate = (a: moment.Moment, b: moment.Moment | undefined): boolean => !!(b && a.isBefore(b));

/**
 * Returnerer true hvis input er dagens dato
 * @param a MomentInput som skal sammenlignes
 */
export const isToday = (a: MomentInput): boolean => {
  return moment(a).isSame(moment(), 'day');
};

/**
 * Returnerer true hvis input er dagens dato og tid er tidligere enn nåtid
 * @param a MomentInput som skal sammenlignes
 */
export const isEarlierToday = (a: MomentInput): boolean => {
  return isToday(a) && isBefore(a);
};

/**
 * Returnerer antall uker som finnes i en måned
 * @param a - Moment obj startdato (first week)
 * @param b - Moment obj sluttdato (last week)
 */
export const numberOfWeeksInMonth = (a: Moment, b: Moment): number => {
  const firstWeek = a.week();
  const lastWeek = b.week();
  if (firstWeek >= 52) {
    return lastWeek;
  } else if (lastWeek < firstWeek) {
    return 53 - firstWeek;
  }
  return lastWeek - firstWeek;
};

/**
 * Returnerer true hvis input er lik 0001-01-01T00:00:00
 * @param a MomentInput som skal sammenlignes
 */
export const isDotNetMinDate = (a: MomentInput): boolean => {
  const input = moment(a);
  // Setup a minDate to mimic .Net Date.MinDate constant.
  const minDate = moment('0001-01-01T00:00:00');
  return input.isSame(minDate);
};

/**
 * Returnerer dato i ISO format med Timezone offset
 * @param a MomentInput som skal sammenlignes
 */
export const toLocalISOStringUsingDateTimezoneOffset = (a: MomentInput): string => {
  const isoDate = moment(a).add('minutes', moment(a).utcOffset()).toISOString();
  return isoDate.substring(0, isoDate.lastIndexOf('.'));
};
