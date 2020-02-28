/* eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/no-var-requires, no-console */
import React, { useEffect } from 'react';

interface WebCompProps {
  domain: string;
  componentName: string;
  componentProps?: Props;
  entryName: string;
}

interface Props {
  [key: string]: string | number | boolean;
}
const WebCompWrapper: React.FC<WebCompProps> = (props: WebCompProps) => {
  const { domain, entryName, componentName, componentProps } = props;
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
        const header = componentName + '-template';
        const tmpl: HTMLTemplateElement = document.getElementById(header) as HTMLTemplateElement;
        tmpl.innerHTML = '';
        //gets scripts and css from entrypoints
        assets.entrypoints[entryName].map((e: string) => {
          if (!e.includes('.map')) {
            if (e.includes('.css')) {
              // vendors css
              const vendorsInlineCSS = document.createElement('link');
              vendorsInlineCSS.setAttribute('href', `${domain}/${e}`);
              vendorsInlineCSS.rel = 'stylesheet';
              //cant append to a document fragment
              tmpl.innerHTML += vendorsInlineCSS.outerHTML;
            } else {
              // vendors js
              const vendorsInlineScript = document.createElement('script');
              vendorsInlineScript.setAttribute('src', `${domain}/${e}`);
              document.head.appendChild(vendorsInlineScript);
            }
          }
        });
      })
      .catch(error => {
        return Promise.reject(Error(error.message));
      });
  }, []);

  const WebCompFromMicroFrontend = React.createElement(componentName, componentProps);

  return <>{WebCompFromMicroFrontend}</>;
};
export default WebCompWrapper;
