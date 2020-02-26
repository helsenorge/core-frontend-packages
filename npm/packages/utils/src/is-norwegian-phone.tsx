export function isNorwegianPhoneNumber(phoneNumber: string | number): boolean {
  const regexString = "^(0047|[+]47)?[4|9][0-9]{7,7}$";
  return new RegExp(regexString, "i").test(
    phoneNumber.toString().replace(new RegExp(" ", "g"), "")
  );
}
