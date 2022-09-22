import * as React from 'react';

import moment, { Moment } from 'moment';

import ArrowLeft from '@helsenorge/designsystem-react/components/Icons/ArrowLeft';
import Pause from '@helsenorge/designsystem-react/components/Icons/Pause';

import { log } from '@helsenorge/core-utils/logger';

import { CheckBox } from '../checkbox';
import { RadioGroup, Options } from '../radio-group';
import SafeInputField from '../safe-input-field';
import SafeSelect from '../safe-select';
import { SafeTextarea } from '../safe-textarea';
import WrappedComponent from './example/wrapped-component-example';
import Validation from './validation';

import Form from '.';

interface ExampleState {
  checkbox1Checked?: boolean;
  checkbox2Checked?: boolean;
  checkbox3Checked?: boolean;
  checkbox4Checked?: boolean;
  fieldsetValid?: boolean;
  formSubmitted?: boolean;
  inputFieldValue: string;
  textfieldValue: string;
  safeselect: string;
  datetimeinputValue: Date | undefined;
  datetimepickerDateValue: moment.Moment | undefined;
  datetimepickerTimeValue: string | undefined;
  datepickerValue: Date | undefined;
  daterangepickerValue: Moment | undefined;
  disabled: boolean;
  startDateValue: Moment | undefined;
  endDateValue: Moment | undefined;
  saving: boolean;
  saved: boolean;
  radioGroupValue: string;
  formValidated: boolean;
  inputFieldRequiredValue: string;
  inputFieldNameValue: string;
  inputFieldDecimalValue: string;
  inputFieldNumberValue: string;
}

export class FormExample extends React.Component<{}, ExampleState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      checkbox1Checked: false,
      checkbox2Checked: false,
      checkbox3Checked: false,
      checkbox4Checked: false,
      fieldsetValid: true,
      formSubmitted: false,
      inputFieldValue: '',
      textfieldValue: '',
      safeselect: '',
      datetimeinputValue: undefined,
      datetimepickerDateValue: undefined,
      datetimepickerTimeValue: undefined,
      datepickerValue: undefined,
      daterangepickerValue: undefined,
      disabled: false,
      startDateValue: moment('10.09.2020', 'DD.MM.YYYY'),
      endDateValue: undefined,
      saving: false,
      saved: false,
      radioGroupValue: '',
      formValidated: false,
      inputFieldRequiredValue: '',
      inputFieldNameValue: '',
      inputFieldDecimalValue: '',
      inputFieldNumberValue: '',
    };
  }

  inputFieldChangeValidator = (value: string): boolean => {
    const r = value.length >= 3;
    console.log('inputFieldChangeValidator returns', r);
    return r;
  };

  inputFieldOnBlurValidator = (input: string | number) => {
    return new Promise<boolean>(resolve => {
      setTimeout(() => {
        if (input === 'Sjur' || input === 'LarsK') {
          console.log('inputFieldOnBlurValidator returns true med verdi', input);
          resolve(true);
        } else {
          console.log('inputFieldOnBlurValidator returns false med verdi', input);
          resolve(false);
        }
      }, 1000);
    });
  };

  inputFieldChange = (event: React.FormEvent<{}>): void => {
    const target: HTMLInputElement = event.target as HTMLInputElement;
    const value: string = target.value;
    this.setState({
      inputFieldValue: value,
    });
  };

  inputFieldRequiredChange = (event: React.FormEvent<{}>): void => {
    const target: HTMLInputElement = event.target as HTMLInputElement;
    const value: string = target.value;
    this.setState({
      inputFieldRequiredValue: value,
    });
  };

  inputFieldNameChange = (event: React.FormEvent<{}>): void => {
    const target: HTMLInputElement = event.target as HTMLInputElement;
    const value: string = target.value;
    this.setState({
      inputFieldNameValue: value,
    });
  };

  inputFieldDecimalChange = (event: React.FormEvent<{}>): void => {
    const target: HTMLInputElement = event.target as HTMLInputElement;
    const value: string = target.value;
    this.setState({
      inputFieldDecimalValue: value,
    });
  };

  inputFieldNumberChange = (event: React.FormEvent<{}>): void => {
    const target: HTMLInputElement = event.target as HTMLInputElement;
    const value: string = target.value;
    this.setState({
      inputFieldNumberValue: value,
    });
  };

  inputFieldOnBlur = (): void => {
    const info: Console = console;
    info.log('inputFieldOnBlur');
  };

  onTextfieldChange = (event: React.FormEvent<{}>): void => {
    const target: HTMLInputElement = event.target as HTMLInputElement;
    const value: string = target.value;
    this.setState({
      textfieldValue: value,
    });
  };

  onSafeselectChange = (evt: React.MouseEvent): void => {
    const info: Console = console;
    const value = (evt.target as HTMLInputElement).value ? (evt.target as HTMLInputElement).value : '-1';
    this.setState({
      safeselect: value,
    });
    info.log('onSafeselectChange', value);
  };

  validateTextarea = (value: string): boolean => {
    if (value.length < 2) {
      return false;
    } else if (value.length > 10) {
      return false;
    }
    return true;
  };

  getTextareaErrorMessage = (value: string): string => {
    if (value.length < 2) {
      return 'Du må skrive minst to tegn';
    } else if (value.length > 10) {
      return 'Du kan ikke skrive mer enn ti tegn';
    }
    return '';
  };

  getFornavnErrorMessage = (value: string): string => {
    if (value === '') {
      return 'Du må fylle ut navn';
    }
    if (value.length > 5) {
      return 'Du må skrive mindre enn 5 tegn';
    }
    if (value.length < 3) {
      return 'Du må skrive mer enn 2 tegn';
    }
    return 'Navn må være Sjur eller LarsK';
  };

  handleRadioChange = (radioKnapp: string): void => {
    const info: Console = console;
    info.log('Du klikket på radioknappen: ', radioKnapp);
    this.setState({ radioGroupValue: radioKnapp });
  };

  handleDisableButtonChange = (): void => {
    this.setState({ disabled: !this.state.disabled });
  };

  onSubmit = (): void => {
    log('form has been submitted');
    this.setState({
      formSubmitted: true,
    });
  };

  toggleCheckbox4 = (): void => {
    this.setState({
      checkbox4Checked: !this.state.checkbox4Checked,
    });
  };

  onDraft = (): void => {
    log('form has been saved as draft');
    this.setState({
      formSubmitted: true,
    });
  };

  onCancel = (): void => {
    log('form has been canceled');
  };

  validateRadioGroup = (value: string): boolean => {
    return value === 'alt1';
  };

  getRadioGroupErrorMessage = (): string => {
    return 'Du må velge alternativ 1';
  };

  isFieldsetValid = (): boolean => {
    if (!this.state.formValidated) {
      return true; // only validate fieldset when form has been submitted at least once
    }
    if (this.state.checkbox1Checked || this.state.checkbox2Checked) {
      return true;
    }
    return false;
  };

  render(): JSX.Element {
    const radioOptions: Array<Options> = [
      {
        type: 'alt1',
        label: 'Alternativ1',
      },
      {
        type: 'alt2',
        label: 'Alternativ2',
      },
    ];

    return (
      <div>
        <h3>{'Ulike form-komponenter'}</h3>
        <p>
          {
            '(!) Form validering fungerer slik at imnput-komponenter wrappes i en <Validation>. De clones ved bruk av ref og berikes av valideringsmetoder. En class ref kan ikke sendes videre til en FunctionComponent. Det er derfor kun Class Components som kan wrappes i <Validation> (ikke FunctionComponent)'
          }
        </p>
        <CheckBox label="Disabled" onChange={this.handleDisableButtonChange} id="disabledcheckbox" checked={this.state.disabled} />
        <Form
          action="#"
          submitButtonText="Send"
          errorMessage="Sjekk at alt er riktig utfylt"
          requiredLabel="(må fylles ut)"
          optionalLabel="(valgfritt)"
          cancelButtonText="Avbryt"
          pauseButtonText="Fortsett senere"
          draftButtonText="Lagre knapp (onDraft)"
          onDraft={this.onDraft}
          onPause={() => {}}
          disabled={this.state.disabled}
          onCancel={this.onCancel}
          pauseButtonLevel="secondary"
          pauseButtonLeftIcon={Pause}
          cancelButtonOutline
          cancelButtonRight
          cancelButtonLeftIcon={ArrowLeft}
          onSubmit={this.onSubmit}
          validationSummary={{
            enable: true,
            header: 'Sjekk at alt er riktig utfylt',
          }}
          draftButtonTestId="form-draftbutton"
          submitButtonTestId="form-submitbutton"
          cancelButtonTestId="form-cancelbutton"
          pauseButtonTestId="form-pausebutton"
          validationTestId="form-validation"
          pauseButtonType="display"
          submitButtonType="display"
          cancelButtonType="display"
        >
          <WrappedComponent />
          <SafeInputField id="disabledField" inputName="disabledField" value={''} showLabel={true} label="disabled field" disabled />
          <Validation>
            <SafeInputField
              isRequired
              id="formExampleNavn"
              inputName="formExampleNavn"
              value={this.state.inputFieldValue}
              minLength={3}
              onChangeValidator={this.inputFieldChangeValidator}
              onBlurValidator={this.inputFieldOnBlurValidator}
              onBlur={this.inputFieldOnBlur}
              errorMessage={this.getFornavnErrorMessage}
              showLabel={true}
              label="Minlength=3, asynknron onblurvalidator og onchangevalidator"
              onChange={this.inputFieldChange}
            />
          </Validation>
          <Validation>
            <SafeInputField
              id="formExampleDesimaltall"
              inputName="formExampleDesimaltall"
              value={this.state.inputFieldDecimalValue}
              errorMessage="Desimaltall må ha færre enn to desimaler"
              showLabel={true}
              label="Desimaltall (maks to desimaler)"
              type="number"
              pattern="^[0-9]+(.[0-9]{1,2})?$"
              onChange={this.inputFieldDecimalChange}
            />
          </Validation>
          <Validation>
            <SafeInputField
              id="formExampleNumber"
              inputName="formExampleNumber"
              value={this.state.inputFieldNumberValue}
              errorMessage="Heltall må være mellom 2 og 5"
              showLabel={true}
              max={5}
              min={2}
              label="Heltall (min 2 max 5)"
              type="number"
              onChange={this.inputFieldNumberChange}
            />
          </Validation>
          <Validation>
            <SafeInputField
              id="formExampleRegex"
              inputName="formExampleRegex"
              value={this.state.inputFieldNameValue}
              onBlur={this.inputFieldOnBlur}
              errorMessage="Etternavn må starte med stor forbokstav"
              showLabel={true}
              label="Etternavn (må starte med stor forbokstav)"
              onChange={this.inputFieldNameChange}
              pattern="^[A-Z][a-z]*"
            />
          </Validation>

          <Validation>
            <SafeTextarea
              id="formTextarea"
              minlength={2}
              value={this.state.textfieldValue ? this.state.textfieldValue : ''}
              isRequired={true}
              showLabel={true}
              label="Hvor har du vondt?"
              validator={this.validateTextarea}
              errorMessage={this.getTextareaErrorMessage}
              onChange={this.onTextfieldChange}
            />
          </Validation>

          <Validation>
            <SafeSelect
              id="selectexample"
              label="safe-select for å teste z-index"
              selectName="select-example2"
              showLabel={true}
              showLabelLeft={true}
              options={[
                new Option('--- Velg ---', '-1'),
                new Option('Fastlege (0)', '0'),
                new Option('Flyktig lege (1)', '1'),
                new Option('Alternativ behandler (2)', '2'),
              ]}
              onChange={this.onSafeselectChange}
              selected={this.state.safeselect}
              errorMessage={(v: string) => {
                return `Error: ${v === '-1' ? 'Du må velge noe' : 'Du får ikke lov til å velge Fastlege (0)'}`;
              }}
              onChangeValidator={(v: string) => {
                const isValid = v !== '-1' && v !== '0';
                console.log('onChangeValidator isValid', isValid);
                return isValid;
              }}
              requiredLabel={' (feltet er required)'}
              value={this.state.safeselect}
              isRequired
            />
          </Validation>

          <Validation>
            <RadioGroup
              id="formRadioGroupExample"
              options={radioOptions}
              legend="Hvilket alternativ passer best for deg?"
              onChange={this.handleRadioChange}
              selected={this.state.radioGroupValue}
              validator={this.validateRadioGroup}
              getErrorMessage={this.getRadioGroupErrorMessage}
              isRequired={true}
            />
          </Validation>
        </Form>
        <h3>{'Form med checkbox og validering'}</h3>
        <Form
          submitButtonType="display"
          action="#"
          submitButtonText={'Opprett digitalt donorkort'}
          errorMessage={''}
          onSubmit={() => log('sendte inn skjema')}
        >
          <Validation>
            <CheckBox
              label={'Jeg ønsker å gi bort mine organer og vev for transplantasjon ved min bortgang'}
              onChange={this.toggleCheckbox4}
              id="savebuttoncheckbox"
              checked={this.state.checkbox4Checked}
              isRequired
              isStyleBlue
              errorMessage={'Du må krysse av for å gå videre'}
            />
          </Validation>
        </Form>
      </div>
    );
  }
}

export default FormExample;
