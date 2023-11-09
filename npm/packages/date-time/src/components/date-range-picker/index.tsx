import * as React from 'react';

import moment from 'moment';
import 'react-dates/initialize';
import { FocusedInputShape, SingleDatePickerShape, DateRangePickerShape } from 'react-dates';

import { LanguageLocales } from '@helsenorge/core-utils/constants/languages';
import { isMobileUA } from '@helsenorge/core-utils/user-agents-utils';
import ValidationError from '@helsenorge/form/components/form/validation-error';

import { renderDesktopDatePicker } from './date-range-picker-desktop';
import { DateRangePickerLabel } from './date-range-picker-label';
import { renderMobileDatePicker } from './date-range-picker-mobile';
import { DateRangePickerDefaultProps, DateRangePickerProps, DateRangePickerState } from './date-range-picker-types';
import {
  START_DATE_ID,
  END_DATE_ID,
  Phrases,
  ErrorPhrases,
  getCSSClasses,
  getDateNOString,
  notifyValidated,
  getDefaultVisibleMonth,
} from './date-range-picker-utils';
import { validateSingleDate, validateRangeDate, isPrevMonthValid, isNextMonthValid } from './date-range-picker-validation';
import {
  DEFAULT_DATE_PLACEHOLDER_NB,
  DEFAULT_DATE_PLACEHOLDER_EN,
  DEFAULT_STARTDATE_PLACEHOLDER,
  DEFAULT_ENDDATE_PLACEHOLDER,
  DEFAULT_DATE_PLACEHOLDER_SE,
} from '../../constants/datetime';

import 'react-dates/lib/css/_datepicker.css';
import toolkitstyles from './styles.module.scss';

export class DateRangePicker extends React.Component<DateRangePickerProps, DateRangePickerState> {
  public static defaultProps: DateRangePickerDefaultProps = {
    id: 'daterangepicker',
    resources: Phrases,
    errorResources: ErrorPhrases,
    startDateId: START_DATE_ID,
    startDatePlaceholderText: DEFAULT_STARTDATE_PLACEHOLDER,
    endDateId: END_DATE_ID,
    endDatePlaceholderText: DEFAULT_ENDDATE_PLACEHOLDER,
    showDefaultInputIcon: true,
    isValidationHidden: false,
    isRequired: false,
    isDisabled: false,
    numberOfMonths: 1,
  };

  airbnbSingleDatepickerRef: React.RefObject<React.ClassicComponent<SingleDatePickerShape, {}>>;
  airbnbDateRangepickerRef: React.RefObject<React.ClassicComponent<DateRangePickerShape, {}>>;

  constructor(props: DateRangePickerProps) {
    super(props);

    const momentLocale = moment();
    if (props.locale === LanguageLocales.ENGLISH) {
      momentLocale.locale('en-gb');
    } else if (props.locale === LanguageLocales.SAMI_NORTHERN) {
      momentLocale.locale('se');
    } else {
      momentLocale.locale('nb');
    }

    this.airbnbSingleDatepickerRef = React.createRef();
    this.airbnbDateRangepickerRef = React.createRef();

    let placeholder = '';

    switch (props.locale) {
      case LanguageLocales.ENGLISH:
        placeholder = DEFAULT_DATE_PLACEHOLDER_EN;
        break;
      case LanguageLocales.SAMI_NORTHERN:
        placeholder = DEFAULT_DATE_PLACEHOLDER_SE;
        break;
      default:
        placeholder = DEFAULT_DATE_PLACEHOLDER_NB;
    }

    this.state = {
      isMobile: isMobileUA(),
      momentLocale: momentLocale.localeData(),
      placeholder: props.placeholder ? props.placeholder : placeholder,
      singleDate: props.singleDateValue ?? null,
      isSingleDateFocused: null,
      isSingleDateValid: true,
      startDate: props.startDateValue ?? null,
      endDate: props.endDateValue ?? null,
      isRangeDateValid: true,
      validated: false,
      focusedInput: null,
      visibleMonth: getDefaultVisibleMonth(props),
    };
  }

  /** Håndterer deaktivering av måned knappene hvis de minimum/maximumDate er satt */
  componentDidMount() {
    this.disableMonthSelectorHandler(this.state.visibleMonth);
  }

  /** Hvis valuen som kommer fra prop er endret underveis så må den gå gjennom validator */
  componentDidUpdate(prevProps: DateRangePickerProps, prevState: DateRangePickerState): void {
    if (prevProps.type === 'single') {
      const prevPropSingleDateValue = getDateNOString(prevProps.singleDateValue);
      const prevStateSingleDate = getDateNOString(prevState.singleDate);
      const currentSingleDateValue = getDateNOString(this.props.singleDateValue);
      if (prevPropSingleDateValue !== currentSingleDateValue && prevStateSingleDate !== currentSingleDateValue) {
        this.setState(
          {
            singleDate: this.props.singleDateValue ?? null,
            visibleMonth: getDefaultVisibleMonth(this.props),
          },
          () => {
            if (!this.state.isSingleDateFocused) {
              this.singleDateValidator(this.state.singleDate);
            }
          }
        );
      }
    } else {
      const prevPropStartDateValue = getDateNOString(prevProps.startDateValue);
      const prevStateStartDate = getDateNOString(prevState.startDate);
      const currentStartDateValue = getDateNOString(this.props.startDateValue);
      const prevPropEndDateValue = getDateNOString(prevProps.endDateValue);
      const prevStateEndDate = getDateNOString(prevState.endDate);
      const currentEndDateValue = getDateNOString(this.props.endDateValue);
      if (prevPropStartDateValue !== currentStartDateValue && prevStateStartDate !== currentStartDateValue) {
        this.setState(
          {
            startDate: this.props.startDateValue ?? null,
          },
          () => {
            if (this.state.focusedInput === null) {
              this.rangeDateValidator(this.state.startDate, this.state.endDate);
            }
          }
        );
      }
      if (prevPropEndDateValue !== currentEndDateValue && prevStateEndDate !== currentEndDateValue) {
        this.setState({ endDate: this.props.endDateValue ?? null }, () => {
          if (this.state.focusedInput === null) {
            this.rangeDateValidator(this.state.startDate, this.state.endDate);
          }
        });
      }
    }

    /* Sjekker om nåværende måned vi ser har endret seg, eller om det skal være lov å gå lenger forover/bakover i tid */
    if (
      prevState.visibleMonth !== this.state.visibleMonth ||
      (prevProps.maximumDate && this.props.maximumDate && !prevProps.maximumDate.isSame(this.props.maximumDate, 'month')) ||
      (prevProps.minimumDate && this.props.minimumDate && !prevProps.minimumDate.isSame(this.props.minimumDate, 'month'))
    ) {
      this.disableMonthSelectorHandler(this.state.visibleMonth);
    }
  }

  /* Calling the validation on the incoming date */
  onSingleDateChange = (singleDate: moment.Moment): void => {
    this.setState({ singleDate });
    this.props.onDateChange && this.props.onDateChange(singleDate, this.props.id);
  };

  /* Calling the validation on the incoming date with the stored end date */
  onStartDateChange = (startDate: moment.Moment): void => {
    this.setState({ startDate });
    this.props.onDateChange && this.props.onDateChange({ start: startDate, end: this.state.endDate }, this.props.id);
  };

  /* Calling the validation on the incoming date with the stored start date */
  onEndDateChange = (endDate: moment.Moment): void => {
    this.setState({ endDate });
    this.props.onDateChange && this.props.onDateChange({ start: this.state.startDate, end: endDate }, this.props.id);
  };

  onRangeDatesChange = ({ startDate, endDate }: { startDate: moment.Moment; endDate: moment.Moment }): void => {
    this.setState({ startDate, endDate });
    this.props.onDateChange && this.props.onDateChange({ start: startDate, end: endDate }, this.props.id);
  };

  singleDateValidator = (date: moment.Moment | null): Promise<void> => {
    const { id, isRequired, errorResources, minimumDate, maximumDate, dateValidator, onValidated, onError } = this.props;

    const v: {
      isSingleDateValid: boolean;
      errorString?: string;
    } = validateSingleDate(this.airbnbSingleDatepickerRef, date, id, isRequired, errorResources, minimumDate, maximumDate, dateValidator);

    return new Promise<void>((resolve: () => void) => {
      this.setState(
        {
          validated: true,
          isSingleDateValid: v.isSingleDateValid,
          errorString: v.errorString,
        },
        () => {
          notifyValidated(id, date, v.isSingleDateValid, v.errorString, onValidated, onError);
          resolve();
        }
      );
    });
  };

  rangeDateValidator = (startDate: moment.Moment | null, endDate: moment.Moment | null): Promise<void> => {
    const { id, isRequired, errorResources, minimumDate, maximumDate, minimumPeriod, dateValidator, onValidated, onError } = this.props;

    const v: {
      isRangeDateValid: boolean;
      errorString?: string;
    } = validateRangeDate(
      this.airbnbDateRangepickerRef,
      startDate,
      endDate,
      id,
      isRequired,
      errorResources,
      minimumDate,
      maximumDate,
      minimumPeriod,
      dateValidator
    );

    return new Promise<void>((resolve: () => void) => {
      this.setState(
        {
          validated: true,
          isRangeDateValid: v.isRangeDateValid,
          errorString: v.errorString,
        },
        () => {
          notifyValidated(id, { start: startDate, end: endDate }, v.isRangeDateValid, v.errorString, onValidated, onError);
          resolve();
        }
      );
    });
  };

  onSingleDateFocusChange = ({ focused }: { focused: boolean | null }): void => {
    // This replaces onBlur method and validates the field for everytime the focus is brought outside
    // setTimeout is needed to delay the check until the focus is moved
    if (!focused) {
      setTimeout(() => {
        this.validateField();
      }, 0);
    }
    if (focused !== this.state.isSingleDateFocused) {
      this.setState({ isSingleDateFocused: focused });
    }
  };

  onRangeDatesFocusChange = (focusedInput: FocusedInputShape): void => {
    // This replaces onBlur method and validates the field for everytime the focus is brought outside
    // setTimeout is needed to delay the check until the focus is moved
    setTimeout(() => {
      if (this.state.focusedInput === null) {
        this.validateField();
        this.setState({ isFocusReset: true });
      }
    }, 0);

    this.setState({ focusedInput });

    // Rekalkulerer om navNext og navPrev skal være disabled
    if (this.state.isFocusReset) {
      this.setState({ isFocusReset: false });
    }
  };

  onCalenderIconClick = (): void => {
    if (this.state.isSingleDateFocused) {
      this.setState({ isSingleDateFocused: false });
    } else if (this.state.focusedInput) {
      this.setState({ focusedInput: null });
    }

    this.setState({ isFocusReset: true });
  };

  /* Runs dates validator */
  validateField(): Promise<void> {
    return this.props.type === 'single'
      ? this.singleDateValidator(this.state.singleDate)
      : this.rangeDateValidator(this.state.startDate, this.state.endDate);
  }

  /* Returns whereas the field is valid (in a form context) */
  isValid(): boolean {
    return this.props.type === 'single' ? this.state.isSingleDateValid : this.state.isRangeDateValid;
  }

  /* returns the error string, used by date-time-picker to access date errors */
  getErrorString = (): string | undefined => this.state.errorString;

  /* onBlurHandler for NativeInput only (desktop uses airbnb focus methods) */
  onBlurHandler = (): void => {
    this.validateField();
    this.setState({ isFocusReset: true });
  };

  /* Disables/enables next and last month selector buttons based on maximum/minimumDate */
  disableMonthSelectorHandler = (date: moment.Moment): void => {
    const disabledNext = !isNextMonthValid(date, this.props.maximumDate);
    this.setState({ isNextMonthDisabled: disabledNext });
    const disabledPrev = !isPrevMonthValid(date, this.props.minimumDate);
    this.setState({ isPrevMonthDisabled: disabledPrev });
  };

  onChangeVisibleMonthHandler = (date: moment.Moment) => {
    this.setState({ visibleMonth: date });
  };

  render(): JSX.Element {
    const {
      locale,
      className,
      label,
      isLabelHidden,
      requiredLabel,
      optionalLabel,
      subLabel,
      helpButton,
      helpElement,
      isValidationHidden,
      validationErrorRenderer,
      ...partialPropsForDesktop
    } = this.props;

    const { isSingleDateValid, isRangeDateValid, errorString } = this.state;
    const { id, type, isRequired } = partialPropsForDesktop;
    const hasErrors = type === 'single' ? !isSingleDateValid : type === 'range' ? !isRangeDateValid : false;
    const errorText = hasErrors ? (errorString ? errorString : 'Error') : '';
    const classes = getCSSClasses(
      toolkitstyles.datepicker,
      toolkitstyles['datepicker--haserror'],
      !isValidationHidden,
      hasErrors,
      className
    );
    moment.locale(locale);

    return (
      <div id={`${id}-wrapper`} className={classes}>
        <fieldset>
          {hasErrors && validationErrorRenderer}
          {!isValidationHidden && <ValidationError isValid={!hasErrors} error={errorText} />}
          {label && (
            <DateRangePickerLabel
              label={label}
              locale={locale}
              isLabelHidden={isLabelHidden}
              isRequired={isRequired}
              requiredLabel={requiredLabel}
              optionalLabel={optionalLabel}
              helpButton={helpButton}
              subLabel={subLabel}
            />
          )}
          {helpElement ?? null}
          {this.state.isMobile
            ? renderMobileDatePicker(
                this.props,
                this.state,
                this.onSingleDateChange,
                this.onStartDateChange,
                this.onEndDateChange,
                this.onBlurHandler
              )
            : renderDesktopDatePicker(
                partialPropsForDesktop,
                this.state,
                this.airbnbSingleDatepickerRef,
                this.airbnbDateRangepickerRef,
                this.onSingleDateChange,
                this.onSingleDateFocusChange,
                this.onRangeDatesChange,
                this.onRangeDatesFocusChange,
                this.onCalenderIconClick,
                this.onChangeVisibleMonthHandler
              )}
        </fieldset>
      </div>
    );
  }
}

export default DateRangePicker;
