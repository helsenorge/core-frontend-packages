import { isAuthorized, hashIsAuthorized } from '../hn-authorize';

describe('hn-authorize', () => {
  describe('Gitt at isAuthorized kalles', () => {
    describe('Når __Authorized__ er definert i HN Rest objektet', () => {
      it('Så returnerer den verdien som er satt der', () => {
        const HN = {
          Rest: { __Authorized__: true },
        };
        const originalWindowHN = global.window['HN'];
        global.window['HN'] = HN;
        const isAuth = isAuthorized();
        expect(isAuth).toBeTruthy();
        global.window['HN'] = originalWindowHN;
      });
    });
  });

  describe('Når __Authorized__ er undefined i HN Rest objektet', () => {
    it('Så returnerer den verdien som er satt der', () => {
      const HN = {
        Rest: { __Authorized__: undefined },
      };
      const originalWindowHN = global.window['HN'];
      global.window['HN'] = HN;
      const isAuth = isAuthorized();
      expect(isAuth).toBeFalsy();
      global.window['HN'] = originalWindowHN;
    });
  });

  describe('Gitt at hasIsAuthorized kalles', () => {
    describe('Når __HashIsAuthorized__ er definert i HN Rest objektet', () => {
      it('Så returnerer den verdien som er satt der', () => {
        const HN = {
          Rest: { __HashIsAuthorized__: true },
        };
        const originalWindowHN = global.window['HN'];
        global.window['HN'] = HN;
        const isAuth = hashIsAuthorized();
        expect(isAuth).toBeTruthy();
        global.window['HN'] = originalWindowHN;
      });
    });
  });

  describe('Når __HashIsAuthorized__ er undefined i HN Rest objektet', () => {
    it('Så returnerer den verdien som er satt der', () => {
      const HN = {
        Rest: { __HashIsAuthorized__: undefined },
      };
      const originalWindowHN = global.window['HN'];
      global.window['HN'] = HN;
      const isAuth = hashIsAuthorized();
      expect(isAuth).toBeFalsy();
      global.window['HN'] = originalWindowHN;
    });
  });
});
