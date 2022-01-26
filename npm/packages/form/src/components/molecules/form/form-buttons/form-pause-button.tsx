import * as React from 'react';
import { FunctionButton } from '../../../atoms/buttons/function-button';
import { ActionButton } from '../../../atoms/buttons/action-button';
import { DisplayButton } from '../../../atoms/buttons/display-button';
import Pause from '../../../icons/Pause';
import toolkitstyles from '../styles.module.scss';

interface FormPauseButtonProps {
  pauseButtonText?: string;
  /** Ekstra CSS-class som legges på pause knappen */
  pauseButtonClasses?: string;
  /** Pause button type. Default is 'action' */
  pauseButtonType?: 'action' | 'display' | 'function';
  /** If the pause button is a primary, secondary or tertiary button */
  pauseButtonLevel?: 'primary' | 'secondary' | 'tertiary';
  /** If the pause button has an icon to be shown on the left - only possible if submitButtonType is 'display'  */
  pauseButtonLeftIcon?: JSX.Element;
  /** If the pause button is disabled  */
  pauseButtonDisabled?: boolean;
  /** Function som kalles ved pause */
  onPause?: () => void;
  /** Id som benyttes for å hente ut PauseButton i automatiske tester */
  pauseButtonTestId?: string;
}

const FormPauseButton: React.FC<FormPauseButtonProps> = (props: FormPauseButtonProps): JSX.Element | null => {
  if (!props.pauseButtonText || !props.onPause) {
    return null;
  }
  if (props.pauseButtonType === 'action') {
    return (
      <ActionButton
        primary={props.pauseButtonLevel === 'primary'}
        secondary={props.pauseButtonLevel === 'secondary'}
        tertiary={props.pauseButtonLevel === 'tertiary'}
        disabled={props.pauseButtonDisabled}
        className={`${toolkitstyles.form__buttonwrapper__button} ${
          props.pauseButtonClasses ? props.pauseButtonClasses : 'atom_actionbutton--pause'
        }`}
        onClick={props.onPause}
        testId={props.pauseButtonTestId}
      >
        {props.pauseButtonText}
      </ActionButton>
    );
  } else if (props.pauseButtonType === 'function') {
    return (
      <FunctionButton
        svgIcon={<Pause />}
        disabled={props.pauseButtonDisabled}
        className={`${toolkitstyles.form__buttonwrapper__button} ${
          props.pauseButtonClasses ? props.pauseButtonClasses : 'atom_functionbutton--pause'
        }`}
        onClick={props.onPause}
        testId={props.pauseButtonTestId}
      >
        {props.pauseButtonText}
      </FunctionButton>
    );
  } else if (props.pauseButtonType === 'display') {
    return (
      <DisplayButton
        primary={props.pauseButtonLevel === 'primary'}
        secondary={props.pauseButtonLevel === 'secondary'}
        tertiary={props.pauseButtonLevel === 'tertiary'}
        disabled={props.pauseButtonDisabled}
        className={`${toolkitstyles.form__buttonwrapper__button} ${
          props.pauseButtonClasses ? props.pauseButtonClasses : 'atom_actionbutton--pause'
        }`}
        onClick={props.onPause}
        leftIcon={props.pauseButtonLeftIcon}
        testId={props.pauseButtonTestId}
      >
        {props.pauseButtonText}
      </DisplayButton>
    );
  }
  return null;
};

export default FormPauseButton;
