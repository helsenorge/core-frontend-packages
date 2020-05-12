/* Events from header-footer webcomp */

export const HNeventSetHiddenHeader = (): void => {
  const webcompheader = document.querySelector('hn-webcomp-header');
  if (webcompheader && webcompheader.dispatchEvent) {
    webcompheader.dispatchEvent(new CustomEvent('hn-webcomp-header-footer-event-sethiddenheader', { detail: { hiddenHeader: true } }));
  }
};

export const HNeventSetHiddenFooter = (): void => {
  const webcompheader = document.querySelector('hn-webcomp-footer');
  if (webcompheader && webcompheader.dispatchEvent) {
    webcompheader.dispatchEvent(new CustomEvent('hn-webcomp-header-footer-event-sethiddenfooter', { detail: { hiddenFooter: true } }));
  }
};

export const HNeventSetSimplifiedFooter = (text: string): void => {
  const webcompheader = document.querySelector('hn-webcomp-footer');
  if (webcompheader && webcompheader.dispatchEvent) {
    webcompheader.dispatchEvent(
      new CustomEvent('hn-webcomp-header-footer-event-sethiddenfooter', { detail: { simplifiedFooter: true, simplifiedFooterText: text } })
    );
  }
};

export const HNeventRefreshMeldinger = (): void => {
  const webcompheader = document.querySelector('hn-webcomp-header');
  if (webcompheader && webcompheader.dispatchEvent) {
    webcompheader.dispatchEvent(new CustomEvent('hn-webcomp-header-footer-event-refreshmeldinger', { detail: {} }));
  }
};
