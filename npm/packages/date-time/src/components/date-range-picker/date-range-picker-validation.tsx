import * as React from 'react';

import moment from 'moment';
import { DateRangePickerShape, SingleDatePickerShape } from 'react-dates';

import { isInclusivelyBeforeDay, isInclusivelyAfterDay } from '@helsenorge/core-utils/moment-utils';

import { DatePickerErrorPhrases, DateRangePickerNode, SingleDatePickerNode } from './date-range-picker-types';

/**
 * @param date - den nåværende datoen vi står på
 * @param maximumDate - maximum tillat dato
 */
export const isNextMonthValid = (date: moment.Moment, maximumDate: moment.Moment | undefined): boolean => {
  const nextMonth = moment(date);
  nextMonth.add(1, 'month').date(1);

  return isMaximumDateValid(nextMonth, maximumDate);
};

/**
 * @param date - den nåværende datoen vi står på
 * @param minimumDate - minimum tillat dato
 */
export const isPrevMonthValid = (date: moment.Moment, minimumDate: moment.Moment | undefined): boolean => {
  const prevMonth = moment(date);
  prevMonth.subtract(1, 'month').endOf('month');

  return isMinimumDateValid(prevMonth, minimumDate);
};

/**
 * @param date - den valgte datoen som skal sjekkes
 * @param minimumDate - minimum tillat dato
 */
export const isMinimumDateValid = (date: moment.Moment, minimumDate: moment.Moment | undefined): boolean => {
  let isMinimumDateValid = true;

  if (minimumDate) {
    isMinimumDateValid = isInclusivelyAfterDay(date, minimumDate);
  }
  return isMinimumDateValid;
};

/**
 * @param date - den valgte datoen som skal sjekkes
 * @param maximumDate - maximum tillat dato
 */
export const isMaximumDateValid = (date: moment.Moment, maximumDate: moment.Moment | undefined): boolean => {
  let isMaximumDateValid = true;

  if (maximumDate) {
    isMaximumDateValid = isInclusivelyBeforeDay(date, maximumDate);
  }
  return isMaximumDateValid;
};

/**
 * Disables the dates that are outside of minimumDate and maximumDate - return true when should be disabled
 * @param date - den valgte datoen som skal sjekkes
 * @param minimumDate - minimum tillat dato
 * @param maximumDate - maximum tillat dato
 */
export const isOutsideRange = (
  date: moment.Moment,
  minimumDate: moment.Moment | undefined,
  maximumDate: moment.Moment | undefined
): boolean => {
  const isMinValid = isMinimumDateValid(date, minimumDate);
  const isMaxValid = isMaximumDateValid(date, maximumDate);

  return !(isMinValid && isMaxValid);
};

/**
 * Kjører full validering på en single date
 * @param airbnbSingleDatepickerRef - ref til daterangepickeren
 * @param date - den valgte datoen som skal sjekkes
 * @param id - from DateRangePicker props
 * @param required - from DateRangePicker props
 * @param errorPhrases - from DateRangePicker props
 * @param minimumDate - from DateRangePicker props
 * @param maximumDate - from DateRangePicker props
 * @param dateValidator - from DateRangePicker props
 */
export const validateSingleDate = (
  airbnbSingleDatepickerRef: React.RefObject<React.ClassicComponent<SingleDatePickerShape, {}>>,
  date: moment.Moment | null,
  id: string,
  required: boolean,
  errorPhrases: DatePickerErrorPhrases,
  minimumDate: moment.Moment | undefined,
  maximumDate: moment.Moment | undefined,
  dateValidator?: (id: string, value?: moment.Moment, endDate?: moment.Moment) => { isValid: boolean; errorString?: string }
): { isSingleDateValid: boolean; errorString?: string } => {
  let isSingleDateValid = true;
  let errorString: string | undefined;
  let inputValue: string | undefined;

  // The DOM node from the react-dates ref is available in a container attribute instead of ref.current directly
  const datepickerElement = (airbnbSingleDatepickerRef.current as SingleDatePickerNode)?.container;

  if (datepickerElement) {
    const dpInput = (datepickerElement as Element).getElementsByClassName('DateInput_input');
    inputValue = (dpInput[0] as HTMLInputElement).value;
  }
  // If the date is required
  if (required) {
    // the date has to be a not null valid moment date
    isSingleDateValid = date ? moment(date).isValid() : false;
    if (!isSingleDateValid) {
      errorString = errorPhrases.errorRequiredDate;
    }
  } else {
    // either null or valid is good
    isSingleDateValid = date === null || moment(date).isValid();
    if (!isSingleDateValid) {
      errorString = errorPhrases.errorInvalidDate;
    }
  }

  // Further checks to get more precise validation messages for min/max dates
  // If the date is null (it means the date was not a valid moment date in react-dates) get the actual input value
  if (date === null && !!inputValue) {
    isSingleDateValid = false;
    const inputMoment = moment(inputValue, 'DD.MM.YYYY');
    const isMinValid = isMinimumDateValid(inputMoment, minimumDate);
    const isMaxValid = isMaximumDateValid(inputMoment, maximumDate);

    if (!inputMoment.isValid()) {
      errorString = errorPhrases.errorInvalidDate;
    } else if (!isMinValid) {
      errorString = `${errorPhrases.errorBeforeMinDate}: ${minimumDate?.format('DD.MM.YYYY')}`;
    } else if (!isMaxValid) {
      errorString = `${errorPhrases.errorAfterMaxDate}: ${maximumDate?.format('DD.MM.YYYY')}`;
    } else {
      errorString = errorPhrases.errorInvalidDate;
    }
  } else if (date && isSingleDateValid) {
    // Goes through the same min/max checks but for the native version of the datepicker
    const isMinValid = isMinimumDateValid(date, minimumDate);
    const isMaxValid = isMaximumDateValid(date, maximumDate);
    if (!isMinValid) {
      isSingleDateValid = false;
      errorString = `${errorPhrases.errorBeforeMinDate}: ${minimumDate?.format('DD.MM.YYYY')}`;
    } else if (!isMaxValid) {
      isSingleDateValid = false;
      errorString = `${errorPhrases.errorAfterMaxDate}: ${maximumDate?.format('DD.MM.YYYY')}`;
    }
  }

  // Finally, if the date is valid - check its value against the custom date validator
  if (date && isSingleDateValid && dateValidator) {
    const isValidObject = dateValidator(id, date);
    isSingleDateValid = isValidObject.isValid;
    errorString = isValidObject.errorString || errorPhrases.errorInvalidDate;
  }

  return {
    isSingleDateValid,
    errorString,
  };
};

/**
 * Kjører full validering på en date range
 * @param airbnbDateRangepickerRef - ref til daterangepickeren
 * @param startDate - den valgte startdatoen som skal sjekkes
 * @param endDate - den valgte sluttdatoen som skal sjekkes
 * @param id - from DateRangePicker props
 * @param required - from DateRangePicker props
 * @param errorPhrases - from DateRangePicker props
 * @param minimumDate - from DateRangePicker props
 * @param maximumDate - from DateRangePicker props
 * @param minimumPeriod - from DateRangePicker props
 * @param dateValidator - from DateRangePicker props
 */
export const validateRangeDate = (
  airbnbDateRangepickerRef: React.RefObject<React.ClassicComponent<DateRangePickerShape, {}>>,
  startDate: moment.Moment | null,
  endDate: moment.Moment | null,
  id: string,
  required: boolean,
  errorPhrases: DatePickerErrorPhrases,
  minimumDate: moment.Moment | undefined,
  maximumDate: moment.Moment | undefined,
  minimumPeriod: number | undefined,
  dateValidator?: (id: string, value?: moment.Moment, endDate?: moment.Moment) => { isValid: boolean; errorString?: string }
): { isRangeDateValid: boolean; errorString?: string } => {
  let isRangeDateValid = true;
  let errorString: string | undefined;
  let inputValueStart: string | undefined;
  let inputValueEnd: string | undefined;

  // The DOM node from the react-dates ref is available in a container attribute instead of ref.current directly
  const dp = (airbnbDateRangepickerRef.current as DateRangePickerNode)?.container;
  if (dp) {
    const dpInput = (dp as Element).getElementsByClassName('DateInput_input');
    inputValueStart = (dpInput[0] as HTMLInputElement).value;
    inputValueEnd = (dpInput[1] as HTMLInputElement).value;
  }

  // If the date is required
  if (required) {
    // the date has to be a not null valid moment date
    isRangeDateValid = startDate && endDate ? moment(startDate).isValid() && moment(endDate).isValid() : false;
    if (!isRangeDateValid) {
      errorString = errorPhrases.errorRequiredDateRange;
    }
  } else {
    // either null or valid is good
    const isStartDateValid = startDate === null || moment(startDate).isValid();
    const isEndDateValid = endDate === null || moment(endDate).isValid();
    isRangeDateValid = isStartDateValid && isEndDateValid;
    if (!(isStartDateValid && isEndDateValid)) {
      errorString = errorPhrases.errorInvalidDateRange;
    }
  }

  // Further checks to get more precise validation messages for min/max dates
  // If the date is null (it means the date was not a valid moment date in react-dates) get the actual input value
  if (startDate === null && !!inputValueStart) {
    isRangeDateValid = false;
    const inputMomentStart = moment(inputValueStart, 'DD.MM.YYYY');
    const isMinValid = isMinimumDateValid(inputMomentStart, minimumDate);
    const isMaxValid = isMaximumDateValid(inputMomentStart, maximumDate);

    if (!inputMomentStart.isValid()) {
      errorString = errorPhrases.errorInvalidDateRange;
    } else if (!isMinValid) {
      errorString = errorPhrases.errorBeforeMinDate;
    } else if (!isMaxValid) {
      errorString = errorPhrases.errorAfterMaxDate;
    } else if (minimumPeriod && endDate && Math.abs(moment(inputValueStart, 'DD.MM.YYYY').diff(endDate, 'days')) + 1 < minimumPeriod) {
      errorString = errorPhrases.errorInvalidMinimumNights + minimumPeriod;
    } else {
      errorString = errorPhrases.errorInvalidDateRange;
    }
  } else if (endDate === null && !!inputValueEnd) {
    isRangeDateValid = false;
    const inputMomentEnd = moment(inputValueEnd, 'DD.MM.YYYY');
    const isMinValid = isMinimumDateValid(inputMomentEnd, minimumDate);
    const isMaxValid = isMaximumDateValid(inputMomentEnd, maximumDate);

    if (!inputMomentEnd.isValid()) {
      errorString = errorPhrases.errorInvalidDateRange;
    } else if (!isMinValid) {
      errorString = errorPhrases.errorBeforeMinDate;
    } else if (!isMaxValid) {
      errorString = errorPhrases.errorAfterMaxDate;
    } else if (minimumPeriod && startDate && Math.abs(startDate.diff(moment(inputValueEnd, 'DD.MM.YYYY'), 'days')) + 1 < minimumPeriod) {
      errorString = errorPhrases.errorInvalidMinimumNights + minimumPeriod;
    } else {
      errorString = errorPhrases.errorInvalidDateRange;
    }
  } else if (startDate && endDate && isRangeDateValid) {
    // Goes through the same min/max checks but for the native version of the datepicker
    const isMinValid = isMinimumDateValid(startDate, minimumDate);
    const isMaxValid = isMaximumDateValid(endDate, maximumDate);
    if (!isMinValid) {
      isRangeDateValid = false;
      errorString = errorPhrases.errorBeforeMinDate;
    } else if (!isMaxValid) {
      isRangeDateValid = false;
      errorString = errorPhrases.errorAfterMaxDate;
    } else if (minimumPeriod && Math.abs(startDate.diff(endDate, 'days')) + 1 < minimumPeriod) {
      isRangeDateValid = false;
      errorString = errorPhrases.errorInvalidMinimumNights + minimumPeriod;
    }
  }

  // Finally, if the date is valid - check its value against the custom date validator
  if (startDate && endDate && isRangeDateValid && dateValidator) {
    const isValidObject = dateValidator(id, startDate, endDate);
    isRangeDateValid = isValidObject.isValid;
    errorString = isValidObject.errorString || errorPhrases.errorInvalidDateRange;
  }

  return {
    isRangeDateValid,
    errorString,
  };
};
