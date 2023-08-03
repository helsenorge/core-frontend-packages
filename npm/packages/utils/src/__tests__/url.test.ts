import { getUrlHostname } from '../url';

describe('getUrlHostname', () => {
  describe('Gitt at domene er www.helsenorge.no', () => {
    describe('Når getUrlHostname kalles ', () => {
      test('Så returnerer den www.helsenorge.no', () => {
        const result = getUrlHostname('https://www.helsenorge.no');
        expect(result).toBe('www.helsenorge.no');
      });
    });
  });
  describe('Gitt at url er ugyldig', () => {
    describe('Når getUrlHostname kalles', () => {
      test('Så returnerer den undefined', () => {
        const result = getUrlHostname('httpnrk.no');
        expect(result).toBeUndefined();
      });
    });
  });
});
