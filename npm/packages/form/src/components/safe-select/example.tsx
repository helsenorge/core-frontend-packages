import * as React from 'react';

import SafeSelect from '.';

export class SafeSelectExample extends React.Component<{}, { selected: string | undefined; isValid: boolean }> {
  constructor(props: {}) {
    super(props);
    this.state = {
      selected: '',
      isValid: false,
    };
  }
  onChange = (evt: React.MouseEvent): void => {
    const selected = (evt.target as HTMLInputElement).value ? (evt.target as HTMLInputElement).value : '-1';
    console.log('onChange called setSelected', selected);
    this.setState({
      selected,
    });
  };
  notifyValidated = (isValid: boolean) => {
    this.setState({
      isValid,
    });
  };
  render(): JSX.Element {
    const options: Array<HTMLOptionElement> = [
      new Option('--- Velg ---', '-1'),
      new Option('Fastlege (0)', '0'),
      new Option('Flyktig lege (1)', '1'),
      new Option('Alternativ behandler (2)', '2'),
    ];
    return (
      <React.Fragment>
        <SafeSelect
          id="selectexample"
          label="Velg et eller et annet"
          selectName="select-example"
          showLabel={true}
          options={options}
          onChange={this.onChange}
          selected={this.state.selected}
          errorMessage={(v: string) => {
            return `Error: ${v === '-1' ? 'Du må velge noe' : 'Du får ikke lov til å velge Fastlege (0)'}`;
          }}
          onChangeValidator={(v: string) => {
            const isValid = v !== '-1' && v !== '0';
            console.log('onChangeValidator isValid', isValid);
            return isValid;
          }}
          onValidated={this.notifyValidated}
          requiredLabel={' (feltet er required)'}
          value={this.state.selected}
          isRequired
          selectTestId="SafeSelect"
          validationTestId="Validation"
          labelTestId="Label"
        />
        <p>{`Verdi som er valgt er ${this.state.selected} og feltet ${
          this.state.isValid ? 'er validert riktig' : 'er IKKE validert riktig'
        } `}</p>
        <p>
          <br />
        </p>
        <SafeSelect
          id="selectexample"
          label="Eksempel med showLabelLeft"
          selectName="select-example2"
          showLabel={true}
          showLabelLeft={true}
          options={options}
          onChange={this.onChange}
          selected={this.state.selected}
          errorMessage={(v: string) => {
            return `Error: ${v === '-1' ? 'Du må velge noe' : 'Du får ikke lov til å velge Fastlege (0)'}`;
          }}
          onChangeValidator={(v: string) => {
            const isValid = v !== '-1' && v !== '0';
            console.log('onChangeValidator isValid', isValid);
            return isValid;
          }}
          onValidated={this.notifyValidated}
          requiredLabel={' (feltet er required)'}
          value={this.state.selected}
          isRequired
        />
      </React.Fragment>
    );
  }
}

export default SafeSelectExample;
