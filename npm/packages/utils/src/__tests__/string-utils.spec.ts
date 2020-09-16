import * as stringFunctions from '../string-utils';

describe('String-utils', () => {
  describe('Gitt at isEmpty skal sjekkes', () => {
    describe('Når det sendes en tom string', () => {
      it('Så returnerer den true', () => {
        const s = stringFunctions.isEmpty('');
        expect(s).toBeTruthy();
      });
    });
    describe('Når det sendes undefined', () => {
      it('Så returnerer den true', () => {
        const s = stringFunctions.isEmpty(undefined);
        expect(s).toBeTruthy();
      });
    });
    describe('Når det sendes null', () => {
      it('Så returnerer den true', () => {
        const s = stringFunctions.isEmpty(null);
        expect(s).toBeTruthy();
      });
    });
    describe('Når det sendes en streng', () => {
      it('Så returnerer den false', () => {
        const s = stringFunctions.isEmpty('test');
        expect(s).toBeFalsy();
      });
    });
  });
  describe('Gitt at hasInvalidCharacters skal sjekkes', () => {
    describe('Når det sendes en vanlig streng', () => {
      it('Så returnerer den false', () => {
        const s = stringFunctions.hasInvalidCharacters('test ()');
        expect(s).toBeFalsy();
      });
    });
    describe('Når det sendes en streng med invalid characters', () => {
      it('Så returnerer den true', () => {
        const s1 = stringFunctions.hasInvalidCharacters('test!');
        expect(s1).toBeTruthy();
        const s2 = stringFunctions.hasInvalidCharacters('test%');
        expect(s2).toBeTruthy();
        const s3 = stringFunctions.hasInvalidCharacters('test;');
        expect(s3).toBeTruthy();
        const s4 = stringFunctions.hasInvalidCharacters('test]');
        expect(s4).toBeTruthy();
        const s5 = stringFunctions.hasInvalidCharacters('test$');
        expect(s5).toBeTruthy();
      });
    });
  });

  describe('Gitt at capitalize/decapitalize skal sjekkes etter hverandre', () => {
    describe('Når det sendes en vanlig streng', () => {
      it('Så returnerer den capitalized først og decapitalized etter', () => {
        const s = stringFunctions.capitalize('my sentence');
        expect(s).toEqual('My sentence');
        const s2 = stringFunctions.decapitalize(s);
        expect(s2).toEqual('my sentence');
      });
    });
  });

  describe('Gitt at isNorwegianPhoneNumber skal sjekkes etter hverandre', () => {
    describe('Når det sendes en streng med 8 null sifre', () => {
      it('Så returnerer den false', () => {
        const s = stringFunctions.isNorwegianPhoneNumber('00000000');
        expect(s).toBeFalsy();
      });
    });
    describe('Når det sendes en streng med blanding av bokstaver', () => {
      it('Så returnerer den false', () => {
        const s = stringFunctions.isNorwegianPhoneNumber('000vk0000');
        expect(s).toBeFalsy();
      });
    });
    describe('Når det sendes en streng eller number med flere eller mindre enn 8 sifre', () => {
      it('Så returnerer den true', () => {
        const s1 = stringFunctions.isNorwegianPhoneNumber('4050803000');
        expect(s1).toBeFalsy();
        const n1 = stringFunctions.isNorwegianPhoneNumber(4050803000);
        expect(n1).toBeFalsy();
        const s2 = stringFunctions.isNorwegianPhoneNumber('405080');
        expect(s2).toBeFalsy();
        const n2 = stringFunctions.isNorwegianPhoneNumber(405080);
        expect(n2).toBeFalsy();
      });
    });
    describe('Når det sendes en streng eller number med 8 sifre', () => {
      it('Så returnerer den true', () => {
        const s = stringFunctions.isNorwegianPhoneNumber('40508030');
        expect(s).toBeTruthy();
        const n = stringFunctions.isNorwegianPhoneNumber(40508030);
        expect(n).toBeTruthy();
      });
    });

    describe('Når det sendes en streng med 0047 eller +47 code', () => {
      it('Så returnerer den true', () => {
        const s = stringFunctions.isNorwegianPhoneNumber('004740508030');
        expect(s).toBeTruthy();
        const n = stringFunctions.isNorwegianPhoneNumber('+4740508030');
        expect(n).toBeTruthy();
      });
    });
  });

  describe('Gitt at format skal sjekkes', () => {
    describe('Når det sendes en streng med 2 placeholder', () => {
      it('Så er den riktig formattert', () => {
        const s = stringFunctions.format('my string {0} to format {1}', ['ipsum', 'lorem'], true);
        expect(s).toEqual('my string ipsum to format lorem');
      });
    });
  });
});
