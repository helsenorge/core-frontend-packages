import moment from "moment";
import StringHelper from "./string-utils";

export function initialize(): void {
  moment.locale("nb");
  const language: moment.LocaleSpecification = {
    monthsShort: "jan._feb._mars_april_mai_juni_juli_aug._sep._okt._nov._des.".split(
      "_"
    ),
    longDateFormat: {
      LT: "HH:mm",
      LTS: "HH:mm:ss",
      L: "DD.MM.YYYY",
      LL: "D. MMMM YYYY",
      LLL: "D. MMMM YYYY, [kl.] HH:mm",
      LLLL: "dddd D. MMMM YYYY, [kl.] HH:mm"
    }
  };
  moment.updateLocale("nb", language);
}

export function toDate(time: moment.MomentInput): Date {
  const start: moment.Moment = moment(time);
  return start.toDate();
}

export function longDate(time: moment.MomentInput): string {
  const start: moment.Moment = moment(time);
  const startOfDay: moment.Moment = moment(time).startOf("day");
  return start.isSame(startOfDay) ? start.format("ll") : start.format("lll");
}

export function mediumDate(time: moment.MomentInput): string {
  const start: moment.Moment = moment(time);
  return start.format("DD. MMM YYYY HH:mm");
}

export function mediumDateNumbersClock(
  time: moment.MomentInput,
  separator = " "
): string {
  const start: moment.Moment = moment(time);
  return start.format(`DD.MM.YYYY${separator}[kl.] HH:mm`);
}
export function longDateNumbersClock(
  time: moment.MomentInput,
  separator = " "
): string {
  const start: moment.Moment = moment(time);
  return start.format(`dddd DD. MMMM YYYY${separator}[klokken] HH:mm`);
}

export function mediumDateNumbers(time: moment.MomentInput): string {
  const start: moment.Moment = moment(time);
  return start.format("DD.MM.YYYY HH:mm");
}

export function shortDate(time: moment.MomentInput): string {
  const start: moment.Moment = moment(time);
  return start.format("DD. MMM YYYY");
}

export function shortDateFullMonth(time: moment.MomentInput): string {
  const start: moment.Moment = moment(time);
  return start.format("D. MMMM YYYY");
}

export function shortDateNb(time: moment.MomentInput): string {
  const start: moment.Moment = moment(time);
  return start.format("D. MMM YYYY");
}

export function shortDateNumbers(time: moment.MomentInput): string {
  const start: moment.Moment = moment(time);
  return start.format("DD.MM.YYYY");
}

export function timeOfDay(time: moment.MomentInput, prefix = ""): string {
  let value = "";
  const start: moment.Moment = moment(time);
  const startOfDay: moment.Moment = moment(time).startOf("day");
  if (!start.isSame(startOfDay)) {
    value = prefix + start.format("LT");
  }
  return value;
}

export function monthYear(time: moment.MomentInput): string {
  const start: moment.Moment = moment(time);
  return StringHelper.capitalize(start.format("MMMM YYYY"));
}

export function shortMonthYear(time: moment.MomentInput): string {
  const start: moment.Moment = moment(time);
  return StringHelper.capitalize(start.format("MMM YYYY").replace(".", ""));
}

export function monthRange(
  first: moment.MomentInput,
  last: moment.MomentInput
): string {
  let range: string;
  const start: moment.Moment = moment(first);
  const end: moment.Moment = moment(last);

  if (start.isSame(end, "month")) {
    range = StringHelper.capitalize(start.format("MMMM YYYY"));
  } else {
    range =
      StringHelper.capitalize(start.format("MMMM YYYY")) +
      String.fromCharCode(160) +
      String.fromCharCode(8211) +
      String.fromCharCode(160) +
      StringHelper.capitalize(end.format("MMMM YYYY"));
  }
  return range;
}

export function timeRangeBetween(
  first: moment.MomentInput,
  last: moment.MomentInput
): string {
  let range: string;
  const start: moment.Moment = moment(first);
  const end: moment.Moment = moment(last);

  if (start.isSame(end)) {
    range = start.format("lll");
  } else {
    range =
      start.format("ll") +
      ", mellom kl. " +
      start.format("LT") +
      " og " +
      end.format("LT");
  }
  return range;
}

export function timeRange(
  first: moment.MomentInput,
  last: moment.MomentInput
): string {
  let range: string;
  const start: moment.Moment = moment(first);
  const end: moment.Moment = moment(last);

  if (start.isSame(end)) {
    range = start.format("lll");
  } else {
    range = start.format("lll") + " - " + end.format("LT");
  }
  return range;
}

export function longTimeRange(
  startInput: moment.MomentInput,
  endInput?: moment.MomentInput
): string {
  const start: moment.Moment = moment(startInput);
  const end: moment.Moment = moment(endInput);
  let range = start.format("dddd D. MMMM YYYY, [kl.] HH:mm");

  if (endInput) {
    range = range + " - " + end.format("LT");
  }

  return StringHelper.capitalize(range);
}

export function isAfterToday(time: moment.MomentInput): boolean {
  const now: moment.Moment = moment();
  return moment(time).isAfter(now);
}

export function numberOfWeeksInMonth(
  first: moment.Moment,
  last: moment.Moment
): number {
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
  isAfterToday,
  numberOfWeeksInMonth
};
