import * as HNuserFunctions from '../hn-user';

describe('hn-user', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('Gitt at User er definert i HN objektet', () => {
    const HN = {
      User: {
        __LastLogOn__: 'dd.mm.yyyy',
        __Name__: 'userName',
        __RepresentedUser__: 'representedUser',
        __AvatarColor__: 3,
        __HasRepresentation__: true,
        __ShowWelcome__: true,
        __NewSocialSecurityNumber__: '000',
        __ShowBruksvilkar__: true,
        __Unsupported__: false,
        __ErRepresentasjon__: true,
        __SamtykkekonverteringInformert__: true,
        __ErMellom12Og16__: false,
        __IsNavigatingToSignOut__: false,
        __FullmaktEgenskaper__: {
          Analog: true,
          FullmaktType: 3,
        },
      },
    };

    describe('Når getLastLogOn kalles', () => {
      it('Så returnerer den verdien som er satt på __LastLogOn__', () => {
        const originalWindowHN = global.window['HN'];
        global.window['HN'] = HN;
        const user = HNuserFunctions.getLastLogOn();
        expect(user).toEqual('dd.mm.yyyy');
        global.window['HN'] = originalWindowHN;
      });
    });

    describe('Når getName kalles', () => {
      it('Så returnerer den verdien som er satt på __Name__', () => {
        const originalWindowHN = global.window['HN'];
        global.window['HN'] = HN;
        const user = HNuserFunctions.getName();
        expect(user).toEqual('userName');
        global.window['HN'] = originalWindowHN;
      });
    });

    describe('Når getRepresentedUser kalles', () => {
      it('Så returnerer den verdien som er satt på __RepresentedUser__', () => {
        const originalWindowHN = global.window['HN'];
        global.window['HN'] = HN;
        const user = HNuserFunctions.getRepresentedUser();
        expect(user).toEqual('representedUser');
        global.window['HN'] = originalWindowHN;
      });
    });

    describe('Når getAvatarColor kalles', () => {
      it('Så returnerer den verdien som er satt på __AvatarColor__', () => {
        const originalWindowHN = global.window['HN'];
        global.window['HN'] = HN;
        const user = HNuserFunctions.getAvatarColor();
        expect(user).toEqual(3);
        global.window['HN'] = originalWindowHN;
      });
    });

    describe('Når getHasRepresentation kalles', () => {
      it('Så returnerer den verdien som er satt på __HasRepresentation__', () => {
        const originalWindowHN = global.window['HN'];
        global.window['HN'] = HN;
        const user = HNuserFunctions.getHasRepresentation();
        expect(user).toBeTruthy();
        global.window['HN'] = originalWindowHN;
      });
    });

    describe('Når getShowWelcome kalles', () => {
      it('Så returnerer den verdien som er satt på __ShowWelcome__', () => {
        const originalWindowHN = global.window['HN'];
        global.window['HN'] = HN;
        const user = HNuserFunctions.getShowWelcome();
        expect(user).toBeTruthy();
        global.window['HN'] = originalWindowHN;
      });
    });

    describe('Når getNewSocialSecurityNumber kalles', () => {
      it('Så returnerer den verdien som er satt på __NewSocialSecurityNumber__', () => {
        const originalWindowHN = global.window['HN'];
        global.window['HN'] = HN;
        const user = HNuserFunctions.getNewSocialSecurityNumber();
        expect(user).toEqual('000');
        global.window['HN'] = originalWindowHN;
      });
    });

    describe('Når getShowBruksvilkar kalles', () => {
      it('Så returnerer den verdien som er satt på __ShowBruksvilkar__', () => {
        const originalWindowHN = global.window['HN'];
        global.window['HN'] = HN;
        const user = HNuserFunctions.getShowBruksvilkar();
        expect(user).toBeTruthy();
        global.window['HN'] = originalWindowHN;
      });
    });

    describe('Når getUnsupported kalles', () => {
      it('Så returnerer den verdien som er satt på __Unsupported__', () => {
        const originalWindowHN = global.window['HN'];
        global.window['HN'] = HN;
        const path = HNuserFunctions.getUnsupported();
        expect(path).toBeFalsy();
        global.window['HN'] = originalWindowHN;
      });
    });

    describe('Når getErRepresentasjon kalles', () => {
      it('Så returnerer den verdien som er satt på __ErRepresentasjon__', () => {
        const originalWindowHN = global.window['HN'];
        global.window['HN'] = HN;
        const user = HNuserFunctions.getErRepresentasjon();
        expect(user).toBeTruthy();
        global.window['HN'] = originalWindowHN;
      });
    });

    describe('Når getSamtykkekonverteringInformert kalles', () => {
      it('Så returnerer den verdien som er satt på __SamtykkekonverteringInformert__', () => {
        const originalWindowHN = global.window['HN'];
        global.window['HN'] = HN;
        const user = HNuserFunctions.getSamtykkekonverteringInformert();
        expect(user).toBeTruthy();
        global.window['HN'] = originalWindowHN;
      });
    });

    describe('Når setTempSamtykkekonverteringInformert kalles', () => {
      it('Så settes det riktig verdi på __SamtykkekonverteringInformert__', () => {
        const originalWindowHN = global.window['HN'];
        global.window['HN'] = HN;
        expect(HN.User.__SamtykkekonverteringInformert__).toBeTruthy();
        HNuserFunctions.setTempSamtykkekonverteringInformert(false);
        expect(HN.User.__SamtykkekonverteringInformert__).toBeFalsy();
        global.window['HN'] = originalWindowHN;
      });
    });

    describe('Når getErMellom12Og16 kalles', () => {
      it('Så returnerer den verdien som er satt på __ErMellom12Og16__', () => {
        const originalWindowHN = global.window['HN'];
        global.window['HN'] = HN;
        const user = HNuserFunctions.getErMellom12Og16();
        expect(user).toBeFalsy();
        global.window['HN'] = originalWindowHN;
      });
    });

    describe('Når brukeren er ikke mellom 12-16 og at erForeldrerepresentasjon12Pluss kalles', () => {
      it('Så returnerer den verdien som er satt på __HasRepresentation__', () => {
        const originalWindowHN = global.window['HN'];
        global.window['HN'] = HN;
        const user = HNuserFunctions.erForeldrerepresentasjon12Pluss();
        expect(user).toBeFalsy();
        global.window['HN'] = originalWindowHN;
      });
    });

    describe('Når brukeren har representasjon og er mellom 12-16, og at erForeldrerepresentasjon12Pluss kalles', () => {
      const HNCustom1216 = {
        User: {
          __ErMellom12Og16__: true,
          __HasRepresentation__: true,
          __FullmaktEgenskaper__: null,
        },
      };

      it('Så returnerer den true', () => {
        const originalWindowHN = global.window['HN'];
        global.window['HN'] = HNCustom1216;
        const user = HNuserFunctions.erForeldrerepresentasjon12Pluss();
        expect(user).toBeTruthy();
        global.window['HN'] = originalWindowHN;
      });
    });

    describe('Når getIsNavigatingToSignOut kalles', () => {
      it('Så returnerer den verdien som er satt på __IsNavigatingToSignOut__', () => {
        const originalWindowHN = global.window['HN'];
        global.window['HN'] = HN;
        const user = HNuserFunctions.getIsNavigatingToSignOut();
        expect(user).toBeFalsy();
        global.window['HN'] = originalWindowHN;
      });
    });

    describe('Når setIsNavigatingToSignOut kalles', () => {
      it('Så settes det riktig verdi på __IsNavigatingToSignOut__', () => {
        const originalWindowHN = global.window['HN'];
        global.window['HN'] = HN;
        expect(HN.User.__IsNavigatingToSignOut__).toBeFalsy();
        HNuserFunctions.setIsNavigatingToSignOut(true);
        expect(HN.User.__IsNavigatingToSignOut__).toBeTruthy();
        global.window['HN'] = originalWindowHN;
      });
    });

    describe('Når Fullmakten er av type Ordinær (2) og at getErOrdinaerAnalogFullmakt kalles', () => {
      it('Så returnerer den true', () => {
        const originalWindowHN = global.window['HN'];
        global.window['HN'] = HN;
        const user = HNuserFunctions.getErOrdinaerAnalogFullmakt();
        expect(user).toBeTruthy();
        global.window['HN'] = originalWindowHN;
      });
    });

    describe('Når Fullmakten er tom eller av en annen type, og at getErOrdinaerAnalogFullmakt kalles', () => {
      it('Så returnerer den false', () => {
        const HNCustomFullmakt = {
          User: {
            __FullmaktEgenskaper__: {
              Analog: false,
              FullmaktType: 1,
            },
          },
        };
        const originalWindowHN = global.window['HN'];
        global.window['HN'] = HNCustomFullmakt;
        let user = HNuserFunctions.getErOrdinaerAnalogFullmakt();
        expect(user).toBeFalsy();
        global.window['HN'].User.__FullmaktEgenskaper__ = null;
        user = HNuserFunctions.getErOrdinaerAnalogFullmakt();
        expect(user).toBeFalsy();
        global.window['HN'] = originalWindowHN;
      });
    });

    describe('Når Fullmakten er av type UtenSamtykkekompenanseOver12 (7) og at getErIkkeSamtykkeKompetentFullmakt kalles', () => {
      it('Så returnerer den true', () => {
        const HNCustomFullmakt7 = {
          User: {
            __FullmaktEgenskaper__: {
              Analog: true,
              FullmaktType: 7,
            },
          },
        };
        const originalWindowHN = global.window['HN'];
        global.window['HN'] = HNCustomFullmakt7;
        const user = HNuserFunctions.getErIkkeSamtykkeKompetentFullmakt();
        expect(user).toBeTruthy();
        global.window['HN'] = originalWindowHN;
      });
    });

    describe('Når Fullmakten er tom eller av en annen type, og at getErIkkeSamtykkeKompetentFullmakt kalles', () => {
      it('Så returnerer den false', () => {
        const HNCustomFullmakt = {
          User: {
            __FullmaktEgenskaper__: {
              Analog: false,
              FullmaktType: 2,
            },
          },
        };
        const originalWindowHN = global.window['HN'];
        global.window['HN'] = HNCustomFullmakt;
        let user = HNuserFunctions.getErIkkeSamtykkeKompetentFullmakt();
        expect(user).toBeFalsy();
        global.window['HN'].User.__FullmaktEgenskaper__ = null;
        user = HNuserFunctions.getErIkkeSamtykkeKompetentFullmakt();
        expect(user).toBeFalsy();
        global.window['HN'] = originalWindowHN;
      });
    });
  });
});
