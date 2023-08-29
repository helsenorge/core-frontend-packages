import * as React from 'react';

import classNames from 'classnames';
import ReactAutosuggest, {
  ChangeEvent,
  SuggestionsFetchRequested,
  OnSuggestionSelected,
  OnSuggestionsClearRequested,
} from 'react-autosuggest';

import { isEmpty, hasInvalidCharacters } from '@helsenorge/core-utils/string-utils';
import ValidationError from '@helsenorge/form/components/form/validation-error';
import { Label } from '@helsenorge/form/components/label';

import autosuggesttheme from './theme.module.scss';

export interface Suggestion {
  label: string;
  optionalLabel?: string;
  value: string;
}

interface Props {
  /** En array med suggestions som skal vises */
  suggestions: Array<Suggestion>;
  /** Id som skal sendes ned til ReactAutosuggest */
  id: string;
  /** ClassName som skal settes på wrapper */
  className?: string;
  /** Verdien i input feltet - Synlig i feltet og blir sendt ned til ReactAutosuggest */
  value: string;
  /** Label som vises over ReactAutosuggest komponentet */
  label?: string | JSX.Element;
  /** Aria-label som sendes ned til ReactAutosuggest */
  ariaLabel?: string;
  /** Teksten til sub label, brukes som enkel hjelpetekst. Sublabel legges som et eget blokk-element nederst i <label> til dette feltet */
  subLabel?: string | JSX.Element;
  /** Type som sendes ned til ReactAutosuggest */
  type?: string;
  /** Funksjon som blir kalt når suggestions blir krevd - sendes til react-autosuggest */
  onSuggestionsFetchRequested: SuggestionsFetchRequested;
  /** Funksjon som skal sendes ned til react-autosuggest */
  onSuggestionSelected: OnSuggestionSelected<Suggestion>;
  /** Funksjon som blir kalt etter et suggestions clear er gjort */
  onSuggestionsClearRequested: OnSuggestionsClearRequested;
  /** Tilpasset funksjon for å definere markup'en som rendres for en suggestion i suggestionslisten */
  renderSuggestion?: (s: Suggestion) => JSX.Element;
  /** Funksjon som skal sendes ned til react-autosuggest */
  onChange: (e: React.FormEvent<{}>, params: ChangeEvent) => void;
  /** Funksjon som skal sendes ned til react-autosuggest */
  onBlur?: (e: React.FormEvent<{}>, params: ReactAutosuggest.BlurEvent<Suggestion>) => void;
  /** Funksjon som skal sendes ned til react-autosuggest */
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  /** Error melding som skal vises når en validering error skjer */
  errorMessage?: string;
  /** Om en validering burde skje og om error meldingen skal vises eller ikke - den vises opprinnelig */
  noValidation?: boolean;
  /** Om characterCheck, minLength og maxLength skal ignoreres i validate funksjonen */
  noCharacterValidation?: boolean;
  /** Validator funksjon som skal kjøres på validation */
  onSubmitValidator?: () => boolean;
  /** Om feltet er et krav */
  isRequired?: boolean;
  /** MinLength verdi som skal brukes internt i validation  */
  minLength?: number;
  /** MaxLength verdi som skal brukes internt i validation  */
  maxLength?: number;
  /** Hjelpetrigger som vises etter label */
  helpButton?: JSX.Element;
  /** Element som vises når man klikker på HelpButton */
  helpElement?: JSX.Element;
  /** Om fokus fortsatt skal være på input feltet etter suggestion er valgt - skal sendes ned til ReactAutosuggest */
  focusInputOnSuggestionClick?: boolean;
}

interface State {
  isValid: boolean;
  validated: boolean;
}

export default class Autosuggest extends React.Component<Props, State> {
  autosuggestRef: React.RefObject<ReactAutosuggest>;

  constructor(props: Props) {
    super(props);
    this.autosuggestRef = React.createRef();

    this.state = {
      isValid: true,
      validated: false,
    };
  }

  renderSuggestion = (suggestion: Suggestion): JSX.Element => (
    <span>
      {suggestion.label}
      {suggestion.optionalLabel && <em> {suggestion.optionalLabel}</em>}
    </span>
  );

  getSuggestionValue = (suggestion: Suggestion): string => (suggestion.label ? suggestion.label : '');

  onChange = (e: React.FormEvent<{}>, params: ChangeEvent): void => {
    const incomingValue = params.newValue;
    if (!this.props.noValidation && !this.validate(incomingValue)) {
      this.setState({ isValid: false });
    } else {
      this.setState({ isValid: true });
    }
    this.props.onChange(e, params);
  };

  onBlur = (e: React.FormEvent<{}>, params: ReactAutosuggest.BlurEvent<Suggestion>): void => {
    if (!this.props.noValidation) {
      this.setState({ validated: true });
    }
    if (this.props.onBlur) this.props.onBlur(e, params);
  };

  onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.keyCode === 13) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (this.props.onKeyDown) this.props.onKeyDown(e);
  };

  isValid = () => {
    return this.state.isValid;
  };

  validate = (incomingValue: string): boolean => {
    const { isRequired, minLength, maxLength, noCharacterValidation } = this.props;

    if (isRequired && isEmpty(incomingValue)) {
      return false;
    }
    if (!isRequired && isEmpty(incomingValue)) {
      return true;
    }
    if (!noCharacterValidation) {
      const valueLength = incomingValue.length;

      if (!isEmpty(incomingValue) && hasInvalidCharacters(incomingValue)) {
        return false;
      }
      if (!isEmpty(incomingValue) && minLength && valueLength < minLength) {
        return false;
      }
      if (!isEmpty(incomingValue) && maxLength && valueLength > maxLength) {
        return false;
      }
    }
    return true;
  };

  /* validating value coming from from state */
  validateField = () => {
    const { value, onSubmitValidator } = this.props;
    return new Promise<void>((resolve: () => void) => {
      if (onSubmitValidator) {
        const isValid = onSubmitValidator() && this.validate(value);
        this.setState({
          isValid,
          validated: true,
        });
        resolve();
      } else if (!this.validate(value)) {
        this.setState({
          isValid: false,
          validated: true,
        });
        resolve();
      } else {
        resolve();
      }
    });
  };

  renderErrorMessage = () => {
    const { noValidation, errorMessage } = this.props;
    const { isValid } = this.state;

    if (!noValidation) {
      return <ValidationError isValid={isValid} error={errorMessage} />;
    }
  };

  render(): JSX.Element {
    const {
      id,
      value,
      suggestions,
      className,
      label,
      subLabel,
      type,
      noValidation,
      isRequired,
      ariaLabel,
      helpButton,
      helpElement,
      onSuggestionSelected,
      onSuggestionsFetchRequested,
      onSuggestionsClearRequested,
      renderSuggestion,
      focusInputOnSuggestionClick,
    } = this.props;

    const { validated, isValid } = this.state;

    const inputProps = {
      id,
      value,
      type: type,
      'aria-label': ariaLabel,
      required: isRequired,
      maxLength: this.props.maxLength,
      minLength: this.props.minLength,
      onChange: this.onChange,
      onKeyDown: this.onKeyDown,
      onBlur: this.onBlur,
    };

    const wrapperClasses = classNames(className, {
      mol_validation: !noValidation,
      'mol_validation--active': !noValidation && validated && !isValid,
    });

    return (
      <div className={wrapperClasses} id={`${id}-wrapper`}>
        {this.renderErrorMessage()}
        {label && <Label labelText={label} htmlFor={id} sublabelText={subLabel} helpButton={helpButton} />}
        {helpElement ? helpElement : null}
        <ReactAutosuggest
          ref={this.autosuggestRef}
          theme={autosuggesttheme}
          suggestions={suggestions}
          inputProps={inputProps}
          onSuggestionsFetchRequested={onSuggestionsFetchRequested}
          onSuggestionsClearRequested={onSuggestionsClearRequested}
          onSuggestionSelected={onSuggestionSelected}
          getSuggestionValue={this.getSuggestionValue}
          renderSuggestion={renderSuggestion ? renderSuggestion : this.renderSuggestion}
          focusInputOnSuggestionClick={focusInputOnSuggestionClick || false}
        />
      </div>
    );
  }
}
