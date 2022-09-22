import * as React from 'react';

import Button from '@helsenorge/designsystem-react/components/Button';

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
  const onClickHandler = (event?: React.FormEvent<{}>): void => {
    if (event) {
      event.preventDefault();
    }
    props.onFormSubmit(() => {
      if (props.onDraft) {
        props.onDraft();
      }
    });
  };

  if (!props.draftButtonText || !props.onDraft) {
    return null;
  }
  return (
    <Button
      variant={'outline'}
      formNoValidate
      wrapperClassName={`${toolkitstyles.form__buttonwrapper__button} ${props.draftButtonClasses}`}
      onClick={onClickHandler}
      data-testid={props.draftButtonTestId}
    >
      {props.draftButtonText}
    </Button>
  );
};

export default FormDraftButton;
