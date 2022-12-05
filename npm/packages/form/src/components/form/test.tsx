import * as React from 'react';

import { shallow, ShallowWrapper, mount } from 'enzyme';

import '@helsenorge/designsystem-react/__mocks__/matchMedia';
import Button from '@helsenorge/designsystem-react/components/Button';

import SafeInputField from '../safe-input-field';
import Validation from './validation';
import ValidationError from './validation-error';
import ValidationSummary from './validation-summary';

import Form, { FormProps } from '.';

describe('Form', () => {
  let mounted: ShallowWrapper<{}, {}> | undefined;
  let props: FormProps;

  const createForm = () => {
    if (!mounted) {
      mounted = shallow(<Form {...props} />);
    }
    return mounted;
  };

  beforeEach(() => {
    props = {
      action: '',
    };
    mounted = undefined;
  });

  it('Form renders without crashing', () => {
    createForm();
  });

  it('renders children', () => {
    const form = mount(
      <Form action="">
        <Validation>
          <SafeInputField id="id" value="value" />
        </Validation>
      </Form>
    );
    expect(form.find(Validation).length).toBe(1);
  });

  it('adds addFormComponent function to children', () => {
    const form = mount(
      <Form action="" requiredLabel="required">
        <Validation>
          <SafeInputField id="id" value="value" />
        </Validation>
      </Form>
    );
    expect(form.find(Validation).first().props().addFormComponent).toBeDefined();
  });

  it('adds onValidated function to children', () => {
    const form = mount(
      <Form action="" requiredLabel="required">
        <Validation>
          <SafeInputField id="id" value="value" />
        </Validation>
      </Form>
    );
    expect(form.find(Validation).first().props().onValidated).toBeDefined();
  });

  it('adds requiredLabel to children', () => {
    const form = mount(
      <Form action="" requiredLabel="required">
        <Validation>
          <SafeInputField id="id" value="value" />
        </Validation>
      </Form>
    );
    expect(form.find(SafeInputField).first().props().requiredLabel).toBe('required');
  });

  it('adds optionalLabel to children', () => {
    const form = mount(
      <Form action="" optionalLabel="optional">
        <Validation>
          <SafeInputField id="id" value="value" />
        </Validation>
      </Form>
    );
    expect(form.find(SafeInputField).first().props().optionalLabel).toBe('optional');
  });

  it('never sets showrequiredlabel', () => {
    const form = mount(
      <Form action="">
        <Validation>
          <SafeInputField id="id" value="value" isRequired />
        </Validation>
        <Validation>
          <SafeInputField id="id" value="value" />
        </Validation>
        <Validation>
          <SafeInputField id="id" value="value" />
        </Validation>
      </Form>
    );
    expect(form.find(SafeInputField).first().props().showRequiredLabel).toBeFalsy();
  });

  it('always sets showoptionallabel', () => {
    const form = mount(
      <Form action="">
        <Validation>
          <SafeInputField id="id" value="value" isRequired />
        </Validation>
        <Validation>
          <SafeInputField id="id" value="value" isRequired />
        </Validation>
        <Validation>
          <SafeInputField id="id" value="value" />
        </Validation>
      </Form>
    );
    expect(form.find(SafeInputField).first().props().showOptionalLabel).toBeTruthy();
  });

  it('renders error message', () => {
    const form = mount(
      <Form action="" submitButtonText="button" optionalLabel="optional" onSubmit={jest.fn()}>
        <Validation>
          <SafeInputField id="id" value="" isRequired />
        </Validation>
      </Form>
    );
    form.find('button').first().simulate('click');
    expect(form.find(ValidationError).first().props().isValid).toBeFalsy();
  });

  it('renders validation summary', () => {
    const form = mount(
      <Form action="" validationSummary={{ enable: true, header: 'validationsummary' }} submitButtonText="button" optionalLabel="optional">
        <Validation>
          <SafeInputField id="id" value="" isRequired />
        </Validation>
      </Form>
    );
    expect(form.find(ValidationSummary).length).toBe(1);
  });

  it('calls validatefield on child on submit', () => {
    const form = mount(
      <Form action="" submitButtonText="button" optionalLabel="optional" onSubmit={jest.fn()}>
        <Validation>
          <SafeInputField id="id" value="" isRequired />
        </Validation>
      </Form>
    );
    const spy = jest.spyOn(form.find(SafeInputField).instance() as SafeInputField, 'validateField');
    form.find('button').first().simulate('click');

    expect(spy).toHaveBeenCalled();
  });

  it('renders cancel button last when cancelButtonRight is true', () => {
    const form = mount(
      <Form
        action=""
        optionalLabel="optional"
        submitButtonText="text__submit"
        pauseButtonText="text__pause"
        onPause={jest.fn()}
        buttonClasses="test__buttonClasses"
        cancelButtonRight
        cancelButtonText="text__cancelbutton"
        cancelButtonTestId={'cancel-testid'}
        onCancel={jest.fn()}
      >
        <Validation>
          <SafeInputField id="id" value="value" />
        </Validation>
      </Form>
    );
    expect(form.find(Button).last().props().testId).toBe('cancel-testid');
  });

  it('renders pause button as secondary when isPauseButtonSecondaryButton and pauseButtonType is "action" ', () => {
    const form = mount(
      <Form
        action=""
        optionalLabel="optional"
        submitButtonText="text__submit"
        pauseButtonText="text__pause"
        onPause={jest.fn()}
        buttonClasses="test__buttonClasses"
        pauseButtonLevel="secondary"
        pauseButtonType="action"
      >
        <Validation>
          <SafeInputField id="id" value="value" />
        </Validation>
      </Form>
    );
    expect(form.find(Button).last().props().variant).toBe('outline');
  });

  it('renders pause button as displayButton when pauseButtonType is "display" ', () => {
    const form = mount(
      <Form
        action=""
        optionalLabel="optional"
        submitButtonText="text__submit"
        pauseButtonText="text__pause"
        onPause={jest.fn()}
        buttonClasses="test__buttonClasses"
        pauseButtonLevel="secondary"
        pauseButtonType="display"
      >
        <Validation>
          <SafeInputField id="id" value="value" />
        </Validation>
      </Form>
    );
    expect(form.find(Button).last().props().variant).toBe('outline');
  });

  it('renders pause button disabled when pauseButtonDisabled is true ', () => {
    const form = mount(
      <Form
        action=""
        optionalLabel="optional"
        submitButtonText="text__submit"
        pauseButtonText="text__pause"
        onPause={jest.fn()}
        buttonClasses="test__buttonClasses"
        pauseButtonDisabled={true}
        pauseButtonType="display"
      >
        <Validation>
          <SafeInputField id="id" value="value" />
        </Validation>
      </Form>
    );
    expect(form.find(Button).last().props().disabled).toBeTruthy();
  });

  it('calls onFieldsNotCorrectlyFilledOut if a field is not correctly filled out', async () => {
    const onFieldsNotCorrectlyFilledOut = jest.fn();
    const form = mount(
      <Form action="" submitButtonText="button" onSubmit={jest.fn()} onFieldsNotCorrectlyFilledOut={onFieldsNotCorrectlyFilledOut}>
        <Validation>
          <SafeInputField id="id" value="" isRequired />
        </Validation>
      </Form>
    );

    form.find('button').first().simulate('click');
    expect(onFieldsNotCorrectlyFilledOut).toHaveBeenCalled();
  });
});
