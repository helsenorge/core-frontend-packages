import '@helsenorge/core-build/lib/polyfills';

import React from 'react';

import { render } from 'react-dom';
import { FormExample } from '../examples';

const anchor: Element | null = document.getElementById('main-content-wrapper');

const TestSide: React.FC = () => {
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h1>{'Form Testside'}</h1>
            <p>{'Her kan du legge inn komponenter og teste dem med "npm run start".'}</p>
            <FormExample />
          </div>
        </div>
      </div>
    </>
  );
};

render(<TestSide />, anchor);
