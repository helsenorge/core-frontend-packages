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

type ISO8601 = string;

/**
 * Returnerer dagens dato i yyyy--mm-dd format
 */
export const todaysDate = (): string => {
  const today = new Date();
  const dd = String(today.getDate());
  const mm = String(today.getMonth() + 1);
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
 * Returnerer tidsonen avhengig av offset til UTC
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

/**
 * Returnerer dato til ISO format
 * @param date i Javascript Date format
 */
export const toLocalISOString = (date: Date): string => {
  const adjusted = new Date(date).getTime() - serverTimezoneOffset();
  const isoDate = new Date(adjusted).toISOString();
  return isoDate.substring(0, isoDate.lastIndexOf('.'));
};

/**
 * Returnerer dato i ISO format med riktig tillegg
 * @param target i ISO format
 * @param originalStart i ISO format
 * @param originalStop i ISO format
 */
export const addDifference = (target: ISO8601, originalStart: ISO8601, originalStop: ISO8601): ISO8601 => {
  const diff = new Date(originalStop).getTime() - new Date(originalStart).getTime();
  const end = new Date(addServerTimezone(target)).getTime() + diff;
  const theEnd = new Date(end);
  return toLocalISOString(theEnd);
};

/**
 * Returnerer måned i en string
 * @param monthNumber tall til ønsket måned (array start med 0)
 * @param resources objeckt med strenger { monthNameJanuary: '', monthNameFebruary: '', ...}
 */
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

/**
 * Returnerer måned i en string
 * @param date dato i Javascript Date format
 * @param resources objeckt med strenger { monthNameJanuary: '', monthNameFebruary: '', ...}
 */
export const getMonthName = (date: Date, resources: ResourcesWithMonthNames): string => {
  const month: number = date.getMonth();
  return getMonthNameFromMonthNumber(month, resources);
};

/**
 * Returnerer dato med måned i en string (eks.: 13. april 2020)
 * @param dateString dato i string format
 * @param resources objeckt med strenger { monthNameJanuary: '', monthNameFebruary: '', ...}
 */
export const getFormattedDateString = (dateString: string, resources: ResourcesWithMonthNames): string | null => {
  if (dateString === null || dateString === undefined || dateString === '') {
    return null;
  }
  const date: Date = new Date(dateString);
  const monthName = getMonthName(date, resources);

  return date.getDate() + '. ' + monthName + ' ' + date.getFullYear();
};

const padStr = (index: number): string => {
  return index < 10 ? `0${index}` : `${index}`;
};

/**
 * Returnerer full dato string (eks.: 13. april 2020)
 * @param dateString dato i Javascript Dato format, string eller ISO
 * @param resources objeckt med strenger { monthNameJanuary: '', monthNameFebruary: '', ...}
 */
export const dateToString = (date: Date | string | ISO8601, resources: ResourcesWithMonthNames): string => {
  const dateObject = toDate(date);
  const month: number = dateObject.getMonth();
  const monthName: string = getMonthNameFromMonthNumber(month, resources);
  return `${padStr(dateObject.getDate())}. ${monthName} ${dateObject.getFullYear()}`;
};

/**
 * Returnerer full time string (00:00)
 * @param date dato i Javascript Dato format
 */
export const timeToString = (date: Date): string => {
  return `${padStr(date.getHours())}:${padStr(date.getMinutes())}`;
};

//////////////// To-DO: MANGLENEDE TESTER ETTER DET PUNKTET

/**
 * Returnerer true hvis datoen er før i dag
 * @param time ISO eller JS date
 */
export const beforeToday = (time: ISO8601 | Date): boolean => {
  const input = toDate(time);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return input.getTime() < today.getTime();
};

/**
 * Returnerer true hvis datoen er før nå
 * @param time ISO eller JS date
 */
export const beforeNow = (time: ISO8601 | Date): boolean => {
  const input = toServerDate(time);
  const today = new Date();
  return input.getTime() < today.getTime();
};

/**
 * Returnerer true hvis datoen er etter i dag
 * @param time ISO eller JS date
 */
export const afterToday = (time: ISO8601 | Date): boolean => {
  const input = toDate(time);
  const today = new Date();
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  tomorrow.setHours(0, 0, 0, 0);
  return input.getTime() > tomorrow.getTime();
};

/**
 * Returnerer true hvis datoen er i dag
 * @param time ISO eller JS date
 */
export const isToday = (time: ISO8601 | Date): boolean => {
  const input = toDate(time);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compare = input;
  compare.setHours(0, 0, 0, 0);
  return compare.getTime() === today.getTime();
};

/**
 * Returnerer true hvis datoen er tidligere i dag
 * @param time ISO eller JS date
 */
export const earlierToday = (time: ISO8601 | Date): boolean => {
  return isToday(time) && beforeNow(time);
};

/**
 * Returnerer true hvis dato a er før dato b
 * @param a ISO eller JS date date som skal sammenlignes
 * @param b ISO eller JS date date som skal sammenlignes
 */
export const isBefore = (a: ISO8601 | Date, b: ISO8601 | Date): boolean => {
  const earlier = toDate(a);
  const later = toDate(b);
  return earlier.getTime() < later.getTime();
};
