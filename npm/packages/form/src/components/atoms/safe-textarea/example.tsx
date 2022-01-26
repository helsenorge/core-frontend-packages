import * as React from 'react';
import { SafeTextarea } from '.';
import { RadioGroup } from '../radio-group';
import { isValid } from '@helsenorge/core-utils/string-utils';

const radioOptionsSize: { type: string; label: string }[] = [
  { type: 'small', label: 'Small' },
  { type: 'medium', label: 'Medium' },
  { type: 'large', label: 'Large' },
  { type: 'maxlength', label: 'La maxlength bestemme' },
];

type sizes = 'small' | 'medium' | 'large' | 'maxlength';

interface SafeTextareaExampleState {
  isValid: boolean;
  value: string;
  size?: sizes;
  maxLength?: number;
  showmax: boolean;
}

export default class SafeTextareaExample extends React.Component<{}, SafeTextareaExampleState> {
  constructor(props: {}) {
    super(props);
    this.state = { isValid: false, value: '', size: 'medium', showmax: false, maxLength: 100 };
    this.handleRadioChange = this.handleRadioChange.bind(this);
    this.handleMaxLengthChange = this.handleMaxLengthChange.bind(this);
  }

  onBlur(): void {
    const info: Console = console;
    info.log('textarea har mistet fokus');
  }

  onChange(event: React.FormEvent<{}>): void {
    const info: Console = console;
    info.log('textarea har endret innhold', event);
  }

  onFocus(): void {
    const info: Console = console;
    info.log('textarea har fått fokus');
  }

  handleRadioChange(radioknapp: sizes): void {
    if (radioknapp === 'maxlength') {
      this.setState({ size: radioknapp, showmax: true });
    } else {
      this.setState({ size: radioknapp, showmax: false });
    }
  }

  handleMaxLengthChange(e: React.FormEvent<{}>): void {
    const target: HTMLInputElement = e.target as HTMLInputElement;
    const value: number = parseInt(target.value, 10);
    this.setState({ maxLength: value });
  }

  notifyValidated = (isValid: boolean) => {
    this.setState({
      isValid,
    });
  };

  render(): JSX.Element {
    const maxlength: JSX.Element = (
      <div className="nested-fieldset nested-fieldset--full-height">
        <label htmlFor="maxlengthtextarea">{'Maks lengde'}</label>
        <input
          className="atom_input--small "
          id="maxlengthtextarea"
          type="number"
          value={this.state.maxLength}
          onChange={this.handleMaxLengthChange}
        />
      </div>
    );
    const setup: JSX.Element = (
      <div>
        <RadioGroup
          id="safetextareasize"
          legend="Størrelse"
          options={radioOptionsSize}
          onChange={this.handleRadioChange}
          selected={this.state.size}
        />
        {this.state.showmax ? maxlength : null}
      </div>
    );

    return (
      <React.Fragment>
        {setup}
        <SafeTextarea
          size={this.state.size !== 'maxlength' ? this.state.size : undefined}
          id="exampleTextarea"
          counter={this.state.maxLength ? true : false}
          maxlength={this.state.size === 'maxlength' ? this.state.maxLength : undefined}
          disabled={false}
          autoFocus={false}
          value="default verdi"
          placeholder="Skriv noe her"
          onFocus={this.onFocus}
          onChange={this.onChange}
          onBlur={this.onBlur}
          validator={isValid}
          testId="SafeTextArea"
        />
        <br />

        <SafeTextarea
          id="exampleTextarea2"
          label={'SafeTextarea med validering: minlength 5 og maxlength 10'}
          showLabel={true}
          size={undefined}
          minlength={5}
          maxlength={10}
          disabled={false}
          autoFocus={false}
          value={this.state.value}
          placeholder="Skriv noe her"
          isRequired
          onChange={(event: React.FormEvent<{}>) => {
            this.setState({ value: (event.target as HTMLInputElement).value });
          }}
          errorMessage={(v: string) => `Error:  Denne verdien '${v}' er ikke gyldig`}
          onValidated={this.notifyValidated}
          requiredLabel={' (feltet er required)'}
        />
      </React.Fragment>
    );
  }
}
