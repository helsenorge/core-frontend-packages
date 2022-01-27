import * as React from 'react';

import {
  SuggestionsFetchRequested,
  SuggestionsFetchRequestedParams,
  OnSuggestionSelected,
  OnSuggestionsClearRequested,
} from 'react-autosuggest';

import Autosuggest, { Suggestion } from '.';

export class AutosuggestExample extends React.Component<{}, { suggestions: Array<Suggestion>; value: string }> {
  constructor(props: {}) {
    super(props);
    this.state = {
      suggestions: [],
      value: '',
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

  render() {
    return (
      <>
        <Autosuggest
          id={'id1'}
          type="search"
          placeholder={'Placeholder text'}
          label={'This is an autosuggest (input search) field with label'}
          subLabel={'and its sublabel'}
          ariaLabel={'this is my ariaLabel'}
          value={this.state.value}
          suggestions={this.state.suggestions}
          onChange={this.onChange}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          onSuggestionSelected={this.onSuggestionsSelected}
          noValidation
        />
      </>
    );
  }
}

export default AutosuggestExample;
