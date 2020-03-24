/* eslint-disable  @typescript-eslint/no-var-requires */
const ICAL = require('ical.js');
/* eslint-enable  @typescript-eslint/no-var-requires */

interface Duration {
  weeks: 0;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isNegative: boolean;
}

export interface Resources {
  dateHrs: string;
  dateMin: string;
  dateHour: string;
  dateHours: string;
}

export function formatDuration(hours: number, minutes: number) {
  return `P${hours > 0 ? `${hours}H` : '0'}${minutes > 0 ? `${minutes}M` : '0M'}`;
}

export function toDuration(hrs: number, min: number) {
  const hours = hrs + Math.floor(min / 60);
  const minutes = min % 60;
  return formatDuration(hours, minutes);
}

export function arrangeDuration(duration: Duration): Duration {
  return {
    weeks: duration.weeks,
    days: duration.days,
    hours: duration.hours + Math.floor(duration.minutes / 60),
    minutes: duration.minutes % 60,
    seconds: duration.seconds,
    isNegative: duration.isNegative,
  };
}

export function duration(aStr: string, resources: Resources) {
  if (aStr && resources) {
    const duration: Duration = arrangeDuration(ICAL.Duration.fromString(aStr));
    if (duration.hours && duration.minutes) {
      return `${duration.hours} ${resources.dateHrs} ${duration.minutes} ${resources.dateMin}`;
    } else if (duration.hours) {
      if (duration.hours === 1) {
        return `${duration.hours} ${resources.dateHour}`;
      }
      return `${duration.hours} ${resources.dateHours}`;
    } else if (duration.minutes) {
      return `${duration.minutes} ${resources.dateMin}`;
    }
  }
}

export function combineDurations(dur1: string, dur2: string) {
  const duration1: Duration = ICAL.Duration.fromString(dur1);
  const duration2: Duration = ICAL.Duration.fromString(dur2);
  const combinedHours = duration1.hours + duration2.hours;
  const combinedMinutes = duration1.minutes + duration2.minutes;
  return toDuration(combinedHours, combinedMinutes);
}
