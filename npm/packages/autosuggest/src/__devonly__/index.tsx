import React from 'react';

import { render } from 'react-dom';

import { AutosuggestExample } from '../examples';

const anchor: Element | null = document.getElementById('main-content-wrapper');

const TestSide: React.FC = () => {
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <AutosuggestExample />
          </div>
        </div>
      </div>
    </>
  );
};

render(<TestSide />, anchor);
