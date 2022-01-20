import { getAssetsUrl } from '../hn-page';
import { error } from '../logger';
import { isCustomElementRegistered } from './register';

/** Denne kan brukes for å fetche en web component som finnes.
 * Legger til <link> og <script> tags for relevant webcomponent så riktig js og css lastes, og oppretter element i dom'en.
 *
 * Tilsvarer "metode 2" for konsumering av web component som er dokumentert på confluence-siden for microfrontend:
 * https://confluence.helsedirektoratet.no/display/HR2/@helsenorge+Microfrontend
 *
 * Eksempel:
 * // Lag template én gang, i html'en eller på root. Fetch nødvendige assets med fetchWebComp
 * <template id="hn-webcomp-oppgave-template"></template>
 * // fetch assets, vanligvis i en UseEffect
 * fetchWebComp({domain={`${getAssetsUrl()}/oppgave`} entryName="webcomp-oppgave" componentName="hn-webcomp-oppgave" includeResetCss});
 * // Lag flere instans av følgende i din react kode:
 * <hn-webcomp-oppgave></hn-webcomp-oppgave>
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

export const fetchWebComp = (props: Props): void => {
  const { domain, entryName, componentName, includeResetCss } = props;
  if (!isCustomElementRegistered(componentName)) {
    const assetsUrl = `${domain}/assets.json`;
    // Sørg for å alltid hente nyeste assets.json
    // https://developer.mozilla.org/en-US/docs/Web/API/Request/cache
    fetch(assetsUrl, { cache: 'no-cache' })
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
        error(e, assetsUrl);
      });
  }
};
