import * as React from 'react';

import Button from '@helsenorge/designsystem-react/components/Button';
import Icon, { SvgIcon } from '@helsenorge/designsystem-react/components/Icons';

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
  cancelButtonLeftIcon?: SvgIcon;
  /** If the cancel button is disabled  */
  cancelButtonDisabled?: boolean;
  /** Function som kalles ved klikk på Avrbyt */
  onCancel?: (event?: React.FormEvent<{}>) => void;
  /** Id som benyttes for å hente ut CancelButton i automatiske tester */
  cancelButtonTestId?: string;
  /** Setter outline variant på CancelButton */
  cancelButtonOutline?: boolean;
}

const FormCancelButton: React.FC<FormCancelButtonProps> = (props: FormCancelButtonProps): JSX.Element | null => {
  if (!props.cancelButtonText || !props.onCancel) {
    return null;
  }

  /** Stopper browser validation fra å trigge  */
  const onCancelHandler = (e?: React.MouseEvent<HTMLElement, MouseEvent>): void => {
    if (e) {
      e.preventDefault();
    }

    if (props.onCancel) {
      props.onCancel(e);
    }
  };

  return (
    <Button
      variant={props.cancelButtonOutline ? 'outline' : 'borderless'}
      wrapperClassName={`${toolkitstyles.form__buttonwrapper__button} ${props.cancelButtonClasses ? props.cancelButtonClasses : ''}`}
      onClick={onCancelHandler}
      disabled={props.cancelButtonDisabled}
      testId={props.cancelButtonTestId}
    >
      {!!props.cancelButtonLeftIcon && <Icon svgIcon={props.cancelButtonLeftIcon} />}
      {props.cancelButtonText}
    </Button>
  );
};

export default FormCancelButton;
