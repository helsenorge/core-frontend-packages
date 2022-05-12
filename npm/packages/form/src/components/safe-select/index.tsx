import * as React from 'react';

import classNames from 'classnames';

import ValidationError from '../form/validation-error';
import { Label } from '../label';

import './styles.scss';

export interface SafeSelectProps {
  /** Unik ID */
  id: string;
  /** name attributt på select feltet */
  selectName?: string;
  /** HTML options som vises under <select> */
  options?: HTMLOptionElement[];
  /**  HMTL Input type */
  type?: string;
  /** Verdi som vises i feltet */
  value?: string;
  /** Verdi som er selected */
  selected?: string;
  /** Om feltet er disabled  */
  disabled?: boolean;
  /** Tekst placeholder som vises i feltet når det ikke er satt value */
  placeholder?: HTMLOptionElement;
  /** Innhold som vises i komponentet */
  children?: React.ReactNode;
  /** Ekstra CSS-class som legges på feltet */
  className?: string;
  /** Ekstra CSS-class som legges på wrapper'en */
  wrapperClasses?: string;
  /** Function som kallers når det tastes i feltet */
  onKeyDown?: React.EventHandler<React.KeyboardEvent<HTMLSelectElement>>;
  /** Function som kalles når fokus er på feltet */
  onFocus?: (event: React.FocusEvent<{}>, id: string) => void;
  /** Function som kalles når verdien i feltet endres */
  onChange?: (event: React.FormEvent<{}>, id: string) => void;
  /** Function som kalles når datoen valideres riktig */
  onValidated?: (valid: boolean | undefined) => void;
  /** Tillatter bare endringer av feltet hvis denne funksjonen returnerer true */
  onChangeValidator?: (value: string | undefined) => boolean;
  /** Denne funksjonen returnere strengen dette feltet settes til etter onChange. Tar imot e.target.value. */
  onChangeFormatter?: (value: string) => string;
  /** ErrorMessage som vises gjennom validering */
  errorMessage?: string | ((value: string | number | undefined) => string);
  /** Component som vises ved validation error */
  validationErrorRenderer?: JSX.Element;
  /** Om feltet er påkrevd eller ikke */
  isRequired?: boolean;
  /** Om label skal vises eller ikke */
  showLabel?: boolean;
  /** Denne viser sorterings-label til venstre for SelectBoxen*/
  showLabelLeft?: boolean;
  /** Teksten til label */
  label?: string | JSX.Element;
  /** Teksten til sub label, brukes som enkel hjelpetekst. Sublabel legges som et eget blokk-element nederst i <label> til dette feltet */
  subLabel?: string | JSX.Element;
  /** HTML aria-required */
  ariaRequired?: boolean;
  /** HTML aria-label */
  ariaLabel?: string;
  /** HTML aria-labbeledby*/
  ariaLabelledby?: string;
  /** TabIndex på selve komponent'en */
  tabIndex?: number;
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
  /** Id som benyttes for å hente ut select i automatiske tester */
  selectTestId?: string;
  /** Id som benyttes for å hente ut ValidationError i automatiske tester */
  validationTestId?: string;
  /** Id som benyttes for å hente ut Label i automatiske tester */
  labelTestId?: string;
}

export interface SafeSelectState {
  isValid: boolean;
  value?: string;
  validated?: boolean;
}

interface EventTargetWithValue extends EventTarget {
  value: string;
}

export default class SafeSelectField extends React.Component<SafeSelectProps, SafeSelectState> {
  static hnFormComponent = true;
  static defaultProps: SafeSelectProps = {
    id: '',
    showRequiredLabel: true,
    showLabelLeft: false,
  };
  selectElementRef: React.RefObject<HTMLSelectElement>;

  constructor(props: SafeSelectProps) {
    super(props);

    this.selectElementRef = React.createRef();

    this.state = {
      isValid: true,
      value: undefined,
      validated: false,
    };
  }

  componentDidMount(): void {
    const { selected, value }: SafeSelectProps = this.props;

    //value kom ikke inn som prop på et bruk av nedtrekksliste, men selected gjør. Legger opp til bruk av begge.
    const compatibleValue = value ? value : selected;
    if (compatibleValue === '' || compatibleValue === null || compatibleValue === undefined) {
      return;
    }
    this.setState({ value: compatibleValue });
    if (this.props.onChangeValidator) {
      this.setState({ isValid: this.props.onChangeValidator(compatibleValue) });
    }

    if (value) {
      this.setState({ value }, () => {
        if (value === '' || value === null || value === undefined) {
          return;
        } else {
          this.validateField();
        }
      });
    }
  }

  static getDerivedStateFromProps(nextProps: SafeSelectProps, prevState: SafeSelectState): SafeSelectState | null {
    const updatedState = { ...prevState };
    if (nextProps.value && nextProps.value !== prevState.value) {
      updatedState.value = nextProps.value;
      return updatedState;
    } else {
      return null;
    }
  }

  onChange = (e: React.FormEvent<{}>): void => {
    const value: string = (e.target as EventTargetWithValue).value as string;
    let formattedValue: string = value;
    if (this.props.onChangeFormatter) {
      formattedValue = this.props.onChangeFormatter(value);
    }

    if (this.state.validated) {
      this.setState({ value: formattedValue }, this.validateField);
    } else {
      this.setState({ value: formattedValue }, this.validateField);
    }
    this.notifyChanged(e);
  };

  notifyChanged = (e: React.FormEvent<{}>): void => {
    if (this.props.onChange) {
      this.props.onChange(e, this.props.id);
    }
  };

  notifyValidated = (): void => {
    if (this.props.onValidated) {
      this.props.onValidated(this.state.isValid);
    }
  };

  onFocus = (e: React.FocusEvent<{}>): void => {
    if (this.props.onFocus) {
      this.props.onFocus(e, this.props.id);
    }
  };

  focus = (): void => {
    if (this.selectElementRef.current) {
      this.selectElementRef.current.focus();
    }
  };

  getOptionWithValue = (value: string | undefined): HTMLOptionElement | undefined => {
    if (!this.props.options || !value) {
      return undefined;
    }
    const filteredOptions = this.props.options.filter((o: HTMLOptionElement) => o.value === value);
    if (!filteredOptions || filteredOptions.length === 0) {
      return undefined;
    }
    return filteredOptions[0];
  };

  validateField = (): Promise<void> => {
    return new Promise<void>((resolve: () => void) => {
      const validatedCB: () => void = () => {
        this.notifyValidated();
        resolve();
      };

      const value = this.state.value;
      if (this.props.onChangeValidator && this.props.isRequired) {
        this.setState({ validated: true, isValid: this.props.onChangeValidator(value) }, validatedCB);
        return;
      }

      let valid = false;
      if (this.props.isRequired) {
        if (this.getOptionWithValue(value)) {
          valid = true;
        }
      } else {
        valid = true;
      }

      this.setState({ validated: true, isValid: valid }, validatedCB);
    });
  };

  isValid = (): boolean => {
    return this.state.isValid;
  };

  renderErrorMessage = (): JSX.Element => {
    if (this.props.validationErrorRenderer && !this.state.isValid) {
      return this.props.validationErrorRenderer;
    }
    let error: string;
    if (this.props.errorMessage) {
      error = typeof this.props.errorMessage === 'string' ? this.props.errorMessage : this.props.errorMessage(this.state.value);
    } else {
      error = 'Ugyldig verdi';
    }

    return <ValidationError isValid={this.state.isValid} error={error} testId={this.props.validationTestId} />;
  };

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
          htmlFor={this.props.selectName}
          sublabelText={this.props.subLabel}
          className={this.props.showLabelLeft ? 'atom_label--showleft' : ''}
          testId={this.props.labelTestId}
          helpButton={this.props.helpButton}
        />
      );
    }
    return null;
  };

  render(): JSX.Element {
    const { className, disabled, selected, isRequired, placeholder, selectName }: SafeSelectProps = this.props;
    const firstOption = this.props.options ? this.props.options[0] : undefined;
    const firstValue = firstOption ? firstOption.value : undefined;
    const selectedValue: string | undefined = this.state.value ? this.state.value : placeholder ? placeholder.value : firstValue;

    const selectClassNames = classNames('atom_select__select', className, {
      ['atom_select__select--haslabelleft']: this.props.showLabelLeft,
      ['atom_select__select--state_validationerror']: !this.state.isValid,
    });

    let wrapperClasses = `mol_validation ${this.props.wrapperClasses ? this.props.wrapperClasses : ''}`;
    if (!this.state.isValid) {
      wrapperClasses += ' mol_validation--active';
    }

    const ariaInvalid = this.state.validated ? { 'aria-invalid': !this.state.isValid } : {};

    const options: JSX.Element[] = [];

    if (placeholder && !this.props.showLabelLeft) {
      options.push(
        <option
          key={'placeholder'}
          value={placeholder.value}
          disabled
          hidden={navigator.platform.toUpperCase().indexOf('MAC') === -1}
          aria-selected={selectedValue === placeholder.value}
        >
          {placeholder.text}
        </option>
      );
    }

    if (this.props.options) {
      this.props.options.forEach(function (item: HTMLOptionElement, index: number) {
        options.push(
          <option key={index} value={item.value} selected={selectedValue === item.value} aria-selected={selectedValue === item.value}>
            {item.text}
          </option>
        );
      });
    }

    return (
      <div className={wrapperClasses} id={`${this.props.id}-wrapper`}>
        {this.renderErrorMessage()}
        {this.renderLabel()}
        {this.props.helpElement ? this.props.helpElement : null}
        <span className={'atom_select'}>
          <select
            ref={this.selectElementRef}
            id={selectName}
            name={selectName}
            defaultValue={selected ? selected : selectedValue}
            tabIndex={this.props.tabIndex}
            data-testid={this.props.selectTestId}
            className={selectClassNames}
            disabled={disabled}
            required={!!isRequired}
            onChange={this.onChange}
            onFocus={this.onFocus}
            onKeyDown={this.props.onKeyDown}
            aria-label={this.props.ariaLabel}
            aria-labelledby={this.props.ariaLabelledby}
            aria-required={this.props.ariaRequired || !!isRequired}
            {...ariaInvalid}
          >
            {options}
          </select>
        </span>
        {this.props.children}
      </div>
    );
  }
}
