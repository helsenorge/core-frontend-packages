import React from 'react';

import ReactDOM from 'react-dom/client';

import Title from '@helsenorge/designsystem-react/components/Title';

import { FileUploadExample } from '../examples';

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

ReactDOM.createRoot(document.getElementById('main-content-wrapper')!).render(
  <React.StrictMode>
    <TestSide />
  </React.StrictMode>
);
