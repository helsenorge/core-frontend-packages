import React, { useEffect } from 'react';
import { fetchWebComp } from './fetcher';

/** Denne kan brukes for å konsumere en web component som finnes.
 * Fetcher nødvendige ressurser
 * Legger til <link> og <script> tags for relevant webcomponent så riktig js og css lastes, og oppretter element i dom'en.
 *
 * Tilsvarer "metode 3" for konsumering av web component som er dokumentert på confluence-siden for microfrontend:
 * https://confluence.helsedirektoratet.no/display/HR2/@helsenorge+Microfrontend
 *
 * Eksempel:
 * Lager template og konsumerer komponenten med en gang. Brukes kun for enkelte tilfeller. Hvis webcomponent instansieres flere ganger bruk methode 1 eller 2
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
  const { componentName, componentProps } = props;

  useEffect(() => {
    fetchWebComp(props);
  }, []);

  const webCompFromMicroFrontend = React.createElement(componentName, componentProps);
  return <React.Fragment>{webCompFromMicroFrontend}</React.Fragment>;
};
export default WebCompConsumer;
