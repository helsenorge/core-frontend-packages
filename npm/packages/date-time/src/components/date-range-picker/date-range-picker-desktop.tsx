import * as React from 'react';

import classNames from 'classnames';
import moment from 'moment';
import {
  DateRangePicker as AirbnbDateRangePicker,
  SingleDatePicker as AirbnbSingleDatePicker,
  FocusedInputShape,
  SingleDatePickerShape,
  DateRangePickerShape,
} from 'react-dates';

import { SCREEN_READER_INPUT } from '../../constants/datetime';
import ArrowIcon from './custom-icons/arrow-icon';
import { PartialPropsForDesktop, DateRangePickerState, IntersectingTypes } from './date-range-picker-types';
import {
  HORIZONTAL_ORIENTATION,
  ANCHOR_LEFT,
  NAV_POSITION_TOP,
  ICON_AFTER_POSITION,
  renderCalendarIcon,
  renderChevronIcon,
  renderMonthHeaderSimplified,
  renderMonthHeader,
} from './date-range-picker-utils';
import { isOutsideRange } from './date-range-picker-validation';

import toolkitstyles from './styles.module.scss';

export const renderDesktopDatePicker = (
  partialProps: PartialPropsForDesktop,
  state: DateRangePickerState,
  airbnbSingleDatepickerRef: React.RefObject<React.ClassicComponent<SingleDatePickerShape, {}>>,
  airbnbDateRangepickerRef: React.RefObject<React.ClassicComponent<DateRangePickerShape, {}>>,
  onSingleDateChange: (singleDate: moment.Moment) => void,
  onSingleDateFocusChange: ({ focused }: { focused: boolean | null }) => void,
  onRangeDatesChange: ({ startDate, endDate }: { startDate: moment.Moment; endDate: moment.Moment }) => void,
  onRangeDatesFocusChange: (focusedInput: FocusedInputShape) => void,
  onCalenderIconClick: () => void,
  onChangeVisibleMonthHandler: (date: moment.Moment) => void
): JSX.Element => {
  const {
    momentLocale,
    placeholder,
    singleDate,
    isSingleDateFocused,
    startDate,
    endDate,
    focusedInput,
    isNextMonthDisabled,
    isPrevMonthDisabled,
    visibleMonth,
  } = state;
  const {
    id,
    type,
    isMonthHeaderSimplified,
    startDateId,
    startDatePlaceholderText,
    endDateId,
    endDatePlaceholderText,
    minimumDate,
    maximumDate,
    minimumPeriod,
    hasFullWidth,
    resources,
    isRequired,
    isDisabled,
    showDefaultInputIcon,
    numberOfMonths,
  } = partialProps;

  /* common props to be sent down to noth AirbnbSingleDatePicker and AirbnbDateRangePicker */
  const commonProps: Omit<Partial<IntersectingTypes<SingleDatePickerShape, DateRangePickerShape>>, 'renderMonthText' | 'onClose'> = {
    showDefaultInputIcon,
    numberOfMonths,
    required: isRequired,
    disabled: isDisabled,
    phrases: resources,
    screenReaderInputMessage: SCREEN_READER_INPUT,
    inputIconPosition: ICON_AFTER_POSITION,
    orientation: HORIZONTAL_ORIENTATION,
    anchorDirection: ANCHOR_LEFT,
    navPosition: NAV_POSITION_TOP,
    enableOutsideDays: false,
    keepFocusOnInput: false,
    horizontalMargin: 0,
    navPrev: renderChevronIcon(
      'prev',
      isPrevMonthDisabled
        ? classNames(toolkitstyles['datepicker__header-navigation'], toolkitstyles['datepicker__header-navigation--disabled'])
        : toolkitstyles['datepicker__header-navigation'],
      isPrevMonthDisabled
    ),
    navNext: renderChevronIcon(
      'next',
      isNextMonthDisabled
        ? classNames(toolkitstyles['datepicker__header-navigation'], toolkitstyles['datepicker__header-navigation--disabled'])
        : toolkitstyles['datepicker__header-navigation'],
      isNextMonthDisabled
    ),
    withPortal: false,
    withFullScreenPortal: false,
    keepOpenOnDateSelect: false,
    isRTL: false,
    customInputIcon: renderCalendarIcon(onCalenderIconClick, toolkitstyles['datepicker__input-icon']),
    initialVisibleMonth: (): moment.Moment => visibleMonth,
    isOutsideRange: (date: moment.Moment): boolean => isOutsideRange(date, minimumDate, maximumDate),
    displayFormat: 'DD.MM.YYYY',
    weekDayFormat: 'DD/MM/YYYY',
    dayAriaLabelFormat: 'DD.MM.YYYY',
    renderWeekHeaderElement: function renderWeekHeaderElement(day: string): JSX.Element {
      const incomingDate = moment(day, 'DD/MM/YYYY');
      const weekHeader = incomingDate ? momentLocale.weekdaysShort(incomingDate) : undefined;

      return weekHeader && weekHeader.length > 2 ? <span>{weekHeader.slice(0, -1)}</span> : <></>;
    },
    renderMonthElement: (props: {
      month: moment.Moment;
      onMonthSelect: (visibleMonth: moment.Moment, newMonthVal: string) => void;
      onYearSelect: (visibleMonth: moment.Moment, newMonthVal: string) => void;
    }): string | JSX.Element => {
      return isMonthHeaderSimplified
        ? renderMonthHeaderSimplified(props, momentLocale)
        : renderMonthHeader(props, momentLocale, minimumDate, maximumDate, onChangeVisibleMonthHandler);
    },
  };

  // This is a bugfix because onFocusChange is not called properly when the user tabs outside of the endDate field
  // This makes sure the focus is set back to null and the calendar closes
  const onRangeBlur = (e: React.FocusEvent<HTMLDivElement>): void => {
    if (e.target.nodeName === 'BUTTON' && focusedInput === 'endDate') {
      onRangeDatesFocusChange(null as unknown as FocusedInputShape);
    }
  };

  return type === 'single' ? (
    <AirbnbSingleDatePicker
      {...commonProps}
      id={id}
      placeholder={placeholder}
      ref={airbnbSingleDatepickerRef}
      date={singleDate}
      focused={!!isSingleDateFocused}
      onDateChange={onSingleDateChange}
      onFocusChange={onSingleDateFocusChange}
      onNextMonthClick={onChangeVisibleMonthHandler}
      onPrevMonthClick={onChangeVisibleMonthHandler}
      block={hasFullWidth}
    />
  ) : (
    <div onBlur={onRangeBlur}>
      <AirbnbDateRangePicker
        {...commonProps}
        startDateId={startDateId}
        startDatePlaceholderText={startDatePlaceholderText}
        endDateId={endDateId}
        endDatePlaceholderText={endDatePlaceholderText}
        ref={airbnbDateRangepickerRef}
        showClearDates={false}
        reopenPickerOnClearDates={false}
        startDate={startDate}
        endDate={endDate}
        focusedInput={focusedInput}
        onDatesChange={onRangeDatesChange}
        onFocusChange={onRangeDatesFocusChange}
        onNextMonthClick={onChangeVisibleMonthHandler}
        onPrevMonthClick={onChangeVisibleMonthHandler}
        minDate={minimumDate}
        maxDate={maximumDate}
        minimumNights={minimumPeriod && minimumPeriod > 1 ? minimumPeriod - 1 : 1}
        customArrowIcon={<ArrowIcon className={toolkitstyles['datepicker__arrow-icon']} />}
        block={hasFullWidth}
      />
    </div>
  );
};
