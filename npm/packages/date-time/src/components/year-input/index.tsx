import * as React from 'react';

import classNames from 'classnames';

import ValidationError from '@helsenorge/form/components/form/validation-error';
import SafeInputField from '@helsenorge/form/components/safe-input-field';

import { ERROR_INVALID_YEAR, ERROR_REQUIRED_YEAR, ERROR_YEAR_AFTER_MAX_DATE, ERROR_YEAR_BEFORE_MIN_DATE } from '../../constants/datetime';

interface YearInputProps {
  /** Unik ID */
  id: string;
  /** Teksten til label */
  label?: JSX.Element | string;
  /** Teksten til sub label, brukes som enkel hjelpetekst. Sublabel legges som et eget blokk-element nederst i <legend> til dette feltet */
  subLabel?: string | JSX.Element;
  /** Om feltet er påkrevd eller ikke */
  isRequired?: boolean;
  /** Hjelpetrigger som vises etter label */
  helpButton?: JSX.Element;
  /** Element som vises når man klikker på HelpButton */
  helpElement?: JSX.Element;
  /** Maksimalt årstall som kan velges */
  maximumYear?: number;
  /** Minimalt årstall som kan velges */
  minimumYear?: number;
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
  /** Verdi som vises i feltet */
  value?: number;
  /** Om required label skal vises eller ikke */
  showRequiredLabel?: boolean;
  /** Om ekstra label skal vises eller ikke */
  showOptionalLabel?: boolean;
  /** Feilmeldinger */
  errorResources?: YearErrorResources;
  /** Function som kalles når verdien i feltet endres */
  onChange?: (year: number) => void;
  /** Function som kalles når fokus går bort fra feltet */
  onBlur?: (e: React.FocusEvent<{}>) => void;
  /** Function som kalles når årstalled valideres riktig */
  onValidated?: (valid: boolean | undefined) => void;
  /** Id som benyttes for å hente ut Label i automatiske tester */
  labelTestId?: string;
  /** Id som benyttes for å hente ut ValidationError i automatiske tester */
  validationTestId?: string;
}

export interface YearErrorResources {
  errorInvalidYear: string;
  errorRequiredYear: string;
  errorYearBeforeMinDate: string;
  errorYearAfterMaxDate: string;
}

interface YearInputState {
  value: number;
  isValid: boolean;
  isValidated: boolean;
  errorMessage: string;
}

export class YearInput extends React.Component<YearInputProps, YearInputState> {
  constructor(props: YearInputProps) {
    super(props);

    this.state = {
      value: props.value || 0,
      isValid: true,
      isValidated: false,
      errorMessage: '',
    };

    this.notifyValidated = this.notifyValidated.bind(this);
    this.validate = this.validate.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.isValid = this.isValid.bind(this);
  }

  componentDidUpdate(_prevProps: YearInputProps, prevState: YearInputState): void {
    if (prevState.isValid !== this.state.isValid) {
      this.notifyValidated();
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps: YearInputProps): void {
    if (nextProps.value && nextProps.value !== this.props.value) {
      this.setState({ value: nextProps.value });
    }
  }

  validateRequired(): string | void {
    if (!this.state.value && this.props.isRequired) {
      return this.props.errorResources?.errorRequiredYear || ERROR_REQUIRED_YEAR;
    }
  }

  validate(value: number): string | void {
    // valider at dette er 4 siffer
    if (value && value.toString().length !== 4) {
      return this.props.errorResources?.errorInvalidYear || ERROR_INVALID_YEAR;
    }

    // valider maximumDate
    if (value && this.props.maximumYear && this.props.maximumYear < value) {
      const errorString = this.props.errorResources?.errorYearAfterMaxDate || ERROR_YEAR_AFTER_MAX_DATE;
      return `${errorString}: ${this.props.maximumYear}`;
    }

    // valider minimumDate
    if (value && this.props.minimumYear && this.props.minimumYear > value) {
      const errorString = this.props.errorResources?.errorYearBeforeMinDate || ERROR_YEAR_BEFORE_MIN_DATE;
      return `${errorString}: ${this.props.minimumYear}`;
    }
  }

  // form submit validation
  validateField(): Promise<void> {
    return new Promise<void>((resolve: () => void) => {
      const errorMessage = this.validateRequired() || this.validate(this.state.value);
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

  onChange(_e: React.FormEvent<{}>, _id: string | undefined, formattedValue: string): void {
    const numberValue = parseInt(formattedValue) || 0;
    this.setState({
      value: numberValue,
    });
    if (!this.state.isValid) {
      const errorMessage = this.validate(numberValue);
      this.setState({
        isValid: !errorMessage,
      });
    }
    if (this.props.onChange) {
      this.props.onChange(numberValue);
    }
  }

  notifyValidated(): void {
    if (this.props.onValidated) {
      this.props.onValidated(this.state.isValid);
    }
  }

  onBlur(e: React.FocusEvent<{}>): void {
    const errorMessage = this.validateRequired() || this.validate(this.state.value);
    this.setState({
      errorMessage: errorMessage || '',
      isValidated: true,
      isValid: !errorMessage,
    });
    if (this.props.onBlur) {
      this.props.onBlur(e);
    }
  }

  isValid(): boolean {
    return this.state.isValid;
  }

  render(): JSX.Element {
    const wrapperClasses = classNames(
      {
        mol_validation: true,
        'mol_validation--active': !this.state.isValid,
      },
      this.props.className
    );
    return (
      <div className={wrapperClasses} id={`${this.props.id}-wrapper`}>
        <ValidationError isValid={this.state.isValid} error={this.state.errorMessage} testId={this.props.validationTestId} />
        <SafeInputField
          type="number"
          inputName={`${this.props.id}-input`}
          maxLength={4}
          pattern="^[0-9]{4}$"
          isValidationHidden
          label={this.props.label}
          subLabel={this.props.subLabel}
          disabled={this.props.disabled}
          optionalLabel={this.props.optionalLabel}
          requiredLabel={this.props.requiredLabel}
          showRequiredLabel={this.props.showRequiredLabel}
          showOptionalLabel={this.props.showOptionalLabel}
          isRequired={this.props.isRequired}
          placeholder={this.props.placeholder}
          helpButton={this.props.helpButton}
          helpElement={this.props.helpElement}
          value={this.state.value}
          labelTestId={this.props.labelTestId}
          onChange={this.onChange}
          onBlur={this.onBlur}
        />
      </div>
    );
  }
}
