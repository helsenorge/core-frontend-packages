import React from 'react';
import { WebcompProps } from '..';
import { EventProvider, SubscribeProvider } from './context';
import { StyleSheetManager } from 'styled-components';

export const styleInjector = (props: WebcompProps, shadowroot: ShadowRoot) => {
  if (props.styleoverwrite) {
    const styleTag = document.createElement('style');
    styleTag.innerHTML = props.styleoverwrite;
    shadowroot.appendChild(styleTag);
  }
};
interface configSetupProps {
  config: { events: boolean; styledComponents: boolean };
  eventDispatcher: (event: Event) => void;
  subscribeDispatcher: (eventname: string, callback: Function) => void;
  mountPoint: HTMLElement;
}

export const ConfigSetup = (props: React.PropsWithChildren<configSetupProps>): JSX.Element => {
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
