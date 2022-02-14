import * as React from 'react';

import { LanguageLocales } from '@helsenorge/core-utils/constants/languages';
import { DEFAULT_FORMAT_INDICATION_NB, DEFAULT_FORMAT_INDICATION_EN, DEFAULT_FORMAT_INDICATION_SE } from '../../constants/datetime';
import toolkitstyles from './styles.module.scss';
import { Props as DateRangePickerProps } from './date-range-picker-types';
import { Sublabel } from '@helsenorge/form/components/label/sublabel';

interface Props {
  label: string | JSX.Element;
  locale?: DateRangePickerProps['locale'];
  isRequired: boolean;
  isLabelHidden?: boolean;
  requiredLabel?: string;
  optionalLabel?: string;
  helpButton?: JSX.Element;
  subLabel?: string | JSX.Element;
}
export const DateRangePickerLabel: React.FC<Props> = ({
  label,
  locale,
  isLabelHidden,
  isRequired,
  requiredLabel,
  optionalLabel,
  helpButton,
  subLabel,
}: Props) => {
  let formatIndication = '';

  switch (locale) {
    case LanguageLocales.ENGLISH:
      formatIndication = DEFAULT_FORMAT_INDICATION_EN;
      break;
    case LanguageLocales.SAMI_NORTHERN:
      formatIndication = DEFAULT_FORMAT_INDICATION_SE;
      break;
    default:
      formatIndication = DEFAULT_FORMAT_INDICATION_NB;
  }

  return (
    <legend className={toolkitstyles['datepicker__legend']}>
      <span
        className={`${toolkitstyles['datepicker__legend__label']} ${
          isLabelHidden ? toolkitstyles['datepicker__legend__label--hidden'] : ''
        }`}
      >
        {label}
      </span>
      {isRequired && requiredLabel ? <em className={toolkitstyles['datepicker__legend__sublabel']}> {requiredLabel}</em> : ''}
      <em className={toolkitstyles['datepicker__legend__sublabel']}>
        {' '}
        {!isRequired && optionalLabel ? `${formatIndication} ${optionalLabel}` : formatIndication}
      </em>
      {helpButton}
      {subLabel && <Sublabel sublabelText={subLabel} />}
    </legend>
  );
};

export default DateRangePickerLabel;
