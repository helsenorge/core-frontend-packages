import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SafeInputField from './index';
import Label from './../label';
import ValidationError from './../../molecules/form/validation-error';
import { FormChild } from './../../molecules/form';

describe('SafeInputField', () => {
  it('SafeInputField renders without crashing', () => {
    shallow(<SafeInputField id="test" value="test" onBlur={() => undefined} />);
  });

  it('Should be readonly', () => {
    const instance = shallow(<SafeInputField id="test" value="test" onBlur={() => undefined} readOnly />);
    const props = instance.find('input').props();
    if (props && props.readOnly !== undefined) {
      expect(props.readOnly).toEqual(true);
    }
  });

  it('Should have minLength', () => {
    const instance = shallow(<SafeInputField id="test" value="test" onBlur={() => undefined} minLength={2} />);
    const props = instance.find('input').props();
    if (props && props.minLength !== undefined) {
      expect(props.minLength).toEqual(2);
    }
  });

  describe('Når man har definert en verdi for maxLength', () => {
    it('Så skal ikke inputfeltet ha maxLength for det', () => {
      const instance = shallow(<SafeInputField id="test" value="test" onBlur={() => undefined} maxLength={2} />);
      const props = instance.find('input').props();
      expect(props.maxLength).toEqual(undefined);
    });
  });

  describe('Når man skriver inn like mange tegn som maxLength', () => {
    it('Så vises ingen feilmelding', async () => {
      render(<SafeInputField id="test" maxLength={3} />);

      const input = screen.getByRole('textbox');
      expect(input).toBeVisible();

      userEvent.type(input, '123');

      const error = screen.queryByText('Du har skrevet for mange tegn. Gjør teksten kortere.');
      expect(error).not.toBeInTheDocument();
    });
  });

  describe('Når man skriver inn flere tegn enn maxLength', () => {
    it('Så beholdes alle tegn man har skrevet, men det vises en feilmelding', async () => {
      render(<SafeInputField id="test" maxLength={3} />);

      const input = screen.getByRole('textbox');
      expect(input).toBeVisible();

      userEvent.type(input, '1234');

      expect((input as HTMLInputElement).value).toBe('1234');

      const error = await screen.findByText('Du har skrevet for mange tegn. Gjør teksten kortere.');
      expect(error).toBeVisible();
    });
  });

  describe('Når en egendefinert feilmelding er skrevet og man skriver inn flere tegn enn maxLength', () => {
    it('Så vises en feilmelding', async () => {
      render(<SafeInputField id="test" maxLength={3} stringOverMaxLengthError="Fatt dem i korthet!" />);

      const input = screen.getByRole('textbox');
      expect(input).toBeVisible();

      userEvent.type(input, '1234');

      const error = await screen.findByText('Fatt dem i korthet!');
      expect(error).toBeVisible();
    });
  });

  it('Should have max', () => {
    const instance = shallow(<SafeInputField id="test" value="test" onBlur={() => undefined} max={2} />);
    const props = instance.find('input').props();
    if (props && props.max !== undefined) {
      expect(props.max).toEqual(2);
    }
  });

  it('Should have min', () => {
    const instance = shallow(<SafeInputField id="test" value="test" onBlur={() => undefined} min={2} />);
    const props = instance.find('input').props();
    if (props && props.min !== undefined) {
      expect(props.min).toEqual(2);
    }
  });

  it('Should have placeholder', () => {
    const instance = shallow(<SafeInputField id="test" value="test" onBlur={() => undefined} placeholder="test" />);
    const props = instance.find('input').props();
    if (props && props.placeholder !== undefined) {
      expect(props.placeholder).toEqual('test');
    }
  });

  it('Should have user defined classname', () => {
    const instance = shallow(<SafeInputField id="test" value="test" onBlur={() => undefined} className="test" />);
    const props = instance.find('input').props();
    if (props && props.className !== undefined) {
      expect(props.className).toContain('test');
    }
  });

  it('Should have classnames for xsmall', () => {
    const instance = shallow(<SafeInputField id="test" value="test" onBlur={() => undefined} size="xSmall" />);
    const props = instance.find('input').props();
    if (props && props.className !== undefined) {
      expect(props.className).toContain('atom_input--xsmall');
    }
  });

  it('Should have classnames for small', () => {
    const instance = shallow(<SafeInputField id="test" value="test" onBlur={() => undefined} size="small" />);
    const props = instance.find('input').props();
    if (props && props.className !== undefined) {
      expect(props.className).toContain('atom_input--small');
    }
  });

  it('Should have classnames for medium', () => {
    const instance = shallow(<SafeInputField id="test" value="test" onBlur={() => undefined} size="medium" />);
    const props = instance.find('input').props();
    if (props && props.className !== undefined) {
      expect(props.className).toContain('atom_input--medium');
    }
  });

  it('Should have classnames for large', () => {
    const instance = shallow(<SafeInputField id="test" value="test" onBlur={() => undefined} size="large" />);
    const props = instance.find('input').props();
    if (props && props.className !== undefined) {
      expect(props.className).toContain('atom_input--large');
    }
  });

  it('Should have classnames for xlarge', () => {
    const instance = shallow(<SafeInputField id="test" value="test" onBlur={() => undefined} size="xLarge" />);
    const props = instance.find('input').props();
    if (props && props.className !== undefined) {
      expect(props.className).toContain('atom_input--xlarge');
    }
  });

  it('Should have label', () => {
    const instance = mount(
      <SafeInputField id="test" value="test" onBlur={() => undefined} showLabel={true} label="test label" inputName="name" />
    );
    const label = instance.find(Label);
    expect(label.text()).toEqual('test label');
  });

  it('should validate isrequired', () => {
    const renderedInstance = shallow(
      <SafeInputField id="test" value="" isRequired={true} onBlur={() => undefined} showLabel={true} label="test label" inputName="name" />
    );
    expect(renderedInstance.find(ValidationError).length).toBe(0);
    const instance = (renderedInstance.instance() as unknown) as FormChild;
    instance.validateField();
    renderedInstance.update();
    expect(renderedInstance.find(ValidationError).length).toBe(1);
  });

  it('should validate min text length', () => {
    const wrapper = shallow(<SafeInputField id="test" minLength={2} value="" inputName="name" />);
    wrapper.setState({ isValid: false });
    const instance = wrapper.instance() as SafeInputField;
    expect(instance.validate('a')).toMatchSnapshot();
  });

  it('should validate max text length', () => {
    const instance = shallow(<SafeInputField id="test" maxLength={2} value="" inputName="name" />).instance() as SafeInputField;
    expect(instance.validate('aaa')).toMatchSnapshot();
  });

  it('should validate max number', () => {
    const instance = shallow(<SafeInputField id="test" type="number" max={1} value="" inputName="name" />).instance() as SafeInputField;
    expect(instance.validate(2)).toMatchSnapshot();
  });

  it('should validate min number', () => {
    const instance = shallow(<SafeInputField id="test" type="number" min={3} value="" inputName="name" />).instance() as SafeInputField;
    expect(instance.validate(2)).toMatchSnapshot();
  });

  it('should validate regex', () => {
    const instance = shallow(<SafeInputField id="test" pattern="^[0-9]$" value="" inputName="name" />).instance() as SafeInputField;
    expect(instance.validate('a')).toMatchSnapshot();
  });
});
