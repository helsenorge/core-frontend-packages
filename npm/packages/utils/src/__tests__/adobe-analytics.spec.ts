import * as adobeFunctions from "../adobe-analytics";

describe("Adobe-analytics", () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  const s = {
    track: (v: string) => {}
  };
  const originalSatellite = global.window["_satellite"];
  global.window["_satellite"] = s;

  describe("Gitt at trackSelfService kalles", () => {
    const digitalData = {
      selfService: {}
    };

    describe("Når SelfServiceTrackType er start", () => {
      it("Så er selfServiceStart satt til true og customProp sendt til trackeren", () => {
        const originalDigitalData = global.window["digitalData"];
        global.window["digitalData"] = digitalData;
        adobeFunctions.trackSelfService(
          "start",
          "satelliteName",
          "satelliteStep",
          1,
          { customProp: "customProp" }
        );
        expect(window.digitalData.selfService.selfServiceStart).toEqual("true");
        expect(window.digitalData.selfService.selfServiceName).toEqual(
          "satelliteName"
        );
        expect(window.digitalData.selfService.selfServiceFunnelStep).toEqual(
          "satelliteStep"
        );
        expect(
          window.digitalData.selfService.selfServiceFunnelStepNumber
        ).toEqual(1);
        expect(window.digitalData.selfService.customProp).toEqual("customProp");
        global.window["digitalData"] = originalDigitalData;
      });
    });

    describe("Når SelfServiceTrackType er funnel", () => {
      it("Så er selfServiceFunnel satt til true og customProp sendt til trackeren", () => {
        const originalDigitalData = global.window["digitalData"];
        global.window["digitalData"] = digitalData;
        adobeFunctions.trackSelfService(
          "funnel",
          "satelliteName",
          "satelliteStep",
          1,
          {}
        );
        expect(window.digitalData.selfService.selfServiceFunnel).toBeTruthy();
        global.window["digitalData"] = originalDigitalData;
      });
    });

    describe("Når SelfServiceTrackType er complete", () => {
      it("Så er selfServiceComplete satt til true og customProp sendt til trackeren", () => {
        const originalDigitalData = global.window["digitalData"];
        global.window["digitalData"] = digitalData;
        adobeFunctions.trackSelfService(
          "complete",
          "satelliteName",
          "satelliteStep",
          1,
          {}
        );
        expect(window.digitalData.selfService.selfServiceComplete).toBeTruthy();
        global.window["digitalData"] = originalDigitalData;
      });
    });

    describe("Når SelfServiceTrackType er cancel", () => {
      it("Så er selfServiceCancel satt til true og customProp sendt til trackeren", () => {
        const originalDigitalData = global.window["digitalData"];
        global.window["digitalData"] = digitalData;
        adobeFunctions.trackSelfService(
          "cancel",
          "satelliteName",
          "satelliteStep",
          1,
          {}
        );
        expect(window.digitalData.selfService.selfServiceCancel).toBeTruthy();
        global.window["digitalData"] = originalDigitalData;
      });
    });

    describe("Når SelfServiceTrackType er continue later", () => {
      it("Så er selfServiceContinueLater satt til true og customProp sendt til trackeren", () => {
        const originalDigitalData = global.window["digitalData"];
        global.window["digitalData"] = digitalData;
        adobeFunctions.trackSelfService(
          "continue later",
          "satelliteName",
          "satelliteStep",
          1,
          {}
        );
        expect(
          window.digitalData.selfService.selfServiceContinueLater
        ).toBeTruthy();
        global.window["digitalData"] = originalDigitalData;
      });
    });
  });

  describe("Gitt at removeNamesAndOtherIds kalles", () => {
    describe("Når strengen inneholder koordinator navn", () => {
      const s = "koordinator/jfsdkjfkdsjfks";
      it("Så er den korrigert", () => {
        const updatedString = adobeFunctions.removeNamesAndOtherIds(s);
        expect(updatedString).toEqual("koordinator");
      });
    });
    describe("Når strengen inneholder helsefagligkontakt navn", () => {
      const s = "helsefagligkontakt/jfsdkjfkdsjfks";
      it("Så er den korrigert", () => {
        const updatedString = adobeFunctions.removeNamesAndOtherIds(s);
        expect(updatedString).toEqual("helsefagligkontakt");
      });
    });
    describe("Når strengen inneholder kommune navn", () => {
      const s = "kommune/jfsdkjfkdsjfks";
      it("Så er den korrigert", () => {
        const updatedString = adobeFunctions.removeNamesAndOtherIds(s);
        expect(updatedString).toEqual("kommune");
      });
    });
    describe("Når strengen inneholder avtale navn", () => {
      const s = "avtale/jfsdkjfkdsjfks/0122";
      it("Så er den korrigert", () => {
        const updatedString = adobeFunctions.removeNamesAndOtherIds(s);
        expect(updatedString).toEqual("avtale/{id}/0122");
      });
    });
  });

  describe("Gitt at getRegisterName kalles", () => {
    describe("Når ingen av de strengene treffer", () => {
      const s = ["smthg", "random"];
      it("Så returnerer den tom streng", () => {
        const updatedString = adobeFunctions.getRegisterName(s);
        expect(updatedString).toEqual("");
      });
    });

    describe("Når strengen treffer", () => {
      it("Så returnerer den første del av dokument title", () => {
        const original = global.document["title"];
        global.document["title"] = "documenttitle-test";
        const s = ["helseregistre", "treff"];
        const updatedString = adobeFunctions.getRegisterName(s);
        expect(updatedString).toEqual("documenttitle");
        global.document["title"] = original;
      });
    });

    describe("Når strengen og dokument title treffer", () => {
      it("Så returnerer den riktig tittel", () => {
        const original = global.document["title"];
        global.document["title"] = "Innsyn i helseregistre";
        const s = ["helseregistre", "treff"];
        const updatedString = adobeFunctions.getRegisterName(s);
        expect(updatedString).toEqual(" helseregistre");
        global.document["title"] = original;
      });
    });
  });

  describe("Gitt at getContentGrouping kalles", () => {
    const d = {
      page: {
        category: {
          siteSection: "",
          siteSectionLevel2: "",
          contentType: "",
          registerName: "",
          contentGrouping: "contentGroupingString"
        }
      }
    };

    describe("Når strengene er tome", () => {
      const s = [];
      it("Så returnerer den tom streng", () => {
        const updatedString = adobeFunctions.getContentGrouping(d, s);
        expect(updatedString).toEqual("");
      });
    });

    describe("Når strengene inneholder noe tilfeldig", () => {
      const s = ["something", "random"];
      it("Så returnerer den første del av pathen", () => {
        const updatedString = adobeFunctions.getContentGrouping(d, s);
        expect(updatedString).toEqual("something");
      });
    });

    describe("Når strengene inneholder avtale", () => {
      const s = ["test", "avtale"];
      it("Så returnerer den timeavtaler", () => {
        const updatedString = adobeFunctions.getContentGrouping(d, s);
        expect(updatedString).toEqual("timeavtaler");
      });
    });

    describe("Når strengene inneholder bestill-time", () => {
      const s = ["bestill-time", ""];
      it("Så returnerer den timeavtaler", () => {
        const updatedString = adobeFunctions.getContentGrouping(d, s);
        expect(updatedString).toEqual("Fastlegen");
      });
    });
  });

  describe("Gitt at trackUrlChange kalles", () => {
    describe("Når url er pathname er definert", () => {
      const digitalData = {
        page: {
          category: {
            siteSection: "",
            siteSectionLevel2: "",
            contentType: "",
            registerName: "",
            contentGrouping: "contentGroupingString"
          },
          pageInfo: {
            pageURL: "",
            pageName: "pageName"
          }
        }
      };

      it("Så oppdaterres det pageInfo og category med riktig data", () => {
        const original = global.window["digitalData"];
        global.window["digitalData"] = digitalData;

        adobeFunctions.trackUrlChange(
          "http://lorem/ipsum/koordinator/visregisterinnsyn?DokumentGuid=5a1c72ac-336d-47ba-bfd4-9cba48ae8a46",
          "loterm/pathName"
        );

        expect(digitalData.page.pageInfo.pageName).toEqual(
          "Tjenester:loterm:pathName"
        );
        expect(digitalData.page.pageInfo.pageURL).toEqual(
          "lorem/ipsum/koordinator"
        );
        expect(digitalData.page.category.siteSectionLevel2).toEqual("pathName");
        expect(digitalData.page.category.contentGrouping).toEqual("loterm");
        global.window["digitalData"] = original;
      });
    });
  });

  describe("Gitt at trackConsent kalles", () => {
    describe("Når consentTrackType som sendes er av type start", () => {
      it("Så settes det riktig verdier og consent på selfService", () => {
        const digitalData = {
          selfService: {}
        };
        const original = global.window["digitalData"];
        global.window["digitalData"] = digitalData;
        adobeFunctions.trackConsent("info", "stepName", 1, "Nytt samtykke");

        expect(window.digitalData.selfService.consentFunnelName).toEqual(
          "Samtykkeflyt"
        );
        expect(window.digitalData.selfService.consentType).toEqual(
          "Nytt samtykke"
        );
        expect(window.digitalData.selfService.consentFunnelStep).toEqual(
          "stepName"
        );
        expect(window.digitalData.selfService.consentFunnelStepNumber).toEqual(
          1
        );
        expect(digitalData.selfService.consentStart).toEqual("true");
        global.window["digitalData"] = original;
      });
    });

    describe("Når consentTrackType som sendes er av type funnel", () => {
      it("Så settes det riktig consent på selfService", () => {
        const digitalData = {
          selfService: {}
        };
        const original = global.window["digitalData"];
        global.window["digitalData"] = digitalData;
        adobeFunctions.trackConsent("funnel", "stepName", 1, "Nytt samtykke");
        expect(digitalData.selfService.consentFunnel).toEqual("true");
        global.window["digitalData"] = original;
      });
    });
    describe("Når consentTrackType som sendes er av type complete", () => {
      it("Så settes det riktig consent på selfService", () => {
        const digitalData = {
          selfService: {}
        };
        const original = global.window["digitalData"];
        global.window["digitalData"] = digitalData;
        adobeFunctions.trackConsent("complete", "stepName", 1, "Nytt samtykke");
        expect(digitalData.selfService.consentComplete).toEqual("true");
        global.window["digitalData"] = original;
      });
    });
  });

  describe("Gitt at trackFilters kalles", () => {
    describe("Når trackType som sendes er av type usage", () => {
      it("Så settes det riktig filterName og filterUsage", () => {
        const digitalData = {
          filters: { filterGroupExpand: {} }
        };
        const original = global.window["digitalData"];
        global.window["digitalData"] = digitalData;
        adobeFunctions.trackFilters("name", "usage");

        expect(digitalData.filters.filterName).toEqual("name");
        expect(digitalData.filters.filterUsage).toEqual("true");

        global.window["digitalData"] = original;
      });
    });
    describe("Når trackType som sendes er av type expand", () => {
      it("Så settes det riktig filterName og filterExpand", () => {
        const digitalData = {
          filters: { filterGroupExpand: {} }
        };
        const original = global.window["digitalData"];
        global.window["digitalData"] = digitalData;
        adobeFunctions.trackFilters("name", "expand");

        expect(digitalData.filters.filterName).toEqual("name");
        expect(digitalData.filters.filterExpand).toEqual("true");

        global.window["digitalData"] = original;
      });
    });
    describe("Når trackType som sendes er av type search", () => {
      it("Så settes det riktig filterName og filterSearch", () => {
        const digitalData = {
          filters: { filterGroupExpand: {} }
        };
        const original = global.window["digitalData"];
        global.window["digitalData"] = digitalData;
        adobeFunctions.trackFilters("name", "search");

        expect(digitalData.filters.filterName).toEqual("name");
        expect(digitalData.filters.filterSearch).toEqual("true");

        global.window["digitalData"] = original;
      });
    });
    describe("Når trackType som sendes er av type groupExpand", () => {
      it("Så settes det riktig filterName og filterGroupExpand", () => {
        const digitalData = {
          filters: { filterGroupExpand: {} }
        };
        const original = global.window["digitalData"];
        global.window["digitalData"] = digitalData;
        adobeFunctions.trackFilters("name", "groupExpand");

        expect(digitalData.filters.filterName).toEqual("name");
        expect(digitalData.filters.filterGroupExpand).toEqual("true");

        global.window["digitalData"] = original;
      });
    });
  });

  describe("Gitt at trackPagePartner kalles", () => {
    describe("Når partnernavn sendes", () => {
      it("Så settes den riktig i PageInfo", () => {
        const digitalData = {
          page: { pageInfo: {} }
        };
        const original = global.window["digitalData"];
        global.window["digitalData"] = digitalData;
        adobeFunctions.trackPagePartner("partnernavn");

        expect(digitalData.page.pageInfo.partner).toEqual("partnernavn");

        global.window["digitalData"] = original;
      });
    });
  });

  describe("Gitt at trackUnreadAlert kalles", () => {
    describe("Når hasUnReadAlerts er true", () => {
      it("Så settes den riktig i user", () => {
        const digitalData = {
          user: { unReadAlerts: undefined }
        };
        const original = global.window["digitalData"];
        global.window["digitalData"] = digitalData;
        adobeFunctions.trackUnreadAlert(true);

        expect(digitalData.user.unReadAlerts).toBeTruthy();

        global.window["digitalData"] = original;
      });
    });
  });

  describe("Gitt at trackUnreadMessage kalles", () => {
    describe("Når hasUnReadMessage er true", () => {
      it("Så settes den riktig i user", () => {
        const digitalData = {
          user: { unReadMessages: undefined }
        };
        const original = global.window["digitalData"];
        global.window["digitalData"] = digitalData;
        adobeFunctions.trackUnreadMessage(true);

        expect(digitalData.user.unReadMessages).toBeTruthy();

        global.window["digitalData"] = original;
      });
    });
  });

  describe("Gitt at trackReadMessageType kalles", () => {
    describe("Når hasUnReadMessages er true", () => {
      it("Så settes den riktig i page category contentType", () => {
        const digitalData = {
          page: { category: { contentType: undefined } }
        };
        const original = global.window["digitalData"];
        global.window["digitalData"] = digitalData;
        adobeFunctions.trackReadMessageType("messagetype");

        expect(digitalData.page.category.contentType).toEqual("messagetype");

        global.window["digitalData"] = original;
      });
    });
  });

  describe("Gitt at trackSearch kalles", () => {
    describe("Når den sender søkeord type og antall treff", () => {
      it("Så settes den riktig data i search track data", () => {
        const digitalData = {
          search: {
            searchTerm: undefined,
            searchType: undefined,
            resultsCount: undefined,
            searchCount: undefined
          }
        };
        const original = global.window["digitalData"];
        global.window["digitalData"] = digitalData;
        adobeFunctions.trackSearch("my search word", "my search type", 12);

        expect(digitalData.search.searchTerm).toEqual("my search word");
        expect(digitalData.search.searchType).toEqual("my search type");
        expect(digitalData.search.resultsCount).toEqual(12);
        expect(digitalData.search.searchCount).toEqual("true");

        global.window["digitalData"] = original;
      });
    });
  });

  describe("Gitt at trackSearchThrough kalles", () => {
    describe("Når searchPosition sendes", () => {
      it("Så settes den riktig data i search track data", () => {
        const digitalData = {
          search: { searchposition: undefined, clickThrough: undefined }
        };
        const original = global.window["digitalData"];
        global.window["digitalData"] = digitalData;
        adobeFunctions.trackSearchThrough(8);

        expect(digitalData.search.searchposition).toEqual(8);
        expect(digitalData.search.clickThrough).toEqual("true");

        global.window["digitalData"] = original;
      });
    });
  });

  describe("Gitt at trackDonorCard kalles", () => {
    describe("Når smsAlert sendes", () => {
      it("Så settes den riktig data i donorCard track data", () => {
        const digitalData = {
          donorCard: { NextOfKin: undefined, smsAlert: undefined }
        };
        const original = global.window["digitalData"];
        global.window["digitalData"] = digitalData;
        adobeFunctions.trackDonorCard(true);

        expect(digitalData.donorCard.smsAlert).toEqual("true");
        expect(digitalData.donorCard.NextOfKin).toEqual("true");

        global.window["digitalData"] = original;
      });
    });
  });

  describe("Gitt at trackProfileInteraction kalles", () => {
    describe("Når name sendes", () => {
      it("Så settes den riktig data i user track data", () => {
        const digitalData = {
          user: {
            profileInteraction: undefined,
            profileInteractionName: undefined
          }
        };
        const original = global.window["digitalData"];
        global.window["digitalData"] = digitalData;
        adobeFunctions.trackProfileInteraction("testnavn");

        expect(digitalData.user.profileInteractionName).toEqual("testnavn");
        expect(digitalData.user.profileInteraction).toEqual("true");

        global.window["digitalData"] = original;
      });
    });
  });

  describe("Gitt at setValueForSelectedUser kalles", () => {
    it("Så settes den riktig data i page user track data", () => {
      const digitalData = {
        page: { user: {} }
      };
      const original = global.window["digitalData"];
      global.window["digitalData"] = digitalData;
      adobeFunctions.setValueForSelectedUser();

      expect(digitalData.page.user.onBehalfOf).toEqual("Eget bruk");
      expect(digitalData.page.user.role).toEqual("Eget bruk");

      global.window["digitalData"] = original;
    });
  });

  describe("Gitt at trackProsesshjelp kalles", () => {
    describe("Når toolAction er Open", () => {
      it("Så settes den riktig data i tool track data", () => {
        const digitalData = {
          tool: {
            toolName: undefined,
            toolType: undefined,
            toolLabels: undefined,
            toolAction: undefined
          }
        };
        const original = global.window["digitalData"];
        global.window["digitalData"] = digitalData;
        adobeFunctions.trackProsesshjelp("name", "tooltype", "label", "Open");

        expect(digitalData.tool.toolName).toEqual("name");
        expect(digitalData.tool.toolType).toEqual("tooltype");
        expect(digitalData.tool.toolLabels).toEqual("label");
        expect(digitalData.tool.toolAction).toEqual("Open");

        global.window["digitalData"] = original;
      });
    });

    describe("Når toolAction er Close", () => {
      it("Så settes den riktig data i tool track data", () => {
        const digitalData = {
          tool: {
            toolName: undefined,
            toolType: undefined,
            toolLabels: "some more toolLabels",
            toolAction: undefined
          }
        };
        const original = global.window["digitalData"];
        global.window["digitalData"] = digitalData;
        adobeFunctions.trackProsesshjelp("name", "tooltype", "label", "Close");

        expect(digitalData.tool.toolName).toEqual("name");
        expect(digitalData.tool.toolType).toEqual("tooltype");
        expect(digitalData.tool.toolLabels).toEqual("some more toolLabels");
        expect(digitalData.tool.toolAction).toEqual("Close");

        global.window["digitalData"] = original;
      });
    });
  });

  describe("Gitt at trackTool kalles", () => {
    it("Så settes den riktig data i tool track data", () => {
      const digitalData = {
        tool: {
          toolName: undefined,
          toolType: undefined,
          toolLabels: undefined,
          toolAction: undefined
        }
      };
      const original = global.window["digitalData"];
      global.window["digitalData"] = digitalData;
      adobeFunctions.trackTool("name", "tooltype", "label", "Close");

      expect(digitalData.tool.toolName).toEqual("name");
      expect(digitalData.tool.toolType).toEqual("tooltype");
      expect(digitalData.tool.toolLabels).toEqual("label");
      expect(digitalData.tool.toolAction).toEqual("Close");

      global.window["digitalData"] = original;
    });
  });
});
