/* eslint-disable no-console */
import * as React from 'react';

import { useForm, type SubmitHandler } from 'react-hook-form';

import type {
  SuggestionsFetchRequested,
  SuggestionsFetchRequestedParams,
  OnSuggestionSelected,
  OnSuggestionsClearRequested,
} from 'react-autosuggest';

import Button from '@helsenorge/designsystem-react/components/Button';
import Spacer from '@helsenorge/designsystem-react/components/Spacer';

import Autosuggest, { type Suggestion } from '.';

interface ExampleForm {
  value: string;
}

export const AutosuggestExample: React.FC = () => {
  const [suggestions, setSuggestions] = React.useState<Suggestion[]>([]);

  const {
    register,
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<ExampleForm>({ defaultValues: { value: '' } });

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

    setValue('value', data.suggestion.value);
  };

  const onSuggestionsClearRequested: OnSuggestionsClearRequested = () => {
    console.log('onSuggestionsClearRequested');

    setSuggestions([]);
  };

  const onSubmit: SubmitHandler<ExampleForm> = data => {
    console.log('onSubmit', data);
  };

  return (
    <>
      <Spacer />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Autosuggest
          inputProps={{
            type: 'search',
            value: getValues('value'),
            ...register('value', {
              required: 'Du må velge et alternativ',
              validate: value => (value === 'First suggestion' ? 'Du kan ikke velge dette alternativet' : undefined),
            }),
          }}
          label={'Søk i behandlinger og undersøkelser'}
          suggestions={suggestions}
          onSuggestionsFetchRequested={onSuggestionsFetchRequested}
          onSuggestionsClearRequested={onSuggestionsClearRequested}
          onSuggestionSelected={onSuggestionsSelected}
          error={!!errors.value}
          errorText={errors.value?.message}
        />
        <Spacer />
        <Button type="submit">{'Send inn'}</Button>
      </form>
    </>
  );
};

export default AutosuggestExample;
