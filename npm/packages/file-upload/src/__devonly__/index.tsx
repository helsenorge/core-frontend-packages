import React from 'react';

import { render } from 'react-dom';

import Title from '@helsenorge/designsystem-react/components/Title';

import Dropzone from '../components/dropzone';
import { DropzoneExample, FileUploadExample } from '../examples';

const anchor: Element | null = document.getElementById('main-content-wrapper');

const TestSide: React.FC = () => {
  const handleDrop = () => {
    // eslint-disable-next-line no-console
    console.log('Dropetidropp');
  };
  const handleDelete = () => {
    // eslint-disable-next-line no-console
    console.log('Slettislett');
  };
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <Title>{'FileUpload'}</Title>
            <br />
            <FileUploadExample />
            <br />
            <Title>{'Dropzone'}</Title>
            <br />
            <DropzoneExample />
          </div>
        </div>
      </div>
    </>
  );
};

render(<TestSide />, anchor);
