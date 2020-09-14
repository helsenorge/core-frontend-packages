import moment, { Moment } from 'moment';
import StringHelper from './string-utils';

type ISO8601 = string;

export function initialize(): void {
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
}

export function toDate(time: moment.MomentInput): Date {
  const start: moment.Moment = moment(time);
  return start.toDate();
}

export function longDate(time: moment.MomentInput): string {
  const start: moment.Moment = moment(time);
  const startOfDay: moment.Moment = moment(time).startOf('day');
  return start.isSame(startOfDay) ? start.format('ll') : start.format('lll');
}

export function mediumDate(time: moment.MomentInput): string {
  const start: moment.Moment = moment(time);
  return start.format('DD. MMM YYYY HH:mm');
}

export function mediumDateNumbersClock(time: moment.MomentInput, separator = ' '): string {
  const start: moment.Moment = moment(time);
  return start.format(`DD.MM.YYYY${separator}[kl.] HH:mm`);
}
export function longDateNumbersClock(time: moment.MomentInput, separator = ' '): string {
  const start: moment.Moment = moment(time);
  return start.format(`dddd DD. MMMM YYYY${separator}[klokken] HH:mm`);
}

export function mediumDateNumbers(time: moment.MomentInput): string {
  const start: moment.Moment = moment(time);
  return start.format('DD.MM.YYYY HH:mm');
}

export function shortDate(time: moment.MomentInput): string {
  const start: moment.Moment = moment(time);
  return start.format('DD. MMM YYYY');
}

export function shortDateFullMonth(time: moment.MomentInput): string {
  const start: moment.Moment = moment(time);
  return start.format('D. MMMM YYYY');
}

export function shortDateNb(time: moment.MomentInput): string {
  const start: moment.Moment = moment(time);
  return start.format('D. MMM YYYY');
}

export function shortDateNumbers(time: moment.MomentInput): string {
  const start: moment.Moment = moment(time);
  return start.format('DD.MM.YYYY');
}

export function timeOfDay(time: moment.MomentInput, prefix = ''): string {
  let value = '';
  const start: moment.Moment = moment(time);
  const startOfDay: moment.Moment = moment(time).startOf('day');
  if (!start.isSame(startOfDay)) {
    value = prefix + start.format('LT');
  }
  return value;
}

export function monthYear(time: moment.MomentInput): string {
  const start: moment.Moment = moment(time);
  return StringHelper.capitalize(start.format('MMMM YYYY'));
}

export function shortMonthYear(time: moment.MomentInput): string {
  const start: moment.Moment = moment(time);
  return StringHelper.capitalize(start.format('MMM YYYY').replace('.', ''));
}

export function monthRange(first: moment.MomentInput, last: moment.MomentInput): string {
  let range: string;
  const start: moment.Moment = moment(first);
  const end: moment.Moment = moment(last);

  if (start.isSame(end, 'month')) {
    range = StringHelper.capitalize(start.format('MMMM YYYY'));
  } else {
    range =
      StringHelper.capitalize(start.format('MMMM YYYY')) +
      String.fromCharCode(160) +
      String.fromCharCode(8211) +
      String.fromCharCode(160) +
      StringHelper.capitalize(end.format('MMMM YYYY'));
  }
  return range;
}

export function timeRangeBetween(first: moment.MomentInput, last: moment.MomentInput): string {
  let range: string;
  const start: moment.Moment = moment(first);
  const end: moment.Moment = moment(last);

  if (start.isSame(end)) {
    range = start.format('lll');
  } else {
    range = start.format('ll') + ', mellom kl. ' + start.format('LT') + ' og ' + end.format('LT');
  }
  return range;
}

export function timeRange(first: moment.MomentInput, last: moment.MomentInput): string {
  let range: string;
  const start: moment.Moment = moment(first);
  const end: moment.Moment = moment(last);

  if (start.isSame(end)) {
    range = start.format('lll');
  } else {
    range = start.format('lll') + ' - ' + end.format('LT');
  }
  return range;
}

export function longTimeRange(startInput: moment.MomentInput, endInput?: moment.MomentInput): string {
  const start: moment.Moment = moment(startInput);
  const end: moment.Moment = moment(endInput);
  let range = start.format('dddd D. MMMM YYYY, [kl.] HH:mm');

  if (endInput) {
    range = range + ' - ' + end.format('LT');
  }

  return StringHelper.capitalize(range);
}

/************************************************************/
/*********************** MOMENT UTILS ***********************/
/************************************************************/
/**
 * Returnerer true hvis datoene er på samme dag
 * @param a Moment date som skal sammenlignes
 * @param b Moment date som skal sammenlignes
 */
export const isSameDay = (a: Moment, b: Moment): boolean => {
  if (!moment.isMoment(a) || !moment.isMoment(b)) return false;
  // Compare least significant, most likely to change units first
  // Moment's isSame clones moment inputs and is a tad slow
  return a.date() === b.date() && a.month() === b.month() && a.year() === b.year();
};

/**
 * Returnerer true hvis dato a er før dato b
 * @param a Moment date som skal sammenlignes
 * @param b Moment date som skal sammenlignes
 */
export const isBeforeDay = (a: Moment, b: Moment): boolean => {
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
 * @param a Moment date som skal sammenlignes
 * @param b Moment date som skal sammenlignes
 */
export const isAfterDay = (a: Moment, b: Moment): boolean => {
  if (!moment.isMoment(a) || !moment.isMoment(b)) return false;
  return !isBeforeDay(a, b) && !isSameDay(a, b);
};

/**
 * Returnerer true hvis dato a er på samme dag eller før dato b
 * @param a Moment date som skal sammenlignes
 * @param b Moment date som skal sammenlignes
 */
export const isInclusivelyBeforeDay = (a: Moment, b: Moment): boolean => {
  if (!moment.isMoment(a) || !moment.isMoment(b)) return false;
  return !isAfterDay(a, b);
};

/**
 * Returnerer true hvis dato a er på samme dag eller etter dato b
 * @param a Moment date som skal sammenlignes
 * @param b Moment date som skal sammenlignes
 */
export const isInclusivelyAfterDay = (a: Moment, b: Moment): boolean => {
  if (!moment.isMoment(a) || !moment.isMoment(b)) return false;
  return !isBeforeDay(a, b);
};

/**
 * Returnerer true hvis input er etter dagens dato
 * @param time MomentInput som skal sammenlignes
 */
export function isAfterToday(time: moment.MomentInput): boolean {
  return moment(time).diff(new Date(), 'days') > 0;
}

/**
 * Returnerer true hvis input er etter nåtid
 * @param time MomentInput som skal sammenlignes
 */
export function isAfter(time: moment.MomentInput): boolean {
  const now: moment.Moment = moment();
  return moment(time).isAfter(now);
}

/**
 * Returnerer true hvis input er før nåtid
 * @param time MomentInput som skal sammenlignes
 */
export function isBefore(time: moment.MomentInput): boolean {
  const now: moment.Moment = moment();
  return moment(time).isBefore(now);
}

export function numberOfWeeksInMonth(first: moment.Moment, last: moment.Moment): number {
  const firstWeek = first.week();
  const lastWeek = last.week();
  if (firstWeek >= 52) {
    return lastWeek;
  } else if (lastWeek < firstWeek) {
    return 53 - firstWeek;
  }
  return lastWeek - firstWeek;
}

export function toDateTime(dateTime: moment.Moment, format: string) {
  const dt: moment.Moment = moment(dateTime, format);
  return dt;
}

/**
 * Returnerer true hvis input er lik 0001-01-01T00:00:00
 * @param dato eller ISO-string som skal sammenlignes
 */
export const isDotNetMinDate = (date: ISO8601 | Date): boolean => {
  const input = moment(date);
  // Setup a minDate to mimic .Net Date.MinDate constant.
  const minDate = moment('0001-01-01T00:00:00');
  return input.isSame(minDate);
};

export const toLocalISOStringUsingDateTimezoneOffset = (date: Date): string => {
  const isoDate = moment(date)
    .add('minutes', moment(date).utcOffset())
    .toISOString();
  return isoDate.substring(0, isoDate.lastIndexOf('.'));
};

export const isToday = (time: ISO8601 | Date): boolean => {
  return moment(time).isSame(new Date(), 'day');
};

export const isBeforeToday = (time: ISO8601 | Date): boolean => {
  return moment(time).diff(new Date(), 'days') < 0;
};

export const isEarlierToday = (time: ISO8601 | Date): boolean => {
  return isToday(time) && isBefore(time);
};

export default {
  initialize,
  longDate,
  mediumDate,
  shortDateNumbers,
  mediumDateNumbersClock,
  mediumDateNumbers,
  shortDate,
  shortDateNb,
  timeOfDay,
  monthYear,
  shortMonthYear,
  monthRange,
  timeRange,
  longTimeRange,
  isToday,
  isBeforeToday,
  isEarlierToday,
  isAfterToday,
  isAfter,
  isBefore,
  numberOfWeeksInMonth,
  isDotNetMinDate,
  toLocalISOStringUsingDateTimezoneOffset,
};
