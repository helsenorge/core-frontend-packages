import * as React from 'react';

import classNames from 'classnames';

import CheckThick from './CheckThick';
import ValidationError from '../form/validation-error';

import './styles.scss';
export interface CheckboxProps {
  /** Unik Id for Input */
  id: string;
  /** Label som vises ved elementen */
  label: string | JSX.Element;
  /** Om checkbox'en er checked som default */
  checked?: boolean;
  /** Innhold som vises i komponentet */
  children?: React.ReactNode;
  /** Function som kalles onChange */
  onChange: (event?: React.FormEvent<{}>) => void;
  /** Viser blå Checkbox istedenfor default lilla stil */
  isStyleBlue?: boolean;
  /** Viser boxed Checkbox istedenfor vanlig styling */
  isStyleBoxed?: boolean;
  /** Extra CSS-classer som legges på wrapper */
  className?: string;
  /** Extra CSS-classer som legges på label */
  labelClassName?: string;
  /** Om checkbox'en er disabled */
  disabled?: boolean;
  /** legger en kommentar etter labelteksten og suffix'en på checkbox'en */
  comment?: string;
  /** Om det er påkrevd å huke av boksen */
  isRequired?: boolean;
  /**  Melding som vises ved validation feil */
  errorMessage?: string;
  /**  Function som kalles ved validation */
  onValidated?: (valid: boolean) => void;
  /* Om det skal legges en atom_helptrigger button */
  helpButton?: JSX.Element;
  /* Selve hjelpElement */
  helpElement?: JSX.Element;
  /** Update valid-state also when component is not updated through component */
  validateOnExternalUpdate?: boolean;
  /** Id som benyttes for å hente ut Label i automatiske tester */
  labelTestId?: string;
  /** Id som benyttes for å hente ut Checkbox i automatiske tester */
  checkboxTestId?: string;
  /** Id som benyttes for å hente ut ValidationError i automatiske tester */
  validationTestId?: string;
}

export interface CheckboxState {
  valid: boolean;
  validated: boolean;
}

export class CheckBox extends React.Component<CheckboxProps, CheckboxState> {
  static hnFormComponent = true;
  inputRef: React.RefObject<HTMLInputElement>;

  constructor(props: CheckboxProps) {
    super(props);
    this.inputRef = React.createRef();
    this.state = {
      valid: true,
      validated: false,
    };
  }

  componentDidMount(): void {
    this.setChecked();
  }

  componentDidUpdate(prevProps: CheckboxProps): void {
    this.setChecked();

    if (this.props.validateOnExternalUpdate && prevProps.checked !== this.props.checked) {
      this.handleOnChange(this.props.checked);
    }
  }

  setChecked(): void {
    const $checkbox = this.inputRef.current;
    if ($checkbox) {
      this.props.checked ? $checkbox.setAttribute('checked', 'checked') : $checkbox.removeAttribute('checked');
    }
  }

  validateField(): Promise<void> {
    this.setState({ validated: true });
    return this.validate(this.props.checked, false);
  }

  validate(value: boolean | undefined, notifyValidated?: boolean): Promise<void> {
    return new Promise<void>((resolve: () => void) => {
      const validatedCB: () => void = () => {
        if (notifyValidated) {
          this.notifyValidated();
        }
        resolve();
      };
      if (this.props.isRequired) {
        this.setState({ valid: value === true }, validatedCB);
      } else {
        this.setState({ valid: true }, validatedCB);
      }
    });
  }

  isValid() {
    return this.state.valid;
  }

  onChange = (event: React.FormEvent<{}>) => {
    this.handleOnChange(!this.props.checked, () => this.props.onChange(event));
  };

  handleOnChange = (checked?: boolean, notify?: () => void) => {
    this.validate(checked, true);
    if (notify) {
      notify();
    }
  };

  notifyValidated(): void {
    if (this.props.onValidated) {
      this.props.onValidated(this.state.valid);
    }
  }

  renderHelp() {
    if (this.props.helpElement) {
      return this.props.helpElement;
    }

    return null;
  }

  render(): JSX.Element {
    const { isStyleBlue, isStyleBoxed, labelClassName, checked, disabled, checkboxTestId, labelTestId, validationTestId } = this.props;

    const labelClasses: string = classNames(
      {
        'atom_checkbox__label--boxed': isStyleBoxed,
        'atom_checkbox__label--checked': checked,
      },
      labelClassName
    );

    const checkiconClasses: string = classNames({
      'atom_checkbox__checkicon--lilla': !isStyleBlue,
      'atom_checkbox__checkicon--blue': isStyleBlue,
      'atom_checkbox__checkicon--boxed': isStyleBoxed,
      'atom_checkbox__checkicon--checked': checked,
      'atom_checkbox__checkicon--disabled': disabled,
    });

    const textClasses = classNames({
      'atom_checkbox__text--checked': checked,
    });

    const wrapperClasses = classNames({ 'mol_validation--active': !this.state.valid }, this.props.className);

    const comment: JSX.Element | boolean = this.props.comment ? (
      <span className="atom_checkbox__comment">{this.props.comment}</span>
    ) : (
      false
    );

    return (
      <div className={`mol_validation atom_checkbox ${wrapperClasses}`} id={`${this.props.id}-wrapper`}>
        <ValidationError
          isValid={this.state.valid}
          error={this.props.errorMessage ? this.props.errorMessage : ''}
          testId={validationTestId}
        />
        <div className="atom_checkbox__labelwrapper">
          <input
            ref={this.inputRef}
            type="checkbox"
            checked={this.props.checked}
            id={this.props.id}
            onChange={this.onChange}
            disabled={this.props.disabled}
            className={`atom_checkbox__input`}
            data-testid={checkboxTestId}
          />
          <label htmlFor={this.props.id} className={`atom_checkbox__label ${labelClasses}`} data-testid={labelTestId}>
            <CheckThick size="small" tabIndex={-1} className={`atom_checkbox__checkicon ${checkiconClasses}`} />
            <span className={`atom_checkbox__text ${textClasses}`}>{this.props.label}</span>
            {comment}
          </label>
          {this.props.helpButton ? <span className="atom_helptrigger-container">{this.props.helpButton}</span> : null}
        </div>
        {this.renderHelp()}
        {this.props.children}
      </div>
    );
  }
}
