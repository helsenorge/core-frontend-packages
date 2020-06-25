import { SamtykkeLevel, StatusKodeType, PersonverninnstillingKategori } from './types/entities';
import { PersonvernInnstillingDefinisjonGuids } from './constants/personvernInnstillingDefinisjonIds';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    HN?: any;
  }
}

export function setSamtykke(definisionGuid: string, statusKode: StatusKodeType): void {
  const aktiv: boolean = statusKode === StatusKodeType.Samtykket;
  const statusType = aktiv ? 0 : 1;

  window.HN.Commands.__GetTjenesterMedTilgang__.Samtykker.push({
    Type: PersonverninnstillingKategori.Samtykke,
    PersonvernInnstillingDefinisjonGuid: definisionGuid,
    Opprettet: '2017-08-09T14:53:35',
    StatusType: statusType,
    SamtykketAvFornavn: 'Maryan Abdirahman Coldevin',
    SamtykketAvEtternavn: 'Carper-Rask Olsen Pettersen',
    RepresentasjonforholdType: 0,
    StatusKodeType: statusKode,
    ErAktiv: aktiv,
  });
}

export function setCurrentSamtykkeLevel(level: SamtykkeLevel): void {
  window.HN.Commands.__GetTjenesterMedTilgang__.Samtykker = [];
  switch (level) {
    case SamtykkeLevel.Helsetjeneste:
      setSamtykke(PersonvernInnstillingDefinisjonGuids.InnsynIOpplysningerRegistrertOmMeg, StatusKodeType.Samtykket);
      setSamtykke(PersonvernInnstillingDefinisjonGuids.InnsynIPasientjournal, StatusKodeType.Samtykket);
      setSamtykke(PersonvernInnstillingDefinisjonGuids.DigitalHelsetjeneste, StatusKodeType.Samtykket);
      break;
    case SamtykkeLevel.Journalinnsyn:
      setSamtykke(PersonvernInnstillingDefinisjonGuids.InnsynIOpplysningerRegistrertOmMeg, StatusKodeType.Samtykket);
      setSamtykke(PersonvernInnstillingDefinisjonGuids.InnsynIPasientjournal, StatusKodeType.Samtykket);
      break;
    case SamtykkeLevel.Registerinnsyn:
      setSamtykke(PersonvernInnstillingDefinisjonGuids.InnsynIOpplysningerRegistrertOmMeg, StatusKodeType.Samtykket);
      break;
  }
}
