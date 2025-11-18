import type { Meta, StoryObj } from '@storybook/react-vite';

import FileUploadExample from './example';

import FileUpload from '.';

const meta = {
  title: '@helsenorge/file-upload/components/FileUpload',
  component: FileUpload,
  args: {
    inputId: 'fileupload',
  },
} satisfies Meta<typeof FileUpload>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <FileUploadExample />,
};
