import * as React from 'react';

import classNames from 'classnames';
import moment from 'moment';

import toolkitstyles from './styles.module.scss';

interface Props {
  id: string;
  dateValue: moment.Moment | null;
  onChange: (date?: moment.Moment) => void;
  minimumDate?: moment.Moment;
  maximumDate?: moment.Moment;
  locale: moment.Locale;
  hasFullWidth?: boolean;
  disabled?: boolean;
}

const DateNativeInput: React.FC<Props> = (props: Props) => {
  const onChange = (e: React.FormEvent<HTMLInputElement>): void => {
    const incomingDate = e.currentTarget.value;

    if (!incomingDate) {
      props.onChange();
    } else {
      // moment.HTML5_FMT.DATE tilsvarer 'YYYY-MM-DD'
      const m: moment.Moment = moment(incomingDate, moment.HTML5_FMT.DATE, true);
      props.onChange(m);
    }
  };

  const { id, dateValue, minimumDate, maximumDate, hasFullWidth, disabled } = props;
  const classes = classNames({
    [toolkitstyles['datepicker__native-input']]: true,
    [toolkitstyles['datepicker__native-input--fullwidth']]: hasFullWidth,
    [toolkitstyles['datepicker__native-input--disabled']]: disabled,
  });

  return (
    <input
      id={id}
      className={classes}
      type="date"
      value={dateValue ? moment(dateValue).format(moment.HTML5_FMT.DATE) : undefined}
      min={minimumDate && moment(minimumDate).format(moment.HTML5_FMT.DATE)}
      max={maximumDate && moment(maximumDate).format(moment.HTML5_FMT.DATE)}
      onChange={onChange}
      disabled={disabled}
      aria-disabled={disabled}
    />
  );
};

export default DateNativeInput;
