import * as React from 'react';

import classNames from 'classnames';

import PrivateRadioGroup from './private-radio-group';
import ValidationError from '../form/validation-error';
import { Sublabel } from '../label/sublabel';

import './styles.scss';

export interface RadioGroupProps {
  /**
   * Must be unique for the application. If it is not unique, interaction with one radio group will change all
   * radio groups sharing the id.
   */
  id: string;
  /**
   * Transform that can be applied an element of the options array to replace a label containing a path
   * with the actual string to be shown
   */
  labelStringFetcher?: (content: string) => string;
  /** Function som kalles onChange */
  onChange: (value?: string) => void;
  /** Ekstra CSS-class som legges på wrapper'en */
  wrapperClassName?: string;
  /** Ekstra CSS-class som legges på label */
  labelClassName?: string;
  /** En Array med alle radioknappene inkl. options */
  options: Array<Options>;
  /** Om det er påkrevd å huke av boksen */
  isRequired?: boolean;
  /** Label som vises ved required validation feilmelding */
  requiredLabel?: string;
  /** Ekstra label som vises ved required validation feilmelding */
  optionalLabel?: string;
  /** Hvilken radio-knapp er selected som default */
  selected?: string;
  /** legger en kommentar før hjelp på radio-gruppen */
  legend?: string | JSX.Element;
  /** ekstra CSS-class som legges på <legend> */
  legendClassName?: string;
  /** Teksten til sub label, brukes som enkel hjelpetekst. Sublabel legges som et eget blokk-element nederst i <legend> til dette feltet */
  subLabel?: string | JSX.Element;
  /** Validator Function som returnerer true/false for validering */
  validator?: (value: string | undefined) => boolean;
  /** Function som kalles når validering er ok */
  onValidated?: (valid: boolean) => void;
  /** Function som kalles for å rendre feilmeldinger */
  getErrorMessage?: (value: string) => string;
  /** Settes til true for å vise ekstra label */
  showRequiredLabel?: boolean;
  /** Settes til true for å vise ekstra optional label */
  showOptionalLabel?: boolean;
  /** Settes til true for å fjerne Fieldset, legend og help funksjonaliteter  */
  noFieldset?: boolean;
  /** ekstra CSS-class som legges på <fieldset> */
  fieldsetClassName?: string;
  /** Legger en ekstra aria-labelledBy på selve radiogroup */
  ariaLabelledBy?: string;
  /* Om det skal legges en atom_helptrigger button */
  helpButton?: JSX.Element;
  /* Selve hjelpElement */
  helpElement?: JSX.Element;
  /** Innhold som vises under radiogruppen */
  children?: JSX.Element;
  /** Viser blue radio-button istedenfor vanlig lilla */
  isStyleBlue?: boolean;
  /** Viser boxed radio-button istedenfor vanlig styling */
  isStyleBoxed?: boolean;
  /** Update valid-state also when component is not updated through component */
  validateOnExternalUpdate?: boolean;
  /** Id som benyttes for å hente ut komponent i automatiske tester */
  testId?: string;
  /** ekstra CSS-class som legges på radiogruppen */
  classNameGroup?: string;
}

export interface Options {
  type: string;
  label: string;
  ariaLabel?: string;
  disabled?: boolean;
  content?: JSX.Element;
  hjelpetrigger?: JSX.Element;
}

export interface RadioGroupState {
  lastFocusedValue?: string;
  valid: boolean;
  validated?: boolean;
  shouldValidate?: boolean;
}

export class RadioGroup extends React.Component<RadioGroupProps, RadioGroupState> {
  static hnFormComponent = true;

  constructor(props: RadioGroupProps, context: Record<string, unknown>) {
    super(props, context);
    this.changeSelectedValue = this.changeSelectedValue.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onChange = this.onChange.bind(this);
    this.notifyValidated = this.notifyValidated.bind(this);

    this.state = {
      // Get from soknadsstore
      lastFocusedValue: props.selected,
      valid: true,
      validated: false,
    };
  }

  static getDerivedStateFromProps(nextProps: RadioGroupProps, prevState: RadioGroupState): RadioGroupState {
    const updatedState = { ...prevState };
    if (nextProps.validateOnExternalUpdate && nextProps.selected && nextProps.selected !== prevState.lastFocusedValue) {
      updatedState.lastFocusedValue = nextProps.selected;
      updatedState.shouldValidate = true;
    } else {
      updatedState.lastFocusedValue = nextProps.selected;
    }

    return updatedState;
  }

  componentDidUpdate(_prevProps: RadioGroupProps, prevState: RadioGroupState): void {
    if (this.state.shouldValidate) {
      this.validate(this.state.lastFocusedValue);

      this.setState({ shouldValidate: false });
    }

    if (prevState.valid !== this.state.valid) {
      this.notifyValidated();
    }
  }

  onChange(e: React.FormEvent<{}>): void {
    const element = document.getElementById((e.target as HTMLLabelElement).htmlFor);

    if (element) {
      e.target = element;
      if ((e.target as HTMLInputElement).disabled) {
        return;
      }

      this.changeSelectedValue((e.target as HTMLInputElement).value, (v: string) => this.props.onChange(v));
    }
  }

  onClick(e: React.MouseEvent<{}>): void {
    this.changeSelectedValue((e.target as HTMLInputElement).value, (v: string) => this.props.onChange(v));
  }

  changeSelectedValue(value: string, notify?: (value: string) => void): void {
    if (value === this.state.lastFocusedValue) {
      return;
    }

    if (notify) {
      notify(value);
    }

    this.setState({ lastFocusedValue: value });
    this.validate(value);
  }

  validate(value: string | undefined): Promise<void> {
    return new Promise<void>((resolve: () => void) => {
      const validatedCB: () => void = () => {
        resolve();
      };
      if (this.props.isRequired) {
        if (this.props.validator) {
          this.setState({ valid: this.props.validator(value) }, validatedCB);
          return;
        }
        const empty: boolean = value === null || value === undefined || value === '';
        this.setState({ valid: !empty }, validatedCB);
      } else {
        this.setState({ valid: true }, validatedCB);
      }
    });
  }

  notifyValidated(): void {
    if (this.props.onValidated) {
      this.props.onValidated(this.state.valid);
    }
  }

  validateField(): Promise<void> {
    this.setState({ validated: true });
    return this.validate(this.state.lastFocusedValue);
  }

  isValid(): boolean {
    return this.state.valid;
  }

  renderErrorMessage(): JSX.Element | null {
    if (!this.props.getErrorMessage) {
      return null;
    }
    const errorMessage: string = this.state.lastFocusedValue
      ? this.props.getErrorMessage(this.state.lastFocusedValue)
      : this.props.getErrorMessage('');
    return <ValidationError isValid={this.state.valid} error={errorMessage} />;
  }

  renderLegend(): JSX.Element | null {
    if (!this.props.legend) {
      return null;
    }
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

  isRadioValid(value: string): boolean {
    if (this.props.isRequired && this.state.lastFocusedValue === null) {
      return false;
    }
    if (value === this.state.lastFocusedValue && !this.state.valid) {
      return false;
    }
    return true;
  }

  renderHelp() {
    if (this.props.helpElement) {
      return this.props.helpElement;
    }
  }

  render(): JSX.Element {
    const {
      id,
      testId,
      options,
      wrapperClassName,
      fieldsetClassName,
      labelClassName,
      selected,
      isRequired,
      isStyleBlue,
      isStyleBoxed,
      noFieldset,
      ariaLabelledBy,
      labelStringFetcher,
      children,
    } = this.props;
    const { valid, validated } = this.state;

    const inputClasses: string = classNames({
      'atom_radio__input--boxed': !isStyleBoxed,
    });

    const inputFields: Array<JSX.Element> = options.map((e: Options, i: number) => {
      const inputId: string = id + '-hn-' + i;
      let label: string = e.label;

      const labelClasses: string = classNames(
        {
          'atom_radio__label--checked': e.type === selected,
          'atom_radio__label--boxed': isStyleBoxed,
        },
        labelClassName
      );

      const checkiconClasses: string = classNames({
        'atom_radio__checkicon--lilla': !isStyleBlue,
        'atom_radio__checkicon--blue': isStyleBlue,
        'atom_radio__checkicon--boxed': isStyleBoxed,
        'atom_radio__checkicon--checked': e.type === selected,
        'atom_radio__checkicon--disabled': e.disabled,
      });

      const textClasses = classNames({
        'atom_radio__text--checked': e.type === selected,
      });

      if (labelStringFetcher) {
        label = labelStringFetcher(label);
      }

      const ariaInvalid = {};
      if (validated) {
        ariaInvalid['aria-invalid'] = !this.isRadioValid(e.type);
      }

      return (
        <div key={inputId} className={`atom_radio`}>
          <input
            id={inputId}
            onChange={this.onChange}
            onClick={this.onClick}
            type="radio"
            checked={e.type === selected}
            value={e.type}
            aria-label={e.ariaLabel}
            disabled={e.disabled ? e.disabled : false}
            required={i === 0 && isRequired}
            className={`atom_radio__input ${inputClasses}`}
            {...ariaInvalid}
          />
          <label htmlFor={inputId} className={`atom_radio__label ${labelClasses}`}>
            <span tabIndex={-1} className={`atom_radio__checkicon ${checkiconClasses}`}>
              <span tabIndex={-1} className={`atom_radio__checkicon_innercicrcle`} />
            </span>
            <span className={`atom_radio__text ${textClasses}`}>{label}</span>
            {e.content}
          </label>
          {e.hjelpetrigger}
        </div>
      );
    });

    const content: JSX.Element = (
      <React.Fragment>
        <PrivateRadioGroup name={id} value={selected} classNameGroup={this.props.classNameGroup}>
          <React.Fragment>{inputFields}</React.Fragment>
        </PrivateRadioGroup>
        {children}
      </React.Fragment>
    );

    return (
      <div
        className={`mol_validation ${!valid ? 'mol_validation--active' : ''} ${wrapperClassName ? wrapperClassName : ''}`}
        id={`${id}-wrapper`}
        data-testid={testId}
      >
        {this.renderErrorMessage()}
        {!noFieldset ? (
          <fieldset className={fieldsetClassName ? fieldsetClassName : ''}>
            {this.renderLegend()}
            {this.renderHelp()}
            {content}
          </fieldset>
        ) : (
          <div aria-labelledby={ariaLabelledBy} role="radiogroup">
            {content}
          </div>
        )}
      </div>
    );
  }
}
