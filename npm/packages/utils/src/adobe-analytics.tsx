import { isEmpty } from './string-utils';

interface DigitalData {
  selfService?: SelfService | ConsentSelfService;
  filters?: Filters;
  page?: Page;
  user?: User;
  articletab?: ArticleTab;
  search?: Search;
  donorCard?: DonorCard;
  tool?: Tool;
  error?: Error;
}

interface Tool {
  toolName: string;
  toolType: string;
  toolLabels: string;
  toolAction: string;
}

interface Category {
  siteSection: string;
  siteSectionLevel2: string;
  contentType: string;
  registerName: string;
  contentGrouping: string;
}

interface Satellite {
  track: (val: string) => void;
}

export interface SelfService extends Object {
  selfServiceStart?: string;
  selfServiceFunnel?: string;
  selfServiceComplete?: string;
  selfServiceContinueLater?: string;
  selfServiceCancel?: string;
  selfServiceEngagement?: string;
  selfServiceEngagementName?: string;
  selfServiceName?: string;
  selfServiceFunnelStep?: string;
  selfServiceFunnelStepNumber?: number;
}

export interface ConsentSelfService extends Object {
  consentStart?: string;
  consentFunnel?: string;
  consentComplete?: string;
  consentFunnelName?: string;
  consentFunnelStep?: string;
  consentFunnelStepNumber?: number;
  consentType?: string;
}

export interface Filters extends Object {
  filterName: string;
  filterUsage?: string;
  filterExpand?: string;
  filterSearch?: string;
  filterGroupExpand?: string;
}

export interface PageUser {
  onBehalfOf?: string;
  role?: string;
}

export interface Page extends Object {
  pageInfo?: PageInfo;
  category?: Category;
  user?: PageUser;
}

export interface PageInfo {
  partner?: string;
  pageURL?: string;
  pageName?: string;
}

export interface User {
  serviceAlert?: string;
  unReadAlerts?: boolean;
  unReadMessages?: boolean;
  profileInteraction?: string;
  profileInteractionName?: string;
  login?: boolean;
}

export interface ArticleTab {
  tabName: string;
  tabClick: string;
}

export interface Search {
  searchTerm?: string;
  searchType?: string;
  resultsCount?: number;
  searchCount?: string;
  nullResult?: string;
  clickThrough?: string;
  searchposition?: number;
}

export interface DonorCard {
  NextOfKin: string;
  smsAlert: string;
}

export interface Error {
  siteError: string;
}

declare global {
  interface Window {
    digitalData: DigitalData;
    _satellite: Satellite;
    opera?: unknown;
  }
}

export type SelfServiceTrackType = 'start' | 'funnel' | 'complete' | 'cancel' | 'continue later';
export type ConsentTrackType = 'info' | 'funnel' | 'complete';
export type FiltersTrackType = 'usage' | 'expand' | 'search' | 'groupExpand';
export type ErrorType = 'level1' | 'level2' | 'level3' | 'level4';
export type ProsesshjelpActionType = 'Open' | 'Close';

/**
 * Spore at bruker har startet, avbrutt, lagret eller fullført en prosess med flere steg.
 * @param trackType type som styrer selfService
 * @param name definerer selfServiceName
 * @param step definerer selfServiceFunnelStep
 * @param stepNumber definerer selfServiceFunnelStepNumber
 * @param custom prop object som merges videre på selfService
 */
export const trackSelfService = (trackType: SelfServiceTrackType, name: string, step: string, stepNumber: number, custom?: {}): void => {
  const digitalData: DigitalData = window.digitalData || undefined;
  const _satellite: Satellite = window._satellite || undefined;

  if (digitalData && _satellite) {
    const selfService: SelfService = {
      selfServiceName: name,
      selfServiceFunnelStep: step,
      selfServiceFunnelStepNumber: stepNumber,
    };

    if (trackType === 'start') {
      selfService.selfServiceStart = 'true';
    }
    if (trackType === 'funnel') {
      selfService.selfServiceFunnel = 'true';
    }
    if (trackType === 'complete') {
      selfService.selfServiceComplete = 'true';
    }
    if (trackType === 'cancel') {
      selfService.selfServiceCancel = 'true';
    }
    if (trackType === 'continue later') {
      selfService.selfServiceContinueLater = 'true';
    }

    digitalData.selfService = { ...selfService, ...custom };

    _satellite.track(`self service ${trackType}`);
  }
};

/**
 * Fjerner diverse navn og id fra paths
 * @param s url som skal renses
 */
export const removeNamesAndOtherIds = (s: string): string => {
  const koordinatorPattern = new RegExp('koordinator/(.+)$');
  const helsefagligPattern = new RegExp('helsefagligkontakt/(.+)$');
  const kommunePattern = new RegExp('kommune/(.+)$');
  const avtalePattern = new RegExp('avtale/((.+)(/)|(.+)$)');

  return s
    .replace(koordinatorPattern, 'koordinator')
    .replace(helsefagligPattern, 'helsefagligkontakt')
    .replace(kommunePattern, 'kommune')
    .replace(avtalePattern, 'avtale/{id}/');
};

/**
 * For tracking registerName on diffrent Helseregistre pages
 * @param path array of strenger som skal registreres
 */
export const getRegisterName = (path: string[]): string => {
  switch (path.length > 0) {
    case path[0] === 'helseregistre':
    case path[0] === 'mfr':
    case path[0] === 'sysvak':
    case path[0] === 'visregisterinnsyn':
    case path[0] === 'reseptformidleren':
      try {
        if (document.title.substr(0, 8) === 'Innsyn i') {
          return document.title.substr(8, document.title.length);
        } else {
          return document.title.split('-')[0].trimRight();
        }
      } catch (e) {
        return document.title;
      }
  }

  return '';
};

/**
 * For tracking contentGrouping
 * @param digitalData digitalData med informasjon om Page
 * @param path array of strenger som skal registreres
 */
export const getContentGrouping = (digitalData: DigitalData | undefined, path: string[]): string => {
  let group = digitalData && digitalData.page && digitalData.page.category ? digitalData.page.category.contentGrouping : '';

  if (path.length > 0) {
    switch (true) {
      case path.length > 1 && path[1] === 'avtale':
        group = 'timeavtaler';
        return group;
      case path[0] === 'bestill-time':
      case path[0] === 'e-konsultasjon':
      case path[0] === 'forny-resept':
      case path[0] === 'kontakt-legekontoret':
        group = 'Fastlegen';
        return group;

      default:
        group = path[0] ? path[0] : '';
        return group;
    }
  } else {
    return '';
  }
};

/**
 * Spor at URL har endret seg (unødvendig om man bruker Router.)
 * @param url Utgangspunkt som brukes for å definere pageURL (window.location.href)
 * @param pathName Utgangspunkt som brukes for å definere pageName (window.location.pathname)
 */
export const trackUrlChange = (url: string, pathName: string): void => {
  const digitalData: DigitalData = window.digitalData || undefined;
  const _satellite: Satellite = window._satellite || undefined;

  const guidPattern = new RegExp('[a-zA-Z0-9]{8}[-]?([a-zA-Z0-9]{4}[-]?){3}[a-zA-Z0-9]{12}');
  const intPattern = /\d+/gm;

  const path = removeNamesAndOtherIds(pathName)
    .split('/')
    .filter(o => !isEmpty(o) && !guidPattern.test(o) && !intPattern.test(o) && o !== '{id}');

  if (digitalData && digitalData.page && digitalData.page.pageInfo) {
    const urlSplit = removeNamesAndOtherIds(url).split('://');

    if (urlSplit.length > 1) {
      digitalData.page.pageInfo.pageURL = urlSplit[1].replace(guidPattern, '{guid}').replace(intPattern, '{id}');
    }

    digitalData.page.pageInfo.pageName = 'Tjenester:' + path.join(':');
  }

  if (digitalData && digitalData.page && digitalData.page.category) {
    digitalData.page.category.siteSectionLevel2 = path.length > 1 ? path[1] : '';
    digitalData.page.category.contentType = '';
    digitalData.page.category.registerName = getRegisterName(path);
    digitalData.page.category.contentGrouping = getContentGrouping(digitalData, path);
  }

  // Forhindre at login trackes 2 ganger når man kommer fra idporten
  if (digitalData && digitalData.user && digitalData.user.login) {
    digitalData.user = {};
  }

  if (_satellite && _satellite.track) {
    _satellite.track('lightbox');
  }
};

/**
 * Spor bruk av samtykkeflyt
 * @param consentTrackType definerer consentStart, consentFunnel eller consentComplete videre
 * @param stepName definerer consentFunnelStep på ConsentSelfService
 * @param stepNumber definerer selfServiceFunnelStepNumber på ConsentSelfService
 * @param consentType definerer consentType på ConsentSelfService
 */
export const trackConsent = (
  consentTrackType: ConsentTrackType,
  stepName: string,
  stepNumber: number,
  consentType: 'Nytt samtykke' | 'Endre samtykke'
): void => {
  const digitalData: DigitalData = window.digitalData || undefined;
  const _satellite: Satellite = window._satellite || undefined;

  if (digitalData && _satellite) {
    const selfService: ConsentSelfService = {
      consentFunnelName: 'Samtykkeflyt',
      consentType: consentType,
      consentFunnelStep: stepName,
      consentFunnelStepNumber: stepNumber,
    };

    let trackText: string | undefined = undefined;

    if (consentTrackType === 'info') {
      selfService.consentStart = 'true';
      trackText = 'consent start';
    }
    if (consentTrackType === 'funnel') {
      selfService.consentFunnel = 'true';
      trackText = 'consent funnel';
    }

    if (consentTrackType === 'complete') {
      selfService.consentComplete = 'true';
      trackText = 'consent complete';
    }

    digitalData.selfService = selfService;
    if (trackText) {
      _satellite.track(trackText);
    }
  }
};

/**
 * Spor bruk av filterkomponent
 * @param name definerer navnet fil Filter
 * @param trackType definerer type tracking: 'usage' | 'expand' | 'search' | 'groupExpand'
 */
export const trackFilters = (name: string, trackType: FiltersTrackType): void => {
  const digitalData: DigitalData = window.digitalData || undefined;
  const _satellite: Satellite = window._satellite || undefined;

  if (digitalData && _satellite) {
    digitalData.filters = {
      filterName: name,
    };

    if (trackType === 'usage') {
      digitalData.filters.filterUsage = 'true';
      _satellite.track('filter use');
    }
    if (trackType === 'expand') {
      digitalData.filters.filterExpand = 'true';
      _satellite.track('filter expand');
    }

    if (trackType === 'groupExpand') {
      digitalData.filters.filterGroupExpand = 'true';
      _satellite.track('filter group expand');
    }

    if (trackType === 'search') {
      digitalData.filters.filterSearch = 'true';
      _satellite.track('filter search');
    }
  }
};

/**
 * Spor pageInfo partner - setter informasjon om tjenesteeier o.l. i window.digitalData
 * @param partner definerer partner som settes i pageInfo
 */
export const trackPagePartner = (partner: string): void => {
  const digitalData: DigitalData = window.digitalData || undefined;

  if (digitalData && digitalData.page && digitalData.page.pageInfo) {
    digitalData.page.pageInfo.partner = partner;
  }
};

/**
 * Spor uleste varslinger
 * @param hasUnReadAlerts true/false
 */
export const trackUnreadAlert = (hasUnReadAlerts: boolean): void => {
  const digitalData: DigitalData = window.digitalData || undefined;
  const _satellite: Satellite = window._satellite || undefined;

  if (digitalData && _satellite) {
    digitalData.user = {
      unReadAlerts: hasUnReadAlerts ? true : false,
    };
    _satellite.track('first logged in page');
  }
};

/**
 * Spor uleste meldinger
 * @param hasUnReadMessages true/false
 */
export const trackUnreadMessage = (hasUnReadMessages: boolean): void => {
  const digitalData: DigitalData = window.digitalData || undefined;
  const _satellite: Satellite = window._satellite || undefined;

  if (digitalData && _satellite) {
    digitalData.user = {
      unReadMessages: hasUnReadMessages ? true : false,
    };
    _satellite.track('first logged in page');
  }
};

/**
 * Spor content-types på meldinger
 * @param contentType type som settes på page category
 */
export const trackReadMessageType = (contentType: string): void => {
  const digitalData: DigitalData = window.digitalData || undefined;

  if (digitalData && digitalData.page && digitalData.page.category) {
    digitalData.page.category.contentType = contentType;
  }

  const _satellite: Satellite = window._satellite || undefined;
  if (_satellite) {
    _satellite.track('message content type');
  }
};

/**
 * Spor internsøk
 * @param term nøkkelord som settes på search searchTerm
 * @param name type som settes på search searchType
 * @param resultsCount antall søkeresultater som settes på search resultsCount
 */
export const trackSearch = (term: string, name: string, resultsCount: number): void => {
  const digitalData: DigitalData = window.digitalData || undefined;
  const _satellite: Satellite = window._satellite || undefined;

  if (digitalData && _satellite) {
    digitalData.search = {
      searchTerm: term,
      searchType: name,
      resultsCount: resultsCount,
      searchCount: 'true',
    };

    if (resultsCount === 0) {
      digitalData.search.nullResult = 'true';
      _satellite.track('search null results');
    } else {
      _satellite.track('internal search');
    }
  }
};

/**
 * Spor klikk på internsøkeresultater
 * @param searchposition position til søkeresultatet som lagres på search searchposition
 */
export const trackSearchThrough = (searchposition: number): void => {
  const digitalData: DigitalData = window.digitalData || undefined;
  const _satellite: Satellite = window._satellite || undefined;

  if (digitalData && _satellite) {
    digitalData.search = {
      clickThrough: 'true',
      searchposition: searchposition,
    };

    _satellite.track('search click through');
  }
};

/**
 * Spor registrering av donorkort
 * @param smsAlert om det ble sendt smsAlert
 */
export const trackDonorCard = (smsAlert: boolean): void => {
  const digitalData: DigitalData = window.digitalData || undefined;
  const _satellite: Satellite = window._satellite || undefined;

  if (digitalData && _satellite) {
    digitalData.donorCard = {
      NextOfKin: 'true',
      smsAlert: smsAlert ? 'true' : 'false',
    };
    _satellite.track('donor card NextOfKin');
  }
};

/**
 * Spor endring av profilinnstillinger
 * @param name navn som lagres på user profileInteractionName
 */
export const trackProfileInteraction = (name: string): void => {
  const digitalData: DigitalData = window.digitalData || undefined;
  const _satellite: Satellite = window._satellite || undefined;

  if (digitalData && _satellite) {
    digitalData.user = {
      profileInteraction: 'true',
      profileInteractionName: name,
    };
    _satellite.track('profile interaction');
  }
};

/**
 * Spor verdien for 'user' representasjon etter at den ble valgt i  personvelger
 */
export const setValueForSelectedUser = (): void => {
  const digitalData: DigitalData = window.digitalData || undefined;
  if (digitalData && digitalData.page) {
    digitalData.page.user = { onBehalfOf: 'Eget bruk', role: 'Eget bruk' };
  }
};

/**
 * Spor åpning/lukking av hjelpeskuff
 * @param name navn som lagres på tool toolName
 * @param toolType type som lagres på tool toolType
 * @param label label som lagres på tool toolLabels
 * @param actionType action-type som lagres på toolAction og som definerer label (Close or Open)
 */
export const trackProsesshjelp = (name: string, toolType: string, label: string, actionType: ProsesshjelpActionType): void => {
  const digitalData: DigitalData = window.digitalData || undefined;
  const toolLabels = actionType === 'Close' && digitalData.tool ? digitalData.tool.toolLabels : label;
  const satelliteTrackContent = actionType + ' context help';
  trackTool(name, toolType, toolLabels, actionType, satelliteTrackContent);
};

/**
 * spor handlinger med kun ett steg, e.g.
 * trackTool('kontaktskjema', 'hjelp', 'bytte fastlege', 'send')
 * @param name navn som lagres på tool toolName
 * @param toolType type som lagres på tool toolType
 * @param label label som lagres på tool toolLabels
 * @param actionType action-type som lagres på toolAction og som definerer label (Close or Open)
 */
export const trackTool = (
  toolName: string,
  toolType: string,
  toolLabels: string,
  toolAction: string,
  satelliteTrackContent?: string
): void => {
  const digitalData = window.digitalData || undefined;
  const _satellite = window._satellite || undefined;
  satelliteTrackContent = satelliteTrackContent || 'use tool';

  if (digitalData && _satellite) {
    digitalData.tool = {
      toolName,
      toolType,
      toolLabels,
      toolAction,
    };
    _satellite.track(satelliteTrackContent);
  }
};

/* ********************************************** */
/* *************** DEPRECATED ******************* */
/* ********************************************** */

// For tracking intent. - muligens deprecated
export const trackSelfServiceIntent = (engagementName: string, custom?: {}): void => {
  const digitalData: DigitalData = window.digitalData || undefined;
  const _satellite: Satellite = window._satellite || undefined;

  if (digitalData && _satellite) {
    digitalData.selfService = {
      selfServiceEngagement: 'true',
      selfServiceEngagementName: engagementName,
      ...custom,
    };

    _satellite.track(`self service intent`);
  }
};

// For tracking pageInfo partner - muligens deprecated
export function trackServiceAlert(hasContent: boolean) {
  const digitalData: DigitalData = window.digitalData || undefined;
  const _satellite: Satellite = window._satellite || undefined;

  if (digitalData && _satellite) {
    digitalData.user = {
      serviceAlert: hasContent ? 'Har innhold' : 'Har ikke innhold',
    };
    _satellite.track('service alert');
  }
}

// For tracking article tab name
export function trackArticleTab(tabName: string) {
  const digitalData: DigitalData = window.digitalData || undefined;
  const _satellite: Satellite = window._satellite || undefined;

  if (digitalData && _satellite) {
    digitalData.articletab = {
      tabName: tabName,
      tabClick: 'true',
    };
    _satellite.track('tab click');
  }
}

// For tracking error
export function trackError(level: ErrorType, details?: string): void {
  const digitalData: DigitalData = window.digitalData || undefined;
  const _satellite: Satellite = window._satellite || undefined;

  if (digitalData && _satellite) {
    let errorType;
    if (level === 'level1') {
      errorType = 'Nivå 1: Teknisk feil';
    } else if (level === 'level2') {
      errorType = 'Nivå 2: Driftsmelding';
    } else if (level === 'level3') {
      errorType = 'Nivå 3: JavaScript feil';
    } else if (level === 'level4') {
      errorType = 'Nivå 4: Interaksjonsfeil';
    } else {
      return;
    }
    digitalData.error = {
      siteError: !details ? errorType : `${errorType} – ${details}`,
    };
    _satellite.track('site error');
  }
}
