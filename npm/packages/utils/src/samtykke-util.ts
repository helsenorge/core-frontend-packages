import { PersonvernInnstillingDefinisjonGuids } from './constants/personvernInnstillingDefinisjonIds';
// @ts-ignore
import { Samtykke } from '../../../src/types/MinHelseEntities';

window.HN = window.HN || {};
window.HN.Commands = window.HN.Commands || {};

export function hasDigitaleHelsetjenesteSamtykke(samtykker: Samtykke[]) {
  if (samtykker) {
    return samtykker.some(
      s => s.PersonvernInnstillingDefinisjonGuid.toUpperCase() === PersonvernInnstillingDefinisjonGuids.DigitalHelsetjeneste && s.ErAktiv
    );
  }
}
export function hasPasientreiserSamtykke(samtykker: Samtykke[]) {
  if (samtykker) {
    return samtykker.some(
      s => s.PersonvernInnstillingDefinisjonGuid.toUpperCase() === PersonvernInnstillingDefinisjonGuids.Pasientreiser && s.ErAktiv
    );
  }
}

export function getSamtykker(): Array<Samtykke> {
  if (window.HN.Commands.__GetTjenesterMedTilgang__ !== undefined && window.HN.Commands.__GetTjenesterMedTilgang__ !== null) {
    return window.HN.Commands.__GetTjenesterMedTilgang__.Samtykker;
  }
  return [];
}

export function harSamtykket(guid: PersonvernInnstillingDefinisjonGuids): boolean {
  const samtykker = getSamtykker();
  if (samtykker.length === 0) {
    return false;
  }
  return (
    samtykker.findIndex(samtykke => {
      return samtykke.PersonvernInnstillingDefinisjonGuid.toUpperCase() === guid.toUpperCase() && samtykke.ErAktiv;
    }) > -1
  );
}
