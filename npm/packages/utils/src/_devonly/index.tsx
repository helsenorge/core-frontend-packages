import * as React from 'react';
import { render } from 'react-dom';

const anchor: Element | null = document.getElementById('main-content-wrapper');

render(
  <div className="utils">
    <p>{'This is the test page'}</p>
  </div>,
  anchor
);
