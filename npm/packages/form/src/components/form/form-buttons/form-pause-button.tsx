import * as React from 'react';

import Button from '@helsenorge/designsystem-react/components/Button';
import { Icon, SvgIcon } from '@helsenorge/designsystem-react/components/Icon';

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
  pauseButtonLeftIcon?: SvgIcon;
  /** If the pause button is disabled  */
  pauseButtonDisabled?: boolean;
  /** Function som kalles ved pause */
  onPause?: () => void;
  /** Id som benyttes for å hente ut PauseButton i automatiske tester */
  pauseButtonTestId?: string;
}

const FormPauseButton: React.FC<FormPauseButtonProps> = (props: FormPauseButtonProps): JSX.Element | null => {
  const getButtonVariant = () => {
    if (props.pauseButtonType === 'function' || props.pauseButtonLevel === 'tertiary') {
      return 'borderless';
    } else if (props.pauseButtonLevel === 'secondary') {
      return 'outline';
    }

    return 'fill';
  };

  /** Stopper browser validation fra å trigge  */
  const onPauseHandler = (e?: React.MouseEvent<HTMLElement, MouseEvent>): void => {
    if (e) {
      e.preventDefault();
    }

    if (props.onPause) {
      props.onPause();
    }
  };

  if (!props.pauseButtonText || !props.onPause) {
    return null;
  }
  return (
    <Button
      variant={getButtonVariant()}
      disabled={props.pauseButtonDisabled}
      wrapperClassName={`${toolkitstyles.form__buttonwrapper__button} ${props.pauseButtonClasses}`}
      onClick={onPauseHandler}
      testId={props.pauseButtonTestId}
    >
      {!!props.pauseButtonLeftIcon && <Icon svgIcon={props.pauseButtonLeftIcon} />}
      {props.pauseButtonText}
    </Button>
  );
};

export default FormPauseButton;
