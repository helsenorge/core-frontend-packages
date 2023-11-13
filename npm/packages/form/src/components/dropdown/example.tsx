import * as React from 'react';

import Icon, { IconSize } from '@helsenorge/designsystem-react/components/Icon';
import Rocket from '@helsenorge/designsystem-react/components/Icons/Rocket';

import CheckBoxGroup, { Option } from '../checkbox-group';
import Form, { FormChild } from '../form';
import { Validation } from '../form/validation';
import SafeInputField from '../safe-input-field';

import { Dropdown } from '.';

interface DropdownExampleState {
  dropdown0: boolean;
  dropdown1: boolean;
  dropdown2: boolean;
  dropdown3: boolean;
  dropdown4: boolean;
  dropdown5: boolean;
  dropdown4Value: string | undefined;
  dropdown5Value: string | undefined;
  inputValue1: string;
  inputValue2: string;
  inputValue3: string;
  checkboxes: Array<Option>;
}

export class DropdownExample extends React.Component<{}, DropdownExampleState> {
  inputfieldInDropdownRef1: React.RefObject<FormChild>;
  inputfieldInDropdownRef2: React.RefObject<FormChild>;
  checkboxInDropdownRef: React.RefObject<FormChild>;

  constructor(props: {}) {
    super(props);
    this.inputfieldInDropdownRef1 = React.createRef();
    this.inputfieldInDropdownRef2 = React.createRef();
    this.checkboxInDropdownRef = React.createRef();

    this.state = {
      dropdown0: false,
      dropdown1: false,
      dropdown2: false,
      dropdown3: false,
      dropdown4: false,
      dropdown5: false,
      dropdown4Value: undefined,
      dropdown5Value: undefined,
      inputValue1: '',
      inputValue2: '',
      inputValue3: '',
      checkboxes: [
        { id: '1', label: 'Bil', checked: false },
        { id: '2', label: 'Drosje', checked: false },
        { id: '3', label: 'Båt', checked: false },
      ],
    };
  }

  toggleOpen = (index: number): void => {
    if (index === 0) {
      this.setState({ dropdown0: !this.state.dropdown0 });
    } else if (index === 1) {
      this.setState({ dropdown1: !this.state.dropdown1 });
    } else if (index === 2) {
      this.setState({ dropdown2: !this.state.dropdown2 });
    } else if (index === 3) {
      this.setState({ dropdown3: !this.state.dropdown3 });
    } else if (index === 4) {
      this.setState({ dropdown4: !this.state.dropdown4 });
    } else if (index === 5) {
      this.setState({ dropdown5: !this.state.dropdown5 });
    }
  };

  updateDropdown4Value = (index: number, value: string): void => {
    // Here you can have whatever busniess logic you want. The aim is just have a state which we can check for changes
    // This is what triggers validation
    const stateToObj = this.state.dropdown4Value ? JSON.parse(this.state.dropdown4Value) : {};
    const dropdownObj = { ...stateToObj, [index]: value };
    const dropdown4Value = JSON.stringify(dropdownObj);
    this.setState({ dropdown4Value });
  };

  updateDropdown5Value = (): void => {
    // Here you can have whatever busniess logic you want. The aim is just have a state which we can check for changes.
    // This is what triggers validation
    const dropdown5Value = JSON.stringify(this.state.checkboxes);
    this.setState({ dropdown5Value });
  };

  updateCheckboxValue = (id: string): void => {
    const newCheckboxes = this.state.checkboxes.map(e => {
      if (e.id === id) {
        e.checked = !e.checked;
      }
      return e;
    });

    this.setState({ checkboxes: newCheckboxes }, () => {
      this.updateDropdown5Value();
    });
  };

  render(): JSX.Element {
    return (
      <div>
        <h3>{'Respekter bredde på knapp (default)'}</h3>
        <Dropdown
          name="Dropdown 0"
          toggleDropdown={this.toggleOpen}
          index={0}
          open={this.state.dropdown0}
          buttonTestId="DropdownBtn"
          validationTestId="DropdownValidation"
        >
          {
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi porttitor, eros ut convallis commodo, ligula magna euismod dui, ut lobortis tellus magna eu metus.'
          }
        </Dropdown>
        <h3>{'Respekter bredde på innhold respectContent=true'}</h3>
        <Dropdown name="Dropdown 1" toggleDropdown={this.toggleOpen} index={1} open={this.state.dropdown1} respectContent={true}>
          {'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi porttitor, eros ut convallis commodo!'}
        </Dropdown>
        <h3>{'Bruk isFullWidth +  ikon'}</h3>
        <Dropdown
          name="Dropdown 2"
          icon={<Icon svgIcon={Rocket} size={IconSize.Small} />}
          toggleDropdown={this.toggleOpen}
          index={2}
          open={this.state.dropdown2}
          isFullWidth={true}
        >
          {'Lorem ipsum dolor sit amet!'}
        </Dropdown>
        <h3>{'Bruk av lang label + ikon med custom height'}</h3>
        <Dropdown
          name="Dropdown 3: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi porttitor, eros ut convallis commodo! Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi porttitor, eros ut convallis commodo! Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi porttitor, eros ut convallis commodo!"
          icon={<Icon svgIcon={Rocket} size={128} />}
          toggleDropdown={this.toggleOpen}
          index={3}
          open={this.state.dropdown3}
        >
          {'Lorem ipsum dolor sit amet!'}
        </Dropdown>
        <hr />
        <h3>{'Dropdown som en del av en <Form> med <Validation>'}</h3>

        <Form
          action="#"
          submitButtonText="Send"
          errorMessage="Sjekk at alt er riktig utfylt"
          requiredLabel={' *'}
          showRequiredLabel={true}
          optionalLabel="(valgfritt)"
          allowChildPropOverride
          onSubmit={() => {
            console.log('SUBMITTING');
          }}
        >
          <Validation>
            <SafeInputField
              label="TestInputDropdown1"
              inputName="TestInputDropdown1"
              value={this.state.inputValue1}
              showLabel={true}
              requiredLabel={'Overwritten required text'}
              requiredErrorMessage={'Feltet er required'}
              minLength={3}
              onValidated={(v: boolean) => {
                console.log('SafeInputFielkd 1 onValidated: ', v ? 'TRUE' : 'FALSE');
              }}
              errorMessage={(v: string) => `Error: ${v}`}
              onChange={(event: React.FormEvent<{}>): void => {
                this.setState({
                  inputValue1: (event.target as HTMLInputElement).value,
                });
              }}
              isRequired
            />
          </Validation>

          <Validation>
            <Dropdown
              name="This is my custom content Dropdown. Den inneholder input som skal valideres:"
              toggleDropdown={this.toggleOpen}
              index={4}
              open={this.state.dropdown4}
              childrenToValidate={[this.inputfieldInDropdownRef1, this.inputfieldInDropdownRef2]}
              errorMessage="Custom errorMessage: noe er ikke fylt ut riktig"
              value={this.state.dropdown4Value}
              isFullWidth
            >
              <SafeInputField
                ref={this.inputfieldInDropdownRef1 as unknown as React.RefObject<SafeInputField>}
                label="TestInputDropdown2"
                inputName="TestInputDropdown2"
                value={this.state.inputValue2}
                showLabel={true}
                requiredLabel={'Overwritten required text'}
                requiredErrorMessage={'Feltet er required'}
                minLength={3}
                errorMessage={(v: string) => `Error: ${v}`}
                onChange={(event: React.FormEvent<{}>): void => {
                  const value = (event.target as HTMLInputElement).value;
                  this.setState(
                    {
                      inputValue2: value,
                    },
                    () => {
                      this.updateDropdown4Value(0, value);
                    }
                  );
                }}
                isRequired
              />
              <SafeInputField
                ref={this.inputfieldInDropdownRef2 as unknown as React.RefObject<SafeInputField>}
                label="TestInputDropdown3"
                inputName="TestInputDropdown3"
                value={this.state.inputValue3}
                showLabel={true}
                requiredLabel={'Overwritten required text'}
                requiredErrorMessage={'Feltet er required'}
                minLength={3}
                errorMessage={(v: string) => `Error: ${v}`}
                onChange={(event: React.FormEvent<{}>): void => {
                  const value = (event.target as HTMLInputElement).value;
                  this.setState(
                    {
                      inputValue3: value,
                    },
                    () => {
                      this.updateDropdown4Value(1, value);
                    }
                  );
                }}
                isRequired
              />
            </Dropdown>
          </Validation>
        </Form>

        <hr />
        <h3>{'Dropdown med enestående komponent med <Validation>'}</h3>

        <Dropdown
          name="Velg transport (et eksempel med CheckboxGroup / List)"
          toggleDropdown={this.toggleOpen}
          index={5}
          open={this.state.dropdown5}
          childrenToValidate={[this.checkboxInDropdownRef]}
          errorMessage="Custom errorMessage: noe er ikke fylt ut riktig"
          value={this.state.dropdown5Value}
          isFullWidth
        >
          <CheckBoxGroup
            id="dropdowncheckbox1"
            ref={this.checkboxInDropdownRef as unknown as React.RefObject<CheckBoxGroup>}
            handleChange={this.updateCheckboxValue}
            errorMessage="Custom errorMessage: Du må velge min én transport og maks to"
            min={1}
            max={2}
            checkboxes={this.state.checkboxes}
            isRequired
          />
        </Dropdown>
        <p>
          <br />
        </p>
      </div>
    );
  }
}

export default DropdownExample;
