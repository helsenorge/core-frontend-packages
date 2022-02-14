import * as React from 'react';
import Validation, { ValidationProps } from '../validation';
import SafeInputField from '../../safe-input-field';

interface State {
  value: string;
}

export default class WrappedComponent extends React.Component<ValidationProps, State> {
  constructor(props: ValidationProps) {
    super(props);
    this.state = {
      value: '',
    };
  }

  inputFieldChange = (event: React.FormEvent<{}>): void => {
    const target: HTMLInputElement = event.target as HTMLInputElement;
    const value: string = target.value;
    this.setState({
      value,
    });
  };

  render() {
    return (
      <Validation {...this.props}>
        <SafeInputField
          id="input"
          onChange={this.inputFieldChange}
          inputName="lala"
          value={this.state.value}
          isRequired
          label="Nøstet komponent"
          showLabel
        />
      </Validation>
    );
  }
}
