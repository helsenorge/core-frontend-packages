import { link } from "../hn_proxy_service";

window.HN = window.HN || {};
window.HN.Rest = window.HN.Rest || {};
window.HN.Rest.__MinHelseUrl__ = "https://proxy.test.nhn.no";
window.HN.Rest.__AnonymousHash__ = "hash1";
window.HN.Rest.__AuthenticatedHash__ = "hash2";
window.HN.Rest.__TjenesteType__ = "tjeneste";
window.HN.Rest.__TimeStamp__ = "time";
window.HN.Rest.__HendelseLoggType__ = "logg";

describe("Gitt at en proxy link skal genereres", () => {
  describe("Når link ikke har noen ekstra request parameter", () => {
    it("Så skal link med headers som parameter returneres", () => {
      const fullUrl = link("MinHelse/testtest", "testProxyTest");
      expect(fullUrl).toBe(
        "https://proxy.test.nhn.no/proxy/testProxyTest/api/v1/MinHelse/testtest?HNAnonymousHash=hash1&HNAuthenticatedHash=hash2&HNTjeneste=tjeneste&HNTimeStamp=time&X-hn-hendelselogg=logg"
      );
    });
  });

  describe("Når parameter er string", () => {
    it("Så skal link med string som parameter returneres", () => {
      const params = {
        Sok: "fastlege"
      };
      const fullUrl = link("url", "p", params);
      expect(fullUrl).toBe(
        "https://proxy.test.nhn.no/proxy/p/api/v1/url?HNAnonymousHash=hash1&HNAuthenticatedHash=hash2&HNTjeneste=tjeneste&HNTimeStamp=time&X-hn-hendelselogg=logg&Sok=fastlege"
      );
    });
  });

  describe("Når parameter er number", () => {
    it("Så skal link med number som parameter returneres", () => {
      const params = {
        maxCount: 3
      };
      const fullUrl = link("url", "p", params);
      expect(fullUrl).toBe(
        "https://proxy.test.nhn.no/proxy/p/api/v1/url?HNAnonymousHash=hash1&HNAuthenticatedHash=hash2&HNTjeneste=tjeneste&HNTimeStamp=time&X-hn-hendelselogg=logg&maxCount=3"
      );
    });
  });

  describe("Når parameter er boolean", () => {
    it("Så skal link med boolean som parameter returneres", () => {
      const params = {
        VisLegerUtenVenteliste: true
      };
      const fullUrl = link("url", "p", params);
      expect(fullUrl).toBe(
        "https://proxy.test.nhn.no/proxy/p/api/v1/url?HNAnonymousHash=hash1&HNAuthenticatedHash=hash2&HNTjeneste=tjeneste&HNTimeStamp=time&X-hn-hendelselogg=logg&VisLegerUtenVenteliste=true"
      );
    });
  });

  describe("Når parameter er array med numbers (f. eks enums)", () => {
    it("Så skal link med flere parametere returneres", () => {
      const params = {
        Filtere: [1, 2, 4]
      };
      const fullUrl = link("url", "p", params);
      expect(fullUrl).toBe(
        "https://proxy.test.nhn.no/proxy/p/api/v1/url?HNAnonymousHash=hash1&HNAuthenticatedHash=hash2&HNTjeneste=tjeneste&HNTimeStamp=time&X-hn-hendelselogg=logg&Filtere=1&Filtere=2&Filtere=4"
      );
    });
  });

  describe("Når parameter er array med strings", () => {
    it("Så skal link med flere parametere returneres", () => {
      const params = {
        Filtere: ["a", "b", "c"]
      };
      const fullUrl = link("url", "p", params);
      expect(fullUrl).toBe(
        "https://proxy.test.nhn.no/proxy/p/api/v1/url?HNAnonymousHash=hash1&HNAuthenticatedHash=hash2&HNTjeneste=tjeneste&HNTimeStamp=time&X-hn-hendelselogg=logg&Filtere=a&Filtere=b&Filtere=c"
      );
    });
  });
});
