/* eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/no-var-requires, no-console */
import React, { useEffect } from 'react';

interface WebCompProps {
  domain: string;
  componentname: string;
  componentProps: Props;
  entryname: string;
}

interface Props {
  [key: string]: string;
}
const WebCompWrapper: React.FC<WebCompProps> = (props: WebCompProps) => {
  const { domain, entryname, componentname, componentProps } = props;
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
        const header = componentname + '-template';
        const tmpl: HTMLTemplateElement = document.getElementById(header) as HTMLTemplateElement;
        tmpl.innerHTML = '';
        // All those should be checked towards existing hash and conditionnally added from backend
        assets.entrypoints[entryname].map((e: string) => {
          if (!e.includes('.map')) {
            if (e.includes('.css')) {
              // vendors css
              const vendorsInlineCSS = document.createElement('link');
              vendorsInlineCSS.setAttribute('href', `${domain}/${e}`);
              vendorsInlineCSS.rel = 'stylesheet';
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

  const WebCompFromMicroFrontend = React.createElement(componentname, componentProps);
  console.log(WebCompFromMicroFrontend);
  return <>{WebCompFromMicroFrontend}</>;
};
export default WebCompWrapper;
