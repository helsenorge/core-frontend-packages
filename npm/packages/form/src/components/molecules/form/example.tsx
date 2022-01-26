import * as React from 'react';
import moment, { Moment } from 'moment';
import { log } from '@helsenorge/core-utils/logger';

import {
  SuggestionsFetchRequested,
  SuggestionsFetchRequestedParams,
  OnSuggestionSelected,
  OnSuggestionsClearRequested,
} from 'react-autosuggest';

import Form from '.';

import SafeInputField from '../../atoms/safe-input-field';
import { SafeTextarea } from '../../atoms/safe-textarea';
import { RadioGroup, Options } from '../../atoms/radio-group';

import SafeSelect from './../../atoms/safe-select';
import DateTimePicker from './../../molecules/date-time-picker';
import { DateRangePicker } from '../../molecules/date-range-picker';

import Autosuggest, { Suggestion } from '../../molecules/autosuggest';

import { CheckBox } from '../../atoms/checkbox';

import WrappedComponent from './example/wrapped-component-example';
import Validation from './validation';

interface ExampleState {
  minDate?: string;
  maxDate?: string;
  checkbox1Checked?: boolean;
  checkbox2Checked?: boolean;
  checkbox3Checked?: boolean;
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
  startDateValue: Moment | undefined;
  endDateValue: Moment | undefined;
  saving: boolean;
  saved: boolean;
  radioGroupValue: string;
  formValidated: boolean;
  suggestions: Array<Suggestion>;
  autosuggestValue: string;
  inputFieldRequiredValue: string;
  inputFieldNameValue: string;
  saveButton: boolean;
  inputFieldDecimalValue: string;
  inputFieldNumberValue: string;
}

export default class FormExample extends React.Component<{}, ExampleState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      minDate: '01.01.2020',
      maxDate: '31.12.2020',
      checkbox1Checked: false,
      checkbox2Checked: false,
      checkbox3Checked: false,
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
      startDateValue: moment('10.09.2020', 'DD.MM.YYYY'),
      endDateValue: undefined,
      saving: false,
      saved: false,
      radioGroupValue: '',
      formValidated: false,
      suggestions: [],
      autosuggestValue: '',
      inputFieldRequiredValue: '',
      inputFieldNameValue: '',
      inputFieldDecimalValue: '',
      saveButton: false,
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

  onAutosuggestChange = (e: React.FormEvent<HTMLInputElement>, { newValue }: { newValue: string; method: string }): void => {
    console.log('onAutosuggestChange', e, newValue);
    this.setState({ autosuggestValue: newValue });
  };

  onSuggestionsFetchRequested: SuggestionsFetchRequested = (requestParams: SuggestionsFetchRequestedParams) => {
    console.log('onSuggestionsFetchRequested', requestParams.value);
    const suggestions: Array<Suggestion> = [
      { label: 'First suggestion', value: 'First suggestion' },
      {
        label: 'Second suggestion which is very long and not accepted under validation',
        value: 'Second suggestion which is very long and not accepted under validation',
      },
      { label: 'Third suggestion', value: 'Third suggestion' },
      { label: 'Fourth suggestion', value: 'Fourth suggestion' },
    ];

    this.setState({
      suggestions,
    });
  };

  onSuggestionsSelected: OnSuggestionSelected<Suggestion> = (e, data) => {
    console.log('onSuggestionsSelected', data.suggestion, e);
    this.setState({
      autosuggestValue: data.suggestion.value,
    });
  };

  onSuggestionsClearRequested: OnSuggestionsClearRequested = () => {
    console.log('onSuggestionsClearRequested');
    this.setState({
      suggestions: [],
    });
  };

  onTextfieldChange = (event: React.FormEvent<{}>): void => {
    const target: HTMLInputElement = event.target as HTMLInputElement;
    const value: string = target.value;
    this.setState({
      textfieldValue: value,
    });
  };

  onChangeDateTimeInput = (value: Date | undefined): void => {
    const info: Console = console;
    this.setState({
      datetimeinputValue: value,
    });
    info.log('onChangeDateTimeInput', value);
  };

  onChangeDateTimePicker = (date: moment.Moment | undefined, time: string): void => {
    const info: Console = console;
    this.setState({
      datetimepickerDateValue: date,
      datetimepickerTimeValue: time,
    });
    info.log('onChangeDatePickerInput', date, time, '.->', date, time);
  };

  onChangeDatePicker = (value: Date | undefined): void => {
    const info: Console = console;
    this.setState({
      datepickerValue: value,
    });
    info.log('onDatePickerChange', value);
  };

  onSafeselectChange = (evt: React.MouseEvent): void => {
    const info: Console = console;
    const value = (evt.target as HTMLInputElement).value ? (evt.target as HTMLInputElement).value : '-1';
    this.setState({
      safeselect: value,
    });
    info.log('onSafeselectChange', value);
  };

  onChangeSingleDatePicker = (value: moment.Moment | { start: moment.Moment | null; end: moment.Moment | null } | null): void => {
    const info: Console = console;

    this.setState({
      daterangepickerValue: value as moment.Moment,
    });
    info.log('onChangeSingleDatePicker', value);
  };

  onChangeRangeDatePicker = (value: { start: moment.Moment | null; end: moment.Moment | null }): void => {
    const info: Console = console;
    this.setState({
      startDateValue: value.start as moment.Moment,
      endDateValue: value.end as moment.Moment,
    });

    info.log('onDatePickerChange', value);
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

  handleSaveButtonChange = (): void => {
    this.setState({ saveButton: !this.state.saveButton });
  };

  onSubmit = (): void => {
    log('form has been submitted');
    this.setState({
      formSubmitted: true,
    });
  };

  onDraft = (): void => {
    log('form has been saved as draft');
    this.setState({
      formSubmitted: true,
    });
  };

  saveButtonOnClick = (): void => {
    if (!this.state.saved) {
      this.setState({
        formSubmitted: true,
        saving: true,
      });
      setTimeout(() => {
        // this.setState({ saving: false, saved: true });
      }, 3000);
    }
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
        <p>
          {
            '(!) Form validering fungerer slik at imnput-komponenter wrappes i en <Validation>. De clones ved bruk av ref og berikes av valideringsmetoder. En class ref kan ikke sendes videre til en FunctionComponent. Det er derfor kun Class Components som kan wrappes i <Validation> (ikke FunctionComponent)'
          }
        </p>
        <CheckBox label="Bruk lagreknapp" onChange={this.handleSaveButtonChange} id="savebuttoncheckbox" checked={this.state.saveButton} />
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
          onCancel={this.onCancel}
          pauseButtonLevel="secondary"
          cancelButtonRight
          onSubmit={this.onSubmit}
          saveButtonOnClick={this.saveButtonOnClick}
          saving={this.state.saving}
          saved={this.state.saved}
          saveText={this.state.saveButton ? 'Lagre endringer' : undefined}
          savedText={'Lagret'}
          validationSummary={{
            enable: true,
            header: 'Sjekk at alt er riktig utfylt',
          }}
          saveButtonTestId="form-savebutton"
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
            <Autosuggest
              id={'autosuggest-id'}
              type="search"
              placeholder={'Placeholder text'}
              label={'This is an autosuggest field'}
              subLabel={'and its sublabel'}
              value={this.state.autosuggestValue}
              suggestions={this.state.suggestions}
              onChange={this.onAutosuggestChange}
              onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
              onSuggestionsClearRequested={this.onSuggestionsClearRequested}
              onSuggestionSelected={this.onSuggestionsSelected}
              errorMessage={'Feltet er påkrevd. Du må velge noe med minLength 2 og maxLength 25'}
              isRequired={true}
              minLength={2}
              maxLength={25}
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
            <DateTimePicker
              id="date-time-picker"
              legend="Når ble du behandlet?"
              dateLabel={'Velg en dato'}
              timeLabel={'og en tid'}
              dateValue={this.state.datetimepickerDateValue}
              timeValue={this.state.datetimepickerTimeValue}
              minimumDateTime={moment('15.07.2020 12:10', 'DD.MM.YYYY HH:mm')}
              maximumDateTime={moment('20.07.2020 12:10', 'DD.MM.YYYY HH:mm')}
              onChange={this.onChangeDateTimePicker}
              isRequired
            />
          </Validation>

          <Validation>
            <DateRangePicker
              id="formdrpsingle"
              type="single"
              singleDateValue={this.state.daterangepickerValue}
              isMonthHeaderSimplified
              //initialDate={moment('08.09.2020', 'DD.MM.YYYY')}
              minimumDate={moment('05.09.2020', 'DD.MM.YYYY')}
              maximumDate={moment('10.09.2020', 'DD.MM.YYYY')}
              dateValidator={(id, date) => {
                const dateToCompare = moment('05.09.2020', 'DD.MM.YYYY');
                const isValid = !date?.isSame(dateToCompare, 'day');
                return { isValid, errorString: id + 'Custom Validator - Dato kan ikke være 05.09 - just because ;)' };
              }}
              onDateChange={this.onChangeSingleDatePicker}
              onError={() => {
                console.log('there is an error');
              }}
              label={'My new datepicker'}
              requiredLabel={'My required label'}
              optionalLabel={'med optional label'}
              placeholder="placeholder"
              isRequired
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
            <DateRangePicker
              id="formdrprange"
              type="range"
              startDateValue={this.state.startDateValue}
              endDateValue={this.state.endDateValue}
              minimumDate={moment('05.09.2020', 'DD.MM.YYYY')}
              maximumDate={moment('14.09.2020', 'DD.MM.YYYY')}
              dateValidator={(id, start, end) => {
                const dateToCompare = moment('05.09.2020', 'DD.MM.YYYY');
                const isValid = !start?.isSame(dateToCompare, 'day') && !end?.isSame(dateToCompare, 'day');
                return { isValid, errorString: id + 'Custom Validator - Datoene kan ikke være 05.09 - just because ;)' };
              }}
              minimumPeriod={3}
              onError={() => {
                console.log('there is an error');
              }}
              onDateChange={this.onChangeRangeDatePicker}
              label={'My range datepicker'}
              requiredLabel={'My required label'}
              placeholder="dd.mm.åååå"
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
      </div>
    );
  }
}
