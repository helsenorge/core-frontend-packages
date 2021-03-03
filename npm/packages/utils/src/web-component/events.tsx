import { useEffect } from 'react';

import { ShowSignOutBoxData, SessionTimeoutAction } from '../types/entities';

/* Events from header-footer and cms-blocks webcomp */
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

export const HNeventSetSimplifiedHeader = (isSimplified: boolean = true): void => {
  const webcompheader = document.querySelector('hn-webcomp-header');
  if (webcompheader && webcompheader.dispatchEvent) {
    webcompheader.dispatchEvent(
      new CustomEvent(HeaderFooterEvents.setsimplifiedheader, {
        detail: { simplifiedHeader: isSimplified },
      })
    );
  }
};

export const HNeventSetHiddenHeader = (isHidden: boolean = true): void => {
  const webcompheader = document.querySelector('hn-webcomp-header');
  if (webcompheader && webcompheader.dispatchEvent) {
    webcompheader.dispatchEvent(new CustomEvent(HeaderFooterEvents.sethiddenheader, { detail: { hiddenHeader: isHidden } }));
  }
};

export const HNeventSetSimplifiedFooter = (text: string, isSimplified: boolean = true): void => {
  const webcompheader = document.querySelector('hn-webcomp-footer');
  if (webcompheader && webcompheader.dispatchEvent) {
    webcompheader.dispatchEvent(
      new CustomEvent(HeaderFooterEvents.setsimplifiedfooter, {
        detail: { simplifiedFooter: isSimplified, simplifiedFooterText: text },
      })
    );
  }
};

export const HNeventSetHiddenFooter = (isHidden: boolean = true): void => {
  const webcompheader = document.querySelector('hn-webcomp-footer');
  if (webcompheader && webcompheader.dispatchEvent) {
    webcompheader.dispatchEvent(new CustomEvent(HeaderFooterEvents.sethiddenfooter, { detail: { hiddenFooter: isHidden } }));
  }
};

export const HNeventRefreshVarslinger = (): void => {
  const webcompheader = document.querySelector('hn-webcomp-header');
  if (webcompheader && webcompheader.dispatchEvent) {
    webcompheader.dispatchEvent(new CustomEvent(HeaderFooterEvents.refreshvarslinger, { detail: {} }));
  }
};

export const HNeventSetDriftsmeldingPath = (path: string): void => {
  const webcompheader = document.querySelector('hn-webcomp-driftspanel');
  if (webcompheader && webcompheader.dispatchEvent) {
    webcompheader.dispatchEvent(new CustomEvent(HeaderFooterEvents.setdriftsmeldingpath, { detail: { path } }));
  }
};

export const HNeventRefreshVarslingerOgHendelsesmeny = (): void => {
  const webcompheader = document.querySelector('hn-webcomp-header');
  if (webcompheader && webcompheader.dispatchEvent) {
    webcompheader.dispatchEvent(new CustomEvent(HeaderFooterEvents.refreshvarslingeroghendelsesmeny, { detail: {} }));
  }
};

export const HNeventSetOnShowSignoutbox = (fn: (data: ShowSignOutBoxData) => SessionTimeoutAction): void => {
  const webcompheader = document.querySelector('hn-webcomp-header');
  if (webcompheader && webcompheader.dispatchEvent) {
    webcompheader.dispatchEvent(new CustomEvent(HeaderFooterEvents.setonshowsignoutbox, { detail: { onShowSignOutBox: fn } }));
  }
};

export const HNeventSetHiddenPromopanel = (isHidden: boolean): void => {
  const webcomppromopanel = document.querySelector('hn-webcomp-cms-block-promopanel');

  if (webcomppromopanel && webcomppromopanel.dispatchEvent) {
    webcomppromopanel.dispatchEvent(new CustomEvent(CmsBlocksEvents.setHiddenPromopanel, { detail: { hiddenPromopanel: isHidden } }));
  }
};

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
