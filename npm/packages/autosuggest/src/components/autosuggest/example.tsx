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

export class AutosuggestExample extends React.Component<{}, { suggestions: Array<Suggestion>; value: string; error: boolean }> {
  constructor(props: {}) {
    super(props);
    this.state = {
      suggestions: [],
      value: '',
      error: false,
    };
  }

  onChange = (e: React.FormEvent<HTMLInputElement>, { newValue }: { newValue: string; method: string }): void => {
    console.log('onChange', e, newValue);
    this.setState({ value: newValue });
  };

  onSuggestionsFetchRequested: SuggestionsFetchRequested = (requestParams: SuggestionsFetchRequestedParams) => {
    console.log('onSuggestionsFetchRequested', requestParams.value);
    const suggestions: Array<Suggestion> = [
      { label: 'First suggestion', value: 'First suggestion' },
      { label: 'Second suggestion', value: 'Second suggestion', optionalLabel: 'this is my optional label' },
      { label: 'Third suggestion', value: 'Third suggestion' },
      { label: 'Fourth suggestion', value: 'Fourth suggestion' },
    ];

    this.setState({
      suggestions,
    });
  };

  onSuggestionsSelected: OnSuggestionSelected<Suggestion> = (e, data) => {
    console.log('onSuggestionsSelected', data.suggestion, e);

    this.setState({
      value: data.suggestion.value,
    });
  };

  onSuggestionsClearRequested: OnSuggestionsClearRequested = () => {
    console.log('onSuggestionsClearRequested');

    this.setState({
      suggestions: [],
    });
  };

  toggleError = () =>
    this.setState({
      error: !this.state.error,
    });

  render() {
    return (
      <>
        <Button onClick={this.toggleError}>{'Feil på/av'}</Button>
        <Spacer />
        <Autosuggest
          inputProps={{
            id: 'id1',
            type: 'search',
            value: this.state.value,
            onChange: this.onChange,
          }}
          label={'Søk i behandlinger og undersøkelser'}
          suggestions={this.state.suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          onSuggestionSelected={this.onSuggestionsSelected}
          error={this.state.error}
          errorText={this.state.error ? 'Du må skrive minst 3 tegn' : undefined}
        />
      </>
    );
  }
}

export default AutosuggestExample;
