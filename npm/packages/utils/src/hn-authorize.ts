interface HNPage {
  Rest: {
    __Authorized__: boolean;
    __HashIsAuthorized__: boolean;
  };
}

declare const HN: HNPage;

/**
 * Returnerer __Authorized__ fra HN.rest objektet
 */
export const isAuthorized = (): boolean => !!HN.Rest.__Authorized__;

/**
 * Returnerer __HashIsAuthorized__ fra HN.rest objektet
 */
export const hashIsAuthorized = (): boolean => {
  return HN.Rest.__HashIsAuthorized__ !== undefined && HN.Rest.__HashIsAuthorized__ !== null ? HN.Rest.__HashIsAuthorized__ : false;
};
