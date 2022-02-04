//Enum for Adobe Analytics
export enum AnalyticsId {
  Tab = 'tab',
  ExpandableSection = 'expandable-section',
  ExpandableBlock = 'expandable-block',
  ExpandableTagSection = 'expandable-tag-section',
  BlockButton = 'block-button',
  DisplayButton = 'display-button',
  FunctionButton = 'function-button',
  NavigationButton = 'navigation-button',
  ProcessStartButton = 'process-start-button',
  SaveButton = 'save-button',
  BlockVideo = 'block-video',
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

type TrackFunction = (val: string) => void;

interface Satellite {
  track: TrackFunction;
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

export type LoginStatus = 'innlogget' | 'ikke innlogget';

export interface PageInfo {
  partner?: string;
  pageURL?: string;
  pageName?: string;
  loggedIn?: LoginStatus;
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

interface HasDigitalData {
  digitalData: DigitalData;
}

interface HasSatellite {
  _satellite: Satellite;
}

declare global {
  interface Window extends Partial<HasDigitalData>, Partial<HasSatellite> {
    opera?: unknown;
  }
}

export type SelfServiceTrackType = 'start' | 'funnel' | 'complete' | 'cancel' | 'continue later';
export type ConsentTrackType = 'info' | 'funnel' | 'complete';
export type FiltersTrackType = 'usage' | 'expand' | 'search' | 'groupExpand';
export type ErrorType = 'level1' | 'level2' | 'level3' | 'level4';
export type ProsesshjelpActionType = 'Open' | 'Close';

/**
 * Brukes for å sjekke om window.digitalData er klar til bruk
 * @param x objektet som skal sjekkes, normalt window.digitalData
 */
const isDigitalData = (x: unknown): x is DigitalData => {
  return typeof x === 'object';
};

/**
 * Brukes for å sjekke om window._satellite er klar for tracking
 * @param x objektet som skal sjekkes, normalt window._satellite
 */
const isSatellite = (x: Satellite | unknown): x is Satellite => {
  const satellite = x as Satellite;

  return satellite?.track !== undefined && typeof satellite.track === 'function';
};

/**
 * Sjekker om window._satellite er klar for tracking
 * Brukes når man bare trenger window._satellite, og ikke window.digitalData
 * @param x objektet som skal sjekkes, normalt window
 */
const isSatelliteReady = (x: Window): x is Window & HasSatellite => {
  return isSatellite(x._satellite);
};

/**
 * Sjekker om både window.digitalData og window._satellite er klare for tracking,
 * inkludert om det er trygt å kalle window._satellite.track()
 * @param x objektet som skal sjekkes, normalt window
 */
export const isTrackingready = (x: Window): x is Window & HasDigitalData & HasSatellite => {
  return isDigitalData(x.digitalData) && isSatellite(x._satellite);
};

/**
 * @param event hvor langt brukeren har kommet i selvbetjeningsløsningen (starter/fullfører/avbryter/lagrer)
 * @param name definerer navnet på selvbetjeningsløsningen.
 * @param type spesifiserer type hvis selvbetjeningsløsningen har flere varianter.
 * @param action spesifiserer hvilken handling man utfører ('søke', 'bytte', 'legge til', etc.).
 * @param labels spesifiserer tilleggsinformasjon man vil skille brukere på. (F.eks. foretrukket kontaktmåte).
 */
export const trackSelfService = (event: SelfServiceTrackType, name: string, type?: string, action?: string, labels?: string): void => {
  if (isTrackingready(window)) {
    const selfService: SelfService = {
      selfServiceName: name,
    };
    if (type) selfService.selfServiceType = type;
    if (action) selfService.selfServiceAction = action;
    if (labels) selfService.selfServiceLabels = labels;

    window.digitalData.selfService = selfService;

    window._satellite.track(`self service ${event}`);
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
  if (isTrackingready(window)) {
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

    window.digitalData.selfService = selfService;
    if (trackText) {
      window._satellite.track(trackText);
    }
  }
};

/**
 * Spor bruk av filterkomponent
 * @param name definerer navnet fil Filter
 * @param trackType definerer type tracking: 'usage' | 'expand' | 'search' | 'groupExpand'
 */
export const trackFilters = (name: string, trackType: FiltersTrackType): void => {
  if (isTrackingready(window)) {
    window.digitalData.filters = {
      filterName: name,
    };

    if (trackType === 'usage') {
      window.digitalData.filters.filterUsage = 'true';
      window._satellite.track('filter use');
    }
    if (trackType === 'expand') {
      window.digitalData.filters.filterExpand = 'true';
      window._satellite.track('filter expand');
    }

    if (trackType === 'groupExpand') {
      window.digitalData.filters.filterGroupExpand = 'true';
      window._satellite.track('filter group expand');
    }

    if (trackType === 'search') {
      window.digitalData.filters.filterSearch = 'true';
      window._satellite.track('filter search');
    }
  }
};

/**
 * Spor pageInfo partner - setter informasjon om tjenesteeier o.l. i window.digitalData
 * @param partner definerer partner som settes i pageInfo
 */
export const trackPagePartner = (partner: string): void => {
  if (window.digitalData && window.digitalData.page && window.digitalData.page.pageInfo) {
    window.digitalData.page.pageInfo.partner = partner;
  }
};

/**
 * Setter informasjon om innlogget status i window.digitalData
 * @param isLoggedIn Om bruker er logget inn eller ikke
 */
export const trackLoginStatus = (isLoggedIn: boolean): void => {
  if (window.digitalData?.page?.pageInfo) {
    window.digitalData.page.pageInfo.loggedIn = isLoggedIn ? 'innlogget' : 'ikke innlogget';
  }
};

/**
 * Spor uleste varslinger
 * @param hasUnReadAlerts true/false
 */
export const trackUnreadAlert = (hasUnReadAlerts: boolean): void => {
  if (isTrackingready(window)) {
    window.digitalData.user = {
      unReadAlerts: hasUnReadAlerts ? true : false,
    };
    window._satellite.track('first logged in page');
  }
};

/**
 * Spor uleste meldinger
 * @param hasUnReadMessages true/false
 */
export const trackUnreadMessage = (hasUnReadMessages: boolean): void => {
  if (isTrackingready(window)) {
    window.digitalData.user = {
      unReadMessages: hasUnReadMessages ? true : false,
    };
    window._satellite.track('first logged in page');
  }
};

/**
 * Spor content-types på meldinger
 * @param contentType type som settes på page category
 */
export const trackReadMessageType = (contentType: string): void => {
  if (window.digitalData && window.digitalData.page && window.digitalData.page.category) {
    window.digitalData.page.category.contentType = contentType;
  }

  if (isSatelliteReady(window)) {
    window._satellite.track('message content type');
  }
};

/**
 * Spor internsøk
 * @param term nøkkelord som settes på search searchTerm
 * @param name type som settes på search searchType
 * @param resultsCount antall søkeresultater som settes på search resultsCount
 */
export const trackSearch = (term: string, name: string, resultsCount: number): void => {
  if (isTrackingready(window)) {
    window.digitalData.search = {
      searchTerm: term,
      searchType: name,
      resultsCount: resultsCount,
      searchCount: 'true',
    };

    if (resultsCount === 0) {
      window.digitalData.search.nullResult = 'true';
      window._satellite.track('search null results');
    } else {
      window._satellite.track('internal search');
    }
  }
};

/**
 * Spor klikk på internsøkeresultater
 * @param searchposition position til søkeresultatet som lagres på search searchposition
 */
export const trackSearchThrough = (searchposition: number): void => {
  if (isTrackingready(window)) {
    window.digitalData.search = {
      clickThrough: 'true',
      searchposition: searchposition,
    };

    window._satellite.track('search click through');
  }
};

/**
 * Spor endring av profilinnstillinger
 * @param name navn som lagres på user profileInteractionName
 */
export const trackProfileInteraction = (name: string): void => {
  if (isTrackingready(window)) {
    window.digitalData.user = {
      profileInteraction: 'true',
      profileInteractionName: name,
    };
    window._satellite.track('profile interaction');
  }
};

/**
 * Spor verdien for 'user' representasjon etter at den ble valgt i  personvelger
 */
export const setValueForSelectedUser = (): void => {
  if (window.digitalData && window.digitalData.page) {
    window.digitalData.page.user = { onBehalfOf: 'Eget bruk', role: 'Eget bruk' };
  }
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
  satelliteTrackContent = satelliteTrackContent || 'use tool';

  if (isTrackingready(window)) {
    window.digitalData.tool = {
      toolName,
      toolType,
      toolLabels,
      toolAction,
    };
    window._satellite.track(satelliteTrackContent);
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
  const toolLabels = actionType === 'Close' && window.digitalData && window.digitalData.tool ? window.digitalData.tool.toolLabels : label;
  const satelliteTrackContent = actionType + ' context help';
  trackTool(name, toolType, toolLabels, actionType, satelliteTrackContent);
};

/**
 * Oppdater data om brukeren, f.eks.
 * updateUserAttributes({ userStatus: "something" })
 * @param userAttributes objekt med verdier som enten legges til eller oppdaterer eksisterende data om brukeren
 */
export const updateUserAttributes = (userAttributes: UserAttributes): void => {
  if (window.digitalData) {
    window.digitalData.user = { ...window.digitalData.user, ...userAttributes };
  }
};

/**
 * spor sidevisninger, e.g.
 * trackPageview()
 */
export const trackPageview = (): void => {
  if (isSatelliteReady(window)) {
    window._satellite.track('track pageview');
  }
};

/**
 * Spor om en tjeneste har innhold eller ikke, f.eks.
 * trackServiceAlert(true)
 * @param hasContent Boolean som sier om det er innhold i tjenesten eller ikke
 */
export const trackServiceAlert = (hasContent: boolean): void => {
  if (isTrackingready(window)) {
    window.digitalData.user = {
      serviceAlert: hasContent ? 'Har innhold' : 'Har ikke innhold',
    };
    window._satellite.track('service alert');
  }
};

/**
 * Spor feil, f.eks.
 * trackError("level1", "Beskrivelse av feilen")
 * @param level Alvorlighetsgrad (level1, level2, level3 eller level4)
 * @param details Tekst som beskriver feilen
 */
export const trackError = (level: ErrorType, details?: string): void => {
  if (isTrackingready(window)) {
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
    window.digitalData.error = {
      siteError: !details ? errorType : `${errorType} – ${details}`,
    };
    window._satellite.track('site error');
  }
};
