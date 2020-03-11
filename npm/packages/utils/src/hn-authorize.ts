interface HNPage {
  Rest: {
    __Authorized__: boolean;
  };
}

declare const HN: HNPage;

export const isAuthorized = () => !!HN.Rest.__Authorized__;
