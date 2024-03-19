import * as React from 'react';

import ReactAutosuggest, { AutosuggestPropsBase, InputProps, RenderSuggestion } from 'react-autosuggest';

import ErrorWrapper from '@helsenorge/designsystem-react/components/ErrorWrapper';
import { renderLabel } from '@helsenorge/designsystem-react/components/Label';
import { FormMode } from '@helsenorge/designsystem-react/constants';
import { useUuid } from '@helsenorge/designsystem-react/hooks/useUuid';

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
  /** Tilpasset funksjon for å definere markup'en som rendres for en suggestion i suggestionslisten */
  renderSuggestion?: RenderSuggestion<T>;
}

const renderSuggestion = (suggestion: Suggestion): JSX.Element => (
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

const Autosuggest = React.forwardRef<ReactAutosuggest, Props<Suggestion>>((props, ref) => {
  const inputId = useUuid(props.inputProps.id);

  // @todo inputProps må bruke aria-labeledby error-en slik som i PR i designsystemet
  return (
    <ErrorWrapper errorText={props.errorText}>
      <div className={props.className}>
        {renderLabel(props.label, inputId, props.error ? FormMode.oninvalid : FormMode.onwhite)}
        <ReactAutosuggest
          ref={ref}
          theme={styles}
          suggestions={props.suggestions}
          inputProps={{ ...props.inputProps, id: inputId, 'aria-invalid': props.error }}
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
});

Autosuggest.displayName = 'Autosuggest';

export default Autosuggest;
