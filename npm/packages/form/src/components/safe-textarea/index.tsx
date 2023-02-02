import * as React from 'react';

import classNames from 'classnames';

import ValidationError from '../form/validation-error';
import { Label } from '../label';

import toolkitstyles from './styles.module.scss';

/**
 * Dette tekstområdet kan trygt motta nye props fra parent uten at verdien i inputfeltet overskrives
 * hvis feltet redigeres akkurat idet de nye propene sendes inn fra parent. Endringer av feltet blir
 * sendt til parent ved onChange.
 */

type sizes = 'xSmall' | 'small' | 'medium' | 'large' | 'xLarge';

interface Window {
  HTMLElement?: unknown;
  chrome?: unknown;
}
export interface SafeTextareaState {
  value?: string;
  defaultValue?: string;
  focused?: boolean;
  blurred?: boolean;
  valid: boolean;
  validated?: boolean;
  size?: sizes;
  maxlength?: number;
  triggerHandleOnChange: boolean;
  propValue?: string;
}

export interface SafeTextareaProps {
  /** Unik ID */
  id: string;
  /** Verdi som vises i feltet */
  value?: string;
  /** Tekst placeholder som vises i feltet når det ikke er satt value */
  placeholder?: string;
  /** Om input feltet er readOnly */
  readOnly?: boolean;
  /** Om feltet er disabled */
  disabled?: boolean;
  /** HTML attribute rows på textarea */
  rows?: number;
  /** HTML attribute auto-focus på textarea */
  autoFocus?: boolean;
  /** Ekstra CSS-class som legges på wrapperen */
  wrapperClasses?: string;
  /** Ekstra CSS-class som legges på char-counter */
  charCounterClasses?: string;
  /** Min lengde på tekst i input */
  minlength?: number;
  /** Maks lengde på tekst i input. En feilmelding vises dersom man skriver inn flere tegn. */
  maxlength?: number;
  /** Størrelse på feltet */
  size?: sizes;
  /** Innhold som vises i komponentet */
  children?: React.ReactNode;
  /** Om en counter for max antall tegn skal vises */
  counter?: boolean;
  /** Om lengden på label skal vises eller ikke*/
  hideLengthLabel?: boolean;
  /** Function som kalles når fokus går bort fra feltet */
  onBlur?: (event: React.FocusEvent<{}>) => void;
  /** Function som kalles når fokus er på feltet */
  onFocus?: (event: React.FocusEvent<{}>) => void;
  /** Function som kalles når verdien i feltet endres */
  onChange?: (event: React.FormEvent<{}>) => void;
  /** Function som kalles når datoen valideres riktig */
  onValidated?: (valid: boolean) => void;
  /** Validator Function */
  validator?: (value: string | undefined) => boolean;
  /** ErrorMessages som vises gjennom validering */
  errorMessage?: string | ((value: string | number | undefined) => string);
  /** ErrorMessages som vises når feltet er required og ikke fylt ut */
  requiredErrorMessage?: string | ((value: string | number | undefined) => string);
  /** Om feltet er påkrevd eller ikke */
  isRequired?: boolean;
  /** Om label skal vises eller ikke */
  showLabel?: boolean;
  /** Teksten til label */
  label?: React.ReactNode;
  /** Teksten til sub label, brukes som enkel hjelpetekst. Sublabel legges som et eget blokk-element nederst i <label> til dette feltet. Dersom feltet har sublabel, brukes ikke prop maxLengthText */
  subLabel?: string | JSX.Element;
  /** Teksten til required label */
  requiredLabel?: string;
  /** Teksten til optional label */
  optionalLabel?: string;
  /** Om required label skal vises eller ikke */
  showRequiredLabel?: boolean;
  /** Om ekstra label skal vises eller ikke */
  showOptionalLabel?: boolean;
  /** HTML aria-label */
  ariaLabel?: string;
  /** Hjelpetrigger som vises etter label */
  helpButton?: JSX.Element;
  /** Element som vises når man klikker på HelpButton */
  helpElement?: JSX.Element;
  /** Update valid-state also when component is not updated through component */
  validateOnExternalUpdate?: boolean;
  /** Feilmelding som vises dersom for mange tegn skrives inn i feltet. Default tekst er "Du har skrevet for mange tegn. Gjør teksten kortere." */
  stringOverMaxLengthError?: string;
  /** Tekst som vises under feltet dersom hideLengthLabel er false. Default tekst er "Maksimum ${maxlength} tegn". Denne vises ikke dersom feltet har sublabel */
  maxLengthText?: string;
  /** Id som benyttes for å hente ut komponent i automatiske tester */
  testId?: string;
}

const getSize = (props: SafeTextareaProps): sizes => {
  const { size, maxlength } = props;

  if (size) {
    return size;
  } else if (maxlength) {
    if (maxlength < 250) {
      return 'small';
    } else if (maxlength < 500) {
      return 'medium';
    } else {
      return 'large';
    }
  } else {
    return 'medium';
  }
};

export class SafeTextarea extends React.Component<SafeTextareaProps, SafeTextareaState> {
  static hnFormComponent = true;

  textareaRef: React.RefObject<HTMLTextAreaElement>;

  constructor(props: SafeTextareaProps) {
    super(props);
    this.textareaRef = React.createRef();

    this.state = {
      focused: false,
      value: undefined,
      defaultValue: props.value,
      blurred: false,
      valid: true,
      validated: false,
      triggerHandleOnChange: false,
      propValue: props.value, // Kopi av prop.value som brukes til å sammenlikne value-endringer
    };
  }

  componentDidMount(): void {
    const { value } = this.props;
    this.setState({ size: getSize(this.props), value }, () => {
      if (value === '' || value === null || value === undefined) {
        return;
      } else {
        this.validateField();
      }
    });

    if (this.props.autoFocus) {
      const position: number = this.props.value ? this.props.value.length : 0;
      if (this.textareaRef.current && typeof this.textareaRef.current.setSelectionRange === 'function') {
        this.textareaRef.current.setSelectionRange(position, position);
      }
    }
  }

  static getDerivedStateFromProps(nextProps: SafeTextareaProps, prevState: SafeTextareaState): SafeTextareaState | null {
    const updatedState = { ...prevState };
    if (nextProps.value !== prevState.propValue) {
      updatedState.propValue = nextProps.value;
    }
    if (updatedState.propValue && updatedState.propValue !== prevState.defaultValue && !prevState.focused) {
      updatedState.defaultValue = updatedState.propValue;
      updatedState.value = updatedState.propValue;
    }
    if (prevState.size !== nextProps.size || prevState.maxlength !== nextProps.maxlength) {
      updatedState.maxlength = nextProps.maxlength;
      updatedState.size = getSize(nextProps);
    }
    if (nextProps.validateOnExternalUpdate && nextProps.value !== prevState.propValue) {
      updatedState.triggerHandleOnChange = true;
    }

    if (updatedState !== prevState) {
      return updatedState;
    } else {
      return null;
    }
  }

  componentDidUpdate(_prevProps: SafeTextareaProps, prevState: SafeTextareaState): void {
    if (this.state.triggerHandleOnChange) {
      this.handleOnChange(this.props.value ?? '');
      this.setState({ triggerHandleOnChange: false });
    }

    if (prevState.valid !== this.state.valid) {
      this.notifyValidated();
    }
  }

  validator = (value: string | undefined): boolean => {
    const overMaxlength = this.isValueOverMaxLength(value);
    const underMinlength = this.isValueUnderMinLength(value);

    if (overMaxlength || underMinlength) {
      return false;
    } else if (this.props.validator) {
      return this.props.validator(value);
    } else {
      return true;
    }
  };

  isValueOverMaxLength = (value: string | undefined): boolean => {
    return this.props.maxlength && value ? value.replace(/(\r\n|\n|\r)/g, '-').length > this.props.maxlength : false;
  };

  isValueUnderMinLength = (value: string | undefined): boolean => {
    return this.props.minlength && value ? value.length < this.props.minlength : false;
  };

  validate = (value: string | undefined): Promise<void> => {
    return new Promise<void>((resolve: () => void) => {
      const validatedCB: () => void = () => {
        resolve();
      };
      this.setState({ valid: this.validator(value) && this.isValidIfRequired(value) }, validatedCB);
    });
  };

  onBlur = (event: React.FocusEvent<{}>): void => {
    const target = event.target as HTMLTextAreaElement;
    this.setState({ focused: false, blurred: true, valid: this.validator(target.value), validated: true });
    if (this.props.onBlur) {
      this.props.onBlur(event);
    }
  };

  onChange = (event: React.FormEvent<{}>): void => {
    const target: HTMLTextAreaElement = event.target as HTMLTextAreaElement;
    this.handleOnChange(target.value, () => {
      if (this.props.onChange) this.props.onChange(event);
    });
  };

  handleOnChange = (value: string, notify?: () => void): void => {
    this.setState({
      value,
      valid: this.validator(value),
      validated: this.isValueOverMaxLength(value) ? true : this.state.validated,
    });

    if (notify) {
      notify();
    }
  };

  notifyValidated = (): void => {
    if (this.props.onValidated) {
      this.props.onValidated(this.state.valid);
    }
  };

  validateField = (): Promise<void> => {
    this.setState({ validated: true });
    return this.validate(this.state.value);
  };

  isValidIfRequired = (value?: string): boolean => {
    if (this.props.isRequired) {
      return value !== null && value !== undefined && value.toString().trim() !== '';
    }

    return true;
  };

  isValid = (): boolean => {
    return this.state.valid;
  };

  onFocus = (event: React.FocusEvent<{}>): void => {
    this.setState({ focused: true });
    if (this.props.onFocus) {
      this.props.onFocus(event);
    }
  };

  focus = (): void => {
    if (this.textareaRef.current) {
      this.textareaRef.current.focus();
    }
  };

  renderSubLabel = (): string | JSX.Element | undefined => {
    if (this.props.subLabel) {
      return this.props.subLabel;
    } else if (this.props.maxlength && !this.props.hideLengthLabel) {
      return this.props.maxLengthText?.replace('{0}', this.props.maxlength.toString()) || `Maksimum ${this.props.maxlength} tegn`;
    }
    return undefined;
  };

  renderLabel = (): JSX.Element | null => {
    const { id, helpButton, label, showLabel, isRequired, requiredLabel, showRequiredLabel, optionalLabel, showOptionalLabel } = this.props;

    if (!showLabel || !id) {
      return null;
    }

    const reqLabel = isRequired && requiredLabel && showRequiredLabel ? <em> {requiredLabel}</em> : '';
    const optLabel = !isRequired && optionalLabel && showOptionalLabel ? <em> {optionalLabel}</em> : '';

    const labelText = (
      <React.Fragment>
        <span>{label}</span>
        {reqLabel}
        {optLabel}
      </React.Fragment>
    );

    return <Label htmlFor={id} labelText={labelText} sublabelText={this.renderSubLabel()} helpButton={helpButton} />;
  };

  renderHelp = (): JSX.Element | undefined => {
    if (this.props.helpElement) {
      return this.props.helpElement;
    }
  };

  renderErrorMessage = (): JSX.Element | null => {
    const { isRequired, requiredErrorMessage, errorMessage } = this.props;
    const { valid, value } = this.state;

    let error: string | undefined = '';
    if (!valid) {
      if (isRequired && !this.isValidIfRequired(value) && requiredErrorMessage) {
        error = typeof requiredErrorMessage === 'string' ? requiredErrorMessage : requiredErrorMessage(value);
      } else if (errorMessage) {
        error = typeof errorMessage === 'string' ? errorMessage : errorMessage(value);
      } else {
        error = 'Ugyldig verdi';
      }

      if (this.isValueOverMaxLength(value)) {
        error = this.props.stringOverMaxLengthError
          ? this.props.stringOverMaxLengthError
          : 'Du har skrevet for mange tegn. Gjør teksten kortere.';
      }
    }

    return <ValidationError isValid={valid} error={error} />;
  };

  render(): JSX.Element {
    const {
      maxlength,
      isRequired,
      minlength,
      id,
      rows,
      placeholder,
      autoFocus,
      disabled,
      ariaLabel,
      readOnly,
      children,
      wrapperClasses,
      charCounterClasses,
    } = this.props;
    const { value, valid, validated, size } = this.state;

    const counterPrefixText = '/'; // TODO: Replace with resource values
    const counterInfixText = 'av'; // TODO: Replace with resource values
    const counterSuffixText = ' tegn brukt'; // TODO: Replace with resource values

    const isSafari: boolean = Object.prototype.toString.call((window as Window).HTMLElement).indexOf('Constructor') > 0;
    const isChrome = !!(window as Window).chrome;

    const isWeird: boolean = isSafari || isChrome;

    let counter;

    if (!!maxlength) {
      let length = 0;

      if (value) {
        length = isWeird ? value.replace(/(\r\n|\n|\r)/g, '-').length : value.length;
      }

      let progress = 0;
      if (maxlength) {
        progress = length / maxlength;
      }

      const ariaLevel = progress > 0.75 ? 'polite' : 'off';

      const lengthClasses = classNames({
        [toolkitstyles['safetextarea__char-counter__length']]: true,
        [toolkitstyles['safetextarea__char-counter__length--invalid']]: !!maxlength && length > maxlength,
      });

      counter = (
        <div
          className={`${toolkitstyles['safetextarea__char-counter']}${!!charCounterClasses ? ` ${charCounterClasses}` : ''}`}
          aria-live={ariaLevel}
          aria-atomic="true"
        >
          <span className={lengthClasses}>{length}</span>
          <span aria-hidden="true">{counterPrefixText}</span>
          <span className={toolkitstyles['safetextarea__char-counter__hidden-text']}>{counterInfixText}</span>
          {maxlength}
          <span className={toolkitstyles['safetextarea__char-counter__hidden-text']}>{counterSuffixText}</span>
        </div>
      );
    }

    let required = false;
    if (isRequired) {
      required = isRequired;
    }

    const textAreaClasses: string = classNames({
      [toolkitstyles.safetextarea__textarea]: true,
      [toolkitstyles['safetextarea__textarea--state_validationerror']]: !valid && validated,
      [toolkitstyles['safetextarea__textarea--small']]: size === 'small',
      [toolkitstyles['safetextarea__textarea--medium']]: size === 'medium',
      [toolkitstyles['safetextarea__textarea--large']]: size === 'large',
    });

    const classes = classNames('mol_validation', { 'mol_validation--active': !valid && validated }, wrapperClasses);

    const ariaInvalid = {};
    if (validated) {
      ariaInvalid['aria-invalid'] = !valid;
    }

    return (
      <div className={classes} id={`${id}-wrapper`}>
        {this.renderErrorMessage()}
        {this.renderLabel()}
        {this.renderHelp()}

        <textarea
          id={id}
          ref={this.textareaRef}
          value={value || ''}
          className={textAreaClasses}
          style={{ resize: 'none' }}
          minLength={minlength}
          rows={rows}
          placeholder={placeholder}
          onChange={this.onChange}
          onBlur={this.onBlur}
          onFocus={this.onFocus}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={autoFocus}
          disabled={disabled}
          required={required}
          aria-required={required}
          aria-label={ariaLabel}
          data-testid={this.props.testId}
          readOnly={readOnly}
          {...ariaInvalid}
        />
        <div className={toolkitstyles['safetextarea__printable-textarea-content']}>{value}</div>

        {counter}
        {children}
      </div>
    );
  }
}

export default SafeTextarea;
