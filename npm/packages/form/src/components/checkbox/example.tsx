import * as React from 'react';

import Button from '@helsenorge/designsystem-react/components/Button';
import { Icon } from '@helsenorge/designsystem-react/components/Icon';
import HelpSign from '@helsenorge/designsystem-react/components/Icons/HelpSign';

import { CheckBox } from '.';

interface CheckboxExampleState {
  isLillaChecked: boolean;
  isLongtextChecked: boolean;
  isBlueChecked: boolean;
  isBoxedChecked: boolean;
  isHjelpetriggerChecked: boolean;
  isHjelpVisible: boolean;
}

export class CheckboxExample extends React.Component<{}, CheckboxExampleState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      isLillaChecked: false,
      isLongtextChecked: false,
      isBlueChecked: false,
      isBoxedChecked: false,
      isHjelpetriggerChecked: false,
      isHjelpVisible: false,
    };
  }

  handleLillaChange = (): void => {
    const info: Console = console;
    info.log('Du klikket på lilla checkboxen');
    this.setState({ isLillaChecked: !this.state.isLillaChecked });
  };

  handleLongtextChange = (): void => {
    const info: Console = console;
    info.log('Du klikket på Longtext checkboxen');
    this.setState({ isLongtextChecked: !this.state.isLongtextChecked });
  };

  handleBlueChange = (): void => {
    const info: Console = console;
    info.log('Du klikket på blue checkboxen');
    this.setState({ isBlueChecked: !this.state.isBlueChecked });
  };

  handleBoxedChange = (): void => {
    const info: Console = console;
    info.log('Du klikket på isBox checkboxen');
    this.setState({ isBoxedChecked: !this.state.isBoxedChecked });
  };

  handleHjelpetriggerChange = (): void => {
    const info: Console = console;
    info.log('Du klikket på hjelpetrigger checkboxen');
    this.setState({ isHjelpetriggerChecked: !this.state.isHjelpetriggerChecked });
  };

  handleVisHjelp = (): void => {
    this.setState({ isHjelpVisible: !this.state.isHjelpVisible });
  };

  render(): JSX.Element {
    return (
      <React.Fragment>
        <CheckBox
          label="CheckBox lilla"
          onChange={this.handleLillaChange}
          id="referralFilterLillaCheckBox"
          checked={this.state.isLillaChecked}
          checkboxTestId="Checkbox"
          labelTestId="Label"
          validationTestId="Validation"
        />
        <CheckBox
          label="CheckBox with a very very long label. Lorem ipsum dolor sit amet consctur lorem ipsum dolor sit amet consctur lorem ipsum dolor sit amet consctur lorem ipsum dolor sit amet consctur l"
          onChange={this.handleLongtextChange}
          id="referralFilterLongtextCheckBox"
          checked={this.state.isLongtextChecked}
        />
        <CheckBox
          label="CheckBox blue"
          isStyleBlue={true}
          onChange={this.handleBlueChange}
          id="referralFilterBlueCheckBox"
          checked={this.state.isBlueChecked}
        />
        <CheckBox
          label="CheckBox isBoxed"
          isStyleBoxed={true}
          onChange={this.handleBoxedChange}
          id="referralFilterBoxCheckBox"
          checked={this.state.isBoxedChecked}
        />

        <CheckBox
          label="Disabled checkbox"
          onChange={() => {
            return null;
          }}
          id="referralFilterCheckBox2"
          disabled
        />
        <CheckBox
          label="Checked disabled checkbox"
          onChange={() => {
            return null;
          }}
          id="referralFilterCheckBox3"
          disabled
          checked
        />
        <CheckBox
          label="CheckBox med hjelpetrigger og comment"
          onChange={this.handleHjelpetriggerChange}
          id="referralFilterHjelpetriggerCheckBox"
          checked={this.state.isHjelpetriggerChecked}
          comment="Dette er en kommentar"
          helpButton={
            <Button ariaLabel={'Vis hjelp eksempel'} variant="borderless" onClick={this.handleVisHjelp}>
              {<Icon color={'black'} svgIcon={HelpSign} />}
            </Button>
          }
          helpElement={this.state.isHjelpVisible ? <div>{`Dette er en hjelpetekst`}</div> : undefined}
        />
      </React.Fragment>
    );
  }
}

export default CheckboxExample;
