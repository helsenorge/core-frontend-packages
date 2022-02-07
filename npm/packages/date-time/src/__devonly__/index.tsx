import '@helsenorge/core-build/lib/polyfills';

import React from 'react';

import { render } from 'react-dom';

const anchor: Element | null = document.getElementById('main-content-wrapper');

const TestSide: React.FC = () => {
  return (
    <>
      <h1>{'Testside'}</h1>
      <p>{'Her kan du legge inn komponenter og teste dem med "npm run start".'}</p>
    </>
  );
};

render(<TestSide />, anchor);
