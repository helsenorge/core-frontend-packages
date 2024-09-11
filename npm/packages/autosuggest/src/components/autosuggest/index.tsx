import * as React from 'react';

import ReactAutosuggest, { AutosuggestPropsBase, InputProps, RenderSuggestion } from 'react-autosuggest';

import ErrorWrapper from '@helsenorge/designsystem-react/components/ErrorWrapper';
import { renderLabel } from '@helsenorge/designsystem-react/components/Label';
import { FormMode } from '@helsenorge/designsystem-react/constants';
import { useUuid } from '@helsenorge/designsystem-react/hooks/useUuid';
import { getAriaDescribedBy } from '@helsenorge/designsystem-react/utils/accessibility';

import styles from './styles.module.scss';

export interface Suggestion {
  label: string;
  value: string;
  optionalLabel?: string;
}

interface Props<T>
  extends Pick<
    AutosuggestPropsBase<T>,
    'focusInputOnSuggestionClick' | 'onSuggestionsClearRequested' | 'onSuggestionSelected' | 'onSuggestionsFetchRequested'
  > {
  /** En array med suggestions som skal vises */
  suggestions: Array<T>;
  /** Props som sendes ned til ReactAutosuggest */
  inputProps: InputProps<T>;
  /** ClassName som skal settes på wrapper */
  className?: string;
  /** Label som vises over ReactAutosuggest komponentet */
  label?: React.ReactNode;
  /** Activates Error style for the input */
  error?: boolean;
  /** Error text to show above the component */
  errorText?: string;
  /** Error text to show above the component */
  errorTextId?: string;
  /** Class name to pass to ErrorWrapper */
  errorWrapperClassName?: string;
  /** Tilpasset funksjon for å definere markup'en som rendres for en suggestion i suggestionslisten */
  renderSuggestion?: RenderSuggestion<T>;
}

const renderSuggestion = (suggestion: Suggestion): React.JSX.Element => (
  <span>
    {suggestion.label}
    {suggestion.optionalLabel && (
      <>
        {' '}
        <em>{suggestion.optionalLabel}</em>
      </>
    )}
  </span>
);

const getSuggestionValue = (suggestion: Suggestion): string => (suggestion.label ? suggestion.label : '');

const Autosuggest: React.FC<Props<Suggestion>> = props => {
  const inputId = useUuid(props.inputProps.id);
  const errorTextUuid = useUuid(props.errorTextId);

  const inputProps: InputProps<Suggestion> = {
    ...props.inputProps,
    id: inputId,
    'aria-invalid': props.error,
    'aria-describedby': getAriaDescribedBy({ ...props.inputProps, ...props }, errorTextUuid),
  };

  return (
    <ErrorWrapper errorText={props.errorText} errorTextId={errorTextUuid} className={props.errorWrapperClassName}>
      <div className={props.className}>
        {renderLabel(props.label, inputId, props.error ? FormMode.oninvalid : FormMode.onwhite)}
        <ReactAutosuggest
          theme={styles}
          suggestions={props.suggestions}
          inputProps={inputProps}
          onSuggestionsFetchRequested={props.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={props.onSuggestionsClearRequested}
          onSuggestionSelected={props.onSuggestionSelected}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={props.renderSuggestion ? props.renderSuggestion : renderSuggestion}
          focusInputOnSuggestionClick={props.focusInputOnSuggestionClick || false}
        />
      </div>
    </ErrorWrapper>
  );
};

export default Autosuggest;
