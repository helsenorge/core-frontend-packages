//Enum for Adobe Analytics
export enum AnalyticsId {
  Tab = 'tab',
  ExpandableSection = 'expandable-section',
  ExpandableBlock = 'expandable-block',
  BlockButton = 'block-button',
  DisplayButton = 'display-button',
  FunctionButton = 'function-button',
  NavigationButton = 'navigation-button',
  ProcessStartButton = 'process-start-button',
  SaveButton = 'save-button',
}

interface DigitalData {
  selfService?: SelfService | ConsentSelfService;
  filters?: Filters;
  page?: Page;
  user?: User & UserAttributes;
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
  selfServiceName?: string;
  selfServiceType?: string;
  selfServiceAction?: string;
  selfServiceLabels?: string;
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

export interface UserAttributes {
  [key: string]: string | number | boolean;
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
 * @param event hvor langt brukeren har kommet i selvbetjeningsløsningen (starter/fullfører/avbryter/lagrer)
 * @param name definerer navnet på selvbetjeningsløsningen.
 * @param type spesifiserer type hvis selvbetjeningsløsningen har flere varianter.
 * @param action spesifiserer hvilken handling man utfører ('søke', 'bytte', 'legge til', etc.).
 * @param labels spesifiserer tilleggsinformasjon man vil skille brukere på. (F.eks. foretrukket kontaktmåte).
 */
export const trackSelfService = (event: SelfServiceTrackType, name: string, type?: string, action?: string, labels?: string): void => {
  const digitalData: DigitalData = window.digitalData || undefined;
  const _satellite: Satellite = window._satellite || undefined;

  if (digitalData && _satellite) {
    const selfService: SelfService = {
      selfServiceName: name,
    };
    if (type) selfService.selfServiceType = type;
    if (action) selfService.selfServiceAction = action;
    if (labels) selfService.selfServiceLabels = labels;

    digitalData.selfService = selfService;

    _satellite.track(`self service ${event}`);
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

/**
 * Oppdater data om brukeren, f.eks.
 * updateUserAttributes({ userStatus: "something" })
 * @param userAttributes objekt med verdier som enten legges til eller oppdaterer eksisterende data om brukeren
 */
export const updateUserAttributes = (userAttributes: UserAttributes): void => {
  const digitalData: DigitalData = window.digitalData || undefined;

  if (digitalData) {
    digitalData.user = { ...digitalData.user, ...userAttributes };
  }
};

/**
 * spor sidevisninger, e.g.
 * trackPageview()
 */
export const trackPageview = (): void => {
  const _satellite = window._satellite || undefined;

  if (_satellite) {
    _satellite.track('track pageview');
  }
};

/* ********************************************** */
/* *************** DEPRECATED ******************* */
/* ********************************************** */

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
