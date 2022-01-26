import * as React from 'react';
import { Sublabel } from '../../atoms/label/sublabel';

interface Props {
  legend: string | JSX.Element;
  isRequired?: boolean;
  requiredLabel?: string;
  optionalLabel?: string;
  helpButton?: JSX.Element;
  subLabel?: string | JSX.Element;
}
export const DateTimePickerLegend: React.FC<Props> = ({
  legend,
  isRequired,
  requiredLabel,
  optionalLabel,
  helpButton,
  subLabel,
}: Props) => {
  return (
    <legend>
      {legend}
      {isRequired && requiredLabel ? <em> {requiredLabel}</em> : ''}
      {!isRequired && optionalLabel ? <em> {optionalLabel}</em> : ''}
      {helpButton}
      {subLabel && <Sublabel sublabelText={subLabel} />}
    </legend>
  );
};

export default DateTimePickerLegend;
