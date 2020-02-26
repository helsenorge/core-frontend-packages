import { isNorwegianPhoneNumber } from "../is-norwegian-phone";

describe("Norwegian phone numbers", () => {
  it("should allow valid Norwegian phone numbers and not invalid", () => {
    expect(isNorwegianPhoneNumber("90000000")).toEqual(true);
    expect(isNorwegianPhoneNumber("90 00 00 00")).toEqual(true);
    expect(isNorwegianPhoneNumber("40000000")).toEqual(true);
    expect(isNorwegianPhoneNumber("40 00 00 00")).toEqual(true);
    expect(isNorwegianPhoneNumber("+4790000000")).toEqual(true);
    expect(isNorwegianPhoneNumber("+47 90 00 00 00")).toEqual(true);
    expect(isNorwegianPhoneNumber("0047 90 00 00 00")).toEqual(true);

    expect(isNorwegianPhoneNumber("abc")).toEqual(false);
    expect(isNorwegianPhoneNumber("00000000")).toEqual(false);
    expect(isNorwegianPhoneNumber("00 00 00 00")).toEqual(false);
    expect(isNorwegianPhoneNumber("900")).toEqual(false);
    expect(isNorwegianPhoneNumber("900000000000")).toEqual(false);
    expect(isNorwegianPhoneNumber("400000000000")).toEqual(false);
  });
});
