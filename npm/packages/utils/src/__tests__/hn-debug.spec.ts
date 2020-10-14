import { isDebug } from '../hn-debug';

describe('Debug', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('Gitt at isDebug kalles', () => {
    describe('Når __Debug__ er definert i HN objektet', () => {
      it('Så returnerer den verdien som er satt der', () => {
        const HN = {
          Debug: 'true',
        };
        const originalWindowHN = global.window['HN'];
        global.window['HN'] = HN;
        const debug = isDebug();
        expect(debug).toBeTruthy();
        global.window['HN'] = originalWindowHN;
      });
    });
  });

  describe('Når __Debug__ er undefined i HN objektet', () => {
    it('Så returnerer den verdien som er satt der', () => {
      const HN = {
        Debug: undefined,
      };
      const originalWindowHN = global.window['HN'];
      global.window['HN'] = HN;
      const debug = isDebug();
      expect(debug).toBeFalsy();
      global.window['HN'] = originalWindowHN;
    });
  });
});
