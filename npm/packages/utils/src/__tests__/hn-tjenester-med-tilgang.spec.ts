import { harTilgangTilTjeneste } from '../hn-tjenester-med-tilgang';

describe('hn-tjenester-med-tilgang', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('Gitt at harTilgangTilTjeneste kalles', () => {
    describe('Når TjenesteTilgang er ikke definert i HN Commands objektet', () => {
      it('Så returnerer den false', () => {
        const HN = {
          Commands: { __GetTjenesterMedTilgang__: { TjenesteTilgang: undefined } },
        };
        const originalWindowHN = global.window['HN'];
        global.window['HN'] = HN;
        const tilgang = harTilgangTilTjeneste(1);
        expect(tilgang).toBeFalsy();
        global.window['HN'] = originalWindowHN;
      });
    });
    describe('Når TjenesteTilgang er definert med JA (1) i HN Commands objektet', () => {
      it('Så returnerer den true', () => {
        const HN = {
          Commands: {
            __GetTjenesterMedTilgang__: {
              TjenesteTilgang: [
                {
                  Tjeneste: 13,
                  Status: 1,
                },
              ],
            },
          },
        };
        const originalWindowHN = global.window['HN'];
        global.window['HN'] = HN;
        const tilgang = harTilgangTilTjeneste(13);
        expect(tilgang).toBeTruthy();
        global.window['HN'] = originalWindowHN;
      });
    });

    describe('Når TjenesteTilgang er definert med NEI (2) eller ikke finnes i HN Commands objektet', () => {
      it('Så returnerer den true', () => {
        const HN = {
          Commands: {
            __GetTjenesterMedTilgang__: {
              TjenesteTilgang: [
                {
                  Tjeneste: 14,
                  Status: 2,
                },
              ],
            },
          },
        };
        const originalWindowHN = global.window['HN'];
        global.window['HN'] = HN;
        const tilgang1 = harTilgangTilTjeneste(999);
        expect(tilgang1).toBeFalsy();
        const tilgang2 = harTilgangTilTjeneste(14);
        expect(tilgang2).toBeFalsy();
        global.window['HN'] = originalWindowHN;
      });
    });
  });
});
