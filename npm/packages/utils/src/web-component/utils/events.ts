export const refreshUlesteMeldingerEvent = 'hn-refreshUlesteMeldinger';

export const dispatchRefreshUlesteMeldingerEvent = (): void => {
  const webcompheader = document.querySelector('hn-webcomp-header');

  if (webcompheader && webcompheader.dispatchEvent) {
    webcompheader.dispatchEvent(new CustomEvent(refreshUlesteMeldingerEvent));
  }
};
