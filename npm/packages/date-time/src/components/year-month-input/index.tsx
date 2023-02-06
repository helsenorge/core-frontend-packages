import * as React from 'react';

import classNames from 'classnames';
import moment from 'moment';

import { LanguageLocales } from '@helsenorge/core-utils/constants/languages';
import ValidationError from '@helsenorge/form/components/form/validation-error';
import { Sublabel } from '@helsenorge/form/components/label/sublabel';
import SafeInputField from '@helsenorge/form/components/safe-input-field';
import SafeSelectField from '@helsenorge/form/components/safe-select';

import {
  ERROR_INVALID_YEAR_MONTH,
  ERROR_REQUIRED_YEAR_MONTH,
  ERROR_YEAR_MONTH_BEFORE_MIN_DATE,
  ERROR_YEAR_MONTH_AFTER_MAX_DATE,
  MONTH_PLACEHOLDER,
  YEAR_PLACEHOLDER,
  ERROR_INVALID_YEAR_MONTH_YEAR,
} from '../../constants/datetime';

import toolkitstyles from './styles.module.scss';

const EMPTY_MONTH_VALUE = -1;

export interface YearMonthValue {
  year: number;
  month: number | null;
}

interface YearMonthInputProps {
  /** Unik ID */
  id: string;
  /** Definerer hvilken locale moment bruker - default en 'nb-NO'  */
  locale?: LanguageLocales.NORWEGIAN | LanguageLocales.ENGLISH;
  /** Teksten til label */
  legend?: JSX.Element | string;
  /** Teksten til sub label, brukes som enkel hjelpetekst. Sublabel legges som et eget blokk-element nederst i <legend> til dette feltet */
  subLabel?: string | JSX.Element;
  /** ekstra CSS-class som legges på <legend> */
  legendClassName?: string;
  /** Om feltet er påkrevd eller ikke */
  isRequired?: boolean;
  /** Hjelpetrigger som vises etter label */
  helpButton?: JSX.Element;
  /** Element som vises når man klikker på HelpButton */
  helpElement?: JSX.Element;
  /** Maksimalt tidspunkt som kan velges. Er et objekt { year: number, month: number } */
  maximumYearMonth?: YearMonthValue;
  /** Minimalt tidspunkt som kan velges. Er et objekt { year: number, month: number } */
  minimumYearMonth?: YearMonthValue;
  /** HTML til required label */
  requiredLabel?: string;
  /** Teksten til optional label */
  optionalLabel?: string;
  /** Tekst placeholder som vises i feltet når det ikke er satt value */
  placeholder?: string;
  /** Ekstra CSS-class som legges på feltet */
  className?: string;
  /** Om feltet er disabled */
  disabled?: boolean;
  /** Verdi som vises i feltet. Er et objekt { year: number, month: number | null}. Måned er 0-indeksert (som i vanlig javascript) */
  value?: YearMonthValue;
  /** Om required label skal vises eller ikke */
  showRequiredLabel?: boolean;
  /** Om ekstra label skal vises eller ikke */
  showOptionalLabel?: boolean;
  /** Feilmeldinger og placeholder-tekster */
  resources?: YearMonthResources;
  /** Function som kalles når verdien i feltet endres */
  onChange?: (newValue: YearMonthValue) => void;
  /** Function som kalles når feltverdien valideres riktig */
  onValidated?: (valid: boolean | undefined) => void;
  /** Id som benyttes for å hente ut ValidationError i automatiske tester */
  validationTestId?: string;
}

export interface YearMonthResources {
  errorInvalidYear: string;
  errorInvalidYearMonth: string;
  errorRequiredField: string;
  errorBeforeMinDate: string;
  errorAfterMaxDate: string;
  selectYearPlaceholder: string;
  selectMonthPlaceholder: string;
}

interface YearMonthInputState {
  value: YearMonthValue;
  isValid: boolean;
  isValidated: boolean;
  errorMessage: string;
}

export class YearMonthInput extends React.Component<YearMonthInputProps, YearMonthInputState> {
  constructor(props: YearMonthInputProps) {
    super(props);

    this.state = {
      value: props.value || { year: 0, month: null },
      isValid: true,
      isValidated: false,
      errorMessage: '',
    };

    this.notifyValidated = this.notifyValidated.bind(this);
    this.validate = this.validate.bind(this);
    this.onChangeYear = this.onChangeYear.bind(this);
    this.onChangeMonth = this.onChangeMonth.bind(this);
    this.onBlurYear = this.onBlurYear.bind(this);
    this.isValid = this.isValid.bind(this);
  }

  componentDidUpdate(_prevProps: YearMonthInputProps, prevState: YearMonthInputState): void {
    if (prevState.isValid !== this.state.isValid) {
      this.notifyValidated();
    }
  }

  static getDerivedStateFromProps(
    nextProps: YearMonthInputProps,
    prevState: YearMonthInputState
  ): { value: YearMonthValue | undefined } | null {
    if (nextProps.value && (nextProps.value.year !== prevState.value?.year || nextProps.value.month !== prevState.value?.month)) {
      return { value: nextProps.value };
    } else {
      return null;
    }
  }

  validateRequired(): string | void {
    if (this.props.isRequired && (!this.state.value?.year || this.state.value.month === null)) {
      return this.props.resources?.errorRequiredField || ERROR_REQUIRED_YEAR_MONTH;
    }
  }

  validateValidYear(value: number | undefined): string | void {
    // valider at dette er 4 siffer
    if (value && value.toString().length !== 4) {
      return this.props.resources?.errorInvalidYear || ERROR_INVALID_YEAR_MONTH_YEAR;
    }
  }

  getValidationValue(value: YearMonthValue): string {
    const month = `0${value.month}`.slice(-2);
    return `${value.year}${month}`;
  }

  validate(value: YearMonthValue | undefined): string | void {
    const hasMonthValue = value?.month !== null && value?.month !== undefined;
    const hasYearValue = !!value?.year;
    const validationValue = value && hasMonthValue && hasYearValue ? this.getValidationValue(value) : '';
    // valider at ikke kun et felt er fyllt ut:
    if (hasMonthValue !== hasYearValue) {
      return this.props.resources?.errorInvalidYearMonth || ERROR_INVALID_YEAR_MONTH;
    }

    // valider maximumDate
    if (
      validationValue &&
      this.props.maximumYearMonth &&
      this.props.maximumYearMonth.month !== null &&
      this.getValidationValue(this.props.maximumYearMonth) < validationValue
    ) {
      const errorString = this.props.resources?.errorAfterMaxDate || ERROR_YEAR_MONTH_AFTER_MAX_DATE;
      return `${errorString}: ${moment.months()[this.props.maximumYearMonth.month]} ${this.props.maximumYearMonth.year}`;
    }

    // valider minimumDate
    if (
      validationValue &&
      this.props.minimumYearMonth &&
      this.props.minimumYearMonth.month !== null &&
      this.getValidationValue(this.props.minimumYearMonth) > validationValue
    ) {
      const errorString = this.props.resources?.errorBeforeMinDate || ERROR_YEAR_MONTH_BEFORE_MIN_DATE;
      return `${errorString}: ${moment.months()[this.props.minimumYearMonth.month]} ${this.props.minimumYearMonth.year}`;
    }
  }

  // form submit validation
  validateField(): Promise<void> {
    return new Promise<void>((resolve: () => void) => {
      const errorMessage = this.validateRequired() || this.validateValidYear(this.state.value.year) || this.validate(this.state.value);
      this.setState(
        {
          errorMessage: errorMessage || '',
          isValid: !errorMessage,
          isValidated: true,
        },
        () => {
          this.notifyValidated();
          resolve();
        }
      );
    });
  }

  onChangeYear(_e: React.FormEvent<{}>, _id: string | undefined, formattedValue: string): void {
    const yearValue = parseInt(formattedValue) || 0;
    const newValue = { ...this.state.value, year: yearValue };
    this.setState({
      value: newValue,
    });
    if (!this.state.isValid) {
      const errorMessage = this.validateValidYear(yearValue) || this.validate(newValue);
      this.setState({
        isValid: !errorMessage,
      });
    }
    if (this.props.onChange) {
      this.props.onChange(newValue);
    }
  }

  onChangeMonth(event: React.FormEvent<{}>): void {
    const selected = parseInt((event.target as HTMLInputElement).value);
    const newValue = { ...this.state.value, month: selected === EMPTY_MONTH_VALUE ? null : selected };
    this.setState({
      value: newValue,
    });
    const errorMessage = this.validate(newValue);
    this.setState({
      isValid: !errorMessage,
      isValidated: true,
      errorMessage: errorMessage || '',
    });
    if (this.props.onChange) {
      this.props.onChange(newValue);
    }
  }

  notifyValidated(): void {
    if (this.props.onValidated) {
      this.props.onValidated(this.state.isValid);
    }
  }

  onBlurYear(): void {
    const yearErrorMessage = this.validateValidYear(this.state.value?.year);
    this.setState({
      errorMessage: yearErrorMessage || '',
      isValidated: true,
      isValid: !yearErrorMessage,
    });
  }

  isValid(): boolean {
    return this.state.isValid;
  }

  renderLegend(): JSX.Element {
    return (
      <legend className={this.props.legendClassName ? this.props.legendClassName : ''}>
        {this.props.legend}
        {this.props.isRequired && this.props.requiredLabel && this.props.showRequiredLabel ? <em> {this.props.requiredLabel}</em> : ''}
        {!this.props.isRequired && this.props.optionalLabel && this.props.showOptionalLabel ? <em> {this.props.optionalLabel}</em> : ''}
        {this.props.helpButton}
        {this.props.subLabel && <Sublabel sublabelText={this.props.subLabel} />}
      </legend>
    );
  }

  render(): JSX.Element {
    moment.locale(this.props.locale);

    const monthPlaceholder = this.props.resources?.selectMonthPlaceholder || MONTH_PLACEHOLDER;
    const monthNames = moment.months();

    const wrapperClasses = classNames(
      {
        mol_validation: true,
        'mol_validation--active': !this.state.isValid,
      },
      this.props.className
    );
    const monthOptions = monthNames.map((monthName, index) => new Option(monthName, index.toString()));
    if (!this.props.isRequired) {
      monthOptions.unshift(new Option(monthPlaceholder, EMPTY_MONTH_VALUE.toString()));
    }

    return (
      <div className={wrapperClasses} id={`${this.props.id}-wrapper`}>
        <ValidationError isValid={this.state.isValid} error={this.state.errorMessage} testId={this.props.validationTestId} />
        <fieldset>
          {this.props.legend && this.renderLegend()}
          {this.props.helpElement ? this.props.helpElement : null}
          <div className={toolkitstyles.mol_yearmonthinput__fieldwrapper}>
            <SafeInputField
              type="number"
              inputName={`${this.props.id}-yearfield`}
              maxLength={4}
              pattern="^[0-9]{4}$"
              wrapperClasses={toolkitstyles.mol_yearmonthinput__yearfield}
              isValidationHidden
              disabled={this.props.disabled}
              isRequired={this.props.isRequired}
              placeholder={this.props.resources?.selectYearPlaceholder || YEAR_PLACEHOLDER}
              value={this.state.value?.year}
              onChange={this.onChangeYear}
              onBlur={this.onBlurYear}
            />
            <SafeSelectField
              id={`${this.props.id}-monthfield`}
              value={this.state.value?.month !== null ? this.state.value?.month.toString() : ''}
              options={monthOptions}
              placeholder={new Option(this.props.resources?.selectMonthPlaceholder || MONTH_PLACEHOLDER, '')}
              disabled={this.props.disabled}
              isRequired={this.props.isRequired}
              onChange={this.onChangeMonth}
              ariaLabel={monthPlaceholder}
            />
          </div>
        </fieldset>
      </div>
    );
  }
}
