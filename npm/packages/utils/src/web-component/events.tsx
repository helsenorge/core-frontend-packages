import { useEffect } from 'react';

import * as History from 'history';

import { ShowSignOutBoxData, SessionTimeoutAction } from '../types/entities';

/* Events from header-footer and cms-blocks webcomp */
import { setVisPersonvelger } from '../hn-user';
import { HeaderFooterEvents, CmsBlocksEvents, CommonEvents } from './constants';

export interface KeyboardEventWithPath extends KeyboardEvent {
  path?: string;
}
export interface MouseEventWithPath extends MouseEvent {
  path?: string;
}

/* This is a custom interface to be able to access and typecheck path on Events */
export interface WebComponentEvent<T extends EventTarget> extends Event {
  target: T;
  tagName: string;
  path: {
    find: (fn: (e: WebComponentEvent<T>) => boolean) => { id: string };
  };
}

/* This is a util to get the event target, wether it comes from the lightDOM or shadowDOM - this requires the Shadow DOM to be of type 'open' */
export const getEventTarget = (e: Event | MouseEvent | KeyboardEvent): EventTarget => {
  const event = e as WebComponentEvent<EventTarget>;
  const path = event.path || (event.composedPath && event.composedPath());
  return path[0];
};

interface EventDetails {
  [key: string]: unknown;
}

const dispatchCustomEvent = (
  selector: string,
  eventType: HeaderFooterEvents | CmsBlocksEvents | CommonEvents,
  detail: EventDetails
): void => {
  const element = document.querySelector(selector);
  if (element && element.dispatchEvent) {
    element.dispatchEvent(
      new CustomEvent(eventType, {
        detail,
      })
    );
  }
};

export const HNeventSetSimplifiedHeader = (isSimplified: boolean = true): void =>
  dispatchCustomEvent('hn-webcomp-header', HeaderFooterEvents.setsimplifiedheader, { simplifiedHeader: isSimplified });

export const HNeventSetFirstTimeLogin = (isFirstTime: boolean = true): void =>
  dispatchCustomEvent('hn-webcomp-header', HeaderFooterEvents.setfirsttimelogin, { firstTimeLogin: isFirstTime });
export const HNeventSetAnonymousHeader = (isAnonymous: boolean = true): void =>
  dispatchCustomEvent('hn-webcomp-header', HeaderFooterEvents.setanonymousheader, { anonymousHeader: isAnonymous });

export const HNeventSetHiddenHeader = (isHidden: boolean = true): void =>
  dispatchCustomEvent('hn-webcomp-header', HeaderFooterEvents.sethiddenheader, { hiddenHeader: isHidden });

export const HNeventSetSimplifiedFooter = (text: string, isSimplified: boolean = true): void =>
  dispatchCustomEvent('hn-webcomp-footer', HeaderFooterEvents.setsimplifiedfooter, {
    simplifiedFooter: isSimplified,
    simplifiedFooterText: text,
  });

export const HNeventSetHiddenFooter = (isHidden: boolean = true): void =>
  dispatchCustomEvent('hn-webcomp-footer', HeaderFooterEvents.sethiddenfooter, {
    hiddenFooter: isHidden,
  });

export const HNeventRefreshVarslinger = (): void => dispatchCustomEvent('hn-webcomp-header', HeaderFooterEvents.refreshvarslinger, {});

export const HNeventSetDriftsmeldingPath = (path: string): void =>
  dispatchCustomEvent('hn-webcomp-driftspanel', HeaderFooterEvents.setdriftsmeldingpath, { path });

export const HNeventRefreshVarslingerOgHendelsesmeny = (): void =>
  dispatchCustomEvent('hn-webcomp-header', HeaderFooterEvents.refreshvarslingeroghendelsesmeny, {});

export const HNeventSetOnShowSignoutbox = (fn: (data: ShowSignOutBoxData) => SessionTimeoutAction): void =>
  dispatchCustomEvent('hn-webcomp-header', HeaderFooterEvents.setonshowsignoutbox, { onShowSignOutBox: fn });

export const HNeventSetUserLoading = (userLoading: boolean): void =>
  dispatchCustomEvent('hn-webcomp-header', HeaderFooterEvents.setuserloading, { userLoading });

export const HNeventSetFromLocation = (fromLocation: History.Location): void =>
  dispatchCustomEvent('hn-webcomp-personvelger', HeaderFooterEvents.setfromlocation, { fromLocation });

export const HNeventSetRedirectToUrlAfterLogin = (redirectToUrlAfterLogin: boolean): void =>
  dispatchCustomEvent('hn-webcomp-personvelger', HeaderFooterEvents.setredirecttourlafterlogin, { redirectToUrlAfterLogin });

export const HNeventSetHistory = (history: History.History<History.LocationState>): void =>
  dispatchCustomEvent('hn-webcomp-personvelger', HeaderFooterEvents.sethistory, { history });

export const HNeventSetLocation = (location: History.Location<History.LocationState>): void =>
  dispatchCustomEvent('hn-webcomp-personvelger', HeaderFooterEvents.setlocation, { location });

export interface VisPersonvelgerDetail extends EventDetails {
  visPersonvelger: boolean;
}

export const HNeventSetVisPersonvelger = (visPersonvelger: boolean): void => {
  setVisPersonvelger(visPersonvelger);
  window.dispatchEvent(
    new CustomEvent<VisPersonvelgerDetail>(HeaderFooterEvents.setvispersonvelger, {
      detail: { visPersonvelger },
    })
  );
};

export const HNeventSetHiddenPromopanel = (isHidden: boolean): void =>
  dispatchCustomEvent('hn-webcomp-cms-block-promopanel', CmsBlocksEvents.setHiddenPromopanel, { hiddenPromopanel: isHidden });

export const HNeventIsMicroFrontendMounted = (webcomponentName: string): void => {
  const webcomponent = document.querySelector(webcomponentName);

  if (webcomponent && webcomponent.dispatchEvent) {
    webcomponent.dispatchEvent(new CustomEvent(CommonEvents.isMounted));
  }
};

export const HNaddEventListener = (
  event: HeaderFooterEvents | CmsBlocksEvents | CommonEvents,
  element: Element | null,
  handler: <T>(EvenCustomEvent: CustomEvent<T>) => void,
  passive = false
): void => {
  useEffect(() => {
    if (element) element.addEventListener(event, handler, passive);

    return function cleanup(): void {
      if (element) element.removeEventListener(event, handler);
    };
  });
};
