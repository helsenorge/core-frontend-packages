/*
 * Get formatted date string
 * 1: date string
 * 2: resources containing month names
 */

type ISO8601 = string;

interface ResourcesWithMonthNames {
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

export function todaysDate(): string {
  const today = new Date();

  const dd = String(today.getDate());
  const mm = String(today.getMonth());
  const yyyy = today.getFullYear();
  return yyyy + '-' + mm + '-' + dd;
}

export function toDate(date: Date | ISO8601): Date {
  let dateObject: Date;
  if (date instanceof Date) {
    dateObject = new Date(date.getTime());
  } else {
    dateObject = new Date(date);
  }
  return dateObject;
}

export function toServerDate(date: Date | ISO8601): Date {
  let dateObject: Date;
  if (date instanceof Date) {
    dateObject = new Date(date.getTime());
  } else {
    dateObject = new Date(addServerTimezone(date));
  }
  return dateObject;
}

function standardTimezoneOffset(today: Date) {
  const jan = new Date(today.getFullYear(), 0, 1);
  const jul = new Date(today.getFullYear(), 6, 1);
  return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
}

export function isDaylightSavingTime(today: Date) {
  return today.getTimezoneOffset() < standardTimezoneOffset(today);
}

function serverOffsetFromUTC() {
  const now = new Date();
  return isDaylightSavingTime(now) ? '+02:00' : '+01:00';
}

function serverTimezoneOffset(date = new Date()) {
  return isDaylightSavingTime(date) ? -120 * 60000 : -60 * 60000;
}

export function addServerTimezone(local: ISO8601) {
  if ((local as string).indexOf('+') !== -1 && (local as string).indexOf('+') !== -1) {
    return local;
  }
  return local + serverOffsetFromUTC();
}

export function addDifference(target: ISO8601, originalStart: ISO8601, originalStop: ISO8601): ISO8601 {
  const diff = new Date(originalStop).getTime() - new Date(originalStart).getTime();
  const end = new Date(addServerTimezone(target)).getTime() + diff;
  const theEnd = new Date(end);
  return toLocalISOString(theEnd);
}

export function toLocalISOString(date: Date) {
  const adjusted = new Date(date).getTime() - serverTimezoneOffset();
  const isoDate = new Date(adjusted).toISOString();
  return isoDate.substring(0, isoDate.lastIndexOf('.'));
}

export function toLocalISOStringUsingDateTimezoneOffset(date: Date) {
  const adjusted = new Date(date).getTime() - serverTimezoneOffset(date);
  const isoDate = new Date(adjusted).toISOString();
  return isoDate.substring(0, isoDate.lastIndexOf('.'));
}

export function getFormattedDateString(dateString: string, resources: ResourcesWithMonthNames): string | null {
  if (dateString === null || dateString === undefined || dateString === '') {
    return null;
  }
  const date: Date = new Date(dateString);
  const monthName = getMonthName(date, resources);

  return date.getDate() + '. ' + monthName + ' ' + date.getFullYear();
}

export function getMonthName(date: Date, resources: ResourcesWithMonthNames): string | null {
  const month: number = date.getMonth();

  let monthName: string | undefined;
  switch (month) {
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

  return monthName ? monthName.toLowerCase() : null;
}

export function dateToString(date: Date | string | ISO8601, resources: ResourcesWithMonthNames): string {
  const dateObject = toDate(date);
  const month: number = dateObject.getMonth();

  let monthName: string;
  switch (month) {
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
  monthName = monthName.toLowerCase();

  return `${padStr(dateObject.getDate())}. ${monthName} ${dateObject.getFullYear()}`;

  /* return padStr(date.getDate()) + '. '
   * + padStr(1 + date.getMonth()) + '.' + date.getFullYear();
   */
}

export function timeToString(date: Date): string {
  return `${padStr(date.getHours())}:${padStr(date.getMinutes())}`;
}

function padStr(index: number): string {
  return index < 10 ? `0${index}` : `${index}`;
}

export function beforeToday(time: ISO8601 | Date) {
  const input = toDate(time);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return input.getTime() < today.getTime();
}

export function beforeNow(time: ISO8601 | Date) {
  const input = toServerDate(time);
  const today = new Date();
  return input.getTime() < today.getTime();
}

export function afterToday(time: ISO8601 | Date) {
  const input = toDate(time);
  const today = new Date();
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  tomorrow.setHours(0, 0, 0, 0);
  return input.getTime() > tomorrow.getTime();
}

export function isToday(time: ISO8601 | Date) {
  const input = toDate(time);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compare = input;
  compare.setHours(0, 0, 0, 0);
  return compare.getTime() === today.getTime();
}

export function earlierToday(time: ISO8601 | Date) {
  return isToday(time) && beforeNow(time);
}

export function isBefore(a: ISO8601 | Date, b: ISO8601 | Date) {
  const earlier = toDate(a);
  const later = toDate(b);
  return earlier.getTime() < later.getTime();
}

export function isDotNetMinDate(date: ISO8601 | Date) {
  // Setup a minDate to mimic .Net Date.MinDate constant.
  const minDate = toDate('0001-01-01T00:00:00');
  const input = toDate(date);
  return minDate.getTime() === input.getTime();
}
