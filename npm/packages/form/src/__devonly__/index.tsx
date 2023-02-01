import React from 'react';

import { render } from 'react-dom';

import { FormExample, RadioGroupExample, SafeInputFieldExample, SafeSelectExample, SafeTextareaExample } from '../examples';

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
            <h2>{'Radio-group'}</h2>
            <RadioGroupExample />
            <h2>{'Safe-Input-Field'}</h2>
            <SafeInputFieldExample />
            <h2>{'Safe-Select'}</h2>
            <SafeSelectExample />
            <h2>{'Safe-Textarea'}</h2>
            <SafeTextareaExample />
          </div>
        </div>
      </div>
    </>
  );
};

render(<TestSide />, anchor);
