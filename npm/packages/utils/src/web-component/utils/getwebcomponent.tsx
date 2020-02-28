/* eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/no-var-requires, no-console */
import React, { useEffect } from 'react';

interface WebCompProps {
  domain: string;
  name: string;
  componentProps: Props;
}

interface Props {
  [key: string]: string;
}
const WebCompWrapper: React.FC<WebCompProps> = (props: WebCompProps) => {
  const { domain, name, componentProps } = props;
  useEffect(() => {
    fetch(`${domain}/assets.json`)
      .then(response => {
        if (response.status === 200) {
          const resp = response.json();
          return resp;
        }
        return Promise.reject(Error('Error while fetching asset-manifest.json'));
      })
      .then(assets => {
        // All those should be checked towards existing hash and conditionnally added from backend

        // vendors css
        const vendorsInlineCSS = document.createElement('link');
        const header = name + '-template';
        const tmpl: HTMLTemplateElement = document.getElementById(header) as HTMLTemplateElement;
        vendorsInlineCSS.setAttribute('src', `${domain}/${assets.assets['vendors.css']}`);
        vendorsInlineCSS.rel = 'stylesheet';
        vendorsInlineCSS.type = 'text/css';
        tmpl.appendChild(vendorsInlineCSS);

        // header-footer css
        const headerfooterInlineCSS = document.createElement('link');
        headerfooterInlineCSS.setAttribute('src', `${domain}/${assets.assets['header-footer.css']}`);
        headerfooterInlineCSS.rel = 'stylesheet';
        headerfooterInlineCSS.type = 'text/css';
        tmpl.appendChild(headerfooterInlineCSS);

        // Polyfill script - should be checked towards existing hash and conditionnally downloaded
        const polyfillInlineScript = document.createElement('script');
        polyfillInlineScript.setAttribute('src', `${domain}/${assets.assets['polyfills.js']}`);
        document.head.appendChild(polyfillInlineScript);

        // Vendors script
        const vendorsInlineScript = document.createElement('script');
        vendorsInlineScript.setAttribute('src', `${domain}/${assets.assets['vendors.js']}`);
        document.head.appendChild(vendorsInlineScript);

        // header-footer script
        const headerfooterInlineScript = document.createElement('script');
        headerfooterInlineScript.setAttribute('src', `${domain}/${assets.assets['header-footer.js']}`);
        document.head.appendChild(headerfooterInlineScript);
      })
      .catch(error => {
        return Promise.reject(Error(error.message));
      });
  }, []);

  const WebCompFromMicroFrontend = React.createElement(name, componentProps);
  console.log(WebCompFromMicroFrontend);
  return <>{WebCompFromMicroFrontend}</>;
};
export default WebCompWrapper;
