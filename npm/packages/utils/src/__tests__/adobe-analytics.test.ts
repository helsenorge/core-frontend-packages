import {
  FiltersTrackType,
  trackArticleTab,
  trackSelfService,
  ArticleTab,
  trackSelfServiceIntent,
  SelfService,
  trackFilters,
  Filters,
  trackServiceAlert,
  trackUnreadAlert,
  trackUnreadMessage,
  User,
  SelfServiceTrackType,
  trackUrlChange,
  Page,
  removeNamesAndOtherIds,
  Search,
  trackSearch,
  trackPagePartner,
  trackSearchThrough,
  trackDonorCard,
  trackProfileInteraction,
  DonorCard,
  trackError,
  Error,
  setValueForSelectedUser
} from "../adobe-analytics";

describe("Adobeanalytics", () => {
  let trackText: string;
  beforeEach(() => {
    trackText = "";
    window._satellite = {
      track: (s: string) => {
        trackText = s;
      }
    };
    window.digitalData = {
      page: {
        pageInfo: {}
      }
    };
  });

  it("Should track self service", () => {
    // Start
    let trackType: SelfServiceTrackType = "start";
    trackSelfService(trackType, "SelfService1", "Step1", 1);
    expect(window.digitalData.selfService as SelfService).toMatchSnapshot();
    expect(trackText).toMatchSnapshot();
    // Funnel
    trackType = "funnel";
    trackSelfService(trackType, "SelfService2", "Step2", 2);
    expect(window.digitalData.selfService as SelfService).toMatchSnapshot();
    expect(trackText).toMatchSnapshot();
    // Complete
    trackType = "complete";
    trackSelfService(trackType, "SelfService3", "Step3", 3);
    expect(window.digitalData.selfService as SelfService).toMatchSnapshot();
    expect(trackText).toMatchSnapshot();

    // Pasientreiser
    trackSelfService("complete", "SelfServicePasientreiser", "TestStep", 4, {
      pasientreiserApplication: "Standardsøknad",
      pasientreiserOnBehalfOf: "Pasient"
    });
    expect(window.digitalData.selfService as SelfService).toMatchSnapshot();

    trackSelfService("complete", "SelfServicePasientreiser2", "TestStep2", 4, {
      pasientreiserApplication: "Utvidet søknad",
      pasientreiserOnBehalfOf: "Foresatt"
    });
    expect(window.digitalData.selfService as SelfService).toMatchSnapshot();
  });

  it("Should track tabs", () => {
    const tabname = "tab1";
    trackArticleTab(tabname);
    expect((window.digitalData.articletab as ArticleTab).tabName).toBe(tabname);
    expect(trackText).toMatchSnapshot();
  });

  it("Should track SelfService Intent", () => {
    const selfServiceEngagementName = "engagementname";
    trackSelfServiceIntent(selfServiceEngagementName);
    expect(
      (window.digitalData.selfService as SelfService).selfServiceEngagementName
    ).toBe(selfServiceEngagementName);
    expect(trackText).toMatchSnapshot();
  });

  it("Should track filter usage", () => {
    const filterName = "filter1";
    const trackType: FiltersTrackType = "usage";
    trackFilters(filterName, trackType);
    expect((window.digitalData.filters as Filters).filterName).toBe(filterName);
    expect(
      (window.digitalData.filters as Filters).filterUsage
    ).toMatchSnapshot();
    expect(trackText).toMatchSnapshot();
  });

  it("Should track filter expand", () => {
    const filterName = "filter2";
    const trackType: FiltersTrackType = "expand";
    trackFilters(filterName, trackType);
    expect((window.digitalData.filters as Filters).filterName).toBe(filterName);
    expect(
      (window.digitalData.filters as Filters).filterExpand
    ).toMatchSnapshot();
    expect(trackText).toMatchSnapshot();
  });

  it("Should track Service alert", () => {
    trackServiceAlert(true);
    expect((window.digitalData.user as User).serviceAlert).toMatchSnapshot();
    trackServiceAlert(false);
    expect((window.digitalData.user as User).serviceAlert).toMatchSnapshot();
    expect(trackText).toMatchSnapshot();
  });

  it("Should track unread alert", () => {
    trackUnreadAlert(true);
    expect((window.digitalData.user as User).unReadAlerts).toBeTruthy();
    trackUnreadAlert(false);
    expect((window.digitalData.user as User).unReadAlerts).toBeFalsy();
  });

  it("Should track unread message", () => {
    trackUnreadMessage(true);
    expect((window.digitalData.user as User).unReadMessages).toBeTruthy();
    trackUnreadMessage(false);
    expect((window.digitalData.user as User).unReadMessages).toBeFalsy();
  });

  it("Should track page partner", () => {
    const partner = "partner";
    trackPagePartner(partner);
    expect((window.digitalData.page as Page).pageInfo).toBeDefined();
    if (window.digitalData.page && window.digitalData.page.pageInfo) {
      expect(window.digitalData.page.pageInfo.partner).toBe(partner);
    }
    expect(trackText).toMatchSnapshot();
  });

  it("Should track search", () => {
    const term = "test";
    const name = "name";
    let count = 10;
    trackSearch(term, name, count);
    expect((window.digitalData.search as Search).searchTerm).toBe(term);
    expect((window.digitalData.search as Search).searchType).toBe(name);
    expect((window.digitalData.search as Search).resultsCount).toBe(count);
    expect((window.digitalData.search as Search).searchCount).toBe("true");
    expect((window.digitalData.search as Search).nullResult).toBeUndefined();
    expect(trackText).toMatchSnapshot();

    count = 0;
    trackSearch(term, name, count);
    expect((window.digitalData.search as Search).searchTerm).toBe(term);
    expect((window.digitalData.search as Search).searchType).toBe(name);
    expect((window.digitalData.search as Search).resultsCount).toBe(count);
    expect((window.digitalData.search as Search).searchCount).toBe("true");
    expect((window.digitalData.search as Search).nullResult).toBe("true");
    expect(trackText).toMatchSnapshot();

    const position = 1;
    trackSearchThrough(position);
    expect((window.digitalData.search as Search).clickThrough).toBe("true");
    expect((window.digitalData.search as Search).searchposition).toBe(position);
    expect(trackText).toMatchSnapshot();
  });

  it("Should track Url change", () => {
    const url = "https://helsenorge.no/avtaler/avtale/1223312/endre";
    const path = "avtaler/avtale/1223312/endre";
    trackUrlChange(url, path);
    expect(window.digitalData.page as Page).toMatchSnapshot();
  });

  it("Should track empty Url change correctly", () => {
    trackUrlChange("", "");
    expect(window.digitalData.page as Page).toMatchSnapshot();
  });

  it("Remove name and other ids from url", () => {
    const url = "https://helsenorge.no/koordinator/";
    var s = removeNamesAndOtherIds(url);
    expect(s).toMatchSnapshot();
  });

  it("Should track donor card", () => {
    trackDonorCard(true);
    expect((window.digitalData.donorCard as DonorCard).smsAlert).toBe("true");
    expect(trackText).toMatchSnapshot();

    trackDonorCard(false);
    expect((window.digitalData.donorCard as DonorCard).smsAlert).toBe("false");
    expect(trackText).toMatchSnapshot();
  });

  it("Should track profile interaction", () => {
    trackProfileInteraction("test");
    expect((window.digitalData.user as User).profileInteraction).toBe("true");
    expect((window.digitalData.user as User).profileInteractionName).toBe(
      "test"
    );
    expect(trackText).toMatchSnapshot();
  });

  it("Should track error", () => {
    trackError("level1");
    expect(window.digitalData.error as Error).toMatchSnapshot();
    expect(trackText).toMatchSnapshot();

    trackError("level2");
    expect(window.digitalData.error as Error).toMatchSnapshot();
    expect(trackText).toMatchSnapshot();

    trackError("level3");
    expect(window.digitalData.error as Error).toMatchSnapshot();
    expect(trackText).toMatchSnapshot();
  });

  it("Should set value for selected user", () => {
    if (window.digitalData.page) {
      window.digitalData.page.user = undefined;
      setValueForSelectedUser();
      expect(window.digitalData.page.user).toEqual({
        onBehalfOf: "Eget bruk",
        role: "Eget bruk"
      });
    }
  });
});
