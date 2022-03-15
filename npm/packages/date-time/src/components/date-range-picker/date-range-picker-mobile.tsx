import * as React from 'react';

import moment from 'moment';

import DateNativeInput from './date-native-input';
import { DateRangePickerProps, DateRangePickerState } from './date-range-picker-types';

export const renderMobileDatePicker = (
  props: DateRangePickerProps,
  state: DateRangePickerState,
  onSingleDateChange: (d: moment.Moment) => void,
  onStartDateChange: (d: moment.Moment) => void,
  onEndDateChange: (d: moment.Moment) => void,
  onBlurHandler: (e: React.FocusEvent<HTMLElement>) => void
): JSX.Element => {
  const { id, type, minimumDate, maximumDate, hasFullWidth, isDisabled } = props;
  const { momentLocale, singleDate, startDate, endDate } = state;

  return type === 'single' ? (
    <div onBlur={onBlurHandler}>
      <DateNativeInput
        id={id}
        dateValue={singleDate}
        onChange={onSingleDateChange}
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        locale={momentLocale}
        disabled={isDisabled}
        hasFullWidth={hasFullWidth}
      />
    </div>
  ) : (
    <div onBlur={onBlurHandler}>
      <DateNativeInput
        id={`${id}-start`}
        dateValue={startDate}
        onChange={onStartDateChange}
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        locale={momentLocale}
        disabled={isDisabled}
        hasFullWidth={hasFullWidth}
      />
      <DateNativeInput
        id={`${id}-end`}
        dateValue={endDate}
        onChange={onEndDateChange}
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        locale={momentLocale}
        disabled={isDisabled}
        hasFullWidth={hasFullWidth}
      />
    </div>
  );
};
