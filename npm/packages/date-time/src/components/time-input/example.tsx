import * as React from 'react';

import { Validation } from '@helsenorge/form/components/form/validation';

import TimeInput from '.';

interface TimeInputExampleState {
  value: string;
  value2: string;
}

export class TimeInputExample extends React.Component<{}, TimeInputExampleState> {
  timeInputRef: React.RefObject<TimeInput>;
  timeInputRef2: React.RefObject<TimeInput>;

  constructor(props: {}) {
    super(props);
    this.timeInputRef = React.createRef();
    this.timeInputRef2 = React.createRef();
    this.state = { value: '', value2: '' };
  }

  handleTimeChange = (newTime: string): void => {
    console.log('Feltet har ny verdi', newTime);
    this.setState({ value: newTime });
  };
  handleSecondTimeChange = (newTime: string): void => {
    console.log('Feltet har ny verdi', newTime);
    this.setState({ value2: newTime });
  };

  onValidated = (valid: boolean | undefined): void => {
    console.log('onValidated', valid);
  };

  onBlur = () => {
    console.log('onBlur test');
  };

  render(): JSX.Element {
    return (
      <>
        <Validation>
          <TimeInput
            ref={this.timeInputRef}
            id="timeInput"
            legend={'Velg en time mellom 2-5 og minutter mellom 2-30'}
            value={this.state.value}
            onBlur={this.onBlur}
            maxHour={5}
            minHour={2}
            maxMinute={30}
            minMinute={2}
            onTimeChange={this.handleTimeChange}
            onValidated={this.onValidated}
            isRequired
            resetButton={{
              onReset: () => {},
              resetButtonText: 'Reset',
            }}
          />
        </Validation>
        <br />
        <Validation>
          <TimeInput
            ref={this.timeInputRef2}
            id="timeInput2"
            legend={'Velg et tidspunkt, når som helst på døgnet'}
            value={this.state.value2}
            onBlur={this.onBlur}
            onTimeChange={this.handleSecondTimeChange}
            onValidated={this.onValidated}
            isRequired
          />
        </Validation>
      </>
    );
  }
}

export default TimeInputExample;
