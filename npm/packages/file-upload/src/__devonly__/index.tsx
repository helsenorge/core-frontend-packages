import React from 'react';

import { render } from 'react-dom';

import Title from '@helsenorge/designsystem-react/components/Title';

import { FileUploadExample } from '../examples';

const anchor: Element | null = document.getElementById('main-content-wrapper');

const TestSide: React.FC = () => (
  <div className="container">
    <div className="row">
      <div className="col-12">
        <Title>{'FileUpload'}</Title>
        <br />
        <FileUploadExample />
      </div>
    </div>
  </div>
);

render(<TestSide />, anchor);
