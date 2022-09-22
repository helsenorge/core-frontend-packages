import '@helsenorge/core-build/lib/polyfills';

import React from 'react';

import { render } from 'react-dom';

import Dropzone from '../components/dropzone';
import { DropzoneExample } from '../examples';

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
      <DropzoneExample />

      <Dropzone
        id="test"
        onDrop={handleDrop}
        uploadedFiles={[{ id: 'asd', name: 'string' }]}
        confirmDelete
        onDelete={handleDelete}
        deleteText="deleteText"
        verifyDeleteText="verifyDeleteText"
        confirmText="confirmText"
        cancelText="cancelText"
      />
    </>
  );
};

render(<TestSide />, anchor);
