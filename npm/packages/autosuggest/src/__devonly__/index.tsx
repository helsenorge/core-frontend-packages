import React from 'react';

import ReactDOM from 'react-dom/client';

import { AutosuggestExample } from '../examples';

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

ReactDOM.createRoot(document.getElementById('main-content-wrapper')!).render(
  <React.StrictMode>
    <TestSide />
  </React.StrictMode>
);
