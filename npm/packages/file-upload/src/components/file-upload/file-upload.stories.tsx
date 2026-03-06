/* eslint-disable no-console */
import * as React from 'react';
import { useState } from 'react';

import { useForm } from 'react-hook-form';

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

import FileUpload, { type MimeTypes, type OnDeleteHandler, type OnChangeHandler, UploadFile } from '.';

interface FormData {
  fileupload: UploadFile;
  fileupload2: UploadFile;
}

const FileUploadExample: React.FC = () => {
  const [defaultFiles] = React.useState<UploadFile[]>([new UploadFile([], 'hello2.jpeg', 'id123', 200000, { type: 'image/jpeg' })]);
  const [acceptedFiles1, setAcceptedFiles1] = React.useState<UploadFile[]>([]);
  const [disableButton, setDisableButton] = React.useState(false);
  const [disableButton2, setDisableButton2] = React.useState(false);
  const useFormReturn = useForm<FormData>({ mode: 'onSubmit' });
  const fileupload = 'fileupload';
  const fileupload2 = 'fileupload2';
  const validFileTypes1: MimeTypes[] = ['image/jpeg', 'image/png', 'application/pdf'];
  const sublabelId = 'sublabelId';
  const sublabelId2 = 'sublabelId2';
  const maxFiles = 2;
  const dropzoneText = !disableButton ? 'Eller dra filer hit' : 'Du har lagt til maksimalt antall filer';

  const onChange1: OnChangeHandler = (newFiles: UploadFile[]): void => {
    console.log('files added', newFiles);
    setAcceptedFiles1([...acceptedFiles1, ...newFiles]);
  };

  const onDelete1: OnDeleteHandler = fileId => {
    console.log('file deleted', fileId);
    setAcceptedFiles1(acceptedFiles1.filter((af: UploadFile) => af.id !== fileId));
  };

  const useFileUpload1 = useFileUpload(
    useFormReturn.register,
    [validateFileSize(0, 300000, 'Filen må være under 300kb'), validateFileType(validFileTypes1, 'Feil filtype')],
    [
      validateNumberOfFiles(1, maxFiles, 'Det må lastes en til to bilder'),
      validateTotalFileSize(0, 400000, 'Samlet filstørrelse må være under 400kb'),
    ]
  );

  const useFileUpload2 = useFileUpload(
    useFormReturn.register,
    [validateFileSize(0, 300000, 'Filen må være under 300kb'), validateFileType(validFileTypes1, 'Feil filtype')],
    [validateNumberOfFiles(1, 1, 'Det må lastes et bilde')]
  );

  React.useEffect(() => {
    setDisableButton(useFileUpload1.acceptedFiles.length + useFileUpload1.rejectedFiles.length >= maxFiles);
  }, [useFileUpload1.acceptedFiles, useFileUpload1.rejectedFiles]);

  React.useEffect(() => {
    setDisableButton2(useFileUpload2.acceptedFiles.length + useFileUpload2.rejectedFiles.length >= 1);
  }, [useFileUpload2.acceptedFiles, useFileUpload2.rejectedFiles]);

  const onChange2: OnChangeHandler = (newFiles: UploadFile[]): void => {
    console.log('files added', newFiles);
  };

  const onDelete2: OnDeleteHandler = fileId => {
    console.log('file deleted', fileId);
  };

  const onOpenFile = (fileId: string): void => {
    console.log('file ' + fileId + ' was opened');
  };

  const onRequestLink = (fileId: string): string => {
    console.log('link was requested for ' + fileId);
    return 'file:///' + fileId;
  };

  // eslint-disable-next-line
  const onSubmit = (data: FormData): any => {
    console.log('onSubmit data:', data);
  };

  return (
    <form onSubmit={useFormReturn.handleSubmit(onSubmit)}>
      <Title htmlMarkup={'h2'} appearance={'title2'}>
        {'(Støtter react-hook-form):'}
      </Title>
      <br />
      <Title htmlMarkup={'h2'} appearance={'title2'}>
        {'Uten validering'}
      </Title>
      <br />
      <FileUpload
        aria-describedby={sublabelId}
        inputId="fileupload2"
        label={
          <Label
            labelTexts={[{ text: 'Last opp hva du vil' }]}
            sublabel={<Sublabel id={sublabelId} sublabelTexts={[{ text: 'Ingen begrensninger her', type: 'subdued' }]} />}
          />
        }
        shouldUploadMultiple
        acceptedFiles={acceptedFiles1}
        onDeleteFile={onDelete1}
        onOpenFile={onOpenFile}
        onRequestLink={onRequestLink}
        onChangeFile={onChange1}
      />
      <Title htmlMarkup={'h2'} appearance={'title2'}>
        {'Med validering'}
      </Title>
      <Validation errorTitle={!useFormReturn.formState.isValid ? 'Sjekk at alt er riktig utfylt' : undefined}>
        <Title htmlMarkup={'h3'} appearance={'title3'}>
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
              labelTexts={[{ text: 'Last opp et bilde' }]}
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
        <Title htmlMarkup={'h3'} appearance={'title3'}>
          {'Med dropzone (Er også wrappet av FormGroup, dette trengs ikke, men støttes)'}
        </Title>
        <br />
        <FormGroup error={useFormReturn.formState.errors.fileupload?.message}>
          <FileUpload
            aria-describedby={sublabelId}
            defaultFiles={defaultFiles}
            disabled={disableButton}
            dropzoneStatusText={dropzoneText}
            error={!!useFormReturn.formState.errors.fileupload}
            inputId="fileupload1"
            label={
              <Label
                labelTexts={[{ text: 'Last opp en eller to bilder' }]}
                sublabel={
                  <Sublabel
                    id={sublabelId}
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

const WithLanguageProviderExample: React.FC = args => {
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
  render: args => {
    return <WithLanguageProviderExample {...args} />;
  },
};
