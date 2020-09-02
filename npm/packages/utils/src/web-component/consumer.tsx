import React, { useEffect } from 'react';
import { getAssetsUrl } from '../hn-service';
import { error } from '../logger';

/** Denne kan brukes for å konsumere en web component som finnes.
 * Legger til <link> og <script> tags for relevant webcomponent så riktig js og css lastes, og oppretter element i dom'en.
 *
 * Tilsvarer "metode 2" for konsumering av web component som er dokumentert på confluence-siden for microfrontend:
 * https://confluence.helsedirektoratet.no/display/HR2/@helsenorge+Microfrontend
 *
 * Eksempel:
 * <template id="hn-webcomp-cms-block-promopanel-template"></template>
 * <WebCompConsumer
 *    domain={`${getAssetsUrl()}/cms-blocks`}
 *    entryName="cms-blocks"
 *    componentName="hn-webcomp-cms-block-promopanel"
 *    includeResetCss
 *  />
 */

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

const WebCompConsumer: React.FC<Props> = (props: Props) => {
  const { domain, entryName, componentName, componentProps, includeResetCss } = props;

  useEffect(() => {
    fetch(`${domain}/assets.json`)
      .then(response => {
        if (response.status === 200) {
          const resp = response.json();
          return resp;
        }
        return Promise.reject(Error(`Error while fetching asset-manifest.json from ${domain}/assets.json`));
      })
      .then(assets => {
        const tmpl: HTMLTemplateElement = document.getElementById(`${componentName}-template`) as HTMLTemplateElement;

        if (includeResetCss) {
          const resetcssInlineCss = document.createElement('link');
          resetcssInlineCss.setAttribute('href', `${getAssetsUrl()}/forside/static/css/resetcss/resetcss.css`);
          resetcssInlineCss.rel = 'stylesheet';
          if (tmpl) tmpl.innerHTML += resetcssInlineCss.outerHTML;
        }

        // gets scripts and css from entrypoint
        assets.entrypoints[entryName].map((asset: string) => {
          if (!asset.includes('.map')) {
            if (asset.includes('.css')) {
              // css
              const inlineCss = document.createElement('link');
              inlineCss.setAttribute('href', `${domain}/${asset}`);
              inlineCss.rel = 'stylesheet';
              if (tmpl) tmpl.innerHTML += inlineCss.outerHTML;
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
export default WebCompConsumer;
