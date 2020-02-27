import '@helsenorge/core-build/lib/polyfills';

// Dette er en setup for web-components
// Hvis du er i denne filen å vurderer å ta en kopi -> Stop her og se heller på muligheten for å eksponere og gjenbruke denne:
// Ved bruk av flere webcomponents kan den gjerne brukes gjennom en npm pakke, eller bli en del av Helenorge core pakkene

import React from 'react';
import ReactDOM, { render } from 'react-dom';
import retargetEvents from 'react-shadow-dom-retarget-events';
import { StyleSheetManager } from 'styled-components';
import { EventProvider, SubscribeProvider } from './utils/context';
import { styleInjector } from './utils/helpers';

export type Props = { element: React.FC };

export interface WebcompProps {
    [key: string]: string;
}

export interface Config {
    events: boolean;
    styledComponents: boolean;
}

 interface configSetupProps {
    config: { events: boolean; styledComponents: boolean };
    eventDispatcher: (event: Event) => void;
    subscribeDispatcher: (eventname: string, callback: Function) => void;
    mountPoint: HTMLElement;
}

const ConfigSetup = (props: React.PropsWithChildren<configSetupProps>): JSX.Element => {
  const { config, eventDispatcher, subscribeDispatcher, mountPoint } = props;
  switch (true) {
    case config.events && !config.styledComponents:
      return (
        <EventProvider value={eventDispatcher}>
          <SubscribeProvider value={subscribeDispatcher}>{props.children}</SubscribeProvider>
        </EventProvider>
      );
    case !config.events && config.styledComponents:
      return <StyleSheetManager target={mountPoint}>{props.children}</StyleSheetManager>;
    case config.events && config.styledComponents:
      return (
        <StyleSheetManager target={mountPoint}>
          <EventProvider value={eventDispatcher}>
            <SubscribeProvider value={subscribeDispatcher}>{props.children}</SubscribeProvider>
          </EventProvider>
        </StyleSheetManager>
      );
    default:
      return <>{props.children}</>;
  }
};


export default function config<Props>(ChildComponent: React.ComponentType<WebcompProps>, name: string, config: Config = { events: false, styledComponents: false }): void {
    class WebComponent extends HTMLElement {
        mountPoint: HTMLElement;
        props: WebcompProps;

        constructor() {
            super();
            this.mountReactApp();
        }

        disconnectedCallback() {
            ReactDOM.unmountComponentAtNode(this.mountPoint);
        }

        get value() {
            return Array.from(this.attributes).reduce((p, c) => {
                p[c.name] = c.value;
                return p;
            }, {}) as WebcompProps;
        }

        eventDispatcher = (event: Event) => {
            this.dispatchEvent(event);
        };

        // Listen to Events from outside
        subscribeDispatcher = (eventname: string, callback: Function) => {
            this.addEventListener(eventname, e => {
                return callback(e);
            });
        };

        mountReactApp() {
            this.props = this.value;
            this.mountPoint = document.createElement('div');
            // TEMPLATE
            const tmpl: HTMLTemplateElement = document.getElementById(`${name}-template-header`) as HTMLTemplateElement;
            // SHADOW-DOM
            // Create an attach to the shadowDOM's root. This is necessary before querying the DOM
            const shadowRoot = this.attachShadow({ mode: 'open' });
            // TEMPLATE + SHADOW-DOM
            // Select the template content and append it to the shadowDOM
            shadowRoot.appendChild(tmpl.content.cloneNode(true));
            shadowRoot.appendChild(this.mountPoint);

            render(
                <ConfigSetup
                    config={config}
                    eventDispatcher={this.eventDispatcher}
                    subscribeDispatcher={this.subscribeDispatcher}
                    mountPoint={this.mountPoint}
                >
                    <ChildComponent {...this.props} />
                </ConfigSetup>,
                this.mountPoint
            );
            styleInjector(this.props, shadowRoot);

            retargetEvents(shadowRoot);
        }
    }

    if (!window.customElements.get(name)) {
      window.customElements.define(name, WebComponent);
    }
}
