import * as React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mount } from 'enzyme';

import ValidationError from '../form/validation-error';

import { SafeTextarea } from '.';

describe('SafeTextarea', () => {
  it('SafeTextarea renders correctly', () => {
    const wrapper = mount(<SafeTextarea id="test" value="test" onBlur={() => null} />);
    expect(wrapper.render()).toMatchSnapshot();
  });

  it('Should be readonly', () => {
    const instance = mount(<SafeTextarea id="test" value="test" onBlur={() => null} readOnly />);

    const textarea = instance.find('textarea');
    const atomTextarea = instance.find('.safetextarea__textarea');
    expect(textarea.exists()).toEqual(true);
    expect(atomTextarea.exists()).toEqual(true);
    expect(textarea.is('[readOnly]')).toBe(true);
  });

  it('Should have minLength', () => {
    const instance = mount(<SafeTextarea id="test" value="test" onBlur={() => null} minlength={3} />);
    expect(instance.exists()).toEqual(true);
    const textarea = instance.find('textarea');
    expect(textarea.exists()).toEqual(true);
    const minLengthAttr: number | undefined = textarea.prop('minLength');
    expect(minLengthAttr).toBe(3);
  });

  describe('Når man har definert en verdi for maxLength', () => {
    it('Så skal ikke textareaet ha maxLength for det', () => {
      const instance = mount(<SafeTextarea id="test" value="test" onBlur={() => null} maxlength={3} />);
      expect(instance.exists()).toEqual(true);
      const textarea = instance.find('textarea');
      expect(textarea.exists()).toEqual(true);
      const maxLengthAttr: number | undefined = textarea.prop('maxLength');
      expect(maxLengthAttr).toBe(undefined);
    });
  });

  describe('Når man skriver inn like mange tegn som maxLength', () => {
    it('Så vises ingen feilmelding', async () => {
      render(<SafeTextarea id="test" maxlength={3} />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeVisible();

      await userEvent.type(textarea, '123');

      const error = screen.queryByText('Du har skrevet for mange tegn. Gjør teksten kortere.');
      expect(error).not.toBeInTheDocument();
    });
  });

  describe('Når man skriver inn flere tegn enn maxLength', () => {
    it('Så beholdes alle tegn man har skrevet, men det vises en feilmelding', async () => {
      render(<SafeTextarea id="test" maxlength={3} />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeVisible();

      await userEvent.type(textarea, '1234');

      expect((textarea as HTMLTextAreaElement).value).toBe('1234');

      const error = await screen.findByText('Du har skrevet for mange tegn. Gjør teksten kortere.');
      expect(error).toBeVisible();
    });
  });

  describe('Når en egendefinert feilmelding er skrevet og man skriver inn flere tegn enn maxLength', () => {
    it('Så vises en feilmelding', async () => {
      render(<SafeTextarea id="test" maxlength={3} stringOverMaxLengthError="Fatt dem i korthet!" />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeVisible();

      await userEvent.type(textarea, '1234');

      const error = await screen.findByText('Fatt dem i korthet!');
      expect(error).toBeVisible();
    });
  });

  it('Should have placeholder', () => {
    const instance = mount(<SafeTextarea id="test" value="test" onBlur={() => null} placeholder="test" />);
    expect(instance.exists()).toEqual(true);
    const textarea = instance.find('textarea');
    expect(textarea.exists()).toEqual(true);
    const placeholderAttr: string | undefined = textarea.prop('placeholder');
    expect(placeholderAttr).toMatch('test');
  });

  it('Should have correct size class small', () => {
    const instance = mount(<SafeTextarea id="test" value="test" onBlur={() => null} maxlength={50} />);
    expect(instance.exists()).toEqual(true);
    const textarea = instance.find('textarea');
    expect(textarea.exists()).toEqual(true);
    const classAttr: string | undefined = textarea.prop('className');
    expect(classAttr).toMatch('safetextarea__textarea--small');
  });

  it('Size should override maxlength classname', () => {
    const instance = mount(<SafeTextarea id="test" value="test" onBlur={() => null} size="medium" maxlength={50} />);
    expect(instance.exists()).toEqual(true);
    const textarea = instance.find('textarea');
    expect(textarea.exists()).toEqual(true);
    const classAttr: string | undefined = textarea.prop('className');
    expect(classAttr).not.toMatch('safetextarea__textarea--small');
    expect(classAttr).toMatch('safetextarea__textarea--medium');
  });

  it('Size should be medium if size or maxlength is not set', () => {
    const instance = mount(<SafeTextarea id="test" value="test" onBlur={() => null} />);
    expect(instance.exists()).toEqual(true);
    const textarea = instance.find('textarea');
    expect(textarea.exists()).toEqual(true);
    const classAttr: string | undefined = textarea.prop('className');
    expect(classAttr).toMatch('safetextarea__textarea--medium');
  });

  it('Should have a label', () => {
    const instance = mount(<SafeTextarea id="test" value="test" onBlur={() => null} showLabel={true} label="test label" />);
    expect(instance.exists()).toEqual(true);
    const label = instance.find('label');
    expect(label.exists()).toEqual(true);
    expect(label.render().text()).toEqual('test label');
  });

  it('Should allow HTML in label', () => {
    render(
      <SafeTextarea
        id="test"
        value="test"
        onBlur={() => null}
        showLabel={true}
        label={
          <>
            <span>{'main label'}</span>
            <span>{'sub label'}</span>
          </>
        }
      />
    );

    const textarea = screen.getByRole('textbox', { name: 'main label sub label' });

    expect(textarea).toBeVisible();
  });

  it('Should include maxlength in label when maxlength is specified', () => {
    const instance = mount(<SafeTextarea id="test" value="test" onBlur={() => null} showLabel={true} label="test label" maxlength={50} />);

    const label = instance.find('.label__sublabel');
    expect(label.exists()).toEqual(true);
    expect(label.render().text()).toEqual('Maksimum 50 tegn');
  });

  it('should render error message after validated on invalid input', () => {
    const renderedInstance = mount(
      <SafeTextarea id="test" value="" isRequired={true} onBlur={() => undefined} showLabel={true} label="test label" />
    );
    expect(renderedInstance.exists()).toEqual(true);
    expect(renderedInstance.find(ValidationError).length).toBe(1);
    expect(renderedInstance.find(ValidationError).text()).toEqual('');

    const instance = renderedInstance.find(SafeTextarea).instance();
    expect(renderedInstance.find(SafeTextarea).length).toBe(1);
    (instance as SafeTextarea).validateField();
    renderedInstance.update();
    expect(renderedInstance.find(ValidationError).text()).not.toEqual('');
  });

  it('should render sublabel', () => {
    const instance = mount(
      <SafeTextarea id="test" value="test" onBlur={() => null} showLabel={true} label="test label" maxlength={50} subLabel="subLabel" />
    );

    const label = instance.find('.label__sublabel');
    expect(label.exists()).toEqual(true);
    expect(label.render().text()).toEqual('subLabel');
  });
});
