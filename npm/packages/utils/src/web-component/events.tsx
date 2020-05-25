import { useEffect } from 'react';

/* Events from header-footer webcomp */
import { HeaderFooterEvents } from './constants';

export const HNeventSetHiddenHeader = (isHidden: boolean = true): void => {
  const webcompheader = document.querySelector('hn-webcomp-header');
  if (webcompheader && webcompheader.dispatchEvent) {
    webcompheader.dispatchEvent(new CustomEvent(HeaderFooterEvents.sethiddenheader, { detail: { hiddenHeader: isHidden } }));
  }
};

export const HNeventSetHiddenFooter = (isHidden: boolean = true): void => {
  const webcompheader = document.querySelector('hn-webcomp-footer');
  if (webcompheader && webcompheader.dispatchEvent) {
    webcompheader.dispatchEvent(new CustomEvent(HeaderFooterEvents.sethiddenfooter, { detail: { hiddenFooter: isHidden } }));
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

export const HNeventRefreshVarslinger = (): void => {
  const webcompheader = document.querySelector('hn-webcomp-header');
  if (webcompheader && webcompheader.dispatchEvent) {
    webcompheader.dispatchEvent(new CustomEvent(HeaderFooterEvents.refreshvarslinger, { detail: {} }));
  }
};

export const HNeventRefreshVarslingerOgHendelsesmeny = (): void => {
  const webcompheader = document.querySelector('hn-webcomp-header');
  if (webcompheader && webcompheader.dispatchEvent) {
    webcompheader.dispatchEvent(new CustomEvent(HeaderFooterEvents.refreshvarslingeroghendelsesmeny, { detail: {} }));
  }
};

export const HNaddEventListener = (
  event: HeaderFooterEvents,
  element: Element | null,
  handler: <T>(EvenCustomEvent: CustomEvent<T>) => void,
  passive = false
) => {
  useEffect(() => {
    if (element) element.addEventListener(event, handler, passive);

    return function cleanup() {
      if (element) element.removeEventListener(event, handler);
    };
  });
};
