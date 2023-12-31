/* eslint-disable no-console */
import * as React from 'react';

import Title from '@helsenorge/designsystem-react/components/Title';

import Dropzone, { OnDropHandler, OnDeleteHandler, UploadedFile } from './index';

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

  onDrop1: OnDropHandler = (files, cb): void => {
    console.log('file dropped', ...files);

    const newState = [...this.state.uploadedFiles1];
    for (const f of files) {
      const uploadedFile = { id: f.name, name: f.name, size: f.size } as UploadedFile;
      newState.push(uploadedFile);
      cb && cb(true, null, uploadedFile);
    }

    this.setState({ uploadedFiles1: newState });
  };
  onDrop2: OnDropHandler = (files, cb): void => {
    console.log('file dropped', ...files);

    const newState = [...this.state.uploadedFiles2];

    for (const f of files) {
      const uploadedFile = { id: f.name, name: f.name, size: f.size } as UploadedFile;
      if (newState.length > 0) {
        const sameFile = newState.find(e => e.name === f.name);
        if (!sameFile) {
          newState.push(uploadedFile);
        }
      } else {
        newState.push(uploadedFile);
      }

      cb && cb(true, null, uploadedFile);
    }

    console.log('newState: ', newState);
    this.setState({ uploadedFiles2: newState });
  };

  onDelete1: OnDeleteHandler = (fileId, cb) => {
    console.log('file deleted', fileId);

    const newState = this.state.uploadedFiles1.filter(f => f.id !== fileId);
    this.setState({ uploadedFiles1: newState });

    cb(true, null);
  };
  onDelete2: OnDeleteHandler = (fileId, cb) => {
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
        <Title htmlMarkup={'h2'} appearance={'title2'}>
          {'(Intern validering):'}
        </Title>
        <br />
        <Title htmlMarkup={'h3'} appearance={'title3'}>
          {'Uten dropzone:'}
        </Title>
        <Dropzone
          id="drop1"
          label={'Last opp ett bilde av sykdommen din'}
          onDrop={this.onDrop1}
          onDelete={this.onDelete1}
          onRequestLink={this.onRequestLink}
          onOpenFile={this.onOpenFile}
          maxFileSize={1024 * 1024 * 0.1}
          fileElementClassName="myclass"
          errorMessage="Maks filstørrelse er 1 MB og formatet må være jpeg, png eller pdf"
          uploadButtonText="Last opp"
          supportedFileFormatsText={'Gyldige filformater er jpeg, png og pdf'}
          validFileTypes={['image/jpeg', 'image/png', 'application/pdf']}
          uploadedFiles={this.state.uploadedFiles1}
          wrapperTestId="Dropzone"
        />
        <br />
        <Title htmlMarkup={'h3'} appearance={'title3'}>
          {'Med Dropzone:'}
        </Title>
        <Dropzone
          id="drop2"
          label={'Last opp flere bilder av sykdommen din'}
          onDrop={this.onDrop2}
          onDelete={this.onDelete2}
          onRequestLink={this.onRequestLink}
          onOpenFile={this.onOpenFile}
          maxFileSize={1024 * 1024 * 1}
          totalMaxFileSize={1024 * 1024 * 1}
          visualDropZone
          dropzoneStatusText={'Dra flere filer hit'}
          errorMessage="Maks filstørrelse er 1 MB og formatet må være jpeg, png eller pdf"
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
