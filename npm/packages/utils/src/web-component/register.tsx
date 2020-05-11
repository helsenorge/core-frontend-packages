import React from 'react';
import ReactDOM, { render } from 'react-dom';
import retargetEvents from 'react-shadow-dom-retarget-events';
import { styleInjector, RegisterWebCompSetup } from './helpers';

/** Registrerer/oppretter ny web-komponent.
 *
 * Eksempel:
 * registerWebComp(HeaderWrapper, 'hn-webcomp-header', { events: true, styledComponents: true }, 'hn-webcomp-header-footer-template');
 */

export type Props = { ChildComponent: React.ComponentType<WebcompProps>; name: string; config: Config; templateName: string };

export interface WebcompProps {
  [key: string]: string;
}

export interface Config {
  events: boolean;
  styledComponents: boolean;
}

export default function registerWebComp(
  ChildComponent: React.ComponentType<WebcompProps>,
  name: string,
  config: Config,
  templateName: string
): void {
  class WebComponent extends HTMLElement {
    mountPoint: HTMLElement;
    props: WebcompProps;

    constructor() {
      super();
      this.mountReactApp();
    }

    disconnectedCallback(): void {
      ReactDOM.unmountComponentAtNode(this.mountPoint);
    }

    get value(): WebcompProps {
      return Array.from(this.attributes).reduce((p, c) => {
        p[c.name] = c.value;
        return p;
      }, {}) as WebcompProps;
    }

    eventDispatcher = (event: Event): void => {
      this.dispatchEvent(event);
    };

    // Listen to Events from outside
    subscribeDispatcher = (eventname: string, callback: Function): void => {
      this.addEventListener(eventname, e => {
        return callback(e);
      });
    };

    mountReactApp(): void | null {
      this.props = this.value;
      this.mountPoint = document.createElement('div');

      if (!templateName) {
        console.error('finner ikke template name');
        return null;
      }
      // TEMPLATE
      // Her settes id til templatet
      const tmpl: HTMLTemplateElement = document.getElementById(templateName) as HTMLTemplateElement;
      if (!tmpl) {
        console.error(`Kunne ikke finne html <template> med id: ${templateName} sjekk i index-html at <template> er oppgitt med riktig id`);
        return null;
      }
      // SHADOW-DOM
      // Create an attach to the shadowDOM's root. This is necessary before querying the DOM
      const shadowRoot = this.attachShadow({ mode: 'open' });
      // TEMPLATE + SHADOW-DOM
      // Select the template content and append it to the shadowDOM
      shadowRoot.appendChild(tmpl.content.cloneNode(true));
      shadowRoot.appendChild(this.mountPoint);

      render(
        <RegisterWebCompSetup
          config={config}
          eventDispatcher={this.eventDispatcher}
          subscribeDispatcher={this.subscribeDispatcher}
          mountPoint={this.mountPoint}
        >
          <ChildComponent {...this.props} />
        </RegisterWebCompSetup>,
        this.mountPoint
      );
      styleInjector(this.props, shadowRoot);
      retargetEvents(shadowRoot);
    }
  }

  //her settes navnet til web component elementet
  if (!window.customElements.get(name)) {
    window.customElements.define(name, WebComponent);
  }
}
