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
});
