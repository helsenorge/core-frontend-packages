import * as adobeFunctions from '../adobe-analytics';

describe('Adobe-analytics', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  const mockTrack = jest.fn();
  const s = {
    track: mockTrack,
  };
  const originalSatellite = global.window['_satellite'];
  global.window['_satellite'] = s;

  describe('Gitt at trackSelfService kalles', () => {
    const digitalData = {
      selfService: {},
    };

    describe('Når funksjonen kalles med alle argumenter ', () => {
      it('Så skal verdiene som blir satt samsvare med argumentene som blir gitt', () => {
        const originalDigitalData = global.window['digitalData'];
        global.window['digitalData'] = digitalData;
        adobeFunctions.trackSelfService('start', 'selfServiceTestName', 'søknad med tilleggsutgifter', 'legge til', 'mail');
        expect(window.digitalData.selfService?.selfServiceName).toBe('selfServiceTestName');
        expect(window.digitalData.selfService?.selfServiceType).toBe('søknad med tilleggsutgifter');
        expect(window.digitalData.selfService?.selfServiceAction).toBe('legge til');
        expect(window.digitalData.selfService?.selfServiceLabels).toBe('mail');
        global.window['digitalData'] = originalDigitalData;
      });
    });

    describe('Når funksjonen kalles uten valgfrie argumenter ', () => {
      it('Så skal alle verdiene som ikke har fått et argument være undefined', () => {
        const originalDigitalData = global.window['digitalData'];
        global.window['digitalData'] = digitalData;
        adobeFunctions.trackSelfService('start', 'selfServiceTestName');
        expect(window.digitalData.selfService?.selfServiceName).toBe('selfServiceTestName');
        expect(window.digitalData.selfService?.selfServiceType).toBe(undefined);
        expect(window.digitalData.selfService?.selfServiceAction).toBe(undefined);
        expect(window.digitalData.selfService?.selfServiceLabels).toBe(undefined);
        global.window['digitalData'] = originalDigitalData;
      });
    });
  });

  describe('Gitt at trackConsent kalles', () => {
    describe('Når consentTrackType som sendes er av type start', () => {
      it('Så settes det riktig verdier og consent på selfService', () => {
        const digitalData = {
          selfService: {},
        };
        const original = global.window['digitalData'];
        global.window['digitalData'] = digitalData;
        adobeFunctions.trackConsent('info', 'stepName', 1, 'Nytt samtykke');

        expect(window.digitalData.selfService.consentFunnelName).toEqual('Samtykkeflyt');
        expect(window.digitalData.selfService.consentType).toEqual('Nytt samtykke');
        expect(window.digitalData.selfService.consentFunnelStep).toEqual('stepName');
        expect(window.digitalData.selfService.consentFunnelStepNumber).toEqual(1);
        expect(digitalData.selfService.consentStart).toEqual('true');
        global.window['digitalData'] = original;
      });
    });

    describe('Når consentTrackType som sendes er av type funnel', () => {
      it('Så settes det riktig consent på selfService', () => {
        const digitalData = {
          selfService: {},
        };
        const original = global.window['digitalData'];
        global.window['digitalData'] = digitalData;
        adobeFunctions.trackConsent('funnel', 'stepName', 1, 'Nytt samtykke');
        expect(digitalData.selfService.consentFunnel).toEqual('true');
        global.window['digitalData'] = original;
      });
    });
    describe('Når consentTrackType som sendes er av type complete', () => {
      it('Så settes det riktig consent på selfService', () => {
        const digitalData = {
          selfService: {},
        };
        const original = global.window['digitalData'];
        global.window['digitalData'] = digitalData;
        adobeFunctions.trackConsent('complete', 'stepName', 1, 'Nytt samtykke');
        expect(digitalData.selfService.consentComplete).toEqual('true');
        global.window['digitalData'] = original;
      });
    });
  });

  describe('Gitt at trackFilters kalles', () => {
    describe('Når trackType som sendes er av type usage', () => {
      it('Så settes det riktig filterName og filterUsage', () => {
        const digitalData = {
          filters: { filterGroupExpand: {} },
        };
        const original = global.window['digitalData'];
        global.window['digitalData'] = digitalData;
        adobeFunctions.trackFilters('name', 'usage');

        expect(digitalData.filters.filterName).toEqual('name');
        expect(digitalData.filters.filterUsage).toEqual('true');

        global.window['digitalData'] = original;
      });
    });
    describe('Når trackType som sendes er av type expand', () => {
      it('Så settes det riktig filterName og filterExpand', () => {
        const digitalData = {
          filters: { filterGroupExpand: {} },
        };
        const original = global.window['digitalData'];
        global.window['digitalData'] = digitalData;
        adobeFunctions.trackFilters('name', 'expand');

        expect(digitalData.filters.filterName).toEqual('name');
        expect(digitalData.filters.filterExpand).toEqual('true');

        global.window['digitalData'] = original;
      });
    });
    describe('Når trackType som sendes er av type search', () => {
      it('Så settes det riktig filterName og filterSearch', () => {
        const digitalData = {
          filters: { filterGroupExpand: {} },
        };
        const original = global.window['digitalData'];
        global.window['digitalData'] = digitalData;
        adobeFunctions.trackFilters('name', 'search');

        expect(digitalData.filters.filterName).toEqual('name');
        expect(digitalData.filters.filterSearch).toEqual('true');

        global.window['digitalData'] = original;
      });
    });
    describe('Når trackType som sendes er av type groupExpand', () => {
      it('Så settes det riktig filterName og filterGroupExpand', () => {
        const digitalData = {
          filters: { filterGroupExpand: {} },
        };
        const original = global.window['digitalData'];
        global.window['digitalData'] = digitalData;
        adobeFunctions.trackFilters('name', 'groupExpand');

        expect(digitalData.filters.filterName).toEqual('name');
        expect(digitalData.filters.filterGroupExpand).toEqual('true');

        global.window['digitalData'] = original;
      });
    });
  });

  describe('Gitt at trackPagePartner kalles', () => {
    describe('Når partnernavn sendes', () => {
      it('Så settes den riktig i PageInfo', () => {
        const digitalData = {
          page: { pageInfo: {} },
        };
        const original = global.window['digitalData'];
        global.window['digitalData'] = digitalData;
        adobeFunctions.trackPagePartner('partnernavn');

        expect(digitalData.page.pageInfo.partner).toEqual('partnernavn');

        global.window['digitalData'] = original;
      });
    });
  });

  describe('Gitt at trackUnreadAlert kalles', () => {
    describe('Når hasUnReadAlerts er true', () => {
      it('Så settes den riktig i user', () => {
        const digitalData = {
          user: { unReadAlerts: undefined },
        };
        const original = global.window['digitalData'];
        global.window['digitalData'] = digitalData;
        adobeFunctions.trackUnreadAlert(true);

        expect(digitalData.user.unReadAlerts).toBeTruthy();

        global.window['digitalData'] = original;
      });
    });
  });

  describe('Gitt at trackUnreadMessage kalles', () => {
    describe('Når hasUnReadMessage er true', () => {
      it('Så settes den riktig i user', () => {
        const digitalData = {
          user: { unReadMessages: undefined },
        };
        const original = global.window['digitalData'];
        global.window['digitalData'] = digitalData;
        adobeFunctions.trackUnreadMessage(true);

        expect(digitalData.user.unReadMessages).toBeTruthy();

        global.window['digitalData'] = original;
      });
    });
  });

  describe('Gitt at trackReadMessageType kalles', () => {
    describe('Når hasUnReadMessages er true', () => {
      it('Så settes den riktig i page category contentType', () => {
        const digitalData = {
          page: { category: { contentType: undefined } },
        };
        const original = global.window['digitalData'];
        global.window['digitalData'] = digitalData;
        adobeFunctions.trackReadMessageType('messagetype');

        expect(digitalData.page.category.contentType).toEqual('messagetype');

        global.window['digitalData'] = original;
      });
    });
  });

  describe('Gitt at trackSearch kalles', () => {
    describe('Når den sender søkeord type og antall treff', () => {
      it('Så settes den riktig data i search track data', () => {
        const digitalData = {
          search: {
            searchTerm: undefined,
            searchType: undefined,
            resultsCount: undefined,
            searchCount: undefined,
          },
        };
        const original = global.window['digitalData'];
        global.window['digitalData'] = digitalData;
        adobeFunctions.trackSearch('my search word', 'my search type', 12);

        expect(digitalData.search.searchTerm).toEqual('my search word');
        expect(digitalData.search.searchType).toEqual('my search type');
        expect(digitalData.search.resultsCount).toEqual(12);
        expect(digitalData.search.searchCount).toEqual('true');

        global.window['digitalData'] = original;
      });
    });
  });

  describe('Gitt at trackSearchThrough kalles', () => {
    describe('Når searchPosition sendes', () => {
      it('Så settes den riktig data i search track data', () => {
        const digitalData = {
          search: { searchposition: undefined, clickThrough: undefined },
        };
        const original = global.window['digitalData'];
        global.window['digitalData'] = digitalData;
        adobeFunctions.trackSearchThrough(8);

        expect(digitalData.search.searchposition).toEqual(8);
        expect(digitalData.search.clickThrough).toEqual('true');

        global.window['digitalData'] = original;
      });
    });
  });

  describe('Gitt at trackProfileInteraction kalles', () => {
    describe('Når name sendes', () => {
      it('Så settes den riktig data i user track data', () => {
        const digitalData = {
          user: {
            profileInteraction: undefined,
            profileInteractionName: undefined,
          },
        };
        const original = global.window['digitalData'];
        global.window['digitalData'] = digitalData;
        adobeFunctions.trackProfileInteraction('testnavn');

        expect(digitalData.user.profileInteractionName).toEqual('testnavn');
        expect(digitalData.user.profileInteraction).toEqual('true');

        global.window['digitalData'] = original;
      });
    });
  });

  describe('Gitt at setValueForSelectedUser kalles', () => {
    it('Så settes den riktig data i page user track data', () => {
      const digitalData = {
        page: { user: {} },
      };
      const original = global.window['digitalData'];
      global.window['digitalData'] = digitalData;
      adobeFunctions.setValueForSelectedUser();

      expect(digitalData.page.user.onBehalfOf).toEqual('Eget bruk');
      expect(digitalData.page.user.role).toEqual('Eget bruk');

      global.window['digitalData'] = original;
    });
  });

  describe('Gitt at trackProsesshjelp kalles', () => {
    describe('Når toolAction er Open', () => {
      it('Så settes den riktig data i tool track data', () => {
        const digitalData = {
          tool: {
            toolName: undefined,
            toolType: undefined,
            toolLabels: undefined,
            toolAction: undefined,
          },
        };
        const original = global.window['digitalData'];
        global.window['digitalData'] = digitalData;
        adobeFunctions.trackProsesshjelp('name', 'tooltype', 'label', 'Open');

        expect(digitalData.tool.toolName).toEqual('name');
        expect(digitalData.tool.toolType).toEqual('tooltype');
        expect(digitalData.tool.toolLabels).toEqual('label');
        expect(digitalData.tool.toolAction).toEqual('Open');

        global.window['digitalData'] = original;
      });
    });

    describe('Når toolAction er Close', () => {
      it('Så settes den riktig data i tool track data', () => {
        const digitalData = {
          tool: {
            toolName: undefined,
            toolType: undefined,
            toolLabels: 'some more toolLabels',
            toolAction: undefined,
          },
        };
        const original = global.window['digitalData'];
        global.window['digitalData'] = digitalData;
        adobeFunctions.trackProsesshjelp('name', 'tooltype', 'label', 'Close');

        expect(digitalData.tool.toolName).toEqual('name');
        expect(digitalData.tool.toolType).toEqual('tooltype');
        expect(digitalData.tool.toolLabels).toEqual('some more toolLabels');
        expect(digitalData.tool.toolAction).toEqual('Close');

        global.window['digitalData'] = original;
      });
    });
  });

  describe('Gitt at trackTool kalles', () => {
    it('Så settes den riktig data i tool track data', () => {
      const digitalData = {
        tool: {
          toolName: undefined,
          toolType: undefined,
          toolLabels: undefined,
          toolAction: undefined,
        },
      };
      const original = global.window['digitalData'];
      global.window['digitalData'] = digitalData;
      adobeFunctions.trackTool('name', 'tooltype', 'label', 'Close');

      expect(digitalData.tool.toolName).toEqual('name');
      expect(digitalData.tool.toolType).toEqual('tooltype');
      expect(digitalData.tool.toolLabels).toEqual('label');
      expect(digitalData.tool.toolAction).toEqual('Close');

      global.window['digitalData'] = original;
    });
  });

  describe('Når updateUserAttributes kalles', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    describe('med et tomt objekt', () => {
      it('Så er digitalData.user uforandret', () => {
        const digitalData = {
          user: {
            serviceAlert: 'some alert',
            unReadAlerts: true,
            unReadMessages: false,
            profileInteraction: 'some interaction',
            profileInteractionName: 'some name',
            login: true,
          },
        };
        const original = global.window['digitalData'];
        global.window['digitalData'] = digitalData;
        adobeFunctions.updateUserAttributes({});

        expect(digitalData.user).toEqual({
          serviceAlert: 'some alert',
          unReadAlerts: true,
          unReadMessages: false,
          profileInteraction: 'some interaction',
          profileInteractionName: 'some name',
          login: true,
        });
        global.window['digitalData'] = original;
      });
    });
    describe('med ekstra data om brukeren', () => {
      it('Så legges dataene til uten å overskrive eller fjerne eksisterende data', () => {
        const digitalData = {
          user: {
            serviceAlert: 'some alert',
            unReadAlerts: true,
            unReadMessages: false,
            profileInteraction: 'some interaction',
            profileInteractionName: 'some name',
            login: true,
          },
        };
        const original = global.window['digitalData'];
        global.window['digitalData'] = digitalData;
        adobeFunctions.updateUserAttributes({
          someStatus: 'Important',
        });

        expect(digitalData.user).toEqual({
          serviceAlert: 'some alert',
          unReadAlerts: true,
          unReadMessages: false,
          profileInteraction: 'some interaction',
          profileInteractionName: 'some name',
          login: true,
          someStatus: 'Important',
        });
        global.window['digitalData'] = original;
      });
    });
    describe('med oppdaterte data om brukeren', () => {
      it('Så overskrives eksisterende data i digitalData.user', () => {
        const digitalData = {
          user: {
            login: true,
          },
        };
        const original = global.window['digitalData'];
        global.window['digitalData'] = digitalData;
        adobeFunctions.updateUserAttributes({
          login: false,
        });

        expect(digitalData.user).toEqual({
          login: false,
        });
        global.window['digitalData'] = original;
      });
    });
  });
  describe('Når trackPageview kalles', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    describe('uten parametere', () => {
      it('Så kalles satellite.track med "track pageview"', () => {
        adobeFunctions.trackPageview();

        expect(mockTrack).toHaveBeenCalledTimes(1);
        expect(mockTrack).toHaveBeenCalledWith('track pageview');
      });
    });
  });
});
