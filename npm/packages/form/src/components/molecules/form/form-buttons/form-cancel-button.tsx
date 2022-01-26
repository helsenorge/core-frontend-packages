import * as React from 'react';
import { ActionButton } from '../../../atoms/buttons/action-button';
import { DisplayButton } from '../../../atoms/buttons/display-button';
import toolkitstyles from '../styles.module.scss';

interface FormCancelButtonProps {
  /** The text to be shown on the cancel button */
  cancelButtonText?: string;
  /** The CSS classes to be added to the cancelbutton */
  cancelButtonClasses?: string;
  /** Om Avbryt knappen vises til venstre */
  cancelButtonLeft?: boolean;
  /** Om Avbryt knappen vises til høyre */
  cancelButtonRight?: boolean;
  /** Cancel button type. Default is 'action' */
  cancelButtonType?: 'action' | 'display';
  /** If the cancel button has an icon to be shown on the left - only possible if cancelButtonType is 'display' */
  cancelButtonLeftIcon?: JSX.Element;
  /** If the cancel button has an icon to be shown on the right - only possible if cancelButtonType is 'display' */
  cancelButtonRightIcon?: JSX.Element;
  /** If the cancel button is disabled  */
  cancelButtonDisabled?: boolean;
  /** Function som kalles ved klikk på Avrbyt */
  onCancel?: (event?: React.FormEvent<{}>) => void;
  /** Id som benyttes for å hente ut CancelButton i automatiske tester */
  cancelButtonTestId?: string;
}

const FormCancelButton: React.FC<FormCancelButtonProps> = (props: FormCancelButtonProps): JSX.Element | null => {
  if (!props.cancelButtonText || !props.onCancel) {
    return null;
  }

  if (props.cancelButtonType === 'display') {
    return (
      <DisplayButton
        tertiary
        className={`${toolkitstyles.form__buttonwrapper__button} ${props.cancelButtonClasses ? props.cancelButtonClasses : ''}`}
        onClick={props.onCancel}
        leftIcon={props.cancelButtonLeftIcon}
        rightIcon={props.cancelButtonRightIcon}
        disabled={props.cancelButtonDisabled}
        testId={props.cancelButtonTestId}
      >
        {props.cancelButtonText}
      </DisplayButton>
    );
  } else if (props.cancelButtonType === 'action') {
    return (
      <ActionButton
        tertiary
        disabled={props.cancelButtonDisabled}
        className={`${toolkitstyles.form__buttonwrapper__button} ${props.cancelButtonClasses ? props.cancelButtonClasses : ''}`}
        onClick={props.onCancel}
        testId={props.cancelButtonTestId}
      >
        {props.cancelButtonText}
      </ActionButton>
    );
  }
  return null;
};

export default FormCancelButton;
