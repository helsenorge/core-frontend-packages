import { vi, describe, it, expect } from 'vitest';

import * as stringFunctions from '../string-utils';

describe('String-utils', () => {
  afterAll(() => {
    vi.clearAllMocks();
  });
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

  describe('Gitt at invalidNodes skal sjekkes', () => {
    describe('Når det sendes en streng med html tags', () => {
      it('Så returnerer den alle tagsene', () => {
        const s = stringFunctions.invalidNodes('This is a <strong>test</strong> with html <span>tags</span>');
        expect(s).toHaveLength(4);
        expect(s[0]).toEqual('<strong>');
        expect(s[1]).toEqual('</strong>');
        expect(s[2]).toEqual('<span>');
        expect(s[3]).toEqual('</span>');
      });
    });

    describe('Når det sendes en streng med html tags som named character entities', () => {
      it('Så returnerer den alle tagsene', () => {
        const s = stringFunctions.invalidNodes('This is a &lt;strong&gt;test&lt;/strong&gt; with html &lt;span&gt;tags&lt;/span&gt;');
        expect(s).toHaveLength(4);
        expect(s[0]).toEqual('<strong>');
        expect(s[1]).toEqual('</strong>');
        expect(s[2]).toEqual('<span>');
        expect(s[3]).toEqual('</span>');
      });
    });

    describe('Når det sendes en streng med html tags som named character entities', () => {
      it('Så returnerer den alle tagsene', () => {
        const s = stringFunctions.invalidNodes('xxx&lt; img src=x onerror=alert(1)&gt;');
        expect(s).toHaveLength(1);
        expect(s[0]).toEqual('< img src=x onerror=alert(1)>');
      });
    });

    describe('Når det sendes en streng med html tags som hex entities', () => {
      it('Så returnerer den alle tagsene', () => {
        const s = stringFunctions.invalidNodes(
          '&#x78;&#x78;&#x78;&#x78;&#x26;&#x6c;&#x74;&#x3b;&#x20;&#x49;&#x4d;&#x47;&#x20;&#x53;&#x52;&#x43;&#x3d;&#x78;&#x20;&#x6f;&#x6e;&#x65;&#x72;&#x72;&#x6f;&#x72;&#x3d;&#x61;&#x6c;&#x65;&#x72;&#x74;&#x28;&#x31;&#x29;&#x20;&#x26;&#x67;&#x74;&#x3b;'
        );
        expect(s).toHaveLength(1);
        expect(s[0]).toEqual('< IMG SRC=x onerror=alert(1) >');
      });
    });
  });

  describe('Gitt at isValid skal sjekkes', () => {
    describe('Når det sendes en streng med html tags', () => {
      it('Så returnerer den false', () => {
        const s = stringFunctions.isValid('This is a <strong>test</strong> with html <span>tags</span>');
        expect(s).toBeFalsy();
      });
    });
    describe('Når det sendes en streng med html tags som named character entities', () => {
      it('Så returnerer den false', () => {
        const s = stringFunctions.isValid('xxx&lt; img src=x onerror=alert(1)&gt;');
        expect(s).toBeFalsy();
      });
    });
    describe('Når det sendes en streng med html tags som hex entities', () => {
      it('Så returnerer den false', () => {
        const s = stringFunctions.isValid(
          '&#x78;&#x78;&#x78;&#x78;&#x26;&#x6c;&#x74;&#x3b;&#x20;&#x49;&#x4d;&#x47;&#x20;&#x53;&#x52;&#x43;&#x3d;&#x78;&#x20;&#x6f;&#x6e;&#x65;&#x72;&#x72;&#x6f;&#x72;&#x3d;&#x61;&#x6c;&#x65;&#x72;&#x74;&#x28;&#x31;&#x29;&#x20;&#x26;&#x67;&#x74;&#x3b;'
        );
        expect(s).toBeFalsy();
      });
    });
    describe('Når det sendes en streng med emoticons', () => {
      it('Så returnerer den false', () => {
        const s = stringFunctions.isValid('This is a smiley \u2700');
        expect(s).toBeFalsy();
      });
    });
    describe('Når det sendes en vanlig streng', () => {
      it('Så returnerer den true', () => {
        const s = stringFunctions.isValid('This is a normal string');
        expect(s).toBeTruthy();
      });
    });
  });

  // Nye tester for safeStableStringify
  describe('Gitt at safeStableStringify skal sjekkes', () => {
    describe('Når et objekt har nøkler i tilfeldig rekkefølge', () => {
      it('Så blir nøkler sortert alfabetisk i output', () => {
        const obj1 = { b: 1, a: 2 } as const;
        const str = stringFunctions.safeStableStringify(obj1);
        expect(str).toEqual('{"a":2,"b":1}');
      });
    });

    describe('Når objektet er nøstet', () => {
      it('Så blir alle nivåer sortert forutsigbart', () => {
        const obj = { b: { y: 2, x: 1 }, a: { b: 1, a: 2 } } as const;
        const str = stringFunctions.safeStableStringify(obj);
        expect(str).toEqual('{"a":{"a":2,"b":1},"b":{"x":1,"y":2}}');
      });
    });

    describe('Når objektet inneholder arrays', () => {
      it('Så beholdes rekkefølgen i arrays og objekter inni sorteres', () => {
        const obj = { a: [{ b: 2, a: 1 }, 3] };
        const str = stringFunctions.safeStableStringify(obj);
        expect(str).toEqual('{"a":[{"a":1,"b":2},3]}');
      });
    });

    describe('Når objektet inneholder sirkulære referanser', () => {
      it('Så ignoreres sirkulære referanser trygt', () => {
        const root: any = { name: 'root' };
        root.self = root; // sirkulær
        const str = stringFunctions.safeStableStringify(root);
        expect(str).toEqual('{"name":"root"}');
      });
    });

    describe('Når to like objekter har ulik nøkkelrekkefølge', () => {
      it('Så gir de lik serialisering', () => {
        const o1 = { z: 1, a: 2, m: 3 };
        const o2 = { a: 2, m: 3, z: 1 };
        const s1 = stringFunctions.safeStableStringify(o1);
        const s2 = stringFunctions.safeStableStringify(o2);
        expect(s1).toEqual(s2);
      });
    });

    describe('Når det sendes primitive verdier', () => {
      it('Så blir de serialisert på samme måte som JSON.stringify', () => {
        expect(stringFunctions.safeStableStringify('abc')).toEqual(JSON.stringify('abc'));
        expect(stringFunctions.safeStableStringify(42)).toEqual(JSON.stringify(42));
        expect(stringFunctions.safeStableStringify(true)).toEqual(JSON.stringify(true));
        expect(stringFunctions.safeStableStringify(null as unknown as any)).toEqual(JSON.stringify(null));
      });
    });
  });
});
