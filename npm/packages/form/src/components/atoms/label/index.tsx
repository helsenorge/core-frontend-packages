import * as React from 'react';

import classNames from 'classnames';

import { Sublabel } from './sublabel';

import toolkitstyles from './styles.module.scss';

interface Props {
  /** Tekst eller Element som vises i <label> node */
  labelText: string | JSX.Element;
  /** htmlFor HTML property som settes på <label> node */
  htmlFor?: string;
  /** Tekst eller Element som vises i <label> node */
  sublabelText?: string | JSX.Element;
  /** Element for hjelpeknapp */
  helpButton?: JSX.Element;
  /* CSS-classes som legges på selve knappen */
  className?: string;
  /** Legger CSSclasse for å styre font-weight på label  */
  isNotBold?: boolean;
  /** Optional ref som forwardes til HTMLButtonElement */
  ref?: React.RefObject<HTMLDivElement>;
  /** Id som benyttes for å hente ut komponent i automatiske tester */
  testId?: string;
}

export const Label = React.forwardRef<HTMLDivElement, React.PropsWithChildren<Props>>((
  { labelText, isNotBold, htmlFor, sublabelText, helpButton, className, children, testId },
  ref: React.RefObject<HTMLDivElement>
) => {
  const labelRef = React.useRef<HTMLDivElement>(null);

  const labelClasses = classNames(toolkitstyles['label'], { [toolkitstyles['label--isnotbold']]: isNotBold });
  return (
    <div ref={ref ? ref : labelRef} className={className ? className : ''}>
      <label className={labelClasses} htmlFor={htmlFor} data-testid={testId}>
        {labelText}
        {helpButton}
        {sublabelText && <Sublabel sublabelText={sublabelText} />}
      </label>
      {children}
    </div>
  );
});

export default Label;
