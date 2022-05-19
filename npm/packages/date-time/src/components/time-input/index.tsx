import * as React from 'react';

import classNames from 'classnames';
import moment from 'moment';

import Button from '@helsenorge/designsystem-react/components/Button';
import Icon from '@helsenorge/designsystem-react/components/Icons';
import Undo from '@helsenorge/designsystem-react/components/Icons/Undo';

import { getHoursFromTimeString, getMinutesFromTimeString } from '@helsenorge/core-utils/date-utils';
import { getDocumentActiveElement } from '@helsenorge/core-utils/focus-utils';
import ValidationError from '@helsenorge/form/components/form/validation-error';
import { Sublabel } from '@helsenorge/form/components/label/sublabel';
import SafeInputField from '@helsenorge/form/components/safe-input-field';

import {
  TIME_SEPARATOR,
  ERROR_REQUIRED_TIME,
  ERROR_INVALID_TIME,
  ERROR_HOURS_AFTER_MAX,
  ERROR_MINUTES_AFTER_MAX,
  ERROR_HOURS_BEFORE_MIN,
  ERROR_MINUTES_BEFORE_MIN,
} from '../../constants/datetime';

import './styles.scss';

interface ResetButton {
  onReset?: () => void;
  resetButtonText: string;
}

export interface TimeResources {
  placeholderHours?: string;
  placeholderMinutes?: string;
  errorResources?: {
    errorInvalidTime?: string;
    errorRequiredTime?: string;
    errorTimeBeforeMin?: string;
    errorTimeAfterMax?: string;
    errorHoursBeforeMin?: string;
    errorHoursAfterMax?: string;
    errorMinutesBeforeMin?: string;
    errorMinutesAfterMax?: string;
  };
}

export interface TimeInputProps {
  /** Unik ID */
  id: string;
  /** Verdi som vises i feltet */
  value?: string;
  /* legend som vises før feltene */
  legend?: string | JSX.Element;
  /** Teksten til sub label, brukes som enkel hjelpetekst. Sublabel legges som et eget blokk-element nederst i <legend> til dette feltet */
  subLabel?: string | JSX.Element;
  /** Om input feltet er readOnly -> skal renames til isDisabled */
  readOnly?: boolean;
  /** Minimum time som er tillatt */
  minHour?: number;
  /** Maks time som er tillatt */
  maxHour?: number;
  /** Minimum minutt som er tillatt */
  minMinute?: number;
  /** Maks minutt som er tillatt */
  maxMinute?: number;
  /** Function som kalles når fokus går bort fra feltet */
  onBlur?: (timeString?: string) => void;
  /** Function som kalles når verdien i feltet endres */
  onTimeChange?: (newTime: string | undefined) => void;
  /** Function som kalles når datoen valideres */
  onValidated?: (valid: boolean | undefined) => void;
  /** Om det skal legges <fieldset> eller ikke */
  renderFieldset?: boolean;
  /** Innhold som vises i komponentet */
  children?: React.ReactNode;
  /** Ekstra CSS-class som legges på wrapperen */
  className?: string;
  /** Ekstra CSS-class som legges på input feltene */
  inputClassName?: string;
  /** Om feltet er påkrevd eller ikke */
  isRequired?: boolean;
  /** Strings som skal brukes i komponenten */
  resources?: TimeResources;
  /** ErrorMessages som vises gjennom validering */
  errorMessage?: string | ((value: string | number | undefined) => string);
  /* Dersom mol_validation og error meldinger ved validering skal skjules */
  isValidationHidden: boolean;
  /** Om det vises en reset button eller ikke */
  resetButton?: ResetButton;
  /** Teksten til required label */
  requiredLabel?: string;
  /** Teksten til optional label */
  optionalLabel?: string;
  /** Om required label skal vises eller ikke */
  showRequiredLabel?: boolean;
  /** Om ekstra label skal vises eller ikke */
  showOptionalLabel?: boolean;
  /** Hjelpetrigger som vises etter label */
  helpButton?: JSX.Element;
  /** Element som vises når man klikker på HelpButton */
  helpElement?: JSX.Element;
  /** Callback-funksjon som brukes til å logge feil til server */
  logCallback?: (message?: string, ...optionalParams: unknown[]) => void;
}

export interface TimeInputState {
  value?: string | number;
  timeString?: string;
  date?: Date;
  validated: boolean;
  valid: boolean;
  errorString?: string;
}

const getValue = (props: TimeInputProps): string | undefined => {
  const { value }: TimeInputProps = props;
  if (value) {
    return value;
  }
};

export default class TimeInput extends React.Component<TimeInputProps, TimeInputState> {
  static defaultProps: Partial<TimeInputProps> = {
    renderFieldset: true,
  };

  wrapperRef: React.RefObject<HTMLDivElement>;
  hoursInputRef: React.RefObject<SafeInputField>;
  minutesInputRef: React.RefObject<SafeInputField>;

  constructor(props: TimeInputProps) {
    super(props);
    this.state = {
      valid: true,
      validated: false,
      timeString: getValue(props),
    };

    this.wrapperRef = React.createRef();
    this.hoursInputRef = React.createRef();
    this.minutesInputRef = React.createRef();
  }

  static getDerivedStateFromProps(
    nextProps: TimeInputProps,
    prevState: TimeInputState
  ): { value: string | undefined; timeString: string | undefined } | null {
    if (nextProps.value !== prevState.value) {
      return { value: nextProps.value, timeString: getValue(nextProps) };
    } else {
      return null;
    }
  }

  getTimeStringFromDate(date: Date): string {
    const momentDate = moment(date);
    return `${momentDate.hours()}${TIME_SEPARATOR}${momentDate.minutes()}`;
  }

  validateField(requiredValidation?: boolean): Promise<void> {
    this.setState({ validated: true });
    if (requiredValidation) {
      return new Promise<void>((resolve: () => void) => {
        this.validateWhenRequired(resolve);
      });
    } else {
      return new Promise<void>((resolve: () => void) => {
        this.validate(resolve);
      });
    }
  }

  validate(cb?: () => void): void {
    const promises: Array<Promise<void>> = [];
    if (this.hoursInputRef.current) {
      promises.push(this.hoursInputRef.current.validateField());
    }
    if (this.minutesInputRef.current) {
      promises.push(this.minutesInputRef.current.validateField());
    }
    Promise.all(promises).then(() => {
      const newValue = this.areAllFieldsValid() && this.isTimeValid();
      this.setState({ valid: !!newValue }, () => {
        this.updateErrorMessage();
        if (cb) cb();
      });
    });
  }

  validateWhenRequired(cb?: () => void): void {
    const promises: Array<Promise<void>> = [];
    if (this.hoursInputRef.current) {
      promises.push(this.hoursInputRef.current.validateField());
    }
    if (this.minutesInputRef.current) {
      promises.push(this.minutesInputRef.current.validateField());
    }
    Promise.all(promises).then(() => {
      const newValue = this.areAllFieldsValid();
      this.setState({ valid: !!newValue }, cb);
    });
  }

  isValid(): boolean {
    return this.state.valid;
  }

  areAllFieldsValid(): boolean | null {
    return (
      this.hoursInputRef.current &&
      this.hoursInputRef.current.isValid() &&
      this.minutesInputRef.current &&
      this.minutesInputRef.current.isValid()
    );
  }

  isTimeValid(): boolean {
    const hoursAsString = getHoursFromTimeString(String(this.state.timeString), TIME_SEPARATOR);
    const minutesAsString = getMinutesFromTimeString(String(this.state.timeString), TIME_SEPARATOR);
    const isTimeStringEmpty = !this.state.timeString || this.state.timeString === '';

    if (this.props.isRequired && isTimeStringEmpty) {
      return false;
    } else if (hoursAsString === '' || minutesAsString === '') {
      // Felt er ikke fylt ut enda, kan ikke validere
      return true;
    }

    try {
      const hours = parseInt(hoursAsString, 10);
      const minutes = parseInt(minutesAsString, 10);
      const time = moment(new Date()).hours(hours).minutes(minutes);
      const minTime = this.getMinTime();
      const maxTime = this.getMaxTime();
      return time.isBetween(minTime, maxTime) || time.isSame(minTime) || time.isSame(maxTime);
    } catch (e) {
      return false;
    }
  }

  getMaxTime(): Date {
    return moment(new Date()).hours(this.getMaxHour()).minutes(this.getMaxMinute()).toDate();
  }

  getMinTime(): Date {
    return moment(new Date()).hours(this.getMinHour()).minutes(this.getMinMinute()).toDate();
  }

  onChildValidated = (): void => {
    if (!this.state.validated) {
      return;
    }
    const newValue = this.areAllFieldsValid() && this.isTimeValid();
    this.setState({ valid: !!newValue }, () => {
      this.notifyValidated();
      this.updateErrorMessage();
    });
  };

  onChangeValidator = (): boolean => {
    return true;
  };

  notifyValidated(): void {
    if (!this.props.onValidated) {
      return;
    }
    this.props.onValidated(this.state.valid);
  }

  getMinHour(): number {
    return this.props.minHour ? this.props.minHour : 0;
  }
  getMaxHour(): number {
    return this.props.maxHour ? this.props.maxHour : 23;
  }
  getMinMinute(): number {
    return this.props.minMinute ? this.props.minMinute : 0;
  }

  getMaxMinute(): number {
    return this.props.maxMinute ? this.props.maxMinute : 59;
  }

  getErrorString(): string | undefined {
    return this.state.errorString;
  }

  handleHoursChange = (event: React.FormEvent<{}>): void => {
    const value = (event.target as HTMLInputElement).value;
    const minutes = getMinutesFromTimeString(String(this.state.timeString), TIME_SEPARATOR);
    const newValue = `${value}${TIME_SEPARATOR}${minutes}`;

    this.setState(
      {
        timeString: newValue,
      },
      () => {
        if (this.props.onTimeChange) {
          this.props.onTimeChange(newValue);
          return;
        }

        if (this.state.validated) {
          this.validate();
          this.notifyValidated();
        }
      }
    );
  };

  handleMinutesChange = (event: React.FormEvent<{}>): void => {
    const value = (event.target as HTMLInputElement).value;
    const hours = getHoursFromTimeString(String(this.state.timeString), TIME_SEPARATOR);
    const newValue = `${hours}${TIME_SEPARATOR}${value}`;
    this.setState(
      {
        timeString: newValue,
      },
      () => {
        if (this.props.onTimeChange) {
          this.props.onTimeChange(newValue);
          return;
        }

        if (this.state.validated) {
          this.validate();
          this.notifyValidated();
        }
      }
    );
  };

  onBlur = (): void => {
    // This is to check whereas the focus is still within the component (should wait) or if the user has gone further (should then validate)
    if (this.wrapperRef && this.wrapperRef.current) {
      const hours = this.padNumber(getHoursFromTimeString(String(this.state.timeString), TIME_SEPARATOR));
      const minutes = this.padNumber(getMinutesFromTimeString(String(this.state.timeString), TIME_SEPARATOR));
      const newValue = `${hours}${TIME_SEPARATOR}${minutes}`;

      this.setState({ timeString: newValue });

      const wrapperNode = this.wrapperRef.current;
      setTimeout(() => {
        const focusedElement = getDocumentActiveElement(wrapperNode, this.props.logCallback);

        if (!wrapperNode.contains(focusedElement)) {
          this.validate();
          if (this.props.onBlur) this.props.onBlur(newValue);
        }
      }, 0);
    }
  };

  onBlurTimeValidator = (time: number | string): boolean => {
    if (time === '') {
      return true;
    }
    if (time > this.getMaxHour() || time < this.getMinHour()) {
      return false;
    }
    return true;
  };

  onBlurMinutesValidator = (minute: number | string): boolean => {
    if (minute === '') {
      return true;
    }
    if (minute > this.getMaxMinute() || minute < this.getMinMinute()) {
      return false;
    }
    return true;
  };

  padNumber(number: string | undefined): string | undefined {
    if (number && number.length < 2 && parseInt(number, 10) < 10) {
      return '0' + number;
    }
    return number;
  }

  updateErrorMessage = (): void => {
    const { errorMessage, minHour, maxHour, minMinute, maxMinute, isRequired, resources } = this.props;
    let errorString: string | undefined = undefined;
    if (this.state.valid) {
      errorString = undefined;
    } else {
      const hours = this.state.timeString ? parseInt(getHoursFromTimeString(String(this.state.timeString), TIME_SEPARATOR), 10) : undefined;
      const minutes = this.state.timeString
        ? parseInt(getMinutesFromTimeString(String(this.state.timeString), TIME_SEPARATOR), 10)
        : undefined;

      if (errorMessage) {
        errorString = typeof errorMessage === 'string' ? errorMessage : errorMessage(this.state.timeString);
      } else if (isRequired && (!this.state.timeString || this.state.timeString === ':')) {
        errorString = resources?.errorResources?.errorRequiredTime || ERROR_REQUIRED_TIME;
      } else if (hours && minHour && hours < minHour) {
        errorString = `${ERROR_HOURS_BEFORE_MIN}: ${minHour}t`;
      } else if (hours && maxHour && hours > maxHour) {
        errorString = `${ERROR_HOURS_AFTER_MAX}: ${maxHour}t`;
      } else if ((minutes || minutes === 0) && (minMinute || minMinute === 0) && minutes < minMinute) {
        errorString = `${ERROR_MINUTES_BEFORE_MIN}: ${minMinute}min`;
      } else if ((minutes || minutes === 0) && (maxMinute || maxMinute === 0) && minutes > maxMinute) {
        errorString = `${ERROR_MINUTES_AFTER_MAX}: ${maxMinute}min`;
      } else {
        errorString = resources?.errorResources?.errorInvalidTime || ERROR_INVALID_TIME;
      }
    }
    this.setState({ errorString });
  };

  renderTimeInputfields(): JSX.Element {
    const { id, inputClassName, isRequired, readOnly, resources } = this.props;
    const { validated, timeString } = this.state;
    const ariaInvalid = {};
    if (validated) ariaInvalid['aria-invalid'] = !this.isValid();

    const hours = getHoursFromTimeString(String(timeString), TIME_SEPARATOR);
    const minutes = getMinutesFromTimeString(String(timeString), TIME_SEPARATOR);
    return (
      <div ref={this.wrapperRef} className="mol_timeinput__inputs">
        <SafeInputField
          ref={this.hoursInputRef}
          id={`${id}_hours`}
          type="number"
          value={hours ? hours : undefined}
          className={inputClassName}
          ariaLabel="Timer"
          placeholder={resources?.placeholderHours}
          maxLength={2}
          min={this.getMinHour()}
          max={this.getMaxHour()}
          onChange={this.handleHoursChange}
          onValidated={this.onChildValidated}
          onChangeValidator={this.onChangeValidator}
          onBlur={this.onBlur}
          validationErrorRenderer={<span />}
          isValidationHidden
          isRequired={isRequired}
          readOnly={readOnly}
          disabled={readOnly}
          {...ariaInvalid}
        />
        <span className="mol_timeinput__separator">{':'}</span>
        <SafeInputField
          ref={this.minutesInputRef}
          id={`${id}_minutes`}
          type="number"
          value={minutes ? minutes : undefined}
          className={inputClassName}
          ariaLabel="Minutter"
          placeholder={resources?.placeholderMinutes}
          maxLength={2}
          min={this.getMinMinute()}
          max={this.getMaxMinute()}
          onChange={this.handleMinutesChange}
          onValidated={this.onChildValidated}
          onChangeValidator={this.onChangeValidator}
          onBlur={this.onBlur}
          validationErrorRenderer={<span />}
          isValidationHidden
          isRequired={isRequired}
          readOnly={readOnly}
          disabled={readOnly}
          {...ariaInvalid}
        />
        {this.renderResetButton()}
        {this.props.children}
      </div>
    );
  }

  renderLegend = (): JSX.Element => {
    const { legend, subLabel, isRequired, requiredLabel, showRequiredLabel, optionalLabel, showOptionalLabel, helpButton } = this.props;
    return (
      <legend>
        <span className={'mol_timeinput__legend'}>
          <span className={'mol_timeinput__legend__label'}>{legend}</span>
          {isRequired && requiredLabel && showRequiredLabel ? <em className={'mol_timeinput__legend__sublabel'}> {requiredLabel}</em> : ''}
          {!isRequired && optionalLabel && showOptionalLabel ? <em className={'mol_timeinput__legend__sublabel'}> {optionalLabel}</em> : ''}
          {helpButton}
          {subLabel && <Sublabel sublabelText={subLabel} />}
        </span>
      </legend>
    );
  };

  resetFields = (): void => {
    this.setState({ timeString: undefined }, () => {
      if (this.props.onTimeChange) {
        this.props.onTimeChange(undefined);
      }
      if (this.props.resetButton && this.props.resetButton.onReset) {
        this.props.resetButton.onReset();
      }
    });
  };

  renderResetButton = (): JSX.Element | undefined => {
    if (this.props.resetButton && this.props.resetButton.resetButtonText) {
      return (
        <div className="mol_timeinput__resetbutton" onBlur={this.onBlur}>
          <Button intent={'danger'} variant={'borderless'} onClick={this.resetFields}>
            <Icon svgIcon={Undo} />
            {this.props.resetButton.resetButtonText}
          </Button>
        </div>
      );
    }
  };

  renderHelp = (): JSX.Element | undefined => {
    if (this.props.helpElement) {
      return this.props.helpElement;
    }
  };

  render(): JSX.Element | null {
    const { valid, errorString } = this.state;
    const { id, legend, className, renderFieldset, isValidationHidden } = this.props;

    const wrapperClasses = classNames(
      {
        mol_validation: !isValidationHidden,
        'mol_validation--active': !isValidationHidden && !valid,
      },
      className
    );

    if (!renderFieldset) {
      return <div className={wrapperClasses}>{this.renderTimeInputfields()}</div>;
    }
    return (
      <div className={`mol_timeinput ${wrapperClasses}`} id={`${id}-wrapper`}>
        {!isValidationHidden && <ValidationError isValid={valid} error={errorString} />}
        <fieldset>
          {legend && this.renderLegend()}
          {this.renderHelp()}
          {this.renderTimeInputfields()}
        </fieldset>
      </div>
    );
  }
}
