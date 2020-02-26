// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function harFullmaktTilSamtykke(tjenesteTilgang: any): boolean {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fullmaktSamtykke = tjenesteTilgang.find((t: any) => {
    return t.Tjeneste === 13;
  });
  if (fullmaktSamtykke.Status === 2) {
    return false;
  }
  return true;
}
