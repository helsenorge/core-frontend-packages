import { fn } from 'storybook/test';

import type { Meta, StoryObj } from '@storybook/react-vite';

import AutosuggestExample from './example';

import Autosuggest from '.';

const meta = {
  title: '@helsenorge/autosuggest/components/Autosuggest',
  component: Autosuggest,
  args: {
    suggestions: [
      { label: 'First suggestion', value: 'First suggestion' },
      { label: 'Second suggestion', value: 'Second suggestion', optionalLabel: 'this is my optional label' },
      { label: 'Third suggestion', value: 'Third suggestion' },
      { label: 'Fourth suggestion', value: 'Fourth suggestion' },
    ],
    inputProps: {
      value: '',
      onChange: fn(),
    },
    label: 'Søk i behandlinger og undersøkelser',
    onSuggestionsFetchRequested: fn(),
  },
} satisfies Meta<typeof Autosuggest>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <AutosuggestExample />,
};
