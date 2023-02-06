import { SingleDatePickerPhrases } from 'react-dates';

import { Props as DateRangePickerProps, DatePickerErrorPhrases } from '../date-range-picker/date-range-picker-types';
import { TimeResources } from '../time-input';

export interface DateTimePickerResources {
  dateResources?: SingleDatePickerPhrases;
  dateErrorResources?: DatePickerErrorPhrases;
  timeResources?: TimeResources;
}

export interface DateTimePickerProps {
  /** GENERELT */
  /** Unik ID */
  id: string;
  /** Dato som er valgt når man åpner DateTimeInput */
  dateValue?: moment.Moment;
  /** Tidspunkt som er valgt når man åpner DateTimeInput */
  timeValue?: string;
  /** Definerer hvilken locale moment bruker - default en 'nb-NO'  */
  locale?: DateRangePickerProps['locale'];
  /** Strings som skal brukes i DatePickeren og Timefeltet */
  resources?: DateTimePickerResources;
  /** Function som kalles når fokus går bort fra feltet */
  onBlur?: (date: moment.Moment | undefined, time: string | undefined) => void;
  /** Function som kalles når en dato velges */
  onChange?: (date: moment.Moment | undefined, time: string | undefined) => void;
  /** Function som kalles når datoen valideres riktig */
  onValidated?: (valid: boolean | undefined) => void;
  /** Ekstra CSS-class som legges på div'en */
  className?: string;
  /** Legend som vises før feltene */
  legend: string | JSX.Element;
  /** Teksten til sub label, brukes som enkel hjelpetekst. Sublabel legges som et eget blokk-element nederst i <legend> til dette feltet */
  subLabel?: string | JSX.Element;
  /** Minimal dato/tid som kan velges */
  minimumDateTime?: moment.Moment;
  /** Maskimal dato/tid som kan velges */
  maximumDateTime?: moment.Moment;
  /** Om feltet er påkrevd */
  isRequired?: boolean; // TO-DO hva skjer når den ene er required og ikke den andre - bør dokumenteres
  /** ErrorMessages string eller method som brukes istedenfor andre sjekk */
  errorMessage?: string | ((date: moment.Moment | undefined, time: string | undefined) => string);
  /** Teksten til required label */
  requiredLabel?: string;
  /** Teksten til optional label */
  optionalLabel?: string;
  /** Om required label skal vises eller ikke */
  showRequiredLabel?: boolean;
  /** Om ekstra label skal vises eller ikke */
  showOptionalLabel?: boolean;
  /** Hjelpetrigger som vises etter label */
  helpButton?: JSX.Element;
  /** Element som vises når man klikker på HelpButton */
  helpElement?: JSX.Element;
  /** DATERANGEPICKER: Label til Datepicker'en */
  dateLabel?: string;
  /** DATERANGEPICKER: Tekst placeholder for datoen */
  datePlaceholder?: string;
  /** DATERANGEPICKER: Ekstra CSS-class som legges på div'en rundt <TimeInput> komponent */
  dateClassName?: string;
  /** Dato visningen i kalenderen starter i. Brukes kun når minimumDate ikke er i bruk. default er faktisk value, og 'now' */
  initialDate?: moment.Moment;
  /** DATERANGEPICKER: Om datofeltet er påkrevd */
  isDateRequired?: boolean;
  /** DATERANGEPICKER: Om datepickeren er disabled */
  isDateDisabled?: boolean;
  /** TIME INPUT: Label til timefeltet */
  timeLabel?: string;
  /** TIME INPUT: Ekstra CSS-class som legges på div'en rundt <TimeInput> komponent */
  timeClassName?: string;
  /** TIME INPUT: Minimum time som er tillatt */
  minimumHour?: number;
  /** TIME INPUT: Maks time som er tillatt */
  maximumHour?: number;
  /** TIME INPUT: Minimum minutt som er tillatt */
  minimumMinute?: number;
  /** TIME INPUT:  Maks minutt som er tillatt */
  maximumMinute?: number;
  /** TIME INPUT: Om timefeltet er påkrevd */
  isTimeRequired?: boolean;
  /** TIME INPUT: Om timefeltet er disabled */
  isTimeDisabled?: boolean;
  /** TIME INPUT: Callback-funksjon som brukes til å logge feil til server */
  logCallback?: (message?: string, ...optionalParams: unknown[]) => void;
}

export interface DateTimePickerState {
  valid: boolean;
  validated: boolean;
  date?: moment.Moment;
  time?: string;
  errorString?: string;
}
