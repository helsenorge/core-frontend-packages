import { getCookieDomainAndPath } from '../shared-cookies';
import '../__mocks__/mockWindow';

describe('Gitt at getCookieDomainAndPath kalles', () => {
  describe('Når hostname er www.helsenorge.no', () => {
    it('Så returneres domene=helsenorge.no og path=/', () => {
      window.location.hostname = 'www.helsenorge.no';
      const result = getCookieDomainAndPath();

      expect(result).toEqual('domain=helsenorge.no; path=/;');
    });
  });

  describe('Når hostname er tjenester.helsenorge.no', () => {
    it('Så returneres domene=helsenorge.no og path=/', () => {
      window.location.hostname = 'tjenester.helsenorge.no';
      const result = getCookieDomainAndPath();

      expect(result).toEqual('domain=helsenorge.no; path=/;');
    });
  });
});
