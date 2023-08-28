import * as React from 'react';

import '@helsenorge/designsystem-react/__mocks__/matchMedia';

import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { FieldValues, useForm } from 'react-hook-form';

import Button from '@helsenorge/designsystem-react/components/Button';
import Label, { Sublabel } from '@helsenorge/designsystem-react/components/Label';
import Validation from '@helsenorge/designsystem-react/components/Validation';

import FileUpload, { UploadFile, MimeTypes, OnDeleteHandler, Props } from '../index';
import { useFileUpload } from '../useFileUpload';
import { validateFileSize, validateFileType, validateNumberOfFiles, validateTotalFileSize } from '../validate-utils';

class MockDataTransfer {
  items = {
    add: jest.fn(),
  };
}

global.DataTransfer = MockDataTransfer;

const FileUploadExample = React.forwardRef((props: Props) => {
  const { acceptedFiles, rejectedFiles } = props;
  const validFileTypes1: MimeTypes[] = ['image/jpeg', 'image/png', 'application/pdf'];
  const fileupload = 'fileupload';
  const sublabelId = 'sublabelId';
  const useFormReturn = useForm({ mode: 'all' });

  const useFileUpload1 = useFileUpload(
    useFormReturn.register,
    [validateFileSize(0, 300000, 'Filen må være under 300kb'), validateFileType(validFileTypes1, 'Feil filtype')],
    [
      validateNumberOfFiles(1, 2, 'Det må lastes en til to bilder'),
      validateTotalFileSize(0, 400000, 'Samlet filstørrelse må være under 400kb'),
    ]
  );

  React.useEffect(() => {
    if (useFileUpload1) {
      acceptedFiles && useFileUpload1.setAcceptedFiles(acceptedFiles);
      rejectedFiles && useFileUpload1.setRejectedFiles(rejectedFiles);
    }
  }, [useFileUpload1]);

  const onOpenFile = (fileId: string): void => {
    // eslint-disable-next-line no-console
    console.log('file ' + fileId + ' was opened');
  };

  const onRequestLink = (fileId: string): string => {
    // eslint-disable-next-line no-console
    console.log('link was requested for ' + fileId);
    return 'file:///' + fileId;
  };

  // eslint-disable-next-line
  const onSubmit = (data: FieldValues): any => {
    // eslint-disable-next-line no-console
    console.log('onSubmit data:', data);
  };

  return (
    <form onSubmit={useFormReturn.handleSubmit(onSubmit)}>
      <Validation errorSummary={useFormReturn.formState.errors.fileupload ? 'Sjekk at alt er riktig utfylt' : undefined}>
        <FileUpload
          aria-describedby={sublabelId}
          errorMessage={useFormReturn.formState.errors.fileupload?.message as string}
          label={
            <Label
              labelTexts={[{ text: 'Last opp et bilde', type: 'semibold' }]}
              sublabel={<Sublabel id={sublabelId} sublabelTexts={[{ text: 'Gyldige filformater er jpeg, png og pdf, maks 300kb' }]} />}
            />
          }
          acceptedFiles={useFileUpload1.acceptedFiles}
          rejectedFiles={useFileUpload1.rejectedFiles}
          onOpenFile={onOpenFile}
          onRequestLink={onRequestLink}
          validFileTypes={validFileTypes1}
          {...useFileUpload1.register(fileupload, { validate: () => true })}
          {...props}
          inputId={fileupload}
        />
      </Validation>
      <Button type="submit">{'Send inn'}</Button>
    </form>
  );
});

FileUploadExample.displayName = 'FileUploadExample';

const FileUploadExample2: React.FC = () => {
  const testFile = [new UploadFile([], 'file1.pdf', undefined, undefined, { type: 'application/pdf' })];
  const testFile2 = [new UploadFile([], 'file2.jpeg', undefined, undefined, { type: 'application/jpeg' })];
  const [acceptedFiles1, setAcceptedFiles1] = React.useState<UploadFile[]>(testFile);
  const [rejectedFiles1, setRejectedFiles1] = React.useState<UploadFile[]>(testFile2);
  const onDelete1: OnDeleteHandler = fileId => {
    setAcceptedFiles1(acceptedFiles1.filter(af => af.id !== fileId));
    setRejectedFiles1(rejectedFiles1.filter(af => af.id !== fileId));
  };

  return <FileUpload inputId={'input01'} acceptedFiles={acceptedFiles1} rejectedFiles={rejectedFiles1} onDeleteFile={onDelete1} />;
};

FileUploadExample2.displayName = 'FileUploadExample2';

describe('FileUpload', () => {
  describe('Gitt at FileUpload skal vises vanlig', () => {
    describe('Når komponentet rendres', () => {
      it('Så det synlig', () => {
        const sublabelId = 'sublabelId';
        const labelText = 'Minimum et bilde';
        const sublabelText = 'Gyldige filformater er jpeg, png og pdf, maks 300kb';

        render(
          <FileUpload
            aria-describedby={sublabelId}
            inputId="id"
            label={
              <Label
                labelTexts={[{ text: labelText, type: 'semibold' }]}
                sublabel={<Sublabel id={sublabelId} sublabelTexts={[{ text: sublabelText }]} />}
              />
            }
            wrapperTestId={'test01'}
          />
        );

        expect(screen.getByTestId('test01')).toHaveClass('dropzone');
        expect(screen.getByText('Last opp')).toBeInTheDocument();
        expect(screen.getByText(labelText)).toBeInTheDocument();
        expect(screen.getByText(sublabelText)).toBeInTheDocument();
      });
    });
  });
  describe('Gitt at FileUpload skal vises med dropzone', () => {
    describe('Når komponentet rendres', () => {
      it('Så dropzone synlig', () => {
        const sublabelId = 'sublabelId';
        const labelText = 'Minimum et bilde';
        const sublabelText = 'Gyldige filformater er jpeg, png og pdf, maks 300kb';

        render(
          <FileUpload
            aria-describedby={sublabelId}
            inputId="id"
            visualDropZone
            dropzoneStatusText="Drop filer her"
            label={
              <Label
                labelTexts={[{ text: labelText, type: 'semibold' }]}
                sublabel={<Sublabel id={sublabelId} sublabelTexts={[{ text: sublabelText }]} />}
              />
            }
          />
        );

        expect(screen.getByText('Drop filer her')).toHaveClass(
          'dropzone__visual-dropzone__label dropzone__visual-dropzone__label--visible'
        );
        expect(screen.getByText('Drop filer her')).toBeInTheDocument();
      });
    });
  });
  describe('Gitt at FileUpload har children', () => {
    describe('Når komponenten vises', () => {
      it('Så er children synlig', () => {
        render(
          <FileUpload inputId="id">
            <div>{'children'}</div>
          </FileUpload>
        );

        const children = screen.getByText('children');
        expect(children).toBeInTheDocument();
      });
    });
  });
  describe('Gitt at FileUpload har acceptedFiles og rejectedFiles satt', () => {
    describe('Når komponenten vises', () => {
      it('Så er acceptedFiles og rejectedFiles synlig', () => {
        const testFile = new UploadFile([], 'file1.pdf', undefined, undefined, { type: 'application/pdf' });
        const testFile2 = new UploadFile([], 'file2.jpeg', undefined, undefined, { type: 'application/jpeg' });
        render(<FileUpload inputId="id" acceptedFiles={[testFile]} rejectedFiles={[testFile2]} />);

        const acceptedFile = screen.getByText('file1.pdf');
        const rejectedFile = screen.getByText('file2.jpeg');
        expect(acceptedFile).toBeInTheDocument();
        expect(rejectedFile).toBeInTheDocument();
      });
    });
    describe('Når filer slettes', () => {
      it('Så vises de ikke lenger', async () => {
        render(<FileUploadExample2 />);

        const acceptedFile = screen.getByText('file1.pdf');
        const rejectedFile = screen.getByText('file2.jpeg');
        expect(acceptedFile).toBeInTheDocument();
        expect(rejectedFile).toBeInTheDocument();

        const deleteButton = screen.getAllByText('Slett')[0];
        await act(async () => await userEvent.click(deleteButton));

        expect(acceptedFile).toBeInTheDocument();
        expect(rejectedFile).not.toBeInTheDocument();
      });
    });
  });
  describe('Gitt at FileUpload har har validering satt', () => {
    describe('Når validering ikke er riktig', () => {
      it('Så vises feilmelding', async () => {
        render(<FileUploadExample inputId={'input01'} />);

        const submitButton = screen.getAllByText('Send inn')[0];
        await act(async () => await userEvent.click(submitButton));

        const errorMessage = screen.getByText('Sjekk at alt er riktig utfylt');
        const errorMessage2 = screen.getByText('Det må lastes en til to bilder');
        expect(errorMessage).toBeInTheDocument();
        expect(errorMessage2).toBeInTheDocument();
      });
    });
    describe('Når validering ikke er riktig', () => {
      it('Så vises error styling', async () => {
        render(<FileUploadExample inputId={'input01'} />);

        const errorMessage1 = screen.queryByText('Det må lastes en til to bilder');
        expect(errorMessage1).not.toBeInTheDocument();

        const submitButton = screen.getAllByText('Send inn')[0];
        await act(async () => await userEvent.click(submitButton));

        const errorMessageTotal = screen.getByText('Sjekk at alt er riktig utfylt');
        const errorMessage2 = screen.getByText('Det må lastes en til to bilder');
        expect(errorMessageTotal).toBeInTheDocument();
        expect(errorMessage2).toBeInTheDocument();
      });
    });
  });
});
