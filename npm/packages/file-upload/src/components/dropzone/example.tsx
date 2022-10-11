/* eslint-disable no-console */
import * as React from 'react';

import Dropzone, { UploadedFile, TextMessage } from '.';

interface DropzoneExampleState {
  uploadedFiles1: UploadedFile[];
  uploadedFiles2: UploadedFile[];
}
export class DropzoneExample extends React.Component<{}, DropzoneExampleState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      uploadedFiles1: [],
      uploadedFiles2: [],
    };
  }

  onDrop1 = (files: Array<File>, cb: (success: boolean, errormessage: TextMessage | null, uploadedFile?: UploadedFile) => void): void => {
    console.log('file dropped', ...files);

    const newState = [...this.state.uploadedFiles1];
    for (const f of files) {
      const uploadedFile = { id: f.name, name: f.name } as UploadedFile;
      newState.push(uploadedFile);
      cb(true, null, uploadedFile);
    }

    this.setState({ uploadedFiles1: newState });
  };
  onDrop2 = (files: Array<File>, cb: (success: boolean, errormessage: TextMessage | null, uploadedFile?: UploadedFile) => void): void => {
    console.log('file dropped', ...files);

    const newState = [...this.state.uploadedFiles2];

    for (const f of files) {
      const uploadedFile = { id: f.name, name: f.name } as UploadedFile;
      if (newState.length > 0) {
        const sameFile = newState.find(e => e.name === f.name);
        if (!sameFile) {
          newState.push(uploadedFile);
        }
      } else {
        newState.push(uploadedFile);
      }

      cb(true, null, uploadedFile);
    }

    console.log('newState: ', newState);
    this.setState({ uploadedFiles2: newState });
  };

  onDelete1 = (fileId: string, cb: (success: boolean, errormessage: TextMessage | null) => void) => {
    console.log('file deleted', fileId);

    const newState = this.state.uploadedFiles1.filter(f => f.id !== fileId);
    this.setState({ uploadedFiles1: newState });

    cb(true, null);
  };
  onDelete2 = (fileId: string, cb: (success: boolean, errormessage: TextMessage | null) => void) => {
    console.log('file deleted', fileId);

    const newState = this.state.uploadedFiles2.filter(f => f.id !== fileId);
    this.setState({ uploadedFiles2: newState });

    cb(true, null);
  };

  onRequestLink(fileId: string): string {
    console.log('link was requested for ' + fileId);
    return 'file:///' + fileId;
  }

  onOpenFile(fileId: string): void {
    console.log('file ' + fileId + ' was opened');
  }

  render(): JSX.Element {
    return (
      <>
        <Dropzone
          id="drop"
          label={'Last opp ett bilde av sykdommen din'}
          onDrop={this.onDrop1}
          onDelete={this.onDelete1}
          onRequestLink={this.onRequestLink}
          onOpenFile={this.onOpenFile}
          maxFileSize={100000}
          fileElementClassName="myclass"
          errorMessage="Maks filstørrelse er 1 000 000 byte og formatet må være jpeg, png eller pdf"
          uploadButtonText="Last opp"
          supportedFileFormatsText={'Gyldige filformater er jpeg, png og pdf'}
          validFileTypes={['image/jpeg', 'image/png', 'application/pdf']}
          uploadedFiles={this.state.uploadedFiles1}
          wrapperTestId="Dropzone"
        />
        <Dropzone
          id="drop"
          label={'Last opp flere bilde av sykdommen din'}
          onDrop={this.onDrop2}
          onDelete={this.onDelete2}
          onRequestLink={this.onRequestLink}
          onOpenFile={this.onOpenFile}
          maxFileSize={100000}
          visualDropZone
          dropzoneStatusText={'Dra flere filer hit'}
          errorMessage="Maks filstørrelse er 1 000 000 byte og formatet må være jpeg, png eller pdf"
          uploadButtonText="Last opp"
          supportedFileFormatsText={'Gyldige filformater er jpeg, png og pdf'}
          validFileTypes={['image/jpeg', 'image/png', 'application/pdf']}
          shouldUploadMultiple
          uploadedFiles={this.state.uploadedFiles2}
          wrapperTestId="Dropzone"
          functionButtonTestId="FunctionButton"
          labelTestId="Label"
          messageBoxTestId="MessageBox"
        />
      </>
    );
  }
}

export default DropzoneExample;
