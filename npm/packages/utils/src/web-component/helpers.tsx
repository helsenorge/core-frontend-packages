import React from 'react';
import { EventProvider, SubscribeProvider } from './context';

interface ConfigSetupProps {
  config: { events: boolean };
  eventDispatcher: (event: Event) => void;
  subscribeDispatcher: (eventname: string, callback: Function) => void;
}

export const RegisterWebCompSetup = (props: React.PropsWithChildren<ConfigSetupProps>): JSX.Element => {
  const { config, eventDispatcher, subscribeDispatcher } = props;

  if (config.events) {
    return (
      <EventProvider value={eventDispatcher}>
        <SubscribeProvider value={subscribeDispatcher}>{props.children}</SubscribeProvider>
      </EventProvider>
    );
  }

  return <>{props.children}</>;
};
