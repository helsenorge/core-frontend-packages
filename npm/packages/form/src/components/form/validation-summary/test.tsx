import * as React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import ValidationSummary, { Props } from '../validation-summary';
import SafeInputField from '../../safe-input-field';
import { FormChild } from '..';

describe('ValidationSummary', () => {
  let props: Props;
  let mountedValidationSummary: ReactWrapper<{}, {}> | undefined;

  const validationSummary = () => {
    if (!mountedValidationSummary) {
      mountedValidationSummary = mount(<ValidationSummary {...props} />);
    }
    return mountedValidationSummary;
  };

  beforeEach(() => {
    const safeInputField = mount(<SafeInputField id="id" value="value" />) as {} as FormChild;
    props = {
      components: [safeInputField],
      submitted: undefined,
      header: '',
    };
    mountedValidationSummary = undefined;
  });

  it('renders nothing when not submitted', () => {
    expect(validationSummary().html()).toBe(null);
  });

  it('renders heading tag', () => {
    const safeInputField1 = mount(<SafeInputField id="id" value="" isRequired />).instance();
    (safeInputField1 as unknown as FormChild).validateField();
    props.submitted = true;
    props.components = [safeInputField1 as {} as FormChild];
    expect(validationSummary().find('h3').length).toBe(1);
  });

  it('renders heading text', () => {
    const safeInputField1 = mount(<SafeInputField id="id" value="" isRequired />).instance();
    (safeInputField1 as unknown as FormChild).validateField();
    props.submitted = true;
    props.header = 'header';
    props.components = [safeInputField1 as {} as FormChild];

    expect(validationSummary().find('h3').text()).toBe('header');
  });

  it('renders only invalid components', () => {
    const safeInputField1 = mount(<SafeInputField id="id" value="" isRequired />).instance();
    const safeInputField2 = mount(<SafeInputField id="id" value="asd" isRequired />).instance();
    (safeInputField1 as unknown as FormChild).validateField();
    (safeInputField2 as unknown as FormChild).validateField();

    props.submitted = true;
    props.components = [safeInputField1 as {} as FormChild, safeInputField2 as {} as FormChild];

    expect(validationSummary().find('li').length).toBe(1);
  });

  it('renders nothing when all fields are valid', () => {
    const safeInputField1 = mount(<SafeInputField id="id" value="sdf" isRequired />).instance();
    const safeInputField2 = mount(<SafeInputField id="id" value="asd" isRequired />).instance();
    (safeInputField1 as unknown as FormChild).validateField();
    (safeInputField2 as unknown as FormChild).validateField();

    props.submitted = true;
    props.components = [safeInputField1 as {} as FormChild, safeInputField2 as {} as FormChild];

    expect(validationSummary().html()).toBe(null);
  });
});
