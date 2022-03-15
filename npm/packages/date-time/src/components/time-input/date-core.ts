import moment from 'moment';

import { getHoursFromTimeString, getMinutesFromTimeString } from '@helsenorge/core-utils/date-utils';

import { TIME_SEPARATOR } from '../../constants/datetime';

export function parseDate(dateString: string): Date {
  return new Date(dateString);
}

export function buildNewDate(date: Date | undefined, timeString: string | undefined): Date | undefined {
  const hours = getHoursFromTimeString(timeString, TIME_SEPARATOR);
  const minutes = getMinutesFromTimeString(timeString, TIME_SEPARATOR);
  if (!hours || !minutes || !date) {
    return;
  }
  try {
    const momentDate = moment(date).hours(parseInt(hours, 10)).minutes(parseInt(minutes, 10));
    return momentDate.toDate();
  } catch (e) {
    return undefined;
  }
}
