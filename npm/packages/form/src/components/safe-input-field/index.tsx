import * as React from 'react';

import classNames from 'classnames';

import Loader from '@helsenorge/designsystem-react/components/Loader';

import ValidationError from '../form/validation-error';
import { Label } from '../label';

import './styles.scss';

interface InputProps {
  step?: string;
  onKeyPress?: (e: React.KeyboardEvent<unknown>) => void;
  onKeyUp?: (e: React.KeyboardEvent<unknown>) => void;
  onPaste?: (e: React.ClipboardEvent) => void;
}

export interface SafeInputFieldProps {
  /** Unik ID */
  id?: string;
  /** name attributt på input feltet */
  inputName?: string;
  /**  HMTL Input type */
  type?: string;
  /** Verdi som vises i feltet */
  value?: string | number;
  /** Tekst placeholder som vises i feltet når det ikke er satt value */
  placeholder?: string;
  /** Om input feltet er readOnly */
  readOnly?: boolean;
  /** Om feltet er disabled */
  disabled?: boolean;
  /** Ekstra CSS-class som legges på wrapperen */
  wrapperClasses?: string;
  /** Innhold som vises i komponentet */
  children?: React.ReactNode;
  /** Ekstra CSS-class som legges på feltet */
  className?: string;
  /* Minimum integer verdi godkjent til validering. Må være av type=number */
  min?: number;
  /** Minimum lengde på tekst i input */
  minLength?: number;
  /* Maksimum integer verdi godkjent til validering. Må være av type=number */
  max?: number;
  /** Maksimum lengde på tekst i input. En feilmelding vises dersom man skriver inn flere tegn. */
  maxLength?: number;
  /** Function som kallers når det tastes i feltet */
  onKeyDown?: React.EventHandler<React.KeyboardEvent<HTMLInputElement>>;
  /** Function som kalles når fokus går bort fra feltet */
  onBlur?: (event: React.FocusEvent<{}>) => void | undefined;
  /** Validator Function som kalles når fokus går bort fra feltet */
  onBlurValidator?: (value: string | number) => Promise<boolean>;
  /** Function som kalles når fokus er på feltet */
  onFocus?: (event: React.FocusEvent<{}>, id: string | undefined) => void;
  /** Function som kalles når verdien i feltet endres */
  onChange?: (event: React.FormEvent<{}>, id: string | undefined, formattedValue: string) => void;
  /** Function som kalles når datoen valideres riktig */
  onValidated?: (valid: boolean | undefined) => void;
  /** Tillatter bare endringer av feltet hvis denne funksjonen returnerer true */
  onChangeValidator?: (value: string | number) => boolean;
  /** Validerer value ved submit, dersom required */
  onSubmitValidator?: (value?: string | number) => boolean;
  /** Denne funksjonen returnere strengen dette feltet settes til etter onChange. Tar imot e.target.value */
  onChangeFormatter?: (value: string | number) => string;
  /** ErrorMessages som vises gjennom validering */
  errorMessage?: string | ((value: string | number | undefined) => string);
  /** Meldingen som vises ved feilmelding om required*/
  requiredErrorMessage?: string | ((value: string | number | undefined) => string);
  /** Component som vises ved validartion error */
  validationErrorRenderer?: JSX.Element;
  /** Om feltet er påkrevd eller ikke */
  isRequired?: boolean;
  /** Om label skal vises eller ikke */
  showLabel?: boolean;
  /** Teksten til label */
  label?: string | JSX.Element;
  /** Teksten til sub label, brukes som enkel hjelpetekst. Sublabel legges som et eget blokk-element nederst i <label> til dette feltet */
  subLabel?: string | JSX.Element;
  /** Teksten til required label */
  requiredLabel?: string;
  /** Teksten til optional label */
  optionalLabel?: string;
  /** HTML aria-required */
  ariaRequired?: boolean;
  /** HTML aria-label */
  ariaLabel?: string;
  /** HTML aria-labbeledby*/
  ariaLabelledby?: string;
  /** Optional regex pattern for validate methoden */
  pattern?: string;
  /** Om required label skal vises eller ikke */
  showRequiredLabel?: boolean;
  /** Om ekstra label skal vises eller ikke */
  showOptionalLabel?: boolean;
  /** størrelse på feltet */
  size?: 'xSmall' | 'small' | 'medium' | 'large' | 'xLarge' | 'fullSize';
  /** Om feltet skal beholde auto størrelse */
  keepDefaultSize?: boolean;
  /** Plassering til Spinner */
  blurSpinnerAlignment?: 'left' | 'right';
  /** TabIndex på selve komponent'en */
  tabIndex?: number;
  /** Hjelpetrigger som vises etter label */
  helpButton?: JSX.Element;
  /** Element som vises når man klikker på HelpButton */
  helpElement?: JSX.Element;
  /** Events to be forwarded - brukes i gamle pasientreiser og skjemautfyller - kan muligens fases ut etterhvert
   *  @deprecated
   */
  inputProps?: InputProps;
  /** attribute autocomplete,  */
  autocomplete?: string;
  /* Dersom mol_validation og error meldinger ved validering skal skjules */
  isValidationHidden: boolean;
  /** Update valid-state also when component is not updated through component */
  validateOnExternalUpdate?: boolean;
  /** Feilmelding som vises dersom for mange tegn skrives inn i feltet. Default tekst er "Du har skrevet for mange tegn. Gjør teksten kortere." */
  stringOverMaxLengthError?: string;
  /** Id som benyttes for å hente ut input i automatiske tester */
  inputTestId?: string;
  /** Id som benyttes for å hente ut ValidationError i automatiske tester */
  validationTestId?: string;
  /** Id som benyttes for å hente ut Label i automatiske tester */
  labelTestId?: string;
}

export interface SafeInputFieldState {
  focused?: boolean;
  isValid: boolean;
  value?: string | number;
  validated?: boolean;
  loading: boolean;
  dirtyInput: boolean;
  onBlurValidationPromise?: Promise<boolean>;
  handleValidation?: boolean;
  propValue?: string | number;
}

interface EventTargetWithValue extends EventTarget {
  value: string;
}

/**
 * Dette tekstinputfeltet kan trygt motta nye props fra parent uten at verdien i inputfeltet overskrives
 * hvis feltet redigeres akkurat idet de nye propene sendes inn fra parent. Endringer av feltet blir
 * sendt til parent ved onBlur.
 */
export default class SafeInputField extends React.Component<SafeInputFieldProps, SafeInputFieldState> {
  static hnFormComponent = true;
  inputFieldRef: React.RefObject<HTMLInputElement>;

  static defaultProps: SafeInputFieldProps = {
    id: undefined,
    onBlur: undefined,
    value: undefined,
    showRequiredLabel: true,
    readOnly: false,
    size: 'medium',
    blurSpinnerAlignment: 'left',
    isValidationHidden: false,
  };

  constructor(props: SafeInputFieldProps) {
    super(props);
    this.state = {
      focused: false,
      isValid: true,
      value: undefined,
      validated: false,
      loading: false,
      dirtyInput: false,
      handleValidation: false,
      propValue: undefined, // Kopi av prop.value som brukes til å sammenlikne value-endringer
    };

    this.inputFieldRef = React.createRef();

    this.onChange = this.onChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleValidation = this.handleValidation.bind(this);
    this.notifyChanged = this.notifyChanged.bind(this);
    this.notifyValidated = this.notifyValidated.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.focus = this.focus.bind(this);
    this.isTypeNumber = this.isTypeNumber.bind(this);
    this.validate = this.validate.bind(this);
    this.validateNumber = this.validateNumber.bind(this);
    this.validateField = this.validateField.bind(this);
    this.isValidIfRequired = this.isValidIfRequired.bind(this);
    this.isValid = this.isValid.bind(this);
    this.renderErrorMessage = this.renderErrorMessage.bind(this);
    this.renderLabel = this.renderLabel.bind(this);
    this.getInputClasses = this.getInputClasses.bind(this);
  }

  componentDidMount(): void {
    const { value }: SafeInputFieldProps = this.props;
    this.setState({ value, propValue: value }, () => {
      if (value === '' || value === null || value === undefined) {
        return;
      } else {
        // Kjør alle valideringsfunksjoner
        if (!this.validate(value)) {
          this.setState({ isValid: false, validated: true });
        } else if (this.props.onChangeValidator && !this.props.onChangeValidator(value)) {
          this.setState({ isValid: false, validated: true });
        } else if (this.props.onBlurValidator) {
          this.props.onBlurValidator(value).then(isValid => {
            this.setState({ isValid, validated: true });
          });
        }
      }
    });
  }

  static getDerivedStateFromProps(nextProps: SafeInputFieldProps, prevState: SafeInputFieldState): SafeInputFieldState | null {
    const updatedState = { ...prevState };
    const hasPropChanged = nextProps.value !== prevState.propValue;
    if (hasPropChanged) updatedState.propValue = nextProps.value;

    if (nextProps.validateOnExternalUpdate && prevState.propValue !== prevState.value) {
      const valueString = updatedState.propValue as string;
      const compareValueString = prevState.propValue as string;
      let formattedValue = valueString;
      let compareFormattedValue = compareValueString;
      if (nextProps.onChangeFormatter) {
        formattedValue = nextProps.onChangeFormatter(formattedValue);
        compareFormattedValue = nextProps.onChangeFormatter(compareFormattedValue);
      }
      if (compareFormattedValue !== prevState.value && hasPropChanged) {
        // Input har endret seg. Dirtyinput = ikke validert
        updatedState.value = formattedValue;
        updatedState.dirtyInput = true;
        updatedState.handleValidation = true;
      }

      return updatedState === prevState ? null : updatedState;
    }
    if (hasPropChanged && updatedState.propValue !== prevState.value) {
      updatedState.value = updatedState.propValue;
      updatedState.dirtyInput = true;
      updatedState.handleValidation = true;
    }
    return updatedState === prevState ? null : updatedState;
  }

  componentDidUpdate(_prevProps: SafeInputFieldProps, prevState: SafeInputFieldState) {
    if (this.state.handleValidation) {
      const valueString = this.state.value as string;
      this.handleValidation(valueString, valueString);
      this.setState({ handleValidation: false });
    }

    if (prevState.isValid !== this.state.isValid) {
      this.notifyValidated();
    }
  }

  onChange(e: React.FormEvent<{}>) {
    const value: string = (e.target as EventTargetWithValue).value as string;
    this.handleChange(value, formattedValue => this.notifyChanged(e, formattedValue));
  }

  handleChange(value: string, notify?: (formattedValue: string) => void) {
    let formattedValue: string = value;
    if (this.props.onChangeFormatter) {
      formattedValue = this.props.onChangeFormatter(value);
    }
    if (formattedValue !== this.state.value) {
      // Input har endret seg. Dirtyinput = ikke validert
      this.setState({ value: formattedValue, dirtyInput: true });

      this.handleValidation(value, formattedValue, notify);
    }
  }

  handleValidation(value: string, formattedValue: string, notify?: (formattedValue: string) => void) {
    if (!this.validate(formattedValue)) {
      this.setState({ isValid: false });
    } else if (this.props.onChangeValidator && this.state.validated) {
      this.setState({ isValid: this.props.onChangeValidator(value) });
    } else {
      this.setState({ isValid: true });
    }

    if (notify) {
      notify(formattedValue);
    }

    if (!formattedValue || this.isValueOverMaxLength(formattedValue)) {
      this.setState({
        validated: !formattedValue ? false : true,
      });
    }
  }

  notifyChanged(e: React.FormEvent<{}>, formattedValue: string) {
    if (this.props.onChange) {
      this.props.onChange(e, this.props.id, formattedValue);
    }
  }

  notifyValidated() {
    if (this.props.onValidated) {
      this.props.onValidated(this.state.isValid);
    }
  }

  onMouseDown() {
    if (this.props.type !== 'number') {
      return;
    }
    if (this.state.focused) {
      return;
    }
    // Firefox does not focus number input field on click on arrow buttons
    this.focus();
  }

  onFocus(e: React.FocusEvent<{}>) {
    this.setState({ focused: true });
    if (this.props.onFocus) {
      this.props.onFocus(e, this.props.id);
    }
  }

  onBlur(e: React.FocusEvent<{}>) {
    e.persist();
    const value: string = (e.target as EventTargetWithValue).value as string;
    this.setState({ focused: false });
    let state: Partial<SafeInputFieldState> | null = null;
    if (this.state.dirtyInput) {
      if (!this.validate(value)) {
        state = { isValid: false, validated: true, dirtyInput: false };
      } else if (typeof value === 'string' && this.props.minLength && value && value.length < this.props.minLength) {
        state = { isValid: false, validated: true, dirtyInput: false };
      } else if (value !== '' && this.props.onChangeValidator && !this.props.onChangeValidator(value)) {
        state = { isValid: false, validated: true, dirtyInput: false };
      } else if (value !== '' && this.props.onBlurValidator) {
        state = {
          loading: true,
          onBlurValidationPromise: this.props.onBlurValidator(value),
        };
      }
    }
    if (state) {
      this.setState(state as SafeInputFieldState, () => {
        if (this.props.onBlurValidator && this.state.onBlurValidationPromise) {
          this.state.onBlurValidationPromise.then(isValid => {
            this.setState({
              isValid,
              validated: true,
              loading: false,
              dirtyInput: false,
              onBlurValidationPromise: undefined,
            });
          });
        }
        if (this.props.onBlur) {
          this.props.onBlur(e);
        }
      });
    } else {
      if (this.props.onBlur) {
        this.props.onBlur(e);
      }
    }
  }

  focus() {
    if (this.inputFieldRef.current) this.inputFieldRef.current.focus();
  }

  isTypeNumber() {
    return this.props.type === 'number' || this.props.type === 'tel';
  }

  validate(value: string | number | undefined) {
    if (this.isTypeNumber() && !this.validateNumber(value)) {
      return false;
    }
    if (typeof value === 'string' && !this.state.isValid && this.props.minLength && value && value.length < this.props.minLength) {
      return false;
    }
    if (this.isValueOverMaxLength(value)) {
      return false;
    }
    if (this.props.pattern && value) {
      const regexp = new RegExp(this.props.pattern);
      if (!regexp.test(value.toString())) {
        return false;
      }
    }
    return true;
  }

  isValueOverMaxLength(value: string | number | undefined) {
    return typeof value === 'string' && this.props.maxLength && value && value.length > this.props.maxLength;
  }

  validateNumber(value: string | number | undefined) {
    const { min, max } = this.props;

    if (!value) {
      return true;
    }
    if (min !== null && min !== undefined && value < min) {
      return false;
    }
    if (max !== null && max !== undefined && value > max) {
      return false;
    }
    return true;
  }

  // Denne funksjonen blir kalt på submit i form.
  validateField() {
    return new Promise<void>((resolve: () => void) => {
      if (this.props.onSubmitValidator) {
        this.setState({
          isValid: this.props.onSubmitValidator(this.state.value),
          validated: true,
        });
        resolve();
      } else if (!this.isValidIfRequired()) {
        this.setState({ isValid: false, validated: true });
        resolve();
      } else if (this.state.onBlurValidationPromise) {
        // Onblurvalidering på gang, vi må vente til den er ferdig før vi vet om form er gyldig
        this.state.onBlurValidationPromise.then(() => {
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  isValidIfRequired() {
    if (this.props.isRequired) {
      return this.state.value !== null && this.state.value !== undefined && this.state.value.toString().trim() !== '';
    }

    return true;
  }

  isValid() {
    return this.state.isValid;
  }

  renderErrorMessage() {
    if (this.props.isValidationHidden) {
      return null;
    }
    if (this.props.validationErrorRenderer && !this.state.isValid) {
      return this.props.validationErrorRenderer;
    }

    let error: string | undefined = '';
    if (!this.state.isValid) {
      if (this.props.isRequired && !this.isValidIfRequired() && this.props.requiredErrorMessage) {
        error =
          typeof this.props.requiredErrorMessage === 'string'
            ? this.props.requiredErrorMessage
            : this.props.requiredErrorMessage(this.state.value);
      } else if (this.props.errorMessage) {
        error = typeof this.props.errorMessage === 'string' ? this.props.errorMessage : this.props.errorMessage(this.state.value);
      } else {
        error = 'Ugyldig verdi';
      }

      if (this.isValueOverMaxLength(this.state.value)) {
        error = this.props.stringOverMaxLengthError
          ? this.props.stringOverMaxLengthError
          : 'Du har skrevet for mange tegn. Gjør teksten kortere.';
      }
    }

    return <ValidationError isValid={this.state.isValid} error={error} testId={this.props.validationTestId} />;
  }

  createMarkup(htmlString: string) {
    return { __html: htmlString };
  }

  renderLabel = () => {
    if (this.props.label !== undefined) {
      const labelText = (
        <React.Fragment>
          {this.props.label}
          {this.props.isRequired && this.props.requiredLabel && this.props.showRequiredLabel ? <em> {this.props.requiredLabel}</em> : ''}

          {!this.props.isRequired && this.props.optionalLabel && this.props.showOptionalLabel ? <em> {this.props.optionalLabel}</em> : ''}
        </React.Fragment>
      );

      return (
        <Label
          labelText={labelText}
          htmlFor={this.props.inputName}
          sublabelText={this.props.subLabel}
          testId={this.props.labelTestId}
          helpButton={this.props.helpButton}
        />
      );
    }
    return null;
  };

  getInputClasses() {
    if (this.props.maxLength) {
      const max: number = this.props.maxLength > 40 ? 40 : this.props.maxLength;
      return `atom_input--${max}`;
    } else if (this.props.max && (this.props.type === 'number' || this.props.type === 'tel')) {
      const length: number = this.props.max.toString().length;
      return `atom_input--${length}`;
    } else {
      return '';
    }
  }

  render() {
    const {
      className,
      disabled,
      size,
      blurSpinnerAlignment,
      keepDefaultSize,
      isRequired,
      id,
      inputName,
      tabIndex,
      min,
      max,
      minLength,
      type,
      wrapperClasses,
      isValidationHidden,
      placeholder,
      onKeyDown,
      ariaLabel,
      ariaLabelledby,
      ariaRequired,
      inputProps,
      readOnly,
      helpElement,
      autocomplete,
      inputTestId,
    }: SafeInputFieldProps = this.props;
    const { value, isValid, validated, loading } = this.state;

    const inputValue: string = typeof value === 'string' ? (value as string) : value ? value.toString() : '';

    const inputClasses: string = classNames(
      'hn-safe-input',
      'atom_input',
      className,
      {
        'safeInputFieldError atom_input--state_validationerror': validated && !isValid,
        'atom_input--xsmall': size === 'xSmall',
        'atom_input--small': size === 'small',
        'atom_input--medium': size === 'medium',
        'atom_input--large': size === 'large',
        'atom_input--xlarge': size === 'xLarge',
        atom_input: size === 'fullSize',
        'atom_input--loading': loading,
        'atom_input--spinnerright': blurSpinnerAlignment === 'right',
        'atom_input--disabled': disabled,
      },
      keepDefaultSize ? '' : this.getInputClasses()
    );

    const classes: string = classNames('safeInputField', wrapperClasses, {
      mol_validation: !isValidationHidden,
      'mol_validation--active': !isValidationHidden && validated && !isValid,
    });

    let required = false;
    if (isRequired) {
      required = isRequired;
    }

    const ariaInvalid = {};
    if (validated) {
      ariaInvalid['aria-invalid'] = validated && !isValid;
    }

    return (
      <div className={classes} id={`${id}-wrapper`}>
        {this.renderErrorMessage()}
        {this.renderLabel()}
        {helpElement ? helpElement : null}
        <span>
          <input
            ref={this.inputFieldRef}
            id={inputName}
            name={inputName}
            type={type ? type : 'text'}
            value={inputValue}
            placeholder={placeholder}
            className={inputClasses}
            min={min}
            max={max}
            minLength={minLength}
            autoComplete={autocomplete || 'off'}
            tabIndex={tabIndex}
            data-testid={inputTestId}
            onChange={this.onChange}
            onBlur={this.onBlur}
            onFocus={this.onFocus}
            onMouseDown={this.onMouseDown}
            onKeyDown={onKeyDown}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledby}
            aria-required={ariaRequired || required}
            required={required}
            disabled={disabled}
            readOnly={readOnly}
            {...inputProps}
            {...ariaInvalid}
          />
          {loading ? <Loader overlay="parent" size="small" className="atom_input__loader" /> : null}
        </span>
        {this.props.children}
      </div>
    );
  }
}
