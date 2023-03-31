import * as React from 'react';

import { screen, render, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '@helsenorge/designsystem-react/__mocks__/matchMedia';

import Dropzone, { OnDropHandler, Props, UploadedFile } from '../index';

const FileUploadExample: React.FC<Pick<Props, Exclude<keyof Props, 'onDrop'>>> = props => {
  const [uploadedFiles, setUploadedFiles] = React.useState<UploadedFile[]>([]);

  const handleDrop: OnDropHandler = (files, cb) => {
    for (const f of files) {
      const uploadedFile: UploadedFile = { id: f.name, name: f.name, size: f.size };
      setUploadedFiles([...uploadedFiles, uploadedFile]);
      cb && cb(true, null, uploadedFile);
    }
  };

  return <Dropzone {...props} uploadedFiles={uploadedFiles} onDrop={handleDrop} />;
};

describe('Dropzone', () => {
  describe('Gitt at Dropzone har children', () => {
    describe('Når komponenten vises', () => {
      it('Så er children synlig', () => {
        render(
          <Dropzone
            id="id"
            onDrop={() => {
              /* tom */
            }}
          >
            <div>{'children'}</div>
          </Dropzone>
        );

        const children = screen.getByText('children');
        expect(children).toBeVisible();
      });
    });
  });
  describe('Gitt at Dropzone har to opplastede filer', () => {
    describe('Når komponenten vises', () => {
      it('Så er er filene synlige', () => {
        const uploadedFiles: UploadedFile[] = [
          {
            id: 'id1',
            name: 'name1',
          },
          {
            id: 'id2',
            name: 'name2',
          },
        ];

        render(
          <Dropzone
            id="id"
            onDrop={() => {
              /* tom */
            }}
            shouldUploadMultiple={true}
            uploadedFiles={uploadedFiles}
          />
        );
        const file1 = screen.getByText('name1');
        expect(file1).toBeVisible();
        const file2 = screen.getByText('name2');
        expect(file2).toBeVisible();
      });
    });
  });
  describe('Gitt at maks filer er 2', () => {
    describe('Når man har lastet opp 3 filer', () => {
      it('Så vises ikke Last opp-knappen', async () => {
        const uploadedFiles: UploadedFile[] = [
          {
            id: 'id1',
            name: 'name1',
          },
          {
            id: 'id2',
            name: 'name2',
          },
        ];
        render(
          <Dropzone
            id="max-files"
            onDrop={() => {
              /* tom */
            }}
            shouldUploadMultiple
            maxFiles={2}
            uploadButtonText="Last opp"
            uploadedFiles={uploadedFiles}
          />
        );

        const button = screen.queryByText('Last opp');
        expect(button).not.toBeInTheDocument();
      });
    });
  });
  describe('Gitt at bare PDF er lov i validFileTypes', () => {
    describe('Når man laster opp en PDF', () => {
      it('Så vises ikke feilmelding', async () => {
        render(<FileUploadExample id="only-pdf" validFileTypes={['application/pdf']} errorMessage="Bare lov med PDF-filer" />);

        const dropzone = screen.getByLabelText('Last opp fil');
        expect(dropzone).toBeInTheDocument();

        const file1 = new File([], 'file.pdf', { type: 'application/pdf' });
        await act(async () => await userEvent.upload(dropzone, file1));

        const error = screen.queryByText('Bare lov med PDF-filer');
        expect(error).not.toBeInTheDocument();
      });
    });
    describe('Når man laster opp en JPG', () => {
      it('Så vises feilmelding', async () => {
        render(<FileUploadExample id="only-pdf" validFileTypes={['application/pdf']} errorMessage="Bare lov med PDF-filer" />);

        const dropzone = screen.getByLabelText('Last opp fil');
        expect(dropzone).toBeInTheDocument();

        const file1 = new File([], 'image.jpg', { type: 'image/jpeg' });
        await act(async () => await userEvent.upload(dropzone, file1));

        const error = screen.getByText('Bare lov med PDF-filer');
        expect(error).toBeVisible();
      });
    });
  });
  describe('Gitt at bare PDF er lov i validMimeTypes', () => {
    describe('Når man laster opp en PDF', () => {
      it('Så vises ikke feilmelding', async () => {
        render(<FileUploadExample id="only-pdf" validMimeTypes={['application/pdf']} errorMessage="Bare lov med PDF-filer" />);

        const dropzone = screen.getByLabelText('Last opp fil');
        expect(dropzone).toBeInTheDocument();

        const file1 = new File([], 'file.pdf', { type: 'application/pdf' });
        await act(async () => await userEvent.upload(dropzone, file1));

        const error = screen.queryByText('Bare lov med PDF-filer');
        expect(error).not.toBeInTheDocument();
      });
    });
    describe('Når man laster opp en JPG', () => {
      it('Så vises feilmelding', async () => {
        render(<FileUploadExample id="only-pdf" validMimeTypes={['application/pdf']} errorMessage="Bare lov med PDF-filer" />);

        const dropzone = screen.getByLabelText('Last opp fil');
        expect(dropzone).toBeInTheDocument();

        const file1 = new File([], 'image.jpg', { type: 'image/jpeg' });
        await act(async () => await userEvent.upload(dropzone, file1));

        const error = screen.getByText('Bare lov med PDF-filer');
        expect(error).toBeVisible();
      });
    });
  });
  describe('Gitt at maks filstørrelse er 1000', () => {
    describe('Når man laster opp en fil på 999', () => {
      it('Så vises ikke feilmelding', async () => {
        render(<FileUploadExample id="total-max-size" maxFileSize={1000} errorMessage="Filen er for stor" />);

        const dropzone = screen.getByLabelText('Last opp fil');
        expect(dropzone).toBeInTheDocument();

        const file1 = new File([], 'file1.pdf', { type: 'application/pdf' });
        Object.defineProperty(file1, 'size', { value: 999 });
        await act(async () => await userEvent.upload(dropzone, file1));

        const error = screen.queryByText('Filen er for stor');
        expect(error).not.toBeInTheDocument();
      });
    });
    describe('Når man laster opp en fil på 1100', () => {
      it('Så vises feilmelding', async () => {
        render(<FileUploadExample id="total-max-size" maxFileSize={1000} errorMessage="Filen er for stor" />);

        const dropzone = screen.getByLabelText('Last opp fil');
        expect(dropzone).toBeInTheDocument();

        const file1 = new File([], 'file1.pdf', { type: 'application/pdf' });
        Object.defineProperty(file1, 'size', { value: 1100 });
        await act(async () => await userEvent.upload(dropzone, file1));

        const error = screen.getByText('Filen er for stor');
        expect(error).toBeVisible();
      });
    });
  });
  describe('Gitt at maks total filstørrelse er 1000', () => {
    describe('Når man laster opp filer på totalt 999', () => {
      it('Så vises ikke feilmelding', async () => {
        render(<FileUploadExample id="total-max-size-2" shouldUploadMultiple totalMaxFileSize={1000} errorMessage="Filene er for store" />);

        const dropzone = screen.getByLabelText('Last opp fil');
        expect(dropzone).toBeInTheDocument();

        const file1 = new File([], 'file1.pdf', { type: 'application/pdf' });
        Object.defineProperty(file1, 'size', { value: 900 });
        await act(async () => await userEvent.upload(dropzone, file1));

        const file2 = new File([], 'file2.pdf', { type: 'application/pdf' });
        Object.defineProperty(file2, 'size', { value: 99 });
        await act(async () => await userEvent.upload(dropzone, file2));

        const error = screen.queryByText('Filene er for store');
        expect(error).not.toBeInTheDocument();
      });
    });
    describe('Når man laster opp filer på totalt 1100', () => {
      it('Så vises feilmelding', async () => {
        render(<FileUploadExample id="total-max-size" shouldUploadMultiple totalMaxFileSize={1000} errorMessage="Filene er for store" />);

        const dropzone = screen.getByLabelText('Last opp fil');
        expect(dropzone).toBeInTheDocument();

        const file1 = new File([], 'file1.pdf', { type: 'application/pdf' });
        Object.defineProperty(file1, 'size', { value: 900 });
        await act(async () => await userEvent.upload(dropzone, file1));

        const file2 = new File([], 'file2.pdf', { type: 'application/pdf' });
        Object.defineProperty(file2, 'size', { value: 200 });
        await act(async () => await userEvent.upload(dropzone, file2));

        const error = screen.getByText('Filene er for store');
        expect(error).toBeVisible();
      });
    });
  });
});
