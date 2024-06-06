export const mockUserAgent = (userAgent: string): void => {
  Object.defineProperty(window.navigator, 'userAgent', {
    value: userAgent,
    configurable: true,
  });
};
