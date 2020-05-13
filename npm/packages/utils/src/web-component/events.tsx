/* Events from header-footer webcomp */

export const HNeventSetHiddenHeader = (isHidden: boolean = true): void => {
  const webcompheader = document.querySelector('hn-webcomp-header');
  if (webcompheader && webcompheader.dispatchEvent) {
    webcompheader.dispatchEvent(new CustomEvent('hn-webcomp-header-footer-event-sethiddenheader', { detail: { hiddenHeader: isHidden } }));
  }
};

export const HNeventSetHiddenFooter = (isHidden: boolean = true): void => {
  const webcompheader = document.querySelector('hn-webcomp-footer');
  if (webcompheader && webcompheader.dispatchEvent) {
    webcompheader.dispatchEvent(new CustomEvent('hn-webcomp-header-footer-event-sethiddenfooter', { detail: { hiddenFooter: isHidden } }));
  }
};

export const HNeventSetSimplifiedFooter = (text: string, isSimplified: boolean = true): void => {
  const webcompheader = document.querySelector('hn-webcomp-footer');
  if (webcompheader && webcompheader.dispatchEvent) {
    webcompheader.dispatchEvent(
      new CustomEvent('hn-webcomp-header-footer-event-setsimplifiedfooter', {
        detail: { simplifiedFooter: isSimplified, simplifiedFooterText: text },
      })
    );
  }
};

export const HNeventRefreshMeldinger = (): void => {
  const webcompheader = document.querySelector('hn-webcomp-header');
  if (webcompheader && webcompheader.dispatchEvent) {
    webcompheader.dispatchEvent(new CustomEvent('hn-webcomp-header-footer-event-refreshmeldinger', { detail: {} }));
  }
};
