import { SamtykkeLevel, FullmaktType } from "../generated-types/minhelseenums";
import { FullmaktEgenskaper } from "../generated-types/minhelseentities";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let HN: any;

window.HN = window.HN || {};
window.HN.User = window.HN.User || {};

export function getLastLogOn(): string {
  return HN.User.__LastLogOn__;
}

export function getName(): string {
  return HN.User.__Name__;
}

export function getRepresentedUser(): string {
  return HN.User.__RepresentedUser__;
}

export function getAvatarColor(): number {
  return HN.User.__AvatarColor__;
}

export function getHasRepresentation(): boolean {
  return HN.User.__HasRepresentation__;
}

export function getShowWelcome(): boolean {
  return HN.User.__ShowWelcome__;
}

export function getNewSocialSecurityNumber(): boolean {
  return HN.User.__NewSocialSecurityNumber__;
}

export function getShowBruksvilkar(): boolean {
  return HN.User.__ShowBruksvilkar__;
}

export function getUnsupported(): boolean {
  return HN.User.__Unsupported__;
}

export function getErRepresentasjon(): boolean {
  return HN.User.__ErRepresentasjon__;
}

export function getSamtykkekonverteringInformert(): boolean {
  return HN.User.__SamtykkekonverteringInformert__;
}

export function getErMellom12Og16(): boolean {
  return HN.User.__ErMellom12Og16__;
}

export function erForeldrerepresentasjon12Pluss(): boolean {
  return (
    HN.User.__ErMellom12Og16__ &&
    HN.User.__FullmaktEgenskaper__ === null &&
    HN.User.__HasRepresentation__ === true
  );
}

export function setTempSamtykkekonverteringInformert(value: boolean): void {
  HN.User.__SamtykkekonverteringInformert__ = value;
}

export function getRequiredSamtykkeLevel(): SamtykkeLevel {
  return HN.User.__RequiredSamtykkeLevel__;
}

export function getIsNavigatingToSignOut(): SamtykkeLevel {
  return HN.User.__IsNavigatingToSignOut__;
}

export function setIsNavigatingToSignOut(value: boolean): void {
  HN.User.__IsNavigatingToSignOut__ = value;
}

export function getErOrdinaerAnalogFullmakt(): boolean {
  const egenskaper: FullmaktEgenskaper = HN.User.__FullmaktEgenskaper__;
  if (egenskaper && egenskaper.Analog) {
    if (egenskaper.FullmaktType === FullmaktType.OrdinaerFullmakt) return true;
  }
  return false;
}

export function getErIkkeSamtykkeKompetentFullmakt(): boolean {
  const egenskaper: FullmaktEgenskaper = HN.User.__FullmaktEgenskaper__;
  if (egenskaper && egenskaper.Analog) {
    if (egenskaper.FullmaktType === FullmaktType.UtenSamtykkekompenanseOver12)
      return true;
  }
  return false;
}
