/* REQUESTS */
export enum HttpStatusCode {
  Continue = 100,
  SwitchingProtocols = 101,
  OK = 200,
  Created = 201,
  Accepted = 202,
  NonAuthoritativeInformation = 203,
  NoContent = 204,
  ResetContent = 205,
  PartialContent = 206,
  MultipleChoices = 300,
  MovedPermanently = 301,
  Redirect = 302,
  SeeOther = 303,
  NotModified = 304,
  UseProxy = 305,
  Unused = 306,
  TemporaryRedirect = 307,
  BadRequest = 400,
  Unauthorized = 401,
  PaymentRequired = 402,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
  NotAcceptable = 406,
  ProxyAuthenticationRequired = 407,
  RequestTimeout = 408,
  Conflict = 409,
  Gone = 410,
  LengthRequired = 411,
  PreconditionFailed = 412,
  RequestEntityTooLarge = 413,
  RequestUriTooLong = 414,
  UnsupportedMediaType = 415,
  RequestedRangeNotSatisfiable = 416,
  ExpectationFailed = 417,
  UpgradeRequired = 426,
  InternalServerError = 500,
  NotImplemented = 501,
  BadGateway = 502,
  ServiceUnavailable = 503,
  GatewayTimeout = 504,
  HttpVersionNotSupported = 505,
}

export class TextMessage {
  Title: string;
  Body: string;
}

export interface OperationResponse extends Response {
  StatusCode: HttpStatusCode;
  InformationMessage: TextMessage;
  WarningMessage: TextMessage;
  ErrorMessage: TextMessage;
  RedirectUrl: string;
}

export enum TjenesteTilgangStatus {
  None = 0,
  Ja = 1,
  Nei = 2,
  VetIkke = 3,
}

export class TjenesteType {
  static TekniskTjeneste: number = -1;
  static IkkeInnloggetTjeneste: number = 0;
  static Timeavtaler: number = 1;
  static Fastlegetjenester: number = 6;
  static Legemidler: number = 7;
  static PersonligHelsearkiv: number = 8;
  static Fastlegevisning: number = 9;
  static InnsynPasientjournal: number = 10;
  static InnsynKjernejournal: number = 11;
  static Egenandeler: number = 12;
  static Profil: number = 13;
  static MinHelseForside: number = 15;
  static EksterneTjenester: number = 16;
  static Henvisninger: number = 17;
  static Pasientreiser: number = 18;
  static Forlopskoordinator: number = 19;
  static Meldinger: number = 20;
  static ByttFastlege: number = 21;
  static DialogForlop: number = 22;
  static DialogHelsehjelp: number = 23;
  static Fullmaktsadministrasjon: number = 24;
  static Helsekontakter: number = 25;
  static DialogOkonomi: number = 26;
  static Beslutningsstotte: number = 27;
  static DialogInnsyn: number = 28;
  static DialogPersonvern: number = 29;
  static Helseregistre: number = 30;
  static LoggOverBrukAvResepter: number = 31;
  static SykdomOgKritiskInformasjon: number = 32;
  static Forskning: number = 33;
  static MinHelse: number = 34;
  static Timeadministrasjon: number = 35;
  static Foreldresamtykke: number = 36;
  static DialogEgenHelseUngdom: number = 37;
  static KprTjenester: number = 38;
  static Vaksiner: number = 39;
  static LegemidlerLiB: number = 40;
  static InnsynRegisterinnhold: number = 41;
  static InnsynRegisterbruk: number = 42;
  static EKonsultasjon: number = 43;
  static Reseptfornyelse: number = 44;
  static EKontakt: number = 45;
  static Timebestilling: number = 46;
  static KritiskInfo: number = 47;
  static AapneKjernejournal: number = 48;
  static ProfildataOgKjernejournal: number = 49;
  static HelsekontakterIKjernejournal: number = 50;
  static LegemidlerFraKjernejournal: number = 51;
  static ProfildataOgKjernejournalReservasjon: number = 52;
  static PersonopplysningerFraKjernejournal: number = 53;
  static Donorkort: number = 54;
  static Samtykkeforesporsel: number = 55;
  static DialogForlopInformasjon: number = 56;
  static Pasientreiseradministrasjon: number = 57;
  static NyttHelsenorgeSamtykke: number = 58;
  static InngripendeForPersonvern: number = 59;
  static Skjemautfyller: number = 60;
  static SamvalgUtenLagring: number = 61;
  static MeldeFeilIBesokshistorikkKj: number = 62;
  static Verktoy: number = 63;
  static VerktoyUtforelse: number = 64;
  static InnsynRegisterinnholdReseptformidler: number = 65;
  static DialogSkjemaRegisterinnsyn: number = 66;
  static DialogSkjemaJournalinnsyn: number = 67;
  static DialogSkjemaHelsetjeneste: number = 68;
  static DialogSkjemaHelsetjenesteStreng: number = 69;
  static RegisterinnsynNasjonaleKvalitetsregister: number = 70;
  static ReiserMedRekvisisjon: number = 71;
}

export interface TjenesteTilgang {
  Tjeneste: number;
  Status: TjenesteTilgangStatus;
}

export type ISO8601 = string;

/* FULLMAKT OG SAMTYKKE */
export enum SamtykkeType {
  None = 0,
  Pha = 1,
  Bruksvilkar = 2,
  RefusjonPasientreiser = 3,
  UngdomsLosning = 4,
}

export enum SamtykkeLevel {
  None = 0,
  Registerinnsyn = 1,
  Journalinnsyn = 2,
  Helsetjeneste = 3,
}

export enum FullmaktType {
  OrdinaerFullmakt = 3,
  BekreftetFullmakt = 4,
  UtenSamtykkekompenanseOver12 = 7,
}

export enum SamtykkeStatusType {
  Samtykket = 0,
  Trukket = 1,
  Utsatt = 2,
}

/* REPRESENTASJONER */

export enum RepresentasjonforholdType {
  InnloggetBruker = 0,
  Fullmakt = 1,
  Foreldrerepresentasjon = 2,
  Saksbehandler = 3,
  SaksbehandlerFullmakt = 4,
}

export enum StatusKodeType {
  Reservert = 1,
  IkkeReservert = 2,
  Samtykket = 3,
  IkkeSamtykket = 4,
  TilgangsbegrensningOpprettet = 5,
  TilgangsbegrensningFjernet = 6,
  AnmodningTilbakeTrekkingSamtykke = 7,
}

export interface FullmaktEgenskaper {
  Analog: boolean;
  FullmaktType: FullmaktType;
}

export interface Samtykke {
  Type: SamtykkeType;
  PersonvernInnstillingDefinisjonGuid: any;
  Opprettet: ISO8601;
  StatusType: SamtykkeStatusType;
  SamtykketAvProfilGuid: any;
  SamtykketAvFornavn: string;
  SamtykketAvEtternavn: string;
  RepresentasjonforholdType: RepresentasjonforholdType;
  StatusKodeType: StatusKodeType;
  ErAktiv: boolean;
}
