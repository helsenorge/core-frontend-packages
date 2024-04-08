import * as React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Autosuggest from '..';

const onChangeMock = jest.fn();
const onSuggestionsFetchRequestedMock = jest.fn();
const onSuggestionsClearRequestedMock = jest.fn();
const onSuggestionsSelectedMock = jest.fn();

describe('Gitt at Autosuggest skal vises', () => {
  describe('Når Autosuggest vises', () => {
    it('Så finnes det et søkefelt med label', () => {
      render(
        <Autosuggest
          label={'Søk'}
          suggestions={[]}
          inputProps={{
            value: '',
            onChange: onChangeMock,
          }}
          onSuggestionsFetchRequested={onSuggestionsFetchRequestedMock}
          onSuggestionsClearRequested={onSuggestionsClearRequestedMock}
          onSuggestionSelected={onSuggestionsSelectedMock}
        />
      );

      const input = screen.getByLabelText('Søk');
      expect(input).toBeVisible();
    });
  });

  describe('Når man skriver i input-feltet', () => {
    it('Så kalles onChange', async () => {
      render(
        <Autosuggest
          label={'Søk'}
          suggestions={[]}
          inputProps={{
            value: '',
            onChange: onChangeMock,
          }}
          onSuggestionsFetchRequested={onSuggestionsFetchRequestedMock}
          onSuggestionsClearRequested={onSuggestionsClearRequestedMock}
          onSuggestionSelected={onSuggestionsSelectedMock}
        />
      );

      const input = screen.getByLabelText('Søk');
      expect(input).toBeVisible();

      await userEvent.type(input, 'x');
      expect(onChangeMock).toHaveBeenCalled();
    });
  });

  describe('Når Autosuggest har en feilmelding', (): void => {
    test('Så er feilmelding knyttet sammen med inputfeltet', (): void => {
      render(
        <Autosuggest
          label={'Søk'}
          suggestions={[]}
          inputProps={{
            value: '',
            onChange: onChangeMock,
          }}
          onSuggestionsFetchRequested={onSuggestionsFetchRequestedMock}
          onSuggestionsClearRequested={onSuggestionsClearRequestedMock}
          onSuggestionSelected={onSuggestionsSelectedMock}
          errorText="Du må skrive mer enn 3 tegn"
          errorTextId="errorTextId"
        />
      );

      const input = screen.getByLabelText('Søk');

      expect(input).toHaveAccessibleDescription('Du må skrive mer enn 3 tegn');
    });
  });

  describe('Når Autosuggest har en feilmelding og aria-describedby', (): void => {
    test('Så har inputfeltet begge to som description', (): void => {
      render(
        <>
          <div id="customDescription">{'Egen beskrivelse'}</div>
          <Autosuggest
            label={'Søk'}
            suggestions={[]}
            inputProps={{
              value: '',
              onChange: onChangeMock,
              'aria-describedby': 'customDescription',
            }}
            onSuggestionsFetchRequested={onSuggestionsFetchRequestedMock}
            onSuggestionsClearRequested={onSuggestionsClearRequestedMock}
            onSuggestionSelected={onSuggestionsSelectedMock}
            errorText="Du må skrive mer enn 3 tegn"
            errorTextId="errorTextId"
          />
        </>
      );

      const input = screen.getByLabelText('Søk');

      expect(input).toHaveAccessibleDescription('Egen beskrivelse Du må skrive mer enn 3 tegn');
    });
  });
});
