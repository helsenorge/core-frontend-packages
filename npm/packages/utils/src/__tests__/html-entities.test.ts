import { unescapeHexEntities, unescapeHtmlEntities } from '../html-entities';

describe('gitt at unescapeHtmlEntities kalles', () => {
  describe('når input har html entities', () => {
    it('så returneres vanlig tekst', () => {
      const result = unescapeHtmlEntities('xxx&lt; img src=x onerror=alert(1)&gt;');

      expect(result).toEqual('xxx< img src=x onerror=alert(1)>');
    });
  });
});

describe('gitt at unescapeHexEntities kalles', () => {
  describe('når input har html entities', () => {
    it('så returneres vanlig tekst', () => {
      const result = unescapeHexEntities(
        '&#x78;&#x78;&#x78;&#x78;&#x26;&#x6c;&#x74;&#x3b;&#x20;&#x49;&#x4d;&#x47;&#x20;&#x53;&#x52;&#x43;&#x3d;&#x78;&#x20;&#x6f;&#x6e;&#x65;&#x72;&#x72;&#x6f;&#x72;&#x3d;&#x61;&#x6c;&#x65;&#x72;&#x74;&#x28;&#x31;&#x29;&#x20;&#x26;&#x67;&#x74;&#x3b;'
      );

      expect(result).toEqual('xxxx&lt; IMG SRC=x onerror=alert(1) &gt;');
    });
  });
});
