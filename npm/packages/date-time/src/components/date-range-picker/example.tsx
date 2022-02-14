import * as React from 'react';

import moment from 'moment';

import { LanguageLocales } from '@helsenorge/core-utils/constants/languages';

import { DateRangePicker } from '.';

export const DateRangePickerExample: React.FC<{}> = () => {
  const [startDatoValue, setStartDatoValue] = React.useState<moment.Moment>(moment('02.06.2021', 'DD.MM.YYYY'));
  const [sluttDatoValue, setSluttDatoValue] = React.useState<moment.Moment>(moment('03.06.2021', 'DD.MM.YYYY'));

  const onDateChangeStart = (date: moment.Moment) => {
    setStartDatoValue(date);
  };
  const onDateChangeSlutt = (date: moment.Moment) => {
    setSluttDatoValue(date);
  };
  return (
    <div>
      <DateRangePicker
        id="single-1"
        type={'single'}
        label={'Vanlig single daterangepicker (required med minDate for tre år siden, singleDateValue/initialDate/maxDate i dag)'}
        requiredLabel={'My required label'}
        optionalLabel={'med optional label'}
        className={'testclassname'}
        placeholder="Velg en dato"
        onDateChange={value => {
          console.log('onDateChange', value);
        }}
        singleDateValue={moment()}
        minimumDate={moment().subtract(3, 'years')}
        initialDate={moment()}
        maximumDate={moment()}
        isRequired
      />
      <br />
      <hr />
      <br />
      <div>
        <h4>To single datepickere for å velge startdato/sluttdato</h4>
        <DateRangePicker
          id="start-dato"
          type="single"
          label={'Startdato'}
          onDateChange={onDateChangeStart}
          singleDateValue={startDatoValue}
          minimumDate={moment('04.06.2018', 'DD.MM.YYYY')}
          maximumDate={moment('04.06.2021', 'DD.MM.YYYY')}
          initialDate={moment('04.06.2021', 'DD.MM.YYYY')}
          isRequired={true}
        />
        <DateRangePicker
          id="slutt-dato"
          type="single"
          label={'Sluttdato'}
          onDateChange={onDateChangeSlutt}
          singleDateValue={sluttDatoValue}
          minimumDate={startDatoValue}
          maximumDate={moment('04.06.2021', 'DD.MM.YYYY')}
          initialDate={moment('04.06.2021', 'DD.MM.YYYY')}
          isRequired={true}
        />
      </div>
      <br />
      <hr />
      <br />

      <DateRangePicker
        id="single-2"
        type={'single'}
        label={'Fullwidth single daterangepicker - uten tilleggsvalidering'}
        requiredLabel={'My required label'}
        optionalLabel={'med optional label'}
        onDateChange={value => {
          console.log('onDateChange', value);
        }}
        hasFullWidth
      />
      <br />
      <hr />
      <br />
      <DateRangePicker
        label={<span className="custom-jsx">{'Engelsk single datepicker with JSX.Element label og custom phrases'}</span>}
        id="single-3"
        type={'single'}
        singleDateValue={moment('11.09.2019', 'DD.MM.YYYY')}
        locale={LanguageLocales.ENGLISH}
        resources={{
          clearDate: 'CLEAR_DATE',
          chooseAvailableDate: () => 'CHOOSE_AVAILABLE_DATE',
          clearDates: 'CLEAR_DATES',
          calendarLabel: 'CALENDAR_LABEL',
          closeDatePicker: 'CLOSE_DATEPICKER',
          focusStartDate: 'FOCUS_STARTDATE',
          jumpToPrevMonth: 'JUMP_TO_PREVMONTH',
          jumpToNextMonth: 'JUMP_TO_NEXTMONTH',
          keyboardShortcuts: 'KB_SHORTCUTS',
          showKeyboardShortcutsPanel: 'SHOW_KEYBOARD_SHORTCUTS_PANEL',
          hideKeyboardShortcutsPanel: 'HIDE_KEYBOARD_SHORTCUTS_PANEL',
          enterKey: 'ENTER_KEY',
          leftArrowRightArrow: 'LEFT_ARROW_RIGHT_ARROW',
          upArrowDownArrow: 'UP_ARROW_DOWN_ARROW',
          pageUpPageDown: 'PAGE_UP_PAGE_DOWN',
          homeEnd: 'HOME_END',
          escape: 'ESCAPE',
          questionMark: 'QUESTION_MARK',
          selectFocusedDate: 'SELECT_FOCUSED_DATE',
          moveFocusByOneDay: 'MOVE_FOCUS_BY_ONE_DAY',
          moveFocusByOneWeek: 'MOVE_FOCUS_BY_ONE_WEEK',
          moveFocusByOneMonth: 'MOVE_FOCUS_BY_ONE_MONTH',
          moveFocustoStartAndEndOfWeek: 'MOVE_FOCUS_START_END_WEEK',
          returnFocusToInput: 'RETURN_FOCUS_TO_INPUT',
          chooseAvailableStartDate: () => 'CHOOSE_AVAILABLE_STARTDATE',
          chooseAvailableEndDate: () => 'CHOOSE_AVAILABLE_ENDDATE',
          dateIsUnavailable: () => 'DATE_IS_UNAVAILABLE',
          dateIsSelected: () => 'DATE_IS_SELECTED',
          dateIsSelectedAsStartDate: () => 'DATE_IS_SELECTED_AS_START_DATE',
          dateIsSelectedAsEndDate: () => 'DATE_IS_SELECTED_AS_END_DATE',
        }}
        errorResources={{
          errorInvalidDate: 'ERROR_INVALID_DATE',
          errorInvalidDateRange: 'ERROR_INVALID_DATE_RANGE',
          errorRequiredDate: 'ERROR_REQUIRED_DATE',
          errorRequiredDateRange: 'ERROR_REQUIRED_DATE_RANGE',
          errorInvalidMinimumNights: 'ERROR_INVALID_MIN_NIGHTS',
          errorBeforeMinDate: 'ERROR_DATE_BEFORE_MIN',
          errorAfterMaxDate: 'ERROR_DATE_AFTER_MAX',
        }}
      />

      <br />
      <hr />
      <br />
      <DateRangePicker
        id="single-4"
        type={'single'}
        label={'Disabled daterangepicker'}
        onDateChange={value => {
          console.log('onDateChange', value);
        }}
        singleDateValue={moment('10.09.2019', 'DD.MM.YYYY')}
        isDisabled
      />

      <br />
      <hr />
      <br />
      <DateRangePicker
        label={<span className="custom-jsx">{'Samisk datepicker'}</span>}
        id="single-5"
        type={'single'}
        singleDateValue={moment('11.09.2019', 'DD.MM.YYYY')}
        locale={LanguageLocales.SAMI_NORTHERN}
      />

      <br />
      <hr />
      <br />

      <DateRangePicker
        startDateId="range-start-1"
        endDateId="range-end-1"
        type={'range'}
        label={'Vanlig daterangepicker (start + end), ikke required med min 01.06.2021 og max dato 10.06.2021'}
        minimumDate={moment('19.03.2019', 'DD.MM.YYYY')}
        maximumDate={moment('10.06.2021', 'DD.MM.YYYY')}
        initialDate={moment()}
      />
      <br />
      <hr />
      <br />

      <DateRangePicker
        startDateId="range-start-2"
        endDateId="range-end-2"
        type={'range'}
        label={'Fullwidth daterangepicker (start + end), uten tilleggsvalidering'}
        hasFullWidth
      />
    </div>
  );
};

export default DateRangePickerExample;
