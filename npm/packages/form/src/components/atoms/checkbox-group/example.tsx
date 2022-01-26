import * as React from 'react';
import CheckBoxGroup, { Option } from '.';

const info: Console = console;
interface CheckBoxGroupExampleState {
  checkboxes: Array<Option>;
}

export default class CheckBoxGroupExample extends React.Component<{}, CheckBoxGroupExampleState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      checkboxes: [
        { id: '1', label: 'Dog', checked: false },
        { id: '2', label: 'Cat', checked: false },
        { id: '3', label: 'Fish', checked: false },
        { id: '4', label: 'Platypus', checked: false },
        { id: '5', label: 'Dodo', checked: false, disabled: true },
      ],
    };
    this.onHandleChange = this.onHandleChange.bind(this);
    this.onValidated = this.onValidated.bind(this);
  }

  onHandleChange(id: string): void {
    let changed!: Option;
    const newCheckboxes = this.state.checkboxes.map(e => {
      if (e.id === id) {
        e.checked = !e.checked;
        changed = e;
      }
      return e;
    });

    if (changed) {
      info.log(`You just ${changed.checked ? 'selected' : 'deselected'} ${changed.label}`);
    }

    this.setState({ checkboxes: newCheckboxes });
  }

  onValidated(isValid: boolean): void {
    info.log(`I'm ${isValid ? '' : '_not_'} valid!`);
  }

  render(): JSX.Element {
    return (
      <React.Fragment>
        <CheckBoxGroup
          id="1"
          legend={<strong>{'legend: Pick your top two favorite animals'}</strong>}
          handleChange={this.onHandleChange}
          onValidated={this.onValidated}
          errorMessage="errorMessage: you can't select more than two animals!"
          max={2}
          checkboxes={this.state.checkboxes}
          checkboxTestId="Checkbox"
          validationTestId="Validation"
          checkboxGroupTestId="CheckboxGroup"
        />
      </React.Fragment>
    );
  }
}
