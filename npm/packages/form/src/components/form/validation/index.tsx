import * as React from 'react';
import { FormChild } from '..';

export interface ValidationProps {
  addFormComponent?: (component: FormChild) => void;
  removeFormComponent?: (component: FormChild) => void;
  onValidated?: (valid: boolean | undefined) => void;
  isSubmitted?: (isSubmitted: boolean | undefined) => void;
  optionalLabel?: string;
  requiredLabel?: string;
  showOptionalLabel?: boolean;
  showRequiredLabel?: boolean;
  /** Component som skal valideres */
  children?: JSX.Element;
  /** ref (callback function) forwarded when nested validating */
  refCallback?: (el: FormChild) => void;
}

export function Validation({
  addFormComponent,
  removeFormComponent,
  children,
  onValidated,
  showRequiredLabel,
  showOptionalLabel,
  requiredLabel,
  optionalLabel,
  refCallback,
}: ValidationProps): JSX.Element {
  const componentRef = React.useRef<FormChild | null>(null);

  /* replaces componentDidMount */
  React.useEffect(() => {
    if (addFormComponent && componentRef.current) {
      addFormComponent(componentRef.current);
    }
  }, []);

  /* replaces componentWillUnmount */
  React.useEffect(() => {
    return (): void => {
      if (removeFormComponent && componentRef.current) {
        removeFormComponent(componentRef.current);
      }
    };
  }, []);

  const clone = React.Children.map(children, child => {
    return React.cloneElement(child as JSX.Element, {
      ref: (el: FormChild) => {
        componentRef.current = el;
        if (refCallback) {
          refCallback(el);
        }
      },
      onValidated: onValidated,
      showRequiredLabel: showRequiredLabel,
      showOptionalLabel: showOptionalLabel,
      requiredLabel: requiredLabel,
      optionalLabel: optionalLabel,
    });
  });

  return <React.Fragment>{clone}</React.Fragment>;
}

export default Validation;
