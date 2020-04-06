export const refreshUlesteMeldingerEvent = 'refreshUlesteMeldinger';

export const fireRefreshUlesteMeldinger = (): void => {
  const webcompheader = document.querySelector('hn-webcomp-header');

  if (webcompheader && webcompheader.dispatchEvent) {
    webcompheader.dispatchEvent(new CustomEvent(refreshUlesteMeldingerEvent));
  }
};
