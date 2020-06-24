import {} from 'jest';
import { hasDigitaleHelsetjenesteSamtykke, hasPasientreiserSamtykke, getSamtykkeStatus, SamtykkeStatus } from '../samtykke-util';
import { Samtykke } from '../generated-types/minhelseentities';
import { PersonvernInnstillingDefinisjonGuids } from '../constants/personvernInnstillingDefinisjonIds';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    HN: any;
  }
}
window.HN = window.HN || {};
window.HN.User = window.HN.User || {};
window.HN.Commands = window.HN.Commands || {};
window.HN.Commands.__GetTjenesterMedTilgang__ = window.HN.Commands.__GetTjenesterMedTilgang__ || {};
window.HN.Commands.__GetTjenesterMedTilgang__.Samtykker = window.HN.Commands.__GetTjenesterMedTilgang__.Samtykker || [];

describe('SamtykkeUtil', () => {
  const samtykkeDigitaleHelsetjenester = {
    PersonvernInnstillingDefinisjonGuid: PersonvernInnstillingDefinisjonGuids.DigitalHelsetjeneste,
    ErAktiv: true,
  };
  const samtykkePasientreiser = {
    PersonvernInnstillingDefinisjonGuid: PersonvernInnstillingDefinisjonGuids.Pasientreiser,
    ErAktiv: true,
  };
  const samtykker: Array<Samtykke> = [samtykkeDigitaleHelsetjenester as Samtykke, samtykkePasientreiser as Samtykke];
  it('Should have pasientreise samtykke', () => {
    expect(hasDigitaleHelsetjenesteSamtykke(samtykker)).toBe(true);
  });
  it('Should have digitale helsetjenester samtykke', () => {
    expect(hasPasientreiserSamtykke(samtykker)).toBe(true);
  });

  const samtykkeDigitaleHelsetjenesterIkkeAktiv = {
    PersonvernInnstillingDefinisjonGuid: PersonvernInnstillingDefinisjonGuids.DigitalHelsetjeneste,
    ErAktiv: false,
  };
  const samtykkePasientreiserIkkeAktiv = {
    PersonvernInnstillingDefinisjonGuid: PersonvernInnstillingDefinisjonGuids.Pasientreiser,
    ErAktiv: false,
  };
  const samtykkerIkkeAktiv: Array<Samtykke> = [
    samtykkeDigitaleHelsetjenesterIkkeAktiv as Samtykke,
    samtykkePasientreiserIkkeAktiv as Samtykke,
  ];
  it('Should not have pasientreise samtykke- not active', () => {
    expect(hasDigitaleHelsetjenesteSamtykke(samtykkerIkkeAktiv)).toBe(false);
  });
  it('Should not have digitale helsetjenester samtykke - not active', () => {
    expect(hasPasientreiserSamtykke(samtykkerIkkeAktiv)).toBe(false);
  });

  const samtykkeOpplysninger = {
    PersonvernInnstillingDefinisjonGuid: PersonvernInnstillingDefinisjonGuids.InnsynIOpplysningerRegistrertOmMeg,
    ErAktiv: true,
  };
  const samtykkerOpplysninger: Array<Samtykke> = [samtykkeOpplysninger as Samtykke];
  it('Should not have pasientreise samtykke', () => {
    expect(hasDigitaleHelsetjenesteSamtykke(samtykkerOpplysninger)).toBe(false);
  });
  it('Should not have digitale helsetjenester samtykke', () => {
    expect(hasPasientreiserSamtykke(samtykkerOpplysninger)).toBe(false);
  });

  describe('Gitt at samtykkestatus skal hentes', () => {
    describe('Gitt at get-samtykke-status kalles', () => {
      describe('Når innbygger er ny bruker', () => {
        it('Så skal status oppgi dette', () => {
          window.HN.User.__ErRepresentasjon__ = false;
          expect(getSamtykkeStatus()).toBe(SamtykkeStatus.NyBruker);
        });
      });
      describe('Når innbygger er ny bruker og representert', () => {
        it('Så skal status oppgi dette', () => {
          window.HN.User.__ErRepresentasjon__ = true;
          expect(getSamtykkeStatus()).toBe(SamtykkeStatus.ReprNyBruker);
        });
      });
      describe('Når Bruker opprettet før konvertering med samtykke PHA, men har ikke blitt informert.', () => {
        it('Så skal status oppgi dette, Vis info, ingen samtykkeflyt', () => {
          window.HN.User.__ErRepresentasjon__ = false;
          window.HN.User.__SamtykkekonverteringInformert__ = false;
          window.HN.Commands.__GetTjenesterMedTilgang__.Samtykker = [
            {
              PersonvernInnstillingDefinisjonGuid: PersonvernInnstillingDefinisjonGuids.InnsynIOpplysningerRegistrertOmMeg,
              ErAktiv: true,
            },
            {
              PersonvernInnstillingDefinisjonGuid: PersonvernInnstillingDefinisjonGuids.Pha,
              ErAktiv: true,
            },
          ];
          expect(getSamtykkeStatus()).toBe(SamtykkeStatus.Dialog);
        });
      });
      describe('Når Bruker er mellom 12 og 16', () => {
        it('Så skal status oppgi dette,', () => {
          window.HN.User.__ErRepresentasjon__ = false;
          window.HN.User.__ErMellom12Og16__ = true;
          window.HN.Commands.__GetTjenesterMedTilgang__.Samtykker = [
            {
              PersonvernInnstillingDefinisjonGuid: PersonvernInnstillingDefinisjonGuids.InnsynIOpplysningerRegistrertOmMeg,
              ErAktiv: false,
            },
          ];
          expect(getSamtykkeStatus()).toBe(SamtykkeStatus.ErMellom12Og16);
        });
      });
      describe('Når Bruker er mellom 12 og 16', () => {
        it('Så skal status oppgi dette,', () => {
          window.HN.User.__ErRepresentasjon__ = false;
          window.HN.User.__ErMellom12Og16__ = false;
          window.HN.Commands.__GetTjenesterMedTilgang__.Samtykker = [
            {
              PersonvernInnstillingDefinisjonGuid: PersonvernInnstillingDefinisjonGuids.Bruksvilkar,
              ErAktiv: true,
            },
          ];
          expect(getSamtykkeStatus()).toBe(SamtykkeStatus.Bruksvilkar);
        });
      });
    });
  });
});
