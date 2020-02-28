import '@helsenorge/core-build/lib/polyfills';

import * as React from 'react';
import { render } from 'react-dom';
import WebCompWrapper from '../utils/getwebcomponent';

const anchor: Element | null = document.getElementById('main-content-wrapper');

render(
  <div className="forside">
    <WebCompWrapper domain={'http://localhost:5000'} name="test-component" componentProps={{ test: 'lol' }} />

    <p>{'This is the main page'}</p>
  </div>,
  anchor
);
