import { createContext } from 'react';

const EventContext = createContext<Function>(() => null);
const SubscribeContext = createContext<(eventname: string, callback: Function) => void>((eventname: string, callback: Function) => null);
export const EventProvider = EventContext.Provider;
export const EventConsumer = EventContext.Consumer;
export const SubscribeProvider = SubscribeContext.Provider;
export { EventContext, SubscribeContext };
