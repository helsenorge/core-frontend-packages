import * as React from 'react';
import classNames from 'classnames';

import { CheckBox } from '../checkbox';
import ValidationError from '../form/validation-error';
import { Sublabel } from '../label/sublabel';

export interface Option {
  /** Unik Id for Checbox'en */
  id: string;
  /** Label som vises ved elementen */
  label: string;
  /** Om checkbox'en er checked som default */
  checked?: boolean;
  /** legger en suffix etter labelteksten på checkbox'en */
  labelSuffixDangerousHtml?: string;
  /* Sendes videre til Checkbox i helpButton property */
  hjelpetrigger?: JSX.Element;
  /** Om checkbox'en er disabled */
  disabled?: boolean;
}

interface Props {
  /** Unik Id for Checbox gruppen */
  id: string;
  /** En Array med alle Checbox'en inkl. options */
  checkboxes: Array<Option>;
  /** Function som kalles onChange */
  handleChange: (id: string) => void;
  /** Viser blå Checkboxer istedenfor default lilla stil */
  isStyleBlue?: boolean;
  /** legger en kommentar etter helpButton på checkbox gruppen */
  legend?: string | JSX.Element;
  /** ekstra CSS-class som legges på <legend> */
  legendClassName?: string;
  /** Teksten til sub label, brukes som enkel hjelpetekst. Sublabel legges som et eget blokk-element nederst i <legend> til dette feltet */
  subLabel?: string | JSX.Element;
  /**  Function som kalles ved validation */
  onValidated?: (valid: boolean | undefined) => void;
  /**  Melding som vises ved validation feil */
  errorMessage?: string;
  /** Om det er påkrevd å huke av boksen */
  isRequired?: boolean;
  /** Label som vises ved required validation feilmelding */
  requiredLabel?: string;
  /** Ekstra label som vises ved required validation feilmelding */
  optionalLabel?: string;
  /** Settes til true for å vise ekstra label */
  showRequiredLabel?: boolean;
  /** Settes til true for å vise ekstra optional label */
  showOptionalLabel?: boolean;
  /** Maks antall bokser som det er tillatt å huke av */
  max?: number;
  /** Minst antall bokser som det er påkrevd å huke av */
  min?: number;
  /** Extra CSS-classer som legges på wrapper */
  className?: string;
  /** Om det skal legges på en ekstra wrapper etter fieldset */
  hasInnerWrapper?: boolean;
  /* Om det skal legges en atom_helptrigger button */
  helpButton?: JSX.Element;
  /* Selve hjelpElement */
  helpElement?: JSX.Element;
  /** Update valid-state also when component is not updated through component */
  validateOnExternalUpdate?: boolean;
  /** Id som benyttes for å hente ut CheckboxGroup i automatiske tester */
  checkboxGroupTestId?: string;
  /** Id som benyttes for å hente ut Checkbox i automatiske tester */
  checkboxTestId?: string;
  /** Id som benyttes for å hente ut ValidationError i automatiske tester */
  validationTestId?: string;
  /** ClassName til fieldset taggen */
  fieldsetClassName?: string;
}

interface State {
  valid: boolean;
  validated: boolean;
}

export default class CheckBoxGroup extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      valid: true,
      validated: false,
    };
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.checkboxes !== this.props.checkboxes) {
      this.setState({ valid: this.validate(this.state.validated) }, this.notifyValidated);
    }
  }

  validateField(): Promise<void> {
    const valid = this.validate(true);

    return new Promise<void>((resolve: () => void) => {
      this.setState({ validated: true, valid }, () => {
        this.notifyValidated();
        resolve();
      });
    });
  }

  isValid(): boolean {
    return this.state.valid;
  }

  validate = (validated?: boolean) => {
    if (this.props.isRequired && validated && !this.props.checkboxes.some(el => el.checked === true)) {
      return false;
    } else if (this.props.max && this.props.checkboxes.filter(el => el.checked === true).length > this.props.max) {
      return false;
    } else if (this.props.min && validated && this.props.checkboxes.filter(el => el.checked === true).length < this.props.min) {
      return false;
    }
    return true;
  };

  notifyValidated = () => {
    if (this.props.onValidated) {
      this.props.onValidated(this.state.valid);
    }
  };

  renderHelp() {
    if (this.props.helpElement) {
      return this.props.helpElement;
    }
  }

  renderLegend(): JSX.Element | null {
    const {
      legend,
      legendClassName,
      isRequired,
      requiredLabel,
      optionalLabel,
      showRequiredLabel,
      showOptionalLabel,
      helpButton,
      subLabel,
    } = this.props;
    if (!legend) {
      return null;
    }

    return (
      <legend className={legendClassName}>
        {legend}
        {isRequired && requiredLabel && showRequiredLabel ? <em> {requiredLabel}</em> : ''}
        {!isRequired && optionalLabel && showOptionalLabel ? <em> {optionalLabel}</em> : ''}
        {helpButton}
        {subLabel && <Sublabel sublabelText={subLabel} />}
      </legend>
    );
  }

  render() {
    const { validateOnExternalUpdate } = this.props;
    const checkboxes = this.props.checkboxes.map(el => {
      return (
        <CheckBox
          label={el.label}
          labelSuffixDangerousHtml={el.labelSuffixDangerousHtml}
          key={el.id}
          id={`${this.props.id}-${el.id}`}
          checked={el.checked}
          onChange={() => this.props.handleChange(el.id)}
          helpButton={el.hjelpetrigger}
          disabled={el.disabled}
          validateOnExternalUpdate={validateOnExternalUpdate}
          checkboxTestId={`${this.props.checkboxTestId}-${el.id}`}
          isStyleBlue={this.props.isStyleBlue}
        />
      );
    });

    const classes = classNames({ 'mol_validation--active': !this.state.valid }, this.props.className);

    return (
      <div className={`mol_validation ${classes}`} id={`${this.props.id}-wrapper`}>
        <ValidationError
          isValid={this.state.valid}
          error={this.props.errorMessage ? this.props.errorMessage : ''}
          testId={this.props.validationTestId}
        />
        <fieldset className={this.props.fieldsetClassName} data-testid={this.props.checkboxTestId}>
          {this.renderLegend()}
          {this.renderHelp()}
          {this.props.hasInnerWrapper ? <div className="atom_checkboxgroup__innerwrap">{checkboxes}</div> : checkboxes}
        </fieldset>
      </div>
    );
  }
}
