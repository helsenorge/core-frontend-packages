import '@helsenorge/core-build/lib/polyfills';

import * as React from 'react';
import { render } from 'react-dom';
import WebCompWrapper from '../utils/getWebComponent';

const anchor: Element | null = document.getElementById('main-content-wrapper');

render(
  <div className="forside">
    <WebCompWrapper
      domain={'http://localhost:5000'}
      componentname="hn-webcomp-header"
      entryname="header-footer"
      componentProps={{ test: 'lol', id: 'hn-webcomp-header' }}
    />

    <p>{'This is the main page'}</p>
  </div>,
  anchor
);
