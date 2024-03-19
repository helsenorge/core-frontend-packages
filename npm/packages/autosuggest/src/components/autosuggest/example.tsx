/* eslint-disable no-console */
import * as React from 'react';

import {
  SuggestionsFetchRequested,
  SuggestionsFetchRequestedParams,
  OnSuggestionSelected,
  OnSuggestionsClearRequested,
} from 'react-autosuggest';

import Button from '@helsenorge/designsystem-react/components/Button';
import Spacer from '@helsenorge/designsystem-react/components/Spacer';

import Autosuggest, { Suggestion } from '.';

export const AutosuggestExample: React.FC = () => {
  const [suggestions, setSuggestions] = React.useState<Suggestion[]>([]);
  const [value, setValue] = React.useState<string>('');
  const [error, setError] = React.useState<boolean>(false);

  const onChange = (e: React.FormEvent<HTMLInputElement>, { newValue }: { newValue: string; method: string }): void => {
    console.log('onChange', e, newValue);
    setValue(newValue);
  };

  const onSuggestionsFetchRequested: SuggestionsFetchRequested = (requestParams: SuggestionsFetchRequestedParams) => {
    console.log('onSuggestionsFetchRequested', requestParams.value);

    setSuggestions([
      { label: 'First suggestion', value: 'First suggestion' },
      { label: 'Second suggestion', value: 'Second suggestion', optionalLabel: 'this is my optional label' },
      { label: 'Third suggestion', value: 'Third suggestion' },
      { label: 'Fourth suggestion', value: 'Fourth suggestion' },
    ]);
  };

  const onSuggestionsSelected: OnSuggestionSelected<Suggestion> = (e, data) => {
    console.log('onSuggestionsSelected', data.suggestion, e);

    setValue(data.suggestion.value);
  };

  const onSuggestionsClearRequested: OnSuggestionsClearRequested = () => {
    console.log('onSuggestionsClearRequested');

    setSuggestions([]);
  };

  const toggleError = (): void => setError(!error);

  return (
    <>
      <Spacer />
      <Button onClick={toggleError}>{'Feil på/av'}</Button>
      <Spacer />
      <Autosuggest
        inputProps={{
          id: 'id1',
          type: 'search',
          value: value,
          onChange: onChange,
        }}
        label={'Søk i behandlinger og undersøkelser'}
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        onSuggestionSelected={onSuggestionsSelected}
        error={error}
        errorText={error ? 'Du må skrive minst 3 tegn' : undefined}
      />
    </>
  );
};

export default AutosuggestExample;
