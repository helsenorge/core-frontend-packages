import * as React from 'react';
import { SaveButton } from '../../../atoms/buttons/save-button';
import { ActionButton } from '../../../atoms/buttons/action-button';
import { DisplayButton } from '../../../atoms/buttons/display-button';
import toolkitstyles from '../styles.module.scss';

interface FormSubmitButtonProps {
  /** Teksten som vises på submit knappen */
  submitButtonText?: string;
  /** Ekstra CSS-class som legges på submit knappen */
  submitButtonClasses?: string;
  /** If the submit button has an icon to be shown on the left - only possible if submitButtonType is 'display' */
  submitButtonLeftIcon?: JSX.Element;
  /** If the submit button has an icon to be shown on the right - only possible if submitButtonType is 'display'  */
  submitButtonRightIcon?: JSX.Element;
  /** Submit button type. Default is 'action' */
  submitButtonType?: 'action' | 'display';
  /** If the submit button is disabled  */
  submitButtonDisabled?: boolean;
  /** Om Formen holder på med å lagre */
  saving?: boolean;
  /** Om Formen er lagret */
  saved?: boolean;
  /** Tekst som vises når formen holder på med å lagre (brukes videre på <SaveButton>) */
  saveText?: string;
  /** Tekst som vises når formen er lagret (brukes videre på <SaveButton>) */
  savedText?: string;
  /** Function som kalles som callback etter onSubmit når det brukes <SaveButton> component */
  saveButtonOnClick?: () => void;
  /** Function som kalles ved Submit */
  onSubmit?: (event?: React.FormEvent<{}>) => void;
  /** Id som benyttes for å hente ut SaveButton i automatiske tester */
  saveButtonTestId?: string;
  /** Id som benyttes for å hente ut SubmitButton i automatiske tester */
  submitButtonTestId?: string;
  /** onFormSubmit fra <Form> komponent */
  onFormSubmit: (cb: () => void) => void;
}

const FormSubmitButton: React.FC<FormSubmitButtonProps> = (props: FormSubmitButtonProps): JSX.Element | null => {
  const shouldUseSaveButton = (): boolean => {
    if (!props.saveButtonOnClick) {
      return false;
    }
    if (props.saving === null || props.saving === undefined) {
      return false;
    }
    if (props.saved === null || props.saved === undefined) {
      return false;
    }
    if (!props.saveText) {
      return false;
    }
    if (!props.savedText) {
      return false;
    }
    return true;
  };

  if (shouldUseSaveButton()) {
    return (
      <SaveButton
        onClick={(): void => {
          props.onFormSubmit(() => {
            if (props.saveButtonOnClick) {
              props.saveButtonOnClick();
            }
          });
        }}
        disabled={props.submitButtonDisabled}
        saving={props.saving}
        saved={props.saved}
        saveText={props.saveText}
        savedText={props.savedText}
        testId={props.saveButtonTestId}
      />
    );
  }

  if (!props.submitButtonText || !props.onSubmit) {
    return null;
  }
  if (props.submitButtonType === 'display') {
    return (
      <DisplayButton
        className={`${toolkitstyles.form__buttonwrapper__button} ${props.submitButtonClasses ? props.submitButtonClasses : ''}`}
        leftIcon={props.submitButtonLeftIcon}
        rightIcon={props.submitButtonRightIcon}
        disabled={props.submitButtonDisabled}
        formNoValidate
        primary
        onClick={(): void => {
          props.onFormSubmit(() => {
            if (props.onSubmit) {
              props.onSubmit();
            }
          });
        }}
        testId={props.submitButtonTestId}
      >
        {props.submitButtonText}
      </DisplayButton>
    );
  } else if (props.submitButtonType === 'action') {
    return (
      <ActionButton
        className={`${toolkitstyles.form__buttonwrapper__button} ${props.submitButtonClasses ? props.submitButtonClasses : ''}`}
        disabled={props.submitButtonDisabled}
        formNoValidate
        primary
        onClick={(): void => {
          props.onFormSubmit(() => {
            if (props.onSubmit) {
              props.onSubmit();
            }
          });
        }}
        testId={props.submitButtonTestId}
      >
        {props.submitButtonText}
      </ActionButton>
    );
  }
  return null;
};

export default FormSubmitButton;
