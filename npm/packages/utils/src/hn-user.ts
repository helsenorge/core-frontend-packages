import { SamtykkeLevel, FullmaktType, FullmaktEgenskaper } from './types/entities';

declare let HN: {
  User: {
    __LastLogOn__: string;
    __Name__: string;
    __FirstName__: string;
    __RepresentedUser__: string;
    __AvatarColor__: number;
    __HasRepresentation__: boolean;
    __ShowWelcome__: boolean;
    __VisPersonvelger__: boolean;
    __NewSocialSecurityNumber__: string;
    __ShowBruksvilkar__: boolean;
    __Unsupported__: boolean;
    __ErRepresentasjon__: boolean;
    __SamtykkekonverteringInformert__: boolean;
    __RequiredSamtykkeLevel__: SamtykkeLevel;
    __ErMellom12Og16__: boolean;
    __IsNavigatingToSignOut__: boolean;
    __FullmaktEgenskaper__: FullmaktEgenskaper;
  };
};

window.HN = window.HN || {};
window.HN.User = window.HN.User || {};

/**
 * Returnerer verdien satt på HN User __LastLogOn__
 */
export const getLastLogOn = (): string => {
  return HN.User.__LastLogOn__;
};

/**
 * Returnerer verdien satt på HN User __Name__
 */
export const getName = (): string => {
  return HN.User.__Name__;
};

/**
 * Returnerer verdien satt på HN User __FirstName__
 */
export const getFirstName = (): string => {
  return HN.User.__FirstName__;
};

/**
 * Returnerer verdien satt på HN User __RepresentedUser__
 */
export const getRepresentedUser = (): string => {
  return HN.User.__RepresentedUser__;
};

/**
 * Returnerer verdien satt på HN User __AvatarColor__
 */
export const getAvatarColor = (): number => {
  return HN.User.__AvatarColor__;
};

/**
 * Returnerer verdien satt på HN User __HasRepresentation__
 */
export const getHasRepresentation = (): boolean => {
  return HN.User.__HasRepresentation__;
};

/**
 * Returnerer verdien satt på HN User __ShowWelcome__
 * DEPRECATED: Bruk getVisPersonvelger() i stedet
 */
export const getShowWelcome = (): boolean => {
  return HN.User.__ShowWelcome__;
};

/**
 * Returnerer verdien satt på HN User __VisPersonvelger__
 */
export const getVisPersonvelger = (): boolean => {
  return HN.User.__VisPersonvelger__;
};

/**
 * Setter verdien til HN User __VisPersonvelger__
 */
export const setVisPersonvelger = (visPersonvelger: boolean): void => {
  HN.User.__VisPersonvelger__ = visPersonvelger;
  // TODO: Kan fjernes når getShowWelcome/HN.User.__ShowWelcome__ fases ut
  HN.User.__ShowWelcome__ = visPersonvelger;
};

/**
 * Returnerer verdien satt på HN User __NewSocialSecurityNumber__
 */
export const getNewSocialSecurityNumber = (): string => {
  return HN.User.__NewSocialSecurityNumber__;
};

/**
 * Returnerer verdien satt på HN User __ShowBruksvilkar__
 */
export const getShowBruksvilkar = (): boolean => {
  return HN.User.__ShowBruksvilkar__;
};

/**
 * Returnerer verdien satt på HN User __Unsupported__
 */
export const getUnsupported = (): boolean => {
  return HN.User.__Unsupported__;
};

/**
 * Returnerer verdien satt på HN User __ErRepresentasjon__
 */
export const getErRepresentasjon = (): boolean => {
  return HN.User.__ErRepresentasjon__;
};

/**
 * Returnerer verdien satt på HN User __SamtykkekonverteringInformert__
 */
export const getSamtykkekonverteringInformert = (): boolean => {
  return HN.User.__SamtykkekonverteringInformert__;
};

/**
 * Setter ny verdi på HN User __SamtykkekonverteringInformert__
 * @param value - verdi som settes
 */
export const setTempSamtykkekonverteringInformert = (value: boolean): void => {
  HN.User.__SamtykkekonverteringInformert__ = value;
};

/**
 * Returnerer verdien satt på HN User __ErMellom12Og16__
 */
export const getErMellom12Og16 = (): boolean => {
  return HN.User.__ErMellom12Og16__;
};

/**
 * Returnerer true når __ErMellom12Og16__ og __HasRepresentation__ er true (og fullmakt er null)
 */
export const erForeldrerepresentasjon12Pluss = (): boolean => {
  return HN.User.__ErMellom12Og16__ && HN.User.__FullmaktEgenskaper__ === null && HN.User.__HasRepresentation__ === true;
};

/**
 * Returnerer verdien satt på HN User __RequiredSamtykkeLevel__
 */
export const getRequiredSamtykkeLevel = (): SamtykkeLevel => {
  return HN.User.__RequiredSamtykkeLevel__;
};

/**
 * Returnerer verdien satt på HN User __IsNavigatingToSignOut__
 */
export const getIsNavigatingToSignOut = (): boolean => {
  return HN.User.__IsNavigatingToSignOut__;
};

/**
 * Setter ny verdi på HN User __IsNavigatingToSignOut__
 * @param value - verdi som settes
 */
export const setIsNavigatingToSignOut = (value: boolean): void => {
  HN.User.__IsNavigatingToSignOut__ = value;
};

/**
 * Returnerer true når __FullmaktEgenskaper__ er analog og ordinær
 */
export const getErOrdinaerAnalogFullmakt = (): boolean => {
  const egenskaper: FullmaktEgenskaper = HN.User.__FullmaktEgenskaper__;
  if (egenskaper && egenskaper.Analog) {
    if (egenskaper.FullmaktType === FullmaktType.OrdinaerFullmakt) return true;
  }
  return false;
};

/**
 * Returnerer true når __FullmaktEgenskaper__ er analog og UtenSamtykkekompenanseOver12
 */
export const getErIkkeSamtykkeKompetentFullmakt = (): boolean => {
  const egenskaper: FullmaktEgenskaper = HN.User.__FullmaktEgenskaper__;
  if (egenskaper && egenskaper.Analog) {
    if (egenskaper.FullmaktType === FullmaktType.UtenSamtykkekompenanseOver12) return true;
  }
  return false;
};
