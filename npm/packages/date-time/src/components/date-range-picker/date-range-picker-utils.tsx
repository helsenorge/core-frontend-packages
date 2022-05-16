import * as React from 'react';

import classNames from 'classnames';
import moment, { Moment } from 'moment';
import {
  SingleDatePickerPhrases,
  DateRangePickerPhrases,
  NavPositionShape,
  IconPositionShape,
  OrientationShape,
  AnchorDirectionShape,
} from 'react-dates';

import { LanguageLocales } from '@helsenorge/core-utils/constants/languages';

import {
  CALENDAR_LABEL,
  CLOSE_DATEPICKER,
  FOCUS_STARTDATE,
  CLEAR_DATE,
  CLEAR_DATES,
  PICK_MONTH,
  PICK_MONTH_EN,
  PICK_YEAR,
  PICK_YEAR_EN,
  JUMP_TO_PREVMONTH,
  JUMP_TO_NEXTMONTH,
  KEYBOARD_SHORTCUTS,
  SHOW_KEYBOARD_SHORTCUTS_PANEL,
  HIDE_KEYBOARD_SHORTCUTS_PANEL,
  ENTER_KEY,
  LEFT_ARROW_RIGHT_ARROW,
  UP_ARROW_DOWN_ARROW,
  PAGE_UP_PAGE_DOWN,
  HOME_END,
  ESCAPE,
  QUESTION_MARK,
  OPEN_THIS_PANEL,
  SELECT_FOCUSED_DATE,
  MOVE_FOCUS_BY_ONE_DAY,
  MOVE_FOCUS_BY_ONE_WEEK,
  MOVE_FOCUS_BY_ONE_MONTH,
  MOVE_FOCUS_START_END_WEEK,
  RETURN_FOCUS_TO_INPUT,
  ERROR_INVALID_DATE,
  ERROR_INVALID_DATE_RANGE,
  ERROR_REQUIRED_DATE,
  ERROR_REQUIRED_DATE_RANGE,
  ERROR_INVALID_MIN_NIGHTS,
  ERROR_DATE_BEFORE_MIN,
  ERROR_DATE_AFTER_MAX,
  PICK_MONTH_SE,
  PICK_YEAR_SE,
} from '../../constants/datetime';
import HeaderNavIcon from './custom-icons/header-nav-icon';
import InputIcon from './custom-icons/input-icon';
import { DatePickerErrorPhrases, DateRangePickerProps } from './date-range-picker-types';

import toolkitstyles from './styles.module.scss';

/* CONTROLS */
export const DISPLAY_FORMAT = 'L';
export const ISO_FORMAT = 'YYYY-MM-DD';
export const ISO_MONTH_FORMAT = 'YYYY-MM';

export const START_DATE_ID = 'startDate';
export const END_DATE_ID = 'endDate';

export const HORIZONTAL_ORIENTATION: OrientationShape = 'horizontal';
export const VERTICAL_ORIENTATION: OrientationShape = 'vertical';
export const VERTICAL_SCROLLABLE = 'verticalScrollable';

export const NAV_POSITION_BOTTOM: NavPositionShape = 'navPositionBottom';
export const NAV_POSITION_TOP: NavPositionShape = 'navPositionTop';

export const ICON_BEFORE_POSITION: IconPositionShape = 'before';
export const ICON_AFTER_POSITION: IconPositionShape = 'after';

export const INFO_POSITION_TOP = 'top';
export const INFO_POSITION_BOTTOM = 'bottom';
export const INFO_POSITION_BEFORE = 'before';
export const INFO_POSITION_AFTER = 'after';

export const ANCHOR_LEFT: AnchorDirectionShape = 'left';
export const ANCHOR_RIGHT: AnchorDirectionShape = 'right';

export const OPEN_DOWN = 'down';
export const OPEN_UP = 'up';

export const DAY_SIZE = 39;
export const BLOCKED_MODIFIER = 'blocked';
export const WEEKDAYS = [0, 1, 2, 3, 4, 5, 6];

export const FANG_WIDTH_PX = 20;
export const FANG_HEIGHT_PX = 10;
export const DEFAULT_VERTICAL_SPACING = 22;

export const MODIFIER_KEY_NAMES = new Set(['Shift', 'Control', 'Alt', 'Meta']);

/* Utils functions to create phrases with dynamic date */
const chooseAvailableStartDate = ({ date }: { date: string }): string => `Velg ${date} som startdato. Den er tilgjengelig.`;
const chooseAvailableEndDate = ({ date }: { date: string }): string => `Velg ${date} som sluttdato. Den er tilgjengelig.`;
const chooseAvailableDate = ({ date }: { date: string }): string => date;
const dateIsUnavailable = ({ date }: { date: string }): string => `Ikke tilgjengelig. ${date}`;
const dateIsSelected = ({ date }: { date: string }): string => `Valgt. ${date}`;
const dateIsSelectedAsStartDate = ({ date }: { date: string }): string => `Valgt som startdato. ${date}`;
const dateIsSelectedAsEndDate = ({ date }: { date: string }): string => `Valgt som sluttdato. ${date}`;

export const Phrases: SingleDatePickerPhrases | DateRangePickerPhrases = {
  clearDate: CLEAR_DATE, // specific to type single
  chooseAvailableDate, // specific to type single
  clearDates: CLEAR_DATES, // specific to type range
  calendarLabel: CALENDAR_LABEL,
  closeDatePicker: CLOSE_DATEPICKER,
  focusStartDate: FOCUS_STARTDATE,
  jumpToPrevMonth: JUMP_TO_PREVMONTH,
  jumpToNextMonth: JUMP_TO_NEXTMONTH,
  keyboardShortcuts: KEYBOARD_SHORTCUTS,
  showKeyboardShortcutsPanel: SHOW_KEYBOARD_SHORTCUTS_PANEL,
  hideKeyboardShortcutsPanel: HIDE_KEYBOARD_SHORTCUTS_PANEL,
  enterKey: ENTER_KEY,
  leftArrowRightArrow: LEFT_ARROW_RIGHT_ARROW,
  upArrowDownArrow: UP_ARROW_DOWN_ARROW,
  pageUpPageDown: PAGE_UP_PAGE_DOWN,
  homeEnd: HOME_END,
  escape: ESCAPE,
  questionMark: QUESTION_MARK,
  openThisPanel: OPEN_THIS_PANEL,
  selectFocusedDate: SELECT_FOCUSED_DATE,
  moveFocusByOneDay: MOVE_FOCUS_BY_ONE_DAY,
  moveFocusByOneWeek: MOVE_FOCUS_BY_ONE_WEEK,
  moveFocusByOneMonth: MOVE_FOCUS_BY_ONE_MONTH,
  moveFocustoStartAndEndOfWeek: MOVE_FOCUS_START_END_WEEK,
  returnFocusToInput: RETURN_FOCUS_TO_INPUT,
  chooseAvailableStartDate, // specific to type range
  chooseAvailableEndDate, // specific to type range
  dateIsUnavailable,
  dateIsSelected,
  dateIsSelectedAsStartDate, // specific to type range
  dateIsSelectedAsEndDate, // specific to type range
};

export const ErrorPhrases: DatePickerErrorPhrases = {
  errorInvalidDate: ERROR_INVALID_DATE,
  errorInvalidDateRange: ERROR_INVALID_DATE_RANGE,
  errorRequiredDate: ERROR_REQUIRED_DATE,
  errorRequiredDateRange: ERROR_REQUIRED_DATE_RANGE,
  errorInvalidMinimumNights: ERROR_INVALID_MIN_NIGHTS,
  errorBeforeMinDate: ERROR_DATE_BEFORE_MIN,
  errorAfterMaxDate: ERROR_DATE_AFTER_MAX,
};

interface MomentLocaleWithConfig {
  _config: { abbr: string };
}

/**
 * Util for å sjekke at en momentLocale objekt inneholder config og abbr for locale
 * @param locale - moment-Locale objekt
 */
const isMomentLocaleConfig = (locale: unknown): locale is MomentLocaleWithConfig => {
  return !!(locale as MomentLocaleWithConfig)?._config?.abbr;
};

/**
 * Leverer options for hvert år mellom min og max
 * @param min - første option (inkl)
 * @param max - siste option (inkl)
 */
export const renderYearsOptions = (min: number, max: number): JSX.Element[] => {
  const options = [];

  for (let i = min; i <= max; i++) {
    options.push(
      <option value={i} key={i}>
        {i}
      </option>
    );
  }

  return options;
};

/**
 * Leverer dropdown for måneder
 * Hvis minimumDate eller maximumDate er ikke definert, eller hvis de er innen samme måned returneres det måneden i en streng
 * @param currentDate - den valgte måneden
 * @param onMonthSelect - methode som skal kalles ved valg av måneden
 * @param locale - moment locale som styrer språk månedene vises i
 * @param minimumDate - minimum tillat dato
 * @param maximumDate - maximum tillat dato
 */
export const renderMonthsPicker = (
  currentDate: Moment,
  onMonthSelect: (month: Moment, value: string) => void,
  locale: moment.Locale,
  minimumDate: moment.Moment | undefined,
  maximumDate: moment.Moment | undefined,
  onChangeVisibleMonthHandler: (date: moment.Moment) => void
): JSX.Element => {
  const localeString = isMomentLocaleConfig(locale) ? locale._config.abbr : LanguageLocales.NORWEGIAN;
  if (minimumDate && maximumDate && moment(minimumDate).isSame(maximumDate, 'month')) {
    return <span className={toolkitstyles['datepicker__month-view']}>{locale.months(moment(currentDate, 'M'))}</span>;
  }
  const options = [];
  for (let i = 0; i <= 11; i++) {
    options.push(
      <option key={i} value={i}>
        {locale.months(moment(i + 1, 'M'))}
      </option>
    );
  }

  let ariaLabel = '';

  if (LanguageLocales.ENGLISH.toLowerCase() === localeString) {
    ariaLabel = PICK_MONTH_EN;
  } else if ('se' === localeString) {
    ariaLabel = PICK_MONTH_SE;
  } else {
    ariaLabel = PICK_MONTH;
  }

  return (
    <select
      className={toolkitstyles['datepicker__month-selector']}
      value={currentDate.month()}
      onChange={(e): void => {
        onMonthSelect(currentDate, e.target.value);
        // Oppdater visibleMonth state til valgt måned
        onChangeVisibleMonthHandler(moment(currentDate).set('month', parseInt(e.target.value)));
      }}
      onKeyDown={(e: React.KeyboardEvent<HTMLSelectElement>): void => {
        e.stopPropagation();
      }}
      aria-label={ariaLabel}
    >
      {options}
    </select>
  );
};

/**
 * Leverer dropdown for årene
 * Hvis min og max er innen samme år returneres det år i en streng
 * Hvis minimumDate ikke er definert brukes det default på 100 år
 * @param currentDate - det valgte året
 * @param onYearSelect - methode som skal kalles ved valg av år
 * @param minimumDate - minimum tillat dato
 * @param maximumDate - maximum tillat dato
 * @param onChangeVisibleMonthHandler - metode som kalles når vi velger år
 */
export const renderYearsPicker = (
  currentDate: Moment,
  onYearSelect: (visibleMonth: Moment, newMonthVal: string) => void,
  locale: moment.Locale,
  minimumDate: moment.Moment | undefined,
  maximumDate: moment.Moment | undefined,
  onChangeVisibleMonthHandler: (date: moment.Moment) => void
): JSX.Element => {
  const localeString = isMomentLocaleConfig(locale) ? locale._config.abbr : LanguageLocales.NORWEGIAN;
  const minYear = minimumDate ? moment(minimumDate).year() : moment().year() - 100;
  const maxYear = maximumDate ? moment(maximumDate).year() : moment().year() + 100;

  let ariaLabel = '';

  if (LanguageLocales.ENGLISH.toLowerCase() === localeString) {
    ariaLabel = PICK_YEAR_EN;
  } else if ('se' === localeString) {
    ariaLabel = PICK_YEAR_SE;
  } else {
    ariaLabel = PICK_YEAR;
  }

  if (maxYear - minYear <= 0) {
    return <span className={toolkitstyles['datepicker__year-view']}>{currentDate.year()}</span>;
  } else {
    const yearsOptions = renderYearsOptions(minYear, maxYear);

    return (
      <select
        className={toolkitstyles['datepicker__year-selector']}
        value={currentDate.year()}
        onChange={(e): void => {
          onYearSelect(currentDate, e.target.value);
          // Oppdater visibleMonth state til valgt år
          onChangeVisibleMonthHandler(moment(currentDate).set('year', parseInt(e.target.value)));
        }}
        onKeyDown={(e: React.KeyboardEvent<HTMLSelectElement>): void => {
          e.stopPropagation();
        }}
        aria-label={ariaLabel}
      >
        {yearsOptions}
      </select>
    );
  }
};

/**
 * Renderer kalender ion som vises ved input feltet
 * @param onClick - methoden som kalles ved klikk på ikon
 * @param className - className som settes på ikonet
 */
export const renderCalendarIcon = (onClick: (e?: React.MouseEvent<{}>) => void, className?: string): JSX.Element => {
  return <InputIcon className={className} onClick={onClick} />;
};

/**
 * Renderer chevron ikon som brukes for prev nav
 * @param direction - definerer om det vises Chevron som peker tilbake eller fremover
 * @param className - className som settes på ikonet
 */
export const renderChevronIcon = (direction: 'prev' | 'next', className?: string, isDisabled?: boolean): JSX.Element => {
  return <HeaderNavIcon className={className} direction={direction} isDisabled={isDisabled} />;
};

/**
 * Renderer en forenklet Month header med en fast streng 'måned YYYY'
 * @param month - den valgte måneden
 * @param locale - moment locale som styrer språk månedene vises i
 */
export const renderMonthHeaderSimplified = ({ month }: { month: Moment }, locale: moment.Locale): string =>
  `${locale.months(moment(month))} ${moment(month).year()}`;

/**
 * Renderer Month header med dropdowns for måned og år slik at brukeren kan raskere bla gjennom
 * @param month - den valgte måneden
 * @param onMonthSelect - methode som skal kalles ved valg av måneden
 * @param onYearSelect - methode som skal kalles ved valg av år
 * @param locale - moment locale som styrer språk månedene vises i
 * @param minimumDate - minimum tillat dato
 * @param maximumDate - maximum tillat dato
 */
export const renderMonthHeader = (
  {
    month,
    onMonthSelect,
    onYearSelect,
  }: {
    month: Moment;
    onMonthSelect: (visibleMonth: Moment, newMonthVal: string) => void;
    onYearSelect: (visibleMonth: Moment, newMonthVal: string) => void;
  },
  locale: moment.Locale,
  minimumDate: moment.Moment | undefined,
  maximumDate: moment.Moment | undefined,
  onChangeVisibleMonthHandler: (date: moment.Moment) => void
): JSX.Element => {
  return (
    <div className={toolkitstyles['datepicker__month-year-selector']}>
      {renderMonthsPicker(month, onMonthSelect, locale, minimumDate, maximumDate, onChangeVisibleMonthHandler)}
      {renderYearsPicker(month, onYearSelect, locale, minimumDate, maximumDate, onChangeVisibleMonthHandler)}
    </div>
  );
};

/**
 * Kaller onValidated og viser error når validering er ferdig
 * @param id - id'en som gjelder
 * @param value - datoen som sendes videre
 * @param isValid - om datoen er valid eller ikke
 * @param errorString - error meldingen som skal vises
 * @param onValidated - methoden som skal kalles (optional)
 * @param onError - methoden som skal kalles ved error (optional)
 */
export const notifyValidated = (
  id: string,
  value: moment.Moment | { start: moment.Moment | null; end: moment.Moment | null } | null,
  isValid: boolean,
  errorString?: string,
  onValidated?: (isValid: boolean) => void,
  onError?: (dato: moment.Moment | { start: moment.Moment | null; end: moment.Moment | null } | null, error?: string, id?: string) => void
): void => {
  onValidated && onValidated(isValid);
  onError && !isValid && onError(value, errorString, id);
};

/**
 * Returnerer css classes som skal settes på DateRangePicker
 * @param baseClass - default classe som vises uansett
 * @param errorClass - error classe som vises kun ved valideringsfeil
 * @param hasErrors - om det er valideringsfeil eller ikke
 * @param className - opptional className som settes i tillegg
 */

export const getCSSClasses = (
  baseClass: string,
  errorClass: string,
  hasValidation: boolean,
  hasErrors: boolean,
  className?: string
): string => {
  return classNames(
    baseClass,
    {
      mol_validation: hasValidation,
      'mol_validation--active': hasValidation && hasErrors,
    },
    hasErrors ? errorClass : '',
    className ? className : ''
  );
};

/**
 * Returnerer datoen i format DD.MM.YYY
 * @param d - moment dato
 */
export const getDateNOString = (d: moment.Moment | undefined | null): string => {
  return d ? moment(d).format('DD.MM.YYYY') : '';
};

/**
 * Returnerer dato som skal være synlig når kalenderen åpnes
 * @param props DateRangePicker sine props
 */
export const getDefaultVisibleMonth = (props: DateRangePickerProps): Moment =>
  props.singleDateValue || props.startDateValue || props.endDateValue || props.initialDate || props.minimumDate || moment();
