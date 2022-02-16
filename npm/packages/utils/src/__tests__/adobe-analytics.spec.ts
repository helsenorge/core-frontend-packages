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
    describe('mens windows._satellite.track er undefined', () => {
      it('Så kalles ikke satellite.track', () => {
        const originalSatellite = global.window['_satellite'];
        global.window['_satellite'] = {
          track: undefined,
        };
        adobeFunctions.trackPageview();

        expect(mockTrack).toHaveBeenCalledTimes(0);
        global.window['_satellite'] = originalSatellite;
      });
    });
  });
  describe('Når trackServiceAlert kalles', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    describe('med true som argument', () => {
      it('Så kalles satellite.track med "service alert" og "Har innhold" i digitalData', () => {
        const originalDigitalData = global.window['digitalData'];
        global.window['digitalData'] = {};

        adobeFunctions.trackServiceAlert(true);

        expect(mockTrack).toHaveBeenCalledTimes(1);
        expect(mockTrack).toHaveBeenCalledWith('service alert');
        expect(window.digitalData?.user?.serviceAlert).toBe('Har innhold');

        global.window['digitalData'] = originalDigitalData;
      });
    });
    describe('med false som argument', () => {
      it('Så kalles satellite.track med "service alert" og "Har ikke innhold" i digitalData', () => {
        const originalDigitalData = global.window['digitalData'];
        global.window['digitalData'] = {};

        adobeFunctions.trackServiceAlert(false);

        expect(mockTrack).toHaveBeenCalledTimes(1);
        expect(mockTrack).toHaveBeenCalledWith('service alert');
        expect(window.digitalData?.user?.serviceAlert).toBe('Har ikke innhold');

        global.window['digitalData'] = originalDigitalData;
      });
    });
  });
  describe('Når trackLanguage kalles', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    describe('med engelsk', () => {
      it('Så kalles satellite.track med "change language" og språket finnes i digitalData', () => {
        const originalDigitalData = global.window['digitalData'];
        global.window['digitalData'] = { page: { pageInfo: {} } };

        adobeFunctions.trackLanguage('engelsk');

        expect(mockTrack).toHaveBeenCalledTimes(1);
        expect(mockTrack).toHaveBeenCalledWith('change language');
        expect(window.digitalData?.page?.pageInfo.language).toBe('engelsk');

        global.window['digitalData'] = originalDigitalData;
      });
    });
  });
  describe('Når trackError kalles', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    describe('med level1', () => {
      it('Så kalles satellite.track med "site error" og beskrivelse tilpasset nivået på feilen i digitalData', () => {
        const originalDigitalData = global.window['digitalData'];
        global.window['digitalData'] = {};

        adobeFunctions.trackError('level1');

        expect(mockTrack).toHaveBeenCalledTimes(1);
        expect(mockTrack).toHaveBeenCalledWith('site error');
        expect(window.digitalData?.error?.siteError).toBe('Nivå 1: Teknisk feil');

        global.window['digitalData'] = originalDigitalData;
      });
    });
    describe('med level2', () => {
      it('Så kalles satellite.track med "site error" og beskrivelse tilpasset nivået på feilen i digitalData', () => {
        const originalDigitalData = global.window['digitalData'];
        global.window['digitalData'] = {};

        adobeFunctions.trackError('level2');

        expect(mockTrack).toHaveBeenCalledTimes(1);
        expect(mockTrack).toHaveBeenCalledWith('site error');
        expect(window.digitalData?.error?.siteError).toBe('Nivå 2: Driftsmelding');

        global.window['digitalData'] = originalDigitalData;
      });
    });
    describe('med level3', () => {
      it('Så kalles satellite.track med "site error" og beskrivelse tilpasset nivået på feilen i digitalData', () => {
        const originalDigitalData = global.window['digitalData'];
        global.window['digitalData'] = {};

        adobeFunctions.trackError('level3');

        expect(mockTrack).toHaveBeenCalledTimes(1);
        expect(mockTrack).toHaveBeenCalledWith('site error');
        expect(window.digitalData?.error?.siteError).toBe('Nivå 3: JavaScript feil');

        global.window['digitalData'] = originalDigitalData;
      });
    });
    describe('med level4', () => {
      it('Så kalles satellite.track med "site error" og beskrivelse tilpasset nivået på feilen i digitalData', () => {
        const originalDigitalData = global.window['digitalData'];
        global.window['digitalData'] = {};

        adobeFunctions.trackError('level4');

        expect(mockTrack).toHaveBeenCalledTimes(1);
        expect(mockTrack).toHaveBeenCalledWith('site error');
        expect(window.digitalData?.error?.siteError).toBe('Nivå 4: Interaksjonsfeil');

        global.window['digitalData'] = originalDigitalData;
      });
    });
    describe('med level4 og detaljer om feilen', () => {
      it('Så kalles satellite.track med "site error" beskrivelse tilpasset nivået på feilen i digitalData', () => {
        const originalDigitalData = global.window['digitalData'];
        global.window['digitalData'] = {};

        adobeFunctions.trackError('level4', 'Beskrivelse av feilen');

        expect(mockTrack).toHaveBeenCalledTimes(1);
        expect(mockTrack).toHaveBeenCalledWith('site error');
        expect(window.digitalData?.error?.siteError).toBe('Nivå 4: Interaksjonsfeil – Beskrivelse av feilen');

        global.window['digitalData'] = originalDigitalData;
      });
    });
    describe('med level4 (som ikke er en gyldig level)', () => {
      it('Så kalles ikke satellite.track', () => {
        const originalDigitalData = global.window['digitalData'];
        adobeFunctions.trackError('level5');

        expect(mockTrack).toHaveBeenCalledTimes(0);
      });
    });
  });
});
describe('Gitt at isTrackingready kalles', () => {
  const originalDigitalData = global.window['digitalData'];
  const originalSatellite = global.window['_satellite'];
  const digitalData = {
    selfService: {},
  };
  beforeAll(() => {
    global.window['digitalData'] = digitalData;
  });
  afterAll(() => {
    global.window['digitalData'] = originalDigitalData;
  });
  describe('når digitalData er undefined', () => {
    it('så skal isTrackingready returnere false', () => {
      global.window['digitalData'] = undefined;
      const result = adobeFunctions.isTrackingready(global.window);

      expect(result).toBeFalsy();
      global.window['digitalData'] = digitalData;
    });
  });
  describe('når _satellite er undefined', () => {
    it('så skal isTrackingready returnere false', () => {
      global.window['_satellite'] = undefined;
      const result = adobeFunctions.isTrackingready(global.window);

      expect(result).toBeFalsy();
      global.window['_satellite'] = originalSatellite;
    });
  });
  describe('når _satellite.track er en funksjon', () => {
    it('så skal isTrackingready returnere true', () => {
      const result = adobeFunctions.isTrackingready(global.window);

      expect(result).toBeTruthy();
    });
  });
  describe('når _satellite.track er null', () => {
    it('så skal isTrackingready returnere false', () => {
      global.window['_satellite'] = {
        track: null,
      };
      const result = adobeFunctions.isTrackingready(global.window);

      expect(result).toBeFalsy();
      global.window['_satellite'] = originalSatellite;
    });
  });
  describe('når _satellite.track er et objekt', () => {
    it('så skal isTrackingready returnere false', () => {
      global.window['_satellite'] = {
        track: {},
      };
      const result = adobeFunctions.isTrackingready(global.window);

      expect(result).toBeFalsy();
      global.window['_satellite'] = originalSatellite;
    });
  });
  describe('når _satellite.track er undefined', () => {
    it('så skal isTrackingready returnere false', () => {
      global.window['_satellite'] = {
        track: undefined,
      };
      const result = adobeFunctions.isTrackingready(global.window);

      expect(result).toBeFalsy();
      global.window['_satellite'] = originalSatellite;
    });
  });

  describe('Gitt at trackLoginStatus kalles', () => {
    describe('Når bruker er logget inn', () => {
      it('Så settes riktig verdi i digitalData', () => {
        const digitalData = {
          page: { pageInfo: {} },
        };
        const original = global.window['digitalData'];
        global.window['digitalData'] = digitalData;
        adobeFunctions.trackLoginStatus(true);

        expect(digitalData.page.pageInfo.loggedIn).toEqual('innlogget');

        global.window['digitalData'] = original;
      });
    });
    describe('Når bruker ikke er logget inn', () => {
      it('Så settes riktig verdi i digitalData', () => {
        const digitalData = {
          page: { pageInfo: {} },
        };
        const original = global.window['digitalData'];
        global.window['digitalData'] = digitalData;
        adobeFunctions.trackLoginStatus(false);

        expect(digitalData.page.pageInfo.loggedIn).toEqual('ikke innlogget');

        global.window['digitalData'] = original;
      });
    });
  });
});
