/* Utility for tracking using Adobe Analytics.
 *
 * Examples:
 * trackSelfService('start', 'Søknad', 'Velg rolle', 1, { pasientreiserApplication: 'Utvidet søknad', pasientreiserOnBehalfOf: 'self'});
 * trackSelfServiceIntent('Page title');
 * trackFilters('Filter name', 'usage');
 * trackPagePartner('Helse Nord RHF');
 * trackServiceAlert(true);
 * trackArticleTab('Legemidler');
 * trackUrlChange(window.location.href, window.location.pathname)
 * trackSearch('søkeord', 'Bytt fastlege søk', 10);
 * trackSearchThrough(1);
 * trackDonorCard(true);
 * trackError('level1' or 'level2');
 * trackProfileInteraction('Registrer fullmakt')
 * trackConsent('complete', 'Kvittering', 4, 'Nytt samtykke');
 * setValueForSelectedUser();
 * trackProsesshjelp('Prosesshjelp' , 'Hjelp' , 'Om Timeavtaler', 'Open' );
 */

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

export type SelfServiceTrackType =
  | "start"
  | "funnel"
  | "complete"
  | "cancel"
  | "continue later";
export type ConsentTrackType = "info" | "funnel" | "complete";
export type FiltersTrackType = "usage" | "expand" | "search" | "groupExpand";

// For tracking start, funnel and complete.
export function trackSelfService(
  trackType: SelfServiceTrackType,
  name: string,
  step: string,
  stepNumber: number,
  custom?: {}
) {
  const digitalData: DigitalData = window.digitalData || undefined;
  const _satellite: Satellite = window._satellite || undefined;

  if (digitalData && _satellite) {
    const selfService: SelfService = {
      selfServiceName: name,
      selfServiceFunnelStep: step,
      selfServiceFunnelStepNumber: stepNumber
    };

    if (trackType === "start") {
      selfService.selfServiceStart = "true";
    }
    if (trackType === "funnel") {
      selfService.selfServiceFunnel = "true";
    }
    if (trackType === "complete") {
      selfService.selfServiceComplete = "true";
    }
    if (trackType === "cancel") {
      selfService.selfServiceCancel = "true";
    }
    if (trackType === "continue later") {
      selfService.selfServiceContinueLater = "true";
    }

    digitalData.selfService = { ...selfService, ...custom };

    _satellite.track(`self service ${trackType}`);
  }
}

// For tracking intent.
export function trackSelfServiceIntent(engagementName: string, custom?: {}) {
  const digitalData: DigitalData = window.digitalData || undefined;
  const _satellite: Satellite = window._satellite || undefined;

  if (digitalData && _satellite) {
    digitalData.selfService = {
      selfServiceEngagement: "true",
      selfServiceEngagementName: engagementName,
      ...custom
    };

    _satellite.track(`self service intent`);
  }
}

export function trackUrlChange(url: string, pathName: string) {
  const digitalData: DigitalData = window.digitalData || undefined;
  const _satellite: Satellite = window._satellite || undefined;

  const guidPattern = new RegExp(
    "[a-zA-Z0-9]{8}[-]?([a-zA-Z0-9]{4}[-]?){3}[a-zA-Z0-9]{12}"
  );
  const intPattern = /\d+/gm;

  const path = removeNamesAndOtherIds(pathName)
    .split("/")
    .filter(
      o =>
        !isEmpty(o) &&
        !guidPattern.test(o) &&
        !intPattern.test(o) &&
        o !== "{id}"
    );

  if (digitalData && digitalData.page && digitalData.page.pageInfo) {
    const urlSplit = removeNamesAndOtherIds(url).split("://");
    if (urlSplit.length > 1) {
      digitalData.page.pageInfo.pageURL = urlSplit[1]
        .replace(guidPattern, "{guid}")
        .replace(intPattern, "{id}");
    }

    digitalData.page.pageInfo.pageName = "Tjenester:" + path.join(":");
  }

  if (digitalData && digitalData.page && digitalData.page.category) {
    digitalData.page.category.siteSectionLevel2 =
      path.length > 1 ? path[1] : "";
    digitalData.page.category.contentType = "";
    digitalData.page.category.registerName = getRegisterName(path);
    digitalData.page.category.contentGrouping = getContentGrouping(
      digitalData,
      path
    );
  }

  // Forhindre at login trackes 2 ganger når man kommer fra idporten
  if (digitalData && digitalData.user && digitalData.user.login) {
    digitalData.user = {};
  }

  if (_satellite && _satellite.track) {
    _satellite.track("lightbox");
  }
}

// For tracking contentGrouping
function getContentGrouping(
  digitalData: DigitalData | undefined,
  path: string[]
): string {
  let group =
    digitalData && digitalData.page && digitalData.page.category
      ? digitalData.page.category.contentGrouping
      : "";

  if (path.length > 0) {
    switch (true) {
      case path.length > 1 && path[1] === "avtale":
        group = "timeavtaler";
        return group;
      case path[0] === "bestill-time":
      case path[0] === "e-konsultasjon":
      case path[0] === "forny-resept":
      case path[0] === "kontakt-legekontoret":
        group = "Fastlegen";
        return group;

      default:
        group = path[0] ? path[0] : "";
        return group;
    }
  } else {
    return "";
  }
}

// For tracking registerName on diffrent Helseregistre pages
function getRegisterName(path: string[]): string {
  switch (path.length > 0) {
    case path[0] === "helseregistre":
    case path[0] === "mfr":
    case path[0] === "sysvak":
    case path[0] === "visregisterinnsyn":
    case path[0] === "reseptformidleren":
      try {
        if (document.title.substr(0, 8) === "Innsyn i") {
          return document.title.substr(8, document.title.length);
        } else {
          return document.title.split("-")[0].trimRight();
        }
      } catch (e) {
        return document.title;
      }
  }
  return "";
}

export function trackConsent(
  consentTrackType: ConsentTrackType,
  stepName: string,
  stepNumber: number,
  consentType: "Nytt samtykke" | "Endre samtykke"
) {
  const digitalData: DigitalData = window.digitalData || undefined;
  const _satellite: Satellite = window._satellite || undefined;

  if (digitalData && _satellite) {
    const selfService: ConsentSelfService = {
      consentFunnelName: "Samtykkeflyt",
      consentType: consentType,
      consentFunnelStep: stepName,
      consentFunnelStepNumber: stepNumber
    };

    let trackText: string | undefined = undefined;

    if (consentTrackType === "info") {
      selfService.consentStart = "true";
      trackText = "consent start";
    }
    if (consentTrackType === "funnel") {
      selfService.consentFunnel = "true";
      trackText = "consent funnel";
    }

    if (consentTrackType === "complete") {
      selfService.consentComplete = "true";
      trackText = "consent complete";
    }

    digitalData.selfService = selfService;
    if (trackText) {
      _satellite.track(trackText);
    }
  }
}

function isEmpty(s: string) {
  return s === "" || s === null || s === undefined;
}

export function removeNamesAndOtherIds(s: string) {
  const koordinatorPattern = new RegExp("koordinator/(.+)$");
  const helsefagligPattern = new RegExp("helsefagligkontakt/(.+)$");
  const kommunePattern = new RegExp("kommune/(.+)$");
  const avtalePattern = new RegExp("avtale/((.+)(/)|(.+)$)");

  return s
    .replace(koordinatorPattern, "koordinator")
    .replace(helsefagligPattern, "helsefagligkontakt")
    .replace(kommunePattern, "kommune")
    .replace(avtalePattern, "avtale/{id}/");
}

// For tracking filters
export function trackFilters(name: string, trackType: FiltersTrackType) {
  const digitalData: DigitalData = window.digitalData || undefined;
  const _satellite: Satellite = window._satellite || undefined;

  if (digitalData && _satellite) {
    digitalData.filters = {
      filterName: name
    };

    if (trackType === "usage") {
      digitalData.filters.filterUsage = "true";
      _satellite.track("filter use");
    }
    if (trackType === "expand") {
      digitalData.filters.filterExpand = "true";
      _satellite.track("filter expand");
    }

    if (trackType === "groupExpand") {
      digitalData.filters.filterGroupExpand = "true";
      _satellite.track("filter group expand");
    }

    if (trackType === "search") {
      digitalData.filters.filterSearch = "true";
      _satellite.track("filter search");
    }
  }
}

// For tracking pageInfo partner
export function trackPagePartner(partner: string) {
  const digitalData: DigitalData = window.digitalData || undefined;

  if (digitalData && digitalData.page && digitalData.page.pageInfo) {
    digitalData.page.pageInfo.partner = partner;
  }
}

// For tracking pageInfo partner
export function trackServiceAlert(hasContent: boolean) {
  const digitalData: DigitalData = window.digitalData || undefined;
  const _satellite: Satellite = window._satellite || undefined;

  if (digitalData && _satellite) {
    digitalData.user = {
      serviceAlert: hasContent ? "Har innhold" : "Har ikke innhold"
    };
    _satellite.track("service alert");
  }
}

// For tracking unread alerts and unread messagses
export function trackUnreadAlert(hasUnReadAlerts: boolean) {
  const digitalData: DigitalData = window.digitalData || undefined;
  const _satellite: Satellite = window._satellite || undefined;

  if (digitalData && _satellite) {
    digitalData.user = {
      unReadAlerts: hasUnReadAlerts ? true : false
    };
    _satellite.track("first logged in page");
  }
}

// For tracking unread alerts and unread messagses
export function trackUnreadMessage(hasUnReadMessages: boolean) {
  const digitalData: DigitalData = window.digitalData || undefined;
  const _satellite: Satellite = window._satellite || undefined;

  if (digitalData && _satellite) {
    digitalData.user = {
      unReadMessages: hasUnReadMessages ? true : false
    };
    _satellite.track("first logged in page");
  }
}

// For tracking article tab name
export function trackArticleTab(tabName: string) {
  const digitalData: DigitalData = window.digitalData || undefined;
  const _satellite: Satellite = window._satellite || undefined;

  if (digitalData && _satellite) {
    digitalData.articletab = {
      tabName: tabName,
      tabClick: "true"
    };
    _satellite.track("tab click");
  }
}

// For tracking search
export function trackSearch(term: string, name: string, resultsCount: number) {
  const digitalData: DigitalData = window.digitalData || undefined;
  const _satellite: Satellite = window._satellite || undefined;

  if (digitalData && _satellite) {
    digitalData.search = {
      searchTerm: term,
      searchType: name,
      resultsCount: resultsCount,
      searchCount: "true"
    };

    if (resultsCount === 0) {
      digitalData.search.nullResult = "true";
      _satellite.track("search null results");
    } else {
      _satellite.track("internal search");
    }
  }
}

// For tracking search click through
export function trackSearchThrough(searchposition: number) {
  const digitalData: DigitalData = window.digitalData || undefined;
  const _satellite: Satellite = window._satellite || undefined;

  if (digitalData && _satellite) {
    digitalData.search = {
      clickThrough: "true",
      searchposition: searchposition
    };

    _satellite.track("search click through");
  }
}

// For tracking donor card
export function trackDonorCard(smsAlert: boolean) {
  const digitalData: DigitalData = window.digitalData || undefined;
  const _satellite: Satellite = window._satellite || undefined;

  if (digitalData && _satellite) {
    digitalData.donorCard = {
      NextOfKin: "true",
      smsAlert: smsAlert ? "true" : "false"
    };
    _satellite.track("donor card NextOfKin");
  }
}

// For tracking profile interaction
export function trackProfileInteraction(name: string) {
  const digitalData: DigitalData = window.digitalData || undefined;
  const _satellite: Satellite = window._satellite || undefined;

  if (digitalData && _satellite) {
    digitalData.user = {
      profileInteraction: "true",
      profileInteractionName: name
    };
    _satellite.track("profile interaction");
  }
}

// Sets value for "user", for use after selecting main user in people picker (personvelger)
export function setValueForSelectedUser() {
  const digitalData: DigitalData = window.digitalData || undefined;

  if (digitalData && digitalData.page) {
    digitalData.page.user = { onBehalfOf: "Eget bruk", role: "Eget bruk" };
  }
}

export type ProsesshjelpActionType = "Open" | "Close";
export function trackProsesshjelp(
  name: string,
  toolType: string,
  label: string,
  actionType: ProsesshjelpActionType
) {
  const digitalData: DigitalData = window.digitalData || undefined;
  const _satellite: Satellite = window._satellite || undefined;

  if (digitalData && _satellite) {
    digitalData.tool = {
      toolName: name,
      toolType: toolType,
      toolLabels:
        actionType === "Close" && digitalData.tool
          ? digitalData.tool.toolLabels
          : label,
      toolAction: actionType
    };
    _satellite.track(actionType + " context help");
  }
}

export type ErrorType = "level1" | "level2" | "level3";
// For tracking error
export function trackError(level: ErrorType) {
  const digitalData: DigitalData = window.digitalData || undefined;
  const _satellite: Satellite = window._satellite || undefined;

  if (digitalData && _satellite) {
    let errorType;
    if (level === "level1") {
      errorType = "Nivå 1: Teknisk feil";
    } else if (level === "level2") {
      errorType = "Nivå 2: Driftsmelding";
    } else if (level === "level3") {
      errorType = "Nivå 3: JavaScript feil";
    } else {
      return;
    }
    digitalData.error = {
      siteError: errorType
    };
    _satellite.track("site error");
  }
}
