import * as React from 'react';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { fn } from 'storybook/test';

import type { Meta, StoryObj } from '@storybook/react-vite';
import type {
  SuggestionsFetchRequested,
  SuggestionsFetchRequestedParams,
  OnSuggestionSelected,
  OnSuggestionsClearRequested,
} from 'react-autosuggest';

import Button from '@helsenorge/designsystem-react/components/Button';
import Spacer from '@helsenorge/designsystem-react/components/Spacer';

import Autosuggest, { type Props as AutosuggestProps, type Suggestion } from '.';

interface ExampleForm {
  value: string;
}

const behandlinger: Suggestion[] = [
  { label: 'Gastroskopi', value: 'Gastroskopi', optionalLabel: 'Undersøkelse av spiserør, magesekk og tolvfingertarm' },
  { label: 'Koloskopi', value: 'Koloskopi', optionalLabel: 'Undersøkelse av tykktarmen' },
  { label: 'MR av kne', value: 'MR av kne' },
  { label: 'Grå stær-operasjon', value: 'Grå stær-operasjon' },
  { label: 'Hofteprotese', value: 'Hofteprotese' },
];

const AutosuggestExample: React.FC<AutosuggestProps<Suggestion>> = args => {
  const [suggestions, setSuggestions] = React.useState<Suggestion[]>([]);

  const {
    register,
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<ExampleForm>({ defaultValues: { value: '' } });

  const onSuggestionsFetchRequested: SuggestionsFetchRequested = (requestParams: SuggestionsFetchRequestedParams) => {
    args.onSuggestionsFetchRequested(requestParams);

    const query = requestParams.value.trim().toLowerCase();
    setSuggestions(args.suggestions.filter(suggestion => suggestion.label.toLowerCase().includes(query)));
  };

  const onSuggestionsSelected: OnSuggestionSelected<Suggestion> = (e, data) => {
    args.onSuggestionSelected?.(e, data);

    setValue('value', data.suggestion.value);
  };

  const onSuggestionsClearRequested: OnSuggestionsClearRequested = () => {
    args.onSuggestionsClearRequested?.();

    setSuggestions([]);
  };

  const onSubmit: SubmitHandler<ExampleForm> = fn();

  return (
    <>
      <Spacer />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Autosuggest
          {...args}
          inputProps={{
            type: 'search',
            value: getValues('value'),
            ...register('value', {
              required: 'Du må velge en behandling eller undersøkelse',
              validate: value => (value === 'Hofteprotese' ? 'Hofteprotese kan ikke velges i dette eksempelet' : undefined),
            }),
          }}
          suggestions={suggestions}
          onSuggestionsFetchRequested={onSuggestionsFetchRequested}
          onSuggestionsClearRequested={onSuggestionsClearRequested}
          onSuggestionSelected={onSuggestionsSelected}
          error={args.error || !!errors.value}
          errorText={errors.value?.message ?? args.errorText}
        />
        <Spacer />
        <Button type="submit">{'Send inn'}</Button>
      </form>
    </>
  );
};

const meta = {
  title: '@helsenorge/autosuggest/components/Autosuggest',
  component: Autosuggest,
  args: {
    suggestions: behandlinger,
    inputProps: {
      value: '',
      onChange: fn(),
    },
    label: 'Søk i behandlinger og undersøkelser',
    error: false,
    errorText: undefined,
    onSuggestionsFetchRequested: fn(),
    onSuggestionsClearRequested: fn(),
    onSuggestionSelected: fn(),
  },
  argTypes: {
    containerProps: {
      control: { type: 'object' },
    },
    inputProps: { control: false },
    renderSuggestion: { control: false },
  },
  render: (args): React.JSX.Element => <AutosuggestExample {...args} />,
} satisfies Meta<typeof Autosuggest>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithError: Story = {
  args: {
    error: true,
    errorText: 'Du må velge en behandling eller undersøkelse',
  },
};
