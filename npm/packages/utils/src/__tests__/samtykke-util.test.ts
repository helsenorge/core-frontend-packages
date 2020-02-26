import {
  hasDigitaleHelsetjenesteSamtykke,
  hasPasientreiserSamtykke
} from "../samtykke-util";
import { Samtykke } from "../../generated-types/MinHelseEntities";
import { PersonvernInnstillingDefinisjonGuids } from "@helsenorge/toolkit/constants/personvernInnstillingDefinisjonIds";

describe("SamtykkeUtil", () => {
  let samtykkeDigitaleHelsetjenester = {
    PersonvernInnstillingDefinisjonGuid:
      PersonvernInnstillingDefinisjonGuids.DigitalHelsetjeneste,
    ErAktiv: true
  };
  let samtykkePasientreiser = {
    PersonvernInnstillingDefinisjonGuid:
      PersonvernInnstillingDefinisjonGuids.Pasientreiser,
    ErAktiv: true
  };
  let samtykker: Array<Samtykke> = [
    samtykkeDigitaleHelsetjenester as Samtykke,
    samtykkePasientreiser as Samtykke
  ];
  it("Should have pasientreise samtykke", () => {
    expect(hasDigitaleHelsetjenesteSamtykke(samtykker)).toBe(true);
  });
  it("Should have digitale helsetjenester samtykke", () => {
    expect(hasPasientreiserSamtykke(samtykker)).toBe(true);
  });

  let samtykkeDigitaleHelsetjenesterIkkeAktiv = {
    PersonvernInnstillingDefinisjonGuid:
      PersonvernInnstillingDefinisjonGuids.DigitalHelsetjeneste,
    ErAktiv: false
  };
  let samtykkePasientreiserIkkeAktiv = {
    PersonvernInnstillingDefinisjonGuid:
      PersonvernInnstillingDefinisjonGuids.Pasientreiser,
    ErAktiv: false
  };
  let samtykkerIkkeAktiv: Array<Samtykke> = [
    samtykkeDigitaleHelsetjenesterIkkeAktiv as Samtykke,
    samtykkePasientreiserIkkeAktiv as Samtykke
  ];
  it("Should not have pasientreise samtykke- not active", () => {
    expect(hasDigitaleHelsetjenesteSamtykke(samtykkerIkkeAktiv)).toBe(false);
  });
  it("Should not have digitale helsetjenester samtykke - not active", () => {
    expect(hasPasientreiserSamtykke(samtykkerIkkeAktiv)).toBe(false);
  });

  let samtykkeOpplysninger = {
    PersonvernInnstillingDefinisjonGuid:
      PersonvernInnstillingDefinisjonGuids.InnsynIOpplysningerRegistrertOmMeg,
    ErAktiv: true
  };
  let samtykkerOpplysninger: Array<Samtykke> = [
    samtykkeOpplysninger as Samtykke
  ];
  it("Should not have pasientreise samtykke", () => {
    expect(hasDigitaleHelsetjenesteSamtykke(samtykkerOpplysninger)).toBe(false);
  });
  it("Should not have digitale helsetjenester samtykke", () => {
    expect(hasPasientreiserSamtykke(samtykkerOpplysninger)).toBe(false);
  });
});
