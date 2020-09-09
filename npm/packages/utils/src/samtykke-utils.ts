import { PersonvernInnstillingDefinisjonGuids } from './constants/personvernInnstillingDefinisjonIds';
import { Samtykke, SamtykkeLevel, TjenesteTilgang } from './types/entities';
import {
  getSamtykkekonverteringInformert,
  getRequiredSamtykkeLevel,
  getErRepresentasjon,
  getErOrdinaerAnalogFullmakt,
  getErMellom12Og16,
} from './hn-user';

window.HN = window.HN || {};
window.HN.Commands = window.HN.Commands || {};

export enum SamtykkeStatus {
  Default = 0,
  NyBruker = 1,
  ReprNyBruker = 2,
  Dialog = 3,
  Bruksvilkar = 4,
  ErMellom12Og16 = 5,
}

/**
 * Sjekker ...
 * @param samtykker ...
 */
export const hasDigitaleHelsetjenesteSamtykke = (samtykker: Samtykke[]): boolean | undefined => {
  if (samtykker) {
    return samtykker.some(
      s => s.PersonvernInnstillingDefinisjonGuid.toUpperCase() === PersonvernInnstillingDefinisjonGuids.DigitalHelsetjeneste && s.ErAktiv
    );
  }
};

/**
 * Sjekker ...
 * @param samtykker ...
 */
export const hasPasientreiserSamtykke = (samtykker: Samtykke[]): boolean | undefined => {
  if (samtykker) {
    return samtykker.some(
      s => s.PersonvernInnstillingDefinisjonGuid.toUpperCase() === PersonvernInnstillingDefinisjonGuids.Pasientreiser && s.ErAktiv
    );
  }
};

/**
 * Sjekker ...
 */
export const getSamtykker = (): Array<Samtykke> => {
  if (window.HN.Commands.__GetTjenesterMedTilgang__ !== undefined && window.HN.Commands.__GetTjenesterMedTilgang__ !== null) {
    return window.HN.Commands.__GetTjenesterMedTilgang__.Samtykker;
  }
  return [];
};

/**
 * Sjekker ...
 * @param guid ...
 * @param samtykker ...
 */
export const harSamtykket = (guid: PersonvernInnstillingDefinisjonGuids, samtykker: Array<Samtykke> | undefined = undefined): boolean => {
  samtykker = samtykker || getSamtykker();
  if (samtykker.length === 0) {
    return false;
  }
  return (
    samtykker.findIndex(samtykke => {
      return samtykke.PersonvernInnstillingDefinisjonGuid.toUpperCase() === guid.toUpperCase() && samtykke.ErAktiv;
    }) > -1
  );
};

/**
 * Sjekker ...
 */
export const getSamtykkeStatus = (): SamtykkeStatus => {
  const erRepresentasjon = getErRepresentasjon();

  if (erRepresentasjon && getErOrdinaerAnalogFullmakt) {
    const level = getRequiredSamtykkeLevel();
    if (
      (level === SamtykkeLevel.Journalinnsyn && !harSamtykket(PersonvernInnstillingDefinisjonGuids.InnsynIPasientjournal)) ||
      (level === SamtykkeLevel.Helsetjeneste && !harSamtykket(PersonvernInnstillingDefinisjonGuids.DigitalHelsetjeneste))
    ) {
      return SamtykkeStatus.ReprNyBruker;
    }
  }

  const harBruksvilkar = harSamtykket(PersonvernInnstillingDefinisjonGuids.Bruksvilkar);
  const harDialog = harSamtykket(PersonvernInnstillingDefinisjonGuids.Pha);
  const harRegisterInnsyn = harSamtykket(PersonvernInnstillingDefinisjonGuids.InnsynIOpplysningerRegistrertOmMeg);
  if (harRegisterInnsyn) {
    if (!getSamtykkekonverteringInformert() && harDialog) {
      // Bruker opprettet før konvertering med samtykke PHA, men har ikke blitt informert. Vis info, ingen samtykkeflyt.
      return SamtykkeStatus.Dialog;
    }
  } else {
    if (!getErRepresentasjon() && getErMellom12Og16()) {
      // Bruker er mellom 12 og 16 og har foreldresamtykke, men forelder har glemt å samtykke til registerinnsyn for dem. Vis info, ingen samtykkeflyt.
      return SamtykkeStatus.ErMellom12Og16;
    }

    if (!getSamtykkekonverteringInformert() && harBruksvilkar) {
      // Bruker opprettet før konvertering uten samtykke PHA, og er ikke en bruker som har trukket samtykker etter konvertering. Vis info om fornying, og deretter samtykkeflyt.
      return SamtykkeStatus.Bruksvilkar;
    }
    // Ny bruker, eller trukket og vil gi på nytt. Vis info ved representasjon, ellers gå direkte til samtykkeflyt.
    return erRepresentasjon ? SamtykkeStatus.ReprNyBruker : SamtykkeStatus.NyBruker;
  }
  return SamtykkeStatus.Default;
};

/**
 * Sjekker ...
 */
export const getSamtykkeLevel = (): SamtykkeLevel => {
  if (harSamtykket(PersonvernInnstillingDefinisjonGuids.DigitalHelsetjeneste)) {
    return SamtykkeLevel.Helsetjeneste;
  }
  if (harSamtykket(PersonvernInnstillingDefinisjonGuids.InnsynIPasientjournal)) {
    return SamtykkeLevel.Journalinnsyn;
  }
  if (harSamtykket(PersonvernInnstillingDefinisjonGuids.InnsynIOpplysningerRegistrertOmMeg)) {
    return SamtykkeLevel.Registerinnsyn;
  }
  return SamtykkeLevel.None;
};

/**
 * Sjekker ...
 */
export const ikkeSamtykketTilHelsenorge = (): boolean => {
  const samtykkeLevel = getSamtykkeLevel();
  return samtykkeLevel === null || samtykkeLevel === SamtykkeLevel.None;
};

/**
 * Sjekker om brukeren har fullmakt
 * @param tjenesteTilgang id til tjenesten
 */
export const harFullmaktTilSamtykke = (tjenesteTilgang: Array<TjenesteTilgang>): boolean => {
  const fullmaktSamtykke = tjenesteTilgang.find((t: TjenesteTilgang) => {
    return t.Tjeneste === 13;
  });
  if (fullmaktSamtykke?.Status === 2) {
    return false;
  }
  return true;
};
