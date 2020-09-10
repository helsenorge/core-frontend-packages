import * as HNpageFunctions from '../hn-page';

describe('hn-page', () => {
  describe('Gitt at getPath kalles', () => {
    describe('Når __Path__ er definert i HN Page objektet', () => {
      it('Så returnerer den verdien som er satt der', () => {
        const HN = {
          Page: { __Path__: 'path' },
        };
        const originalWindowHN = global.window['HN'];
        global.window['HN'] = HN;
        const path = HNpageFunctions.getPath();
        expect(path).toEqual('path');
        global.window['HN'] = originalWindowHN;
      });
    });
  });

  describe('Gitt at getVersion kalles', () => {
    describe('Når __Version__ er definert i HN Page objektet', () => {
      it('Så returnerer den verdien som er satt der', () => {
        const HN = {
          Page: { __Version__: 'version' },
        };
        const originalWindowHN = global.window['HN'];
        global.window['HN'] = HN;
        const version = HNpageFunctions.getVersion();
        expect(version).toEqual('version');
        global.window['HN'] = originalWindowHN;
      });
    });
  });

  describe('Gitt at getAssets kalles', () => {
    describe('Når __Assets__ er definert i HN Page objektet', () => {
      it('Så returnerer den verdien som er satt der', () => {
        const HN = {
          Page: { __Assets__: 'assets' },
        };
        const originalWindowHN = global.window['HN'];
        global.window['HN'] = HN;
        const assets = HNpageFunctions.getAssets();
        expect(assets).toEqual('assets');
        global.window['HN'] = originalWindowHN;
      });
    });
  });

  describe('Gitt at getAssetsUrl kalles', () => {
    describe('Når __Assets__ er undefined i HN Page objektet', () => {
      it('Så returnerer den en tom streng', () => {
        const HN = {
          Page: { __Assets__: undefined },
        };
        const originalWindowHN = global.window['HN'];
        global.window['HN'] = HN;
        const assets = HNpageFunctions.getAssetsUrl();
        expect(assets).toEqual('');
        global.window['HN'] = originalWindowHN;
      });
    });
  });

  describe('Gitt at setPath kalles', () => {
    describe('Når __Path__ er undefined i HN Page objektet og at en settes på nytt', () => {
      it('Så returnerer den nye verdien som ble satt', () => {
        const HN = {
          Page: { __Path__: undefined },
        };
        const originalWindowHN = global.window['HN'];
        global.window['HN'] = HN;
        const oldPath = HNpageFunctions.getPath();
        expect(oldPath).toEqual(undefined);
        HNpageFunctions.setPath('path');
        const path = HNpageFunctions.getPath();
        expect(path).toEqual('path');
        global.window['HN'] = originalWindowHN;
      });
    });
  });

  describe('Gitt at HN Queue ikke finnes', () => {
    describe('Når register og registerBlock kalles', () => {
      it('Så kalles callback functionen og det opprettes en tom array på Queue', () => {
        const HN = {
          MinHelse: {},
        };
        const callbackMock = jest.fn();
        const originalWindowHN = global.window['HN'];
        global.window['HN'] = HN;

        HNpageFunctions.register(callbackMock);
        expect(callbackMock).toHaveBeenCalledTimes(1);
        HNpageFunctions.registerBlock(callbackMock);
        expect(callbackMock).toHaveBeenCalledTimes(2);
        expect(window.HN.MinHelse.Queue).toEqual([]);
        global.window['HN'] = originalWindowHN;
      });
    });
  });
  describe('Gitt at HN Queue finnes', () => {
    describe('Når register og registerBlock kalles', () => {
      it('Så settes callback functionen i Queue', () => {
        const HN = {
          MinHelse: { Queue: [] },
        };

        const callbackMock = jest.fn();
        const originalWindowHN = global.window['HN'];
        global.window['HN'] = HN;

        HNpageFunctions.register(callbackMock);
        expect(window.HN.MinHelse.Queue[0]).toEqual(callbackMock);
        HNpageFunctions.registerBlock(callbackMock);
        expect(window.HN.MinHelse.Queue.length).toEqual(2);
        expect(window.HN.MinHelse.Queue[1]).toEqual(callbackMock);

        global.window['HN'] = originalWindowHN;
      });
    });
  });
});
