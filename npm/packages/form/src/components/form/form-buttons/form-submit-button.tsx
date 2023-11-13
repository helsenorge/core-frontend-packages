import * as React from 'react';

import Button from '@helsenorge/designsystem-react/components/Button';
import Icon from '@helsenorge/designsystem-react/components/Icon';
import ArrowRight from '@helsenorge/designsystem-react/components/Icons/ArrowRight';

import toolkitstyles from '../styles.module.scss';

interface FormSubmitButtonProps {
  /** Teksten som vises på submit knappen */
  submitButtonText?: string;
  /** Ekstra CSS-class som legges på submit knappen */
  submitButtonClasses?: string;
  /** If the submit button has an icon to be shown on the left - only possible if submitButtonType is 'display' */
  submitButtonLeftIcon?: boolean;
  /** If the submit button has an icon to be shown on the right - only possible if submitButtonType is 'display'  */
  submitButtonRightIcon?: boolean;
  /** Submit button type. Default is 'action' */
  submitButtonType?: 'action' | 'display';
  /** If the submit button is disabled  */
  submitButtonDisabled?: boolean;
  /** Function som kalles ved Submit */
  onSubmit?: (event?: React.FormEvent<{}>) => void;
  /** Id som benyttes for å hente ut SubmitButton i automatiske tester */
  submitButtonTestId?: string;
  /** onFormSubmit fra <Form> komponent */
  onFormSubmit: (cb: () => void) => void;
}

const FormSubmitButton: React.FC<FormSubmitButtonProps> = (props: FormSubmitButtonProps): JSX.Element | null => {
  const onClickHandler = (event?: React.FormEvent<{}>): void => {
    if (event) {
      event.preventDefault();
    }
    props.onFormSubmit(() => {
      if (props.onSubmit) {
        props.onSubmit(event);
      }
    });
  };

  if (!props.submitButtonText || !props.onSubmit) {
    return null;
  }
  if (props.submitButtonType === 'display' || props.submitButtonType === 'action') {
    return (
      <Button
        variant={props.submitButtonType === 'display' ? 'fill' : 'outline'}
        wrapperClassName={`${toolkitstyles.form__buttonwrapper__button} ${props.submitButtonClasses ? props.submitButtonClasses : ''}`}
        disabled={props.submitButtonDisabled}
        formNoValidate
        onClick={onClickHandler}
        testId={props.submitButtonTestId}
        arrow={props.submitButtonRightIcon}
      >
        {props.submitButtonLeftIcon && <Icon svgIcon={ArrowRight} />}
        {props.submitButtonText}
      </Button>
    );
  }
  return null;
};

export default FormSubmitButton;
