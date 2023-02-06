import {
  FocusedInputShape,
  SingleDatePickerPhrases,
  DateRangePickerPhrases,
  SingleDatePickerShape,
  DateRangePickerShape,
} from 'react-dates';

import { LanguageLocales } from '@helsenorge/core-utils/constants/languages';

export type DatePickerErrorPhrases = {
  errorInvalidDate: string;
  errorInvalidDateRange: string;
  errorRequiredDate: string;
  errorRequiredDateRange: string;
  errorInvalidMinimumNights: string;
  errorAfterMaxDate: string;
  errorBeforeMinDate: string;
};
export type SingleDatePickerNode = React.ClassicComponent<SingleDatePickerShape, {}> & {
  container?: HTMLElement;
};
export type DateRangePickerNode = React.ClassicComponent<DateRangePickerShape, {}> & {
  container?: HTMLElement;
};

export interface DateRangePickerDefaultProps {
  /** Unik ID som sendes videre til komponenten - spesifikk til type === 'single'  */
  id: string;
  /** Unik ID som sendes videre til startDate inputfelt - spesifikk til type === 'range'  */
  startDateId: string;
  /** Placeholder som brukes i startDate input feltet - spesifikk til type === 'range' - default er 'Startdato' */
  startDatePlaceholderText: string;
  /** Unik ID som sendes videre til endDate inputfelt - spesifikk til type === 'range'  */
  endDateId: string;
  /** Placeholder som brukes i endDate input feltet - spesifikk til type === 'range' - default er 'Sluttdato' */
  endDatePlaceholderText: string;
  /** Forhåndsdefinerte string Resources som konsumeres av komponenten - kan overskrives */
  resources: SingleDatePickerPhrases | DateRangePickerPhrases;
  /** Forhåndsdefinerte error string Resources som konsumeres av komponenten - kan overskrives */
  errorResources: DatePickerErrorPhrases;
  /** Viser kalender icon i inputfeltet - default er true */
  showDefaultInputIcon: boolean;
  /** Antall måneder som skal vises i kalenderpanelet - default er 1 */
  numberOfMonths: number;
  /* Dersom mol_validation og error meldinger ved validering skal skjules */
  isValidationHidden: boolean;
  /** Definerer om feltet er required - brukes både for validering og for styling */
  isRequired: boolean;
  /** Definerer om feltet er disabled */
  isDisabled: boolean;
}

export interface Props {
  /** Definerer om det skal velges én dato eller en periode  */
  type: 'single' | 'range';
  /** Definerer hvilken locale moment bruker - default en 'nb-NO'  */
  locale?: LanguageLocales.NORWEGIAN | LanguageLocales.ENGLISH | LanguageLocales.SAMI_NORTHERN;
  /** Optional label som settes over datepickeren */
  label?: string | JSX.Element;
  /** Teksten til sub label, brukes som enkel hjelpetekst. Sublabel legges som et eget blokk-element nederst i <legend> til dette feltet */
  subLabel?: string | JSX.Element;
  /** Placeholder som brukes i input feltet - spesifikk til type === 'single'  - default er 'dd.mm.åååå' */
  placeholder?: string;
  /** Custom className som settes på wrapperen  */
  className?: string;
  /** Verdien som settes som default på DatePickeren når den initieres */
  singleDateValue?: moment.Moment;
  /** Verdien som settes som default på startDate i Daterangepickeren når den initieres */
  startDateValue?: moment.Moment;
  /** Verdien som settes som default på startDate i Daterangepickeren når den initieres */
  endDateValue?: moment.Moment;
  /** Minimum dato som kan velges. Brukes både for visning i kalenderen og for validering */
  minimumDate?: moment.Moment;
  /** Maksimal dato som kan velges. Brukes både for visning i kalenderen og for validering*/
  maximumDate?: moment.Moment;
  /** Definerer minimum antall dager for en periode - spesifikk til type === 'range'   */
  minimumPeriod?: number;
  /** Dato visningen i kalenderen starter i. Brukes kun når minimumDate ikke er i bruk. default er faktisk value, og 'now' */
  initialDate?: moment.Moment;
  /** Optional function som kalles når datoen endrer seg. Hvis type === range sendes det et objekt med begge datoer som andre parameter */
  onDateChange?: (value: moment.Moment | { start: moment.Moment | null; end: moment.Moment | null } | null, id?: string) => void;
  /* Teksten til required label */
  requiredLabel?: string;
  /* Teksten til optional label - krever at required er false for å vises */
  optionalLabel?: string;
  /** Setter en --hidden className på label - fortsatt lesbart for screen-readers men ikke synlig */
  isLabelHidden?: boolean;
  /** Definerer om input feltet skal ta hele bredden - gjelder både mobil og desktop - default er false  */
  hasFullWidth?: boolean;
  /** Definerer om måned og år skal vise en enkel string istedenfor dropdowns: default er false  */
  isMonthHeaderSimplified?: boolean;
  /** Optional JSX.Element som vises ved error istedenfor standard ValidationError fra Form */
  validationErrorRenderer?: JSX.Element;
  /** Ekstra validator check - returnerer om verdien er gyldig og errorString som skal vises  */
  dateValidator?: (id: string, value?: moment.Moment, endDate?: moment.Moment) => { isValid: boolean; errorString?: string };
  /** Function som kalles når en dato er feil */
  onError?: (date: moment.Moment | { start: moment.Moment | null; end: moment.Moment | null } | null, error?: string, id?: string) => void;
  /** Function som kalles når datoen valideres riktig */
  onValidated?: (isValid: boolean) => void;
  /** Hjelpetrigger som vises etter label */
  helpButton?: JSX.Element;
  /** Element som vises når man klikker på HelpButton */
  helpElement?: JSX.Element;
}

export type DateRangePickerProps = DateRangePickerDefaultProps & Props;

export type PartialPropsForDesktop = Omit<
  DateRangePickerProps,
  | 'locale'
  | 'className'
  | 'label'
  | 'isLabelHidden'
  | 'requiredLabel'
  | 'optionalLabel'
  | 'sublabel'
  | 'validationErrorRenderer'
  | 'isValidationHidden'
  | 'helpButton'
  | 'helpElement'
>;

/** Returnerer nytt interface som består av alt som er felles for T og U */
export type IntersectingTypes<T, U> = {
  [K in Extract<keyof T, keyof U>]: T[K];
};

export interface DateRangePickerState {
  isMobile: boolean;
  momentLocale: moment.Locale;
  placeholder: string;
  singleDate: moment.Moment | null;
  isSingleDateFocused: boolean | null;
  isSingleDateValid: boolean;
  startDate: moment.Moment | null;
  endDate: moment.Moment | null;
  isRangeDateValid: boolean;
  validated: boolean;
  focusedInput: FocusedInputShape | null;
  errorString?: string;
  isNextMonthDisabled?: boolean;
  isPrevMonthDisabled?: boolean;
  isFocusReset?: boolean;
  visibleMonth: moment.Moment;
}
