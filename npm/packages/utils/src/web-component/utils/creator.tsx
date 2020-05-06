import React, { useEffect } from 'react';
import { error } from '../../logger';

interface ComponentProps {
  [key: string]: string | number | boolean;
}

interface Props {
  domain: string;
  componentName: string;
  componentProps?: ComponentProps;
  entryName: string;
  includeResetCss?: boolean;
}

const WebCompCreator: React.FC<Props> = (props: Props) => {
  const { domain, entryName, componentName, componentProps, includeResetCss } = props;

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
        const tmpl: HTMLTemplateElement = document.getElementById(`${componentName}-template`) as HTMLTemplateElement;

        if (includeResetCss) {
          const resetcssInlineCss = document.createElement('link');
          resetcssInlineCss.setAttribute('href', `/forside/static/css/resetcss/resetcss.css`);
          resetcssInlineCss.rel = 'stylesheet';
          tmpl.innerHTML += resetcssInlineCss.outerHTML;
        }

        // gets scripts and css from entrypoint
        assets.entrypoints[entryName].map((asset: string) => {
          if (!asset.includes('.map')) {
            if (asset.includes('.css')) {
              // css
              const inlineCss = document.createElement('link');
              inlineCss.setAttribute('href', `${domain}/${asset}`);
              inlineCss.rel = 'stylesheet';
              tmpl.innerHTML += inlineCss.outerHTML;
            } else {
              // js
              const inlineJs = document.createElement('script');
              inlineJs.setAttribute('src', `${domain}/${asset}`);
              document.head.appendChild(inlineJs);
            }
          }
        });
      })
      .catch(e => {
        error(e);
      });
  }, []);

  const webCompFromMicroFrontend = React.createElement(componentName, componentProps);

  return <React.Fragment>{webCompFromMicroFrontend}</React.Fragment>;
};
export default WebCompCreator;
