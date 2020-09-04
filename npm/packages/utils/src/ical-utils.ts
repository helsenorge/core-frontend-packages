/* eslint-disable-next-line  @typescript-eslint/no-var-requires */
const ICAL = require('ical.js');

export interface Duration {
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

/**
 * Returnerer en ICAL duration string basert på antall timer og minutter
 * @param hours antall timer
 * @param hours antall minuter
 */
export const formatDuration = (hours: number, minutes: number): string => {
  return `P${hours > 0 ? `${hours}H` : '0'}${minutes > 0 ? `${minutes}M` : '0M'}`;
};

/**
 * Returnerer en ICAL duration string basert på antall timer og  minutter - med rundet timer og minutter
 * @param hours antall timer
 * @param hours antall minuter
 */
export const toDuration = (hrs: number, min: number): string => {
  const hours = hrs + Math.floor(min / 60);
  const minutes = min % 60;
  return formatDuration(hours, minutes);
};

/**
 * Returnerer en ICAL duration object med rundet timer og minutter
 * @param duration ICAL duration object { weeks: 0; days: number; hours: number; minutes: number; seconds: number; isNegative: boolean;}
 */
export const arrangeDuration = (duration: Duration): Duration => {
  return {
    weeks: duration.weeks,
    days: duration.days,
    hours: duration.hours + Math.floor(duration.minutes / 60),
    minutes: duration.minutes % 60,
    seconds: duration.seconds,
    isNegative: duration.isNegative,
  };
};

/**
 * Returnerer en konkatenert string basert på en ICAL duration string og tekster
 * @param aStr ICAL duration string
 * @param resources tekster { dateHrs: string; dateMin: string; dateHour: string; dateHours: string; }
 */
export const duration = (aStr: string, resources: Resources): string | void => {
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
};

/**
 * Returnerer summen at to ICAL duration strings
 * @param dur1 ICAL duration string
 * @param dur2 ICAL duration string
 */
export const combineDurations = (dur1: string, dur2: string): string => {
  const duration1: Duration = ICAL.Duration.fromString(dur1);
  const duration2: Duration = ICAL.Duration.fromString(dur2);
  const combinedHours = duration1.hours + duration2.hours;
  const combinedMinutes = duration1.minutes + duration2.minutes;
  return toDuration(combinedHours, combinedMinutes);
};
