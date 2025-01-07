import { validateString } from '../validation-utils';

describe('Gitt at en string kun kan inneholde bokstav, spesifiserte tegn  og suspekt innhold', () => {
  describe('Når det sendes en string med suspekt innhold', () => {
    it('Så returnerer den true', () => {
      const isValid = validateString('<test>', ['disable-suspect', 'letter'], ['<', '>']);
      expect(isValid).toEqual(true);
    });
  });
});

describe('Gitt at en string kun kan inneholde bokstav og spesifiserte tegn', () => {
  describe('Når det sendes en string med suspekt innhold', () => {
    it('Så returnerer den alle ugyldige tegn', () => {
      const invalidChars = validateString('<test>', ['letter'], ['<', '>']);
      expect(invalidChars).toEqual('<test>');
    });
  });
});

describe('Gitt at en string kun skal inneholde bokstav, tall og mellomrom', () => {
  describe('Når det sendes en gyldig string', () => {
    it('Så returnerer den true', () => {
      const isValid = validateString('test 1234', ['letter', 'digit', 'whitespace']);
      expect(isValid).toEqual(true);
    });
  });
  describe('Når det sendes en string som inkluderer tegnsetting', () => {
    it('Så returnerer den alle ugyldige tegn', () => {
      const invalidChars = validateString('test 1234/*', ['letter', 'digit', 'whitespace']);
      expect(invalidChars).toEqual('/, *');
    });
  });
});

describe('Gitt at en string kun skal inneholde kontrolltegn', () => {
  describe('Når det sendes en gyldig string', () => {
    it('Så returnerer den true', () => {
      const isValid = validateString('\x07', ['control']);
      expect(isValid).toEqual(true);
    });
  });
  describe('Når det sendes en string som inkluderer tall', () => {
    it('Så returnerer den alle tall', () => {
      const invalidChars = validateString('12\x07', ['control']);
      expect(invalidChars).toEqual('1, 2');
    });
  });
});

describe('Gitt at en string kun skal inneholde tegnsetting og skilletegn', () => {
  describe('Når det sendes en gyldig string', () => {
    it('Så returnerer den true', () => {
      const isValid = validateString('! .', ['punctuation', 'separator']);
      expect(isValid).toEqual(true);
    });
  });
  describe('Når det sendes en string som inkluderer tall', () => {
    it('Så returnerer den alle tall', () => {
      const invalidChars = validateString('! . 12', ['punctuation', 'separator']);
      expect(invalidChars).toEqual('1, 2');
    });
  });
});
