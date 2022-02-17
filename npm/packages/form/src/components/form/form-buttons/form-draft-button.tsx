import * as React from 'react';
import toolkitstyles from '../styles.module.scss';

interface FromDraftButtonProps {
  /** Teksten som vises på lagre knappen */
  draftButtonText?: string;
  /** Ekstra CSS-class som legges på lagre knappen */
  draftButtonClasses?: string;
  /** Function som kalles ved lagring */
  onDraft?: (event?: React.FormEvent<{}>) => void;
  /** Id som benyttes for å hente ut DraftButton i automatiske tester */
  draftButtonTestId?: string;
  /** onFormSubmit fra <Form> komponent */
  onFormSubmit: (cb: () => void) => void;
}

const FormDraftButton: React.FC<FromDraftButtonProps> = (props: FromDraftButtonProps): JSX.Element | null => {
  if (!props.draftButtonText || !props.onDraft) {
    return null;
  }
  return (
    <button
      type="button"
      formNoValidate
      className={`${toolkitstyles.form__buttonwrapper__button} ${
        props.draftButtonClasses ? props.draftButtonClasses : 'atom_actionbutton atom_actionbutton--secondary'
      }`}
      onClick={(): void => {
        props.onFormSubmit(() => {
          if (props.onDraft) {
            props.onDraft();
          }
        });
      }}
      data-testid={props.draftButtonTestId}
    >
      {props.draftButtonText}
    </button>
  );
};

export default FormDraftButton;