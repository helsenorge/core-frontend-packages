import * as React from 'react';
import { UnmountClosed } from 'react-collapse';

import './../styles.scss';
export interface ValidationErrorProps {
  /** Om komponenten vises eller ikke */
  isValid: boolean;
  /** Error objektet som visning av feilmeldingen baserer seg på */
  error: string | (() => string);
  /** Ekstra CSS-class som legges på UnmountClosed component  */
  className?: string;
  /** Ekstra CSS-class som legges på mol_validation__errortext div'en */
  textClassName?: string;
  /** Id som benyttes for å hente ut komponent i automatiske tester */
  testId?: string;
}

export const ValidationError: React.FC<ValidationErrorProps> = ({
  className,
  error,
  isValid,
  textClassName,
  testId,
}: ValidationErrorProps) => {
  let componentError = '';
  if (error) {
    componentError = typeof error === 'string' ? error : error();
  }
  return (
    <UnmountClosed isOpened={!isValid} className={className}>
      <div className={textClassName ? textClassName : 'mol_validation__errortext'} data-testid={testId}>
        {componentError}
      </div>
    </UnmountClosed>
  );
};

export default ValidationError;
