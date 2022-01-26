import moment from 'moment';
import {
  ERROR_INVALID_TIME,
  ERROR_REQUIRED_DATE,
  ERROR_REQUIRED_TIME,
  ERROR_TIME_BEFORE_MIN,
  ERROR_TIME_AFTER_MAX,
} from '../../../constants/datetime';

import { isAfterMaxDate, isBeforeMinDate } from '@helsenorge/core-utils/moment-utils';
import { DateRangePicker } from '../date-range-picker';
import { DateTimePickerResources } from './date-time-picker-types';
import TimeInput from '../time-input';

/**
 * Setter klokkeslett på en dato og returnerer en moment date
 * @param date - moment dato
 * @param timeString - streng i format HH:mm
 */
export const getFullMomentDate = (date: moment.Moment | undefined, timeString: string | undefined): moment.Moment | undefined => {
  if (!date) return;
  const time = timeString ? moment(timeString, 'HH:mm') : undefined;
  const hour = time ? time.hours() : 0;
  const minute = time ? time.minutes() : 0;

  const newDate = moment(date)
    .set({
      hour,
      minute,
      second: 0,
    })
    .toDate();
  return moment(newDate);
};

/**
 * Setter klokkeslett på en dato og sjekker den mot min max og required
 * @param date - moment dato
 * @param timeString - streng i format HH:mm
 * @param isRequired - om dato og tid er påkrevde felter
 * @param minimumDateTime - minimum dato den skal sjekkes mot
 * @param maximumDateTime - maximum dato den skal sjekkes mot
 * @param isOtherFieldChecked - om nabofeltet er validert ok
 */
export const isFullDateTimeValid = (
  date: moment.Moment | undefined,
  timeString: string | undefined,
  isRequired: boolean | undefined,
  minimumDateTime: moment.Moment | undefined,
  maximumDateTime: moment.Moment | undefined,
  isOtherFieldChecked: boolean
): boolean => {
  let isValid = isOtherFieldChecked;
  const currentDate = getFullMomentDate(date, timeString);

  if (isRequired) {
    isValid = !!date && date.isValid() && !!timeString && moment(timeString, 'HH:mm').isValid();
  }

  if (isValid && currentDate) {
    if (isAfterMaxDate(currentDate, maximumDateTime)) isValid = false;
    if (isBeforeMinDate(currentDate, minimumDateTime)) isValid = false;
  }

  return isValid;
};

export interface GetErrorString {
  date?: moment.Moment;
  timeString?: string;
  valid: boolean;
  resources?: DateTimePickerResources;
  minimumDateTime?: moment.Moment;
  maximumDateTime?: moment.Moment;
  isRequired?: boolean;
  isDateRequired?: boolean;
  isTimeRequired?: boolean;
  errorMessage?: string | ((date: moment.Moment | undefined, time: string | undefined) => string);
  dateFieldInstance?: DateRangePicker | null;
  timeFieldInstance?: TimeInput | null;
}
/**
 * Returnerer riktig errorString avhengig av diverse sjekk
 * @param date - moment dato
 * @param timeString - streng i format HH:mm
 * @param valid - om feltet har state valid før sjekken
 * @param resources - tekst resursser for å vise feilmeldinger
 * @param minimumDateTime - minimum dato den skal sjekkes mot
 * @param maximumDateTime - maximum dato den skal sjekkes mot
 * @param isRequired - om dato og tid er påkrevde felter
 * @param isDateRequired - om dato er påkrevde felter
 * @param isTimeRequired - om tid er påkrevde felter
 * @param errorMessage - errorMessage string eller method som brukes istedenfor andre sjekk
 * @param dateFieldInstance - instance av child feltet DateRangePicker
 * @param timeFieldInstance - instance av child feltet TimeInput
 */
export const getErrorString = (params: GetErrorString): string | undefined => {
  let errorString: string | undefined;
  const {
    date,
    timeString,
    valid,
    resources,
    minimumDateTime,
    maximumDateTime,
    isRequired,
    isDateRequired,
    isTimeRequired,
    errorMessage,
    dateFieldInstance,
    timeFieldInstance,
  } = params;
  if (valid) {
    errorString = undefined;
  } else {
    const currentDate = getFullMomentDate(date, timeString);
    // First: sjekk om det er kommet noe error message fra parenten
    if (errorMessage && date && timeString) {
      errorString = typeof errorMessage === 'string' ? errorMessage : errorMessage(date, timeString);
    } else if (dateFieldInstance && !dateFieldInstance.isValid()) {
      // Så: sjekk om det er kommet noe error message fra date-range-picker
      errorString = dateFieldInstance.getErrorString();
    } else if (timeFieldInstance && !timeFieldInstance.isValid()) {
      // Så: sjekk om det er kommet noe error message fra time-input
      errorString = timeFieldInstance.getErrorString();
    } else {
      // Så: kjør validering på total dateandtime
      if (currentDate && isBeforeMinDate(currentDate, minimumDateTime)) {
        errorString = `${resources?.timeResources?.errorResources?.errorTimeBeforeMin || ERROR_TIME_BEFORE_MIN}: ${minimumDateTime?.format(
          'DD.MM.YYYY HH:mm'
        )}`;
      } else if (currentDate && isAfterMaxDate(currentDate, maximumDateTime)) {
        errorString = `${resources?.timeResources?.errorResources?.errorTimeAfterMax || ERROR_TIME_AFTER_MAX}: ${maximumDateTime?.format(
          'DD.MM.YYYY HH:mm'
        )}`;
      } else if (errorString === undefined && !currentDate && (isRequired || isDateRequired)) {
        errorString = resources?.dateErrorResources?.errorRequiredDate || ERROR_REQUIRED_DATE;
      } else if (errorString === undefined && !timeString && (isRequired || isTimeRequired)) {
        errorString = resources?.timeResources?.errorResources?.errorRequiredTime || ERROR_REQUIRED_TIME;
      } else {
        errorString = resources?.timeResources?.errorResources?.errorInvalidTime || ERROR_INVALID_TIME;
      }
    }
  }
  return errorString;
};
