import * as React from 'react';
import SafeInputField from './index';
import { isValid } from '@helsenorge/core-utils/string-utils';

export default class SafeInputFieldExample extends React.Component<{}, {}> {
  onBlur(): void {
    const info: Console = console;
    info.log('Input feltet har mistet fokus');
  }

  onBlurValidator(value: string | number): Promise<boolean> {
    const info: Console = console;
    info.log('onBlurValidator: ', value);
    return new Promise(resolve => {
      setTimeout(() => {
        if (value !== 'b') {
          resolve(false);
        }
        resolve(true);
      }, 1000);
    });
  }

  onFocus(): void {
    const info: Console = console;
    info.log('Feltet har fått fokus');
  }

  changeValidator(value: string | number): boolean {
    const info: Console = console;
    info.log('onChangeValidator: ', value);
    return value !== 'a'; // For demo
  }

  handleChange(event: React.FormEvent<{}>): void {
    const info: Console = console;
    info.log('Feltet har ny verdi', event);
  }

  render(): JSX.Element {
    return (
      <div>
        {'Størrelse på input feltet settes enten ved prop xsmall - xlarge, eller ved å sette en maks lengde på input'}
        <SafeInputField
          size={'xSmall'}
          id="exampleSafeInputField"
          value=""
          disabled={false}
          className="mittTestInputFelt"
          onFocus={this.onFocus}
          onChange={this.handleChange}
          onChangeValidator={this.changeValidator}
          onBlurValidator={this.onBlurValidator}
          errorMessage="Denne verdien er ikke gyldig"
          onBlur={this.onBlur}
          showLabel={true}
          inputName="TestInput"
          label="xSmall"
          inputTestId="SafeInputField"
          validationTestId="Validation"
          labelTestId="Label"
        />
        <br />
        <SafeInputField value="" size={'small'} showLabel={true} label="small" inputName="TestInput3" />
        <br />
        <SafeInputField value="" size={'medium'} showLabel={true} label="medium" inputName="TestInput4" />
        <br />
        <SafeInputField value="" size={'large'} showLabel={true} label="large" inputName="TestInput5" />
        <br />
        <SafeInputField value="" size={'xLarge'} showLabel={true} label="xLarge" inputName="TestInput6" />
        <br />
        <SafeInputField value="" size={'medium'} showLabel={true} label="maxLength 5" inputName="TestInput7" maxLength={5} />

        <br />
        <SafeInputField value="" size={'medium'} showLabel={true} label="max 5" max={5} type={'number'} inputName="TestInput9" />
        <br />
        <SafeInputField disabled size={'medium'} showLabel={true} label="Deaktivert felt" inputName="TestInput10" />
        <br />
        <SafeInputField placeholder={'Placeholder tekst'} inputName="TestInput11" />
        <br />
        <SafeInputField
          value=""
          size={'medium'}
          showLabel={true}
          label="validerer ulovlige tegn (bruker util isValid). tillater ikke html-tags eller emoticons"
          inputName="TestInput12"
          onChangeValidator={isValid}
        />
      </div>
    );
  }
}
