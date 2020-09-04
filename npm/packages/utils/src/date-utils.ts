import moment, { Moment } from 'moment';

/*
 * Get formatted date string
 * 1: date string
 * 2: resources containing month names
 */

type ISO8601 = string;

export interface ResourcesWithMonthNames {
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

/**
 * Returnerer dagens dato i yyyy--mm-dd format (minus 1 for month (array format))
 */
export const todaysDate = (): string => {
  const today = new Date();
  const dd = String(today.getDate());
  const mm = String(today.getMonth());
  const yyyy = today.getFullYear();
  return yyyy + '-' + mm + '-' + dd;
};

/**
 * Returnerer dato i Javascript Date format
 * @param date i Javascript Date format eller ISO8601
 */
export const toDate = (date: Date | ISO8601): Date => {
  let dateObject: Date;
  if (date instanceof Date) {
    dateObject = new Date(date.getTime());
  } else {
    dateObject = new Date(date);
  }
  return dateObject;
};

/**
 * Returnerer max offset mellom januar og juli
 * @param today dagens dato i Javascript Date format
 */
export const standardTimezoneOffset = (today: Date): number => {
  const jan = new Date(today.getFullYear(), 0, 1);
  const jul = new Date(today.getFullYear(), 6, 1);
  return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
};

/**
 * Returnerer om dagen i dag er i daglyssparingsperiode
 * @param today dagens dato i Javascript Date format
 */
export const isDaylightSavingTime = (today: Date): boolean => {
  return today.getTimezoneOffset() < standardTimezoneOffset(today);
};

/**
 * Returnerer '+02:00' eller '+01:00' avhengig av avstanden med UTC tid
 */
export const serverOffsetFromUTC = (): string => {
  const now = new Date();
  return isDaylightSavingTime(now) ? '+02:00' : '+01:00';
};

/**
 * Returnerer number avhengig av avstanden med UTC tid
 * @param date  dato i Javascript Date format - default er new Date
 */
export const serverTimezoneOffset = (date = new Date()): number => {
  return isDaylightSavingTime(date) ? -120 * 60000 : -60 * 60000;
};

/**
 * Returnerer tidsonenavhengig av offset til UTC
 * @param local dagens dato i ISO8601 format
 */
export const addServerTimezone = (local: ISO8601): string => {
  if ((local as string).indexOf('+') !== -1 && (local as string).indexOf('+') !== -1) {
    return local;
  }
  return local + serverOffsetFromUTC();
};

/**
 * Returnerer riktig dato for serveren i Javascript Date format
 * @param date i Javascript Date format eller ISO8601
 */
export const toServerDate = (date: Date | ISO8601): Date => {
  let dateObject: Date;
  if (date instanceof Date) {
    dateObject = new Date(date.getTime());
  } else {
    dateObject = new Date(addServerTimezone(date));
  }
  return dateObject;
};

export const toLocalISOString = (date: Date): string => {
  const adjusted = new Date(date).getTime() - serverTimezoneOffset();
  const isoDate = new Date(adjusted).toISOString();
  return isoDate.substring(0, isoDate.lastIndexOf('.'));
};

export function addDifference(target: ISO8601, originalStart: ISO8601, originalStop: ISO8601): ISO8601 {
  const diff = new Date(originalStop).getTime() - new Date(originalStart).getTime();
  const end = new Date(addServerTimezone(target)).getTime() + diff;
  const theEnd = new Date(end);
  return toLocalISOString(theEnd);
}

export const toLocalISOStringUsingDateTimezoneOffset = (date: Date): string => {
  const adjusted = new Date(date).getTime() - serverTimezoneOffset(date);
  const isoDate = new Date(adjusted).toISOString();
  return isoDate.substring(0, isoDate.lastIndexOf('.'));
};

export const getMonthNameFromMonthNumber = (monthNumber: number, resources: ResourcesWithMonthNames): string => {
  let monthName: string | undefined;
  switch (monthNumber) {
    case 0:
      monthName = resources.monthNameJanuary;
      break;
    case 1:
      monthName = resources.monthNameFebruary;
      break;
    case 2:
      monthName = resources.monthNameMarch;
      break;
    case 3:
      monthName = resources.monthNameApril;
      break;
    case 4:
      monthName = resources.monthNameMay;
      break;
    case 5:
      monthName = resources.monthNameJune;
      break;
    case 6:
      monthName = resources.monthNameJuly;
      break;
    case 7:
      monthName = resources.monthNameAugust;
      break;
    case 8:
      monthName = resources.monthNameSeptember;
      break;
    case 9:
      monthName = resources.monthNameOctober;
      break;
    case 10:
      monthName = resources.monthNameNovember;
      break;
    case 11:
      monthName = resources.monthNameDecember;
      break;
    default:
      monthName = '';
  }
  return monthName ? monthName.toLowerCase() : '';
};

export const getMonthName = (date: Date, resources: ResourcesWithMonthNames): string => {
  const month: number = date.getMonth();
  return getMonthNameFromMonthNumber(month, resources);
};

export const getFormattedDateString = (dateString: string, resources: ResourcesWithMonthNames): string | null => {
  if (dateString === null || dateString === undefined || dateString === '') {
    return null;
  }
  const date: Date = new Date(dateString);
  const monthName = getMonthName(date, resources);

  return date.getDate() + '. ' + monthName + ' ' + date.getFullYear();
};

export const padStr = (index: number): string => {
  return index < 10 ? `0${index}` : `${index}`;
};

export const dateToString = (date: Date | string | ISO8601, resources: ResourcesWithMonthNames): string => {
  const dateObject = toDate(date);
  const month: number = dateObject.getMonth();
  const monthName: string = getMonthNameFromMonthNumber(month, resources);
  return `${padStr(dateObject.getDate())}. ${monthName} ${dateObject.getFullYear()}`;
};

export const timeToString = (date: Date): string => {
  return `${padStr(date.getHours())}:${padStr(date.getMinutes())}`;
};

export const beforeToday = (time: ISO8601 | Date): boolean => {
  const input = toDate(time);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return input.getTime() < today.getTime();
};

export const beforeNow = (time: ISO8601 | Date): boolean => {
  const input = toServerDate(time);
  const today = new Date();
  return input.getTime() < today.getTime();
};

export const afterToday = (time: ISO8601 | Date): boolean => {
  const input = toDate(time);
  const today = new Date();
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  tomorrow.setHours(0, 0, 0, 0);
  return input.getTime() > tomorrow.getTime();
};

export const isToday = (time: ISO8601 | Date): boolean => {
  const input = toDate(time);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compare = input;
  compare.setHours(0, 0, 0, 0);
  return compare.getTime() === today.getTime();
};

export const earlierToday = (time: ISO8601 | Date): boolean => {
  return isToday(time) && beforeNow(time);
};

export const isBefore = (a: ISO8601 | Date, b: ISO8601 | Date): boolean => {
  const earlier = toDate(a);
  const later = toDate(b);
  return earlier.getTime() < later.getTime();
};

export const isDotNetMinDate = (date: ISO8601 | Date): boolean => {
  // Setup a minDate to mimic .Net Date.MinDate constant.
  const minDate = toDate('0001-01-01T00:00:00');
  const input = toDate(date);
  return minDate.getTime() === input.getTime();
};

/************************************************************/
/*********************** MOMENT UTILS ***********************/
/************************************************************/
export const isSameDay = (a: Moment, b: Moment): boolean => {
  if (!moment.isMoment(a) || !moment.isMoment(b)) return false;
  // Compare least significant, most likely to change units first
  // Moment's isSame clones moment inputs and is a tad slow
  return a.date() === b.date() && a.month() === b.month() && a.year() === b.year();
};

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

export const isAfterDay = (a: Moment, b: Moment): boolean => {
  if (!moment.isMoment(a) || !moment.isMoment(b)) return false;
  return !isBeforeDay(a, b) && !isSameDay(a, b);
};

export const isInclusivelyAfterDay = (a: Moment, b: Moment): boolean => {
  if (!moment.isMoment(a) || !moment.isMoment(b)) return false;
  return !isBeforeDay(a, b);
};
export const isInclusivelyBeforeDay = (a: Moment, b: Moment): boolean => {
  if (!moment.isMoment(a) || !moment.isMoment(b)) return false;
  return !isAfterDay(a, b);
};
