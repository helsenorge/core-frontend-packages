import * as React from 'react';
import { RadioGroup, Options } from '.';

interface State {
  selected: string;
}
export default class RadioGroupExample extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      selected: 'alt3',
    };
  }

  handleChange = (value: string): void => {
    this.setState({
      selected: value,
    });
    console.log('Du klikket på radioknappen: ', value);
  };

  render(): JSX.Element {
    const radioOptions: Array<Options> = [
      {
        type: 'alt1',
        label: 'Alternativ 1',
      },
      {
        type: 'alt2',
        label:
          'Alternativ 2 med en utrolig lang label tekst. Lorem ipsum ddolor sit amet consectur Lorem ipsum ddolor sit amet consectur Lorem ipsum ddolor sit amet consectur',
      },
      {
        type: 'alt3',
        label: 'Alternativ 3, deaktivert',
        disabled: true,
      },
    ];

    return (
      <RadioGroup
        id="example"
        options={radioOptions}
        onChange={this.handleChange}
        selected={this.state.selected}
        legend="Hvilket alternativ vil du ha?"
        testId="RadioGroup"
      />
    );
  }
}
