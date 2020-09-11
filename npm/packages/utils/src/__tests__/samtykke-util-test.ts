import {} from 'jest';
import {
  hasDigitaleHelsetjenesteSamtykke,
  hasPasientreiserSamtykke,
  getSamtykkeStatus,
  SamtykkeStatus,
  ikkeSamtykketTilHelsenorge,
  harSamtykket,
} from '../samtykke-util';
import { Samtykke, SamtykkeLevel } from '../types/entities';
import { PersonvernInnstillingDefinisjonGuids } from '../constants/personvernInnstillingDefinisjonIds';
import { setCurrentSamtykkeLevel } from '../samtykke-util-test-util';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    HN?: any;
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
  describe('Gitt at pasientreisersamtykke ligger i listen med samtykker', () => {
    it('Så skal hasPasientreiserSamtykke returnere true', () => {
      expect(hasPasientreiserSamtykke(samtykker)).toBe(true);
    });
  });
  describe('Gitt at DigitaleHelsetjenestesamtykke ligger i listen med samtykker', () => {
    it('Så skal DigitaleHelsetjenesteShould returnere true', () => {
      expect(hasDigitaleHelsetjenesteSamtykke(samtykker)).toBe(true);
    });
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

  describe('Gitt at pasientreisersamtykke som ligger i listen med samtykker ikke er aktiv', () => {
    it('Så skal hasPasientreiserSamtykke returnere false', () => {
      expect(hasPasientreiserSamtykke(samtykkerIkkeAktiv)).toBe(false);
    });
  });
  describe('Gitt at DigitaleHelsetjeneste som ligger i listen med samtykker ikke er aktiv', () => {
    it('Så skal hasDigitaleHelsetjeneste returnere false', () => {
      expect(hasDigitaleHelsetjenesteSamtykke(samtykkerIkkeAktiv)).toBe(false);
    });
  });

  const samtykkeOpplysninger = {
    PersonvernInnstillingDefinisjonGuid: PersonvernInnstillingDefinisjonGuids.InnsynIOpplysningerRegistrertOmMeg,
    ErAktiv: true,
  };
  const samtykkerOpplysninger: Array<Samtykke> = [samtykkeOpplysninger as Samtykke];
  describe('Gitt at pasientreisersamtykke ikke ligger i listen med samtykker ', () => {
    it('Så skal hasPasientreiserSamtykke returnere false', () => {
      expect(hasPasientreiserSamtykke(samtykkerOpplysninger)).toBe(false);
    });
  });
  describe('Gitt at DigitaleHelsetjeneste ikke ligger i listen med samtykker', () => {
    it('Så skal hasDigitaleHelsetjeneste returnere false', () => {
      expect(hasDigitaleHelsetjenesteSamtykke(samtykkerOpplysninger)).toBe(false);
    });
  });

  describe('Når harSamtykket kalles', () => {
    it('Så skal det returneres true hvis samtykket ligger i listen med samtykker som blir sendt med som parameter', () => {
      expect(harSamtykket(PersonvernInnstillingDefinisjonGuids.Pasientreiser, [samtykkePasientreiser as Samtykke])).toBe(true);
    });

    it('Så skal det returneres false hvis samtykket ikke ligger i listen med samtykker som blir sendt med som parameter', () => {
      expect(harSamtykket(PersonvernInnstillingDefinisjonGuids.Pasientreiser, [samtykkeDigitaleHelsetjenester as Samtykke])).toBe(false);
    });

    it('Så skal det returneres true hvis det ikke sendes med samtykker og samtykket ligger i global state', () => {
      const originalSamtykker = window.HN.Commands.__GetTjenesterMedTilgang__.Samtykker;
      window.HN.Commands.__GetTjenesterMedTilgang__.Samtykker = [samtykkeDigitaleHelsetjenester];

      expect(harSamtykket(PersonvernInnstillingDefinisjonGuids.DigitalHelsetjeneste)).toBe(true);
      window.HN.Commands.__GetTjenesterMedTilgang__.Samtykker = originalSamtykker;
    });

    it('Så  skal det returneres false hvis det ikke sendes med samtykker og samtykket ikke ligger i global state', () => {
      const originalSamtykker = window.HN.Commands.__GetTjenesterMedTilgang__.Samtykker;
      window.HN.Commands.__GetTjenesterMedTilgang__.Samtykker = [samtykkePasientreiser];

      expect(harSamtykket(PersonvernInnstillingDefinisjonGuids.DigitalHelsetjeneste)).toBe(false);
      window.HN.Commands.__GetTjenesterMedTilgang__.Samtykker = originalSamtykker;
    });
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
  window.HN.Commands.__GetTjenesterMedTilgang__ = window.HN.Commands.__GetTjenesterMedTilgang__ || {};
  describe('Når innbygger ikke har samtykket til helsenorge', () => {
    it('Så forteller hjelpefunksjonen at innbygger ikke har samtykket', () => {
      window.HN.Commands.__GetTjenesterMedTilgang__.Samtykker = [];
      expect(ikkeSamtykketTilHelsenorge()).toBe(true);
    });
  });
  describe('Når innbygger har samtykket fullt til helsenorge', () => {
    it('Så forteller hjelpefunksjonen at innbygger har samtykket', () => {
      setCurrentSamtykkeLevel(SamtykkeLevel.Helsetjeneste);
      expect(ikkeSamtykketTilHelsenorge()).toBe(false);
    });
  });
  describe('Når innbygger har samtykket med kun Journalinnsyn til helsenorge', () => {
    it('Så forteller hjelpefunksjonen at innbygger har samtykket', () => {
      setCurrentSamtykkeLevel(SamtykkeLevel.Journalinnsyn);
      expect(ikkeSamtykketTilHelsenorge()).toBe(false);
    });
  });
  describe('Når innbygger har samtykket kun til registerinnsyn til helsenorge', () => {
    it('Så forteller hjelpefunksjonen at innbygger har samtykket', () => {
      setCurrentSamtykkeLevel(SamtykkeLevel.Registerinnsyn);
      expect(ikkeSamtykketTilHelsenorge()).toBe(false);
    });
  });
});
