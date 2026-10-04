import * as React from 'react';
import { useState } from 'react';

import { useForm } from 'react-hook-form';
import { fn } from 'storybook/test';

import type { Meta, StoryObj } from '@storybook/react-vite';

import Button from '@helsenorge/designsystem-react/components/Button';
import Dropdown from '@helsenorge/designsystem-react/components/Dropdown';
import FormGroup from '@helsenorge/designsystem-react/components/FormGroup';
import Globe from '@helsenorge/designsystem-react/components/Icons/Globe';
import Label, { Sublabel } from '@helsenorge/designsystem-react/components/Label';
import Spacer from '@helsenorge/designsystem-react/components/Spacer';
import Title from '@helsenorge/designsystem-react/components/Title';
import Validation from '@helsenorge/designsystem-react/components/Validation';
import LanguageProvider from '@helsenorge/designsystem-react/utils/language';

import { LanguageLocales } from '@helsenorge/designsystem-react';

import { useFileUpload } from './useFileUpload';
import { validateNumberOfFiles, validateFileSize, validateFileType, validateTotalFileSize } from './validate-utils';

import FileUpload, { type MimeTypes, type OnDeleteHandler, type OnChangeHandler, type Props, UploadFile } from '.';

interface FormData {
  fileupload: UploadFile;
  fileupload2: UploadFile;
}

type ExampleCallbacks = Pick<Props, 'onChangeFile' | 'onDeleteFile' | 'onOpenFile' | 'onRequestLink'>;

const FileUploadExample: React.FC<ExampleCallbacks> = callbacks => {
  const [defaultFiles] = React.useState<UploadFile[]>([new UploadFile([], 'henvisning.jpeg', 'id123', 200000, { type: 'image/jpeg' })]);
  const [acceptedFiles1, setAcceptedFiles1] = React.useState<UploadFile[]>([]);
  const [disableButton, setDisableButton] = React.useState(false);
  const [disableButton2, setDisableButton2] = React.useState(false);
  const useFormReturn = useForm<FormData>({ mode: 'onSubmit' });
  const fileupload = 'fileupload';
  const fileupload2 = 'fileupload2';
  const validFileTypes1: MimeTypes[] = ['image/jpeg', 'image/png', 'application/pdf'];
  const sublabelId = 'sublabelId';
  const sublabelId2 = 'sublabelId2';
  const sublabelId3 = 'sublabelId3';
  const maxFiles = 2;
  const dropzoneText = !disableButton ? 'Eller dra filer hit' : 'Du har lagt til maksimalt antall filer';

  const onChange1: OnChangeHandler = (newFiles: UploadFile[]): void => {
    callbacks.onChangeFile?.(newFiles);
    setAcceptedFiles1([...acceptedFiles1, ...newFiles]);
  };

  const onDelete1: OnDeleteHandler = fileId => {
    callbacks.onDeleteFile?.(fileId);
    setAcceptedFiles1(acceptedFiles1.filter((af: UploadFile) => af.id !== fileId));
  };

  const useFileUpload1 = useFileUpload(
    useFormReturn.register,
    [validateFileSize(0, 300000, 'Filen må være under 300kb'), validateFileType(validFileTypes1, 'Feil filtype')],
    [
      validateNumberOfFiles(1, maxFiles, 'Du må laste opp ett eller to bilder'),
      validateTotalFileSize(0, 400000, 'Samlet filstørrelse må være under 400kb'),
    ]
  );

  const useFileUpload2 = useFileUpload(
    useFormReturn.register,
    [validateFileSize(0, 300000, 'Filen må være under 300kb'), validateFileType(validFileTypes1, 'Feil filtype')],
    [validateNumberOfFiles(1, 1, 'Du må laste opp ett bilde')]
  );

  React.useEffect(() => {
    setDisableButton(useFileUpload1.acceptedFiles.length + useFileUpload1.rejectedFiles.length >= maxFiles);
  }, [useFileUpload1.acceptedFiles, useFileUpload1.rejectedFiles]);

  React.useEffect(() => {
    setDisableButton2(useFileUpload2.acceptedFiles.length + useFileUpload2.rejectedFiles.length >= 1);
  }, [useFileUpload2.acceptedFiles, useFileUpload2.rejectedFiles]);

  const onChange2: OnChangeHandler = (newFiles: UploadFile[]): void => {
    callbacks.onChangeFile?.(newFiles);
  };

  const onDelete2: OnDeleteHandler = fileId => {
    callbacks.onDeleteFile?.(fileId);
  };

  const onOpenFile = (fileId: string): void => {
    callbacks.onOpenFile?.(fileId);
  };

  const onRequestLink = (fileId: string): string => {
    callbacks.onRequestLink?.(fileId);
    return '#' + fileId;
  };

  const onSubmit = (): void => {};

  return (
    <form onSubmit={useFormReturn.handleSubmit(onSubmit)}>
      <Title htmlMarkup={'h2'} appearance={'title2'}>
        {'Med react-hook-form'}
      </Title>
      <br />
      <Title htmlMarkup={'h3'} appearance={'title3'}>
        {'Uten validering'}
      </Title>
      <br />
      <FileUpload
        aria-describedby={sublabelId}
        inputId="fileupload1"
        label={
          <Label
            labelTexts={[{ text: 'Last opp vedlegg til meldingen' }]}
            sublabel={<Sublabel id={sublabelId} sublabelTexts={[{ text: 'Du kan legge ved så mange filer du vil', type: 'subdued' }]} />}
          />
        }
        shouldUploadMultiple
        acceptedFiles={acceptedFiles1}
        onDeleteFile={onDelete1}
        onOpenFile={onOpenFile}
        onRequestLink={onRequestLink}
        onChangeFile={onChange1}
      />
      <Title htmlMarkup={'h3'} appearance={'title3'}>
        {'Med validering'}
      </Title>
      <Validation errorTitle={!useFormReturn.formState.isValid ? 'Sjekk at alt er riktig utfylt' : undefined}>
        <Title htmlMarkup={'h4'} appearance={'title4'}>
          {'Uten dropzone'}
        </Title>
        <br />
        <FileUpload
          aria-describedby={sublabelId2}
          disabled={disableButton2}
          errorText={useFormReturn.formState.errors.fileupload2?.message}
          inputId="fileupload2"
          label={
            <Label
              labelTexts={[{ text: 'Last opp bilde av henvisningen' }]}
              sublabel={
                <Sublabel
                  id={sublabelId2}
                  sublabelTexts={[{ text: 'Gyldige filformater er jpeg, png og pdf, maks 300kb', type: 'subdued' }]}
                />
              }
            />
          }
          acceptedFiles={useFileUpload2.acceptedFiles}
          rejectedFiles={useFileUpload2.rejectedFiles}
          onDeleteFile={onDelete2}
          onOpenFile={onOpenFile}
          onRequestLink={onRequestLink}
          validFileTypes={validFileTypes1}
          {...useFileUpload2.register(fileupload2, { validate: () => true })}
          onChangeFile={onChange2}
        />
        <Title htmlMarkup={'h4'} appearance={'title4'}>
          {'Med dropzone (er også wrappet av FormGroup, dette trengs ikke, men støttes)'}
        </Title>
        <br />
        <FormGroup error={useFormReturn.formState.errors.fileupload?.message}>
          <FileUpload
            aria-describedby={sublabelId3}
            defaultFiles={defaultFiles}
            disabled={disableButton}
            dropzoneStatusText={dropzoneText}
            error={!!useFormReturn.formState.errors.fileupload}
            inputId="fileupload3"
            label={
              <Label
                labelTexts={[{ text: 'Last opp ett eller to bilder av utslettet' }]}
                sublabel={
                  <Sublabel
                    id={sublabelId3}
                    sublabelTexts={[
                      {
                        text: 'Gyldige filformater er jpeg, png og pdf, maks 300kb per fil og maks 400kb over alle filer',
                        type: 'subdued',
                      },
                    ]}
                  />
                }
              />
            }
            visualDropZone
            acceptedFiles={useFileUpload1.acceptedFiles}
            rejectedFiles={useFileUpload1.rejectedFiles}
            onDeleteFile={onDelete2}
            onOpenFile={onOpenFile}
            onRequestLink={onRequestLink}
            shouldUploadMultiple
            validFileTypes={validFileTypes1}
            {...useFileUpload1.register(fileupload, { validate: () => true })}
            onChangeFile={onChange2}
          />
        </FormGroup>
      </Validation>
      <Spacer />
      <Button type="submit">{'Send inn'}</Button>
    </form>
  );
};

const vedlegg = [
  new UploadFile([], 'henvisning.pdf', 'henvisning', 180000, { type: 'application/pdf' }),
  new UploadFile([], 'bilde-av-utslett.jpeg', 'utslett', 240000, { type: 'image/jpeg' }),
];

const FileUploadWithState: React.FC<Props> = props => {
  const [acceptedFiles, setAcceptedFiles] = useState<UploadFile[]>(props.acceptedFiles ?? []);

  return (
    <FileUpload
      {...props}
      acceptedFiles={acceptedFiles}
      onChangeFile={(newFiles): void => {
        props.onChangeFile?.(newFiles);
        setAcceptedFiles(prev => [...prev, ...newFiles]);
      }}
      onDeleteFile={(fileId): void => {
        props.onDeleteFile?.(fileId);
        setAcceptedFiles(prev => prev.filter(file => file.id !== fileId));
      }}
    />
  );
};

const meta = {
  title: '@helsenorge/file-upload/components/FileUpload',
  component: FileUpload,
  args: {
    inputId: 'fileupload',
    label: (
      <Label
        labelTexts={[{ text: 'Last opp vedlegg' }]}
        sublabel={
          <Sublabel id="fileupload-sublabel" sublabelTexts={[{ text: 'Gyldige filformater er jpeg, png og pdf', type: 'subdued' }]} />
        }
      />
    ),
    'aria-describedby': 'fileupload-sublabel',
    acceptedFiles: [],
    rejectedFiles: [],
    validFileTypes: ['image/jpeg', 'image/png', 'application/pdf'],
    shouldUploadMultiple: true,
    disabled: false,
    loading: false,
    visualDropZone: false,
    dropzoneStatusText: '',
    hideDeleteButton: false,
    confirmDelete: false,
    errorText: '',
    onChangeFile: fn(),
    onDeleteFile: fn(),
    onOpenFile: fn(),
    onRequestLink: fn(),
  },
  argTypes: {
    label: { control: false },
    acceptedFiles: { control: false },
    rejectedFiles: { control: false },
    defaultFiles: { control: false },
    helpElement: { control: false },
    validFileTypes: {
      control: { type: 'check' },
      options: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 'image/gif', 'image/tiff', 'image/bmp', 'image/tif'],
    },
  },
  render: (args): React.JSX.Element => <FileUploadWithState {...args} />,
} satisfies Meta<typeof FileUpload>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithFiles: Story = {
  args: {
    acceptedFiles: vedlegg,
    rejectedFiles: [new UploadFile([], 'stort-bilde.tiff', 'stort-bilde', 5000000, { type: 'image/tiff' })],
    errorText: 'Filen stort-bilde.tiff har ugyldig filformat',
    confirmDelete: true,
  },
};

export const Dropzone: Story = {
  args: {
    visualDropZone: true,
    dropzoneStatusText: 'Eller dra filer hit',
  },
};

export const WithValidation: Story = {
  render: (args): React.JSX.Element => <FileUploadExample {...args} />,
};

const WithLanguageProviderExample: React.FC<ExampleCallbacks> = args => {
  const [language, setLanguage] = useState<LanguageLocales>(LanguageLocales.NORWEGIAN);

  return (
    <LanguageProvider<LanguageLocales> language={language}>
      <Dropdown svgIcon={Globe} triggerText="Velg språk">
        <Dropdown.SingleSelectItem text={'English'} asChild>
          <button onClick={() => setLanguage(LanguageLocales.ENGLISH)} />
        </Dropdown.SingleSelectItem>
        <Dropdown.SingleSelectItem text={'Samisk'} asChild>
          <button onClick={() => setLanguage(LanguageLocales.SAMI_NORTHERN)} />
        </Dropdown.SingleSelectItem>
        <Dropdown.SingleSelectItem text={'Nynorsk'} asChild>
          <button onClick={() => setLanguage(LanguageLocales.NORWEGIAN_NYNORSK)} />
        </Dropdown.SingleSelectItem>
        <Dropdown.SingleSelectItem text={'Bokmål'} asChild defaultSelected>
          <button onClick={() => setLanguage(LanguageLocales.NORWEGIAN)} />
        </Dropdown.SingleSelectItem>
      </Dropdown>
      <Spacer />
      <FileUploadExample {...args} />
    </LanguageProvider>
  );
};

export const WithLanguageProvider: Story = {
  render: (args): React.JSX.Element => <WithLanguageProviderExample {...args} />,
};
