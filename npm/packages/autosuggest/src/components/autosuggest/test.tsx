import * as React from 'react';

import { render, screen } from '@testing-library/react';
import { mount } from 'enzyme';

import { Label } from '@helsenorge/form/components/label';

import Autosuggest, { Suggestion } from '.';

describe('Autosuggest', () => {
  const suggestions: Array<Suggestion> = [
    { label: 'First suggestion', value: 'First suggestion' },
    { label: 'Second suggestion', value: 'Second suggestion', optionalLabel: 'optionalLabel' },
    { label: 'Third suggestion', value: 'Third suggestion' },
    { label: 'Fourth suggestion', value: 'Fourth suggestion' },
  ];

  describe('Gitt at Autosuggest er initialisert', () => {
    const onChangeMock = jest.fn();
    const onBlurMock = jest.fn();
    const onSuggestionsFetchRequestedMock = jest.fn();
    const onSuggestionsClearRequestedMock = jest.fn();
    const onSuggestionsSelectedMock = jest.fn();
    const onSubmitValidatorMock = jest.fn();

    describe('Når Autosuggest vises', () => {
      it('Så finnes det et søkefelt med label', () => {
        render(
          <Autosuggest
            id={'id1'}
            type="search"
            label={'Søk'}
            value={'default value'}
            suggestions={[]}
            onChange={onChangeMock}
            onSuggestionsFetchRequested={onSuggestionsFetchRequestedMock}
            onSuggestionsClearRequested={onSuggestionsClearRequestedMock}
            onSuggestionSelected={onSuggestionsSelectedMock}
            noValidation
          />
        );

        const input = screen.getByLabelText('Søk');
        expect(input).toBeVisible();
      });
    });

    describe('Når den mountes med labels og noValidation', () => {
      const wrapper = mount(
        <Autosuggest
          id={'id1'}
          type="search"
          label={'This is an autosuggest (input search) field with label'}
          subLabel={'and its sublabel'}
          value={'default value'}
          suggestions={[]}
          onChange={onChangeMock}
          onSuggestionsFetchRequested={onSuggestionsFetchRequestedMock}
          onSuggestionsClearRequested={onSuggestionsClearRequestedMock}
          onSuggestionSelected={onSuggestionsSelectedMock}
          noValidation
        />
      );

      it('Så rendres det Label og sublabel + autosuggest component', () => {
        expect(wrapper.find(Label).length).toEqual(1);
        expect(wrapper.render()).toMatchSnapshot();
      });

      it('Så kalles det ikke validate ved onChange', () => {
        const instance: Autosuggest = wrapper.instance() as Autosuggest;
        jest.spyOn(instance, 'validate');

        wrapper.find('input').simulate('change', { target: { name: 'name_of_input', value: 'value' } });
        wrapper.update();
        expect(onChangeMock).toHaveBeenCalled();
        expect(instance.validate).not.toHaveBeenCalled();
      });
    });

    describe('Når den mountes med validation', () => {
      const wrapper = mount(
        <Autosuggest
          id={'id1'}
          type="search"
          label={'This is an autosuggest (input search) field with label'}
          subLabel={'and its sublabel'}
          value={'default value'}
          suggestions={[]}
          onChange={onChangeMock}
          onSuggestionsFetchRequested={onSuggestionsFetchRequestedMock}
          onSuggestionsClearRequested={onSuggestionsClearRequestedMock}
          onSuggestionSelected={onSuggestionsSelectedMock}
          onSubmitValidator={onSubmitValidatorMock}
          maxLength={10}
          isRequired
          noValidation
        />
      );
      const instance: Autosuggest = wrapper.instance() as Autosuggest;

      it('Så isValid er oppdatert iht staten', () => {
        expect(instance.isValid()).toEqual(true);
      });

      it('Så validate oppdaterer staten iht sjekkene', () => {
        // does not validate empty string when required
        expect(instance.validate('')).toEqual(false);
        // does not validate invalid characters
        expect(instance.validate('#')).toEqual(false);
        // does validate long string
        expect(instance.validate('ølkjhgfdsdfghjklølkjhgfdsdfghjkllkjhgfdsdfghjklkjhgfdfgh')).toEqual(false);
      });

      it('Så kalles det onSubmitValidatorMock når angitt', () => {
        instance.validateField();
        expect(onSubmitValidatorMock).toHaveBeenCalled();
      });
    });

    describe('Når det gjøres endringer i input feltet', () => {
      const wrapper = mount(
        <Autosuggest
          id={'id2'}
          type="search"
          value={'default value'}
          suggestions={[]}
          onChange={onChangeMock}
          onSuggestionsFetchRequested={onSuggestionsFetchRequestedMock}
          onSuggestionsClearRequested={onSuggestionsClearRequestedMock}
          onSuggestionSelected={onSuggestionsSelectedMock}
          errorMessage={'error message'}
          isRequired
          minLength={2}
          maxLength={50}
        />
      );
      const instance: Autosuggest = wrapper.instance() as Autosuggest;

      it('Så kalles det onChange og validate', () => {
        jest.spyOn(instance, 'validate');

        wrapper.find('input').simulate('change', { target: { name: 'name_of_input', value: 'value' } });
        wrapper.update();
        expect(onChangeMock).toHaveBeenCalled();
        expect(instance.validate).toHaveBeenCalled();
      });
    });

    describe('Når det settes focus på inputFeltet', () => {
      const wrapper = mount(
        <Autosuggest
          id={'id3'}
          type="search"
          value={'default value'}
          suggestions={[]}
          onBlur={onBlurMock}
          onChange={onChangeMock}
          onSuggestionsFetchRequested={onSuggestionsFetchRequestedMock}
          onSuggestionsClearRequested={onSuggestionsClearRequestedMock}
          onSuggestionSelected={onSuggestionsSelectedMock}
          errorMessage={'error message'}
          isRequired
          minLength={2}
          maxLength={50}
        />
      );
      const instance: Autosuggest = wrapper.instance() as Autosuggest;

      it('Så kalles det onBlur class method i tillegg til prop', () => {
        jest.useFakeTimers();
        jest.spyOn(instance, 'onBlur');

        wrapper.find('input').simulate('change', { target: { value: '1' } });
        wrapper.find('input').simulate('blur');
        jest.runAllTimers();

        wrapper.update();
        expect(instance.onBlur).toHaveBeenCalled();
        expect(onBlurMock).toHaveBeenCalled();
      });
    });

    describe('Når det brukes tastaturet', () => {
      const wrapper = mount(
        <Autosuggest
          id={'id3'}
          type="search"
          value={'default value'}
          suggestions={[]}
          onChange={onChangeMock}
          onSuggestionsFetchRequested={onSuggestionsFetchRequestedMock}
          onSuggestionsClearRequested={onSuggestionsClearRequestedMock}
          onSuggestionSelected={onSuggestionsSelectedMock}
          errorMessage={'error message'}
          isRequired
          minLength={2}
          maxLength={50}
        />
      );
      const instance: Autosuggest = wrapper.instance() as Autosuggest;

      it('Så håndteres det Keydown riktig', () => {
        jest.useFakeTimers();
        jest.spyOn(instance, 'onKeyDown');
        wrapper.find('input').simulate('change', { target: { value: 'abcdefg' } });
        wrapper.find('input').simulate('keydown', { keyCode: 13 });

        jest.runAllTimers();

        wrapper.update();
        expect(instance.onKeyDown).toHaveBeenCalled();
      });
    });

    describe('Når det rendres suggestions', () => {
      const wrapper = mount(
        <Autosuggest
          id={'id4'}
          type="search"
          value={'default value'}
          suggestions={suggestions}
          onBlur={onBlurMock}
          onChange={onChangeMock}
          onSuggestionsFetchRequested={onSuggestionsFetchRequestedMock}
          onSuggestionsClearRequested={onSuggestionsClearRequestedMock}
          onSuggestionSelected={onSuggestionsSelectedMock}
          errorMessage={'error message'}
          isRequired
        />
      );

      it('Så rendres det riktig markup med og uten optionalLabel', () => {
        const instance: Autosuggest = wrapper.instance() as Autosuggest;
        const suggestionMarkup = instance.renderSuggestion(suggestions[0]);
        const suggestionMarkupWithOptionalLabel = instance.renderSuggestion(suggestions[1]);
        expect(suggestionMarkup).toMatchSnapshot();
        expect(suggestionMarkupWithOptionalLabel).toMatchSnapshot();
      });
    });

    describe('Når den mountes med noCharacterValidation', () => {
      const wrapper = mount(
        <Autosuggest
          id={'id5'}
          type="search"
          label={'This is an autosuggest (input search) field with label'}
          subLabel={'and its sublabel'}
          value={'default value'}
          suggestions={[]}
          onChange={onChangeMock}
          onSuggestionsFetchRequested={onSuggestionsFetchRequestedMock}
          onSuggestionsClearRequested={onSuggestionsClearRequestedMock}
          onSuggestionSelected={onSuggestionsSelectedMock}
          onSubmitValidator={onSubmitValidatorMock}
          maxLength={10}
          isRequired
          noCharacterValidation={true}
        />
      );
      const instance: Autosuggest = wrapper.instance() as Autosuggest;

      it('Så validate oppdaterer staten iht sjekkene', () => {
        // does not validate empty string when required
        expect(instance.validate('')).toEqual(false);
        // does not validate invalid characters
        expect(instance.validate('#')).toEqual(true);
        // does validate long string
        expect(instance.validate('ølkjhgfdsdfghjklølkjhgfdsdfghjkllkjhgfdsdfghjklkjhgfdfgh')).toEqual(true);
      });

      it('Så kalles det onSubmitValidatorMock når angitt', () => {
        instance.validateField();
        expect(onSubmitValidatorMock).toHaveBeenCalled();
      });
    });
  });
});
