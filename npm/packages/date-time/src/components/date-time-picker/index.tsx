import * as React from 'react';

import classNames from 'classnames';
import moment from 'moment';

import ValidationError from '@helsenorge/form/components/form/validation-error';

import { DateRangePicker } from '../date-range-picker';
import { Phrases, ErrorPhrases } from '../date-range-picker/date-range-picker-utils';
import datepickerstyles from '../date-range-picker/styles.module.scss';
import TimeInput from '../time-input';
import DateTimePickerLegend from './date-time-picker-legend';
import { DateTimePickerProps, DateTimePickerState } from './date-time-picker-types';
import { getFullMomentDate, isFullDateTimeValid, getErrorString } from './date-time-picker-utils';

import toolkitstyles from './styles.module.scss';

export default class DateTime extends React.Component<DateTimePickerProps, DateTimePickerState> {
  static hnFormComponent = true;

  wrapperRef: React.RefObject<HTMLDivElement>;
  dateInputRef: React.RefObject<DateRangePicker>;
  timeInputRef: React.RefObject<TimeInput>;

  constructor(props: DateTimePickerProps) {
    super(props);

    this.wrapperRef = React.createRef();
    this.dateInputRef = React.createRef();
    this.timeInputRef = React.createRef();

    this.state = {
      valid: true,
      validated: true,
      date: props.dateValue,
      time: props.timeValue,
    };
  }

  componentDidUpdate(prevProps: DateTimePickerProps): void {
    // Hvis valuen som kommer fra prop er endret underveis så må den gå gjennom validator
    if (
      (this.props.dateValue && prevProps.dateValue && !prevProps.dateValue.isSame(this.props.dateValue)) ||
      (this.props.timeValue && prevProps.timeValue && prevProps.timeValue !== this.props.timeValue)
    ) {
      this.setState(
        {
          date: this.props.dateValue,
          time: this.props.timeValue,
        },
        () => {
          this.validate();
        }
      );
    }
  }

  isValid = (): boolean => this.state.valid;

  areAllFieldsValid = (): boolean => {
    if (this.dateInputRef.current && this.timeInputRef.current) {
      return this.dateInputRef.current.isValid() && this.timeInputRef.current.isValid();
    }
    return true;
  };

  validate = (cb?: () => void): void => {
    const promises: Array<Promise<void>> = [];
    if (this.dateInputRef && this.dateInputRef.current) promises.push(this.dateInputRef.current.validateField());
    if (this.timeInputRef && this.timeInputRef.current) promises.push(this.timeInputRef.current.validateField());

    Promise.all(promises).then(() => {
      const { date, time } = this.state;
      const { isRequired, minimumDateTime, maximumDateTime } = this.props;
      const isTimeAndDateValid = this.timeInputRef.current ? this.timeInputRef.current.isValid() && this.areAllFieldsValid() : false;
      this.setState({ valid: isFullDateTimeValid(date, time, isRequired, minimumDateTime, maximumDateTime, isTimeAndDateValid) }, () => {
        this.notifyValidated();
        if (cb) cb();
      });
    });
  };

  validateField = (): Promise<void> => {
    this.setState({ validated: true });
    return new Promise<void>((resolve: () => void) => {
      this.validate(resolve);
    });
  };

  validateOnlyDate = (cb?: () => void): void => {
    const promises: Array<Promise<void>> = [];
    if (this.dateInputRef && this.dateInputRef.current) promises.push(this.dateInputRef.current.validateField());

    Promise.all(promises).then(() => {
      const { date, time } = this.state;
      const { isRequired, minimumDateTime, maximumDateTime } = this.props;
      const isTimeValid = this.timeInputRef.current ? this.timeInputRef.current.isValid() : false;
      this.setState({ valid: isFullDateTimeValid(date, time, isRequired, minimumDateTime, maximumDateTime, isTimeValid) }, () => {
        this.notifyValidated();
        if (cb) cb();
      });
    });
  };

  notifyValidated = (): void => {
    this.updateErrorMessage();
    if (this.props.onValidated) this.props.onValidated(this.state.valid);
  };

  // Validates both fields only if
  // -> there was not given any original value and the time has been filled
  // -> there was given an original value but that the time state differs from it
  onChildDateValidated = (): void => {
    if (!this.state.validated) return;
    const { date, time } = this.state;
    const { isRequired, minimumDateTime, maximumDateTime } = this.props;
    if ((!this.props.timeValue && time) || (this.props.timeValue && time && this.props.timeValue !== time)) {
      const isTimeValid = this.timeInputRef.current ? this.timeInputRef.current.isValid() && this.areAllFieldsValid() : false;
      const valid = isFullDateTimeValid(date, time, isRequired, minimumDateTime, maximumDateTime, isTimeValid);
      this.setState({ valid }, () => {
        this.notifyValidated();
      });
    }
  };

  // Calls this.props.onBlur if given
  // Runs only date validation and calls notify
  onDateBlur = (): void => {
    const { date, time, validated } = this.state;
    const { onBlur } = this.props;
    if (validated) this.validateOnlyDate(this.notifyValidated);
    const currentDateAndTime = getFullMomentDate(date, time);
    if (onBlur && currentDateAndTime) onBlur(date, time);
  };

  // Calls this.props.onBlur if given
  // Runs full validation and calls notify
  onTimeBlur = (formattedTime: string): void => {
    const { onBlur } = this.props;

    this.setState({
      time: formattedTime,
    });

    const { date, time, validated } = this.state;

    if (validated) this.validate(this.notifyValidated);
    const currentDateAndTime = getFullMomentDate(date, time);

    if (onBlur && currentDateAndTime) onBlur(date, time);
  };

  onTimeChange = (time: string): void => {
    const { date } = this.state;
    this.setState(
      {
        time,
      },
      () => {
        if (this.props.onChange) this.props.onChange(date, time);
      }
    );
  };

  onDateChange = (date: moment.Moment | { start: moment.Moment | null; end: moment.Moment | null } | null): void => {
    const { time } = this.state;
    this.setState(
      {
        date: date as moment.Moment,
      },
      () => {
        if (this.props.onChange) this.props.onChange(date as moment.Moment, time);
      }
    );
  };

  updateErrorMessage = (): void => {
    const { date, time, valid } = this.state;
    const { resources, minimumDateTime, maximumDateTime, isRequired, isDateRequired, isTimeRequired, errorMessage } = this.props;

    const errorString = getErrorString({
      date,
      timeString: time,
      valid,
      resources,
      minimumDateTime,
      maximumDateTime,
      isRequired,
      isDateRequired,
      isTimeRequired,
      errorMessage,
      dateFieldInstance: this.dateInputRef.current,
      timeFieldInstance: this.timeInputRef.current,
    });
    this.setState({
      errorString,
    });
  };

  render(): JSX.Element | null {
    const {
      id,
      className,
      locale,
      resources,
      legend,
      subLabel,
      requiredLabel,
      showRequiredLabel,
      optionalLabel,
      showOptionalLabel,
      dateClassName,
      dateLabel,
      datePlaceholder,
      initialDate,
      minimumDateTime,
      maximumDateTime,
      isDateRequired,
      isDateDisabled,
      timeClassName,
      timeLabel,
      isRequired,
      minimumHour,
      maximumHour,
      minimumMinute,
      maximumMinute,
      isTimeRequired,
      isTimeDisabled,
      helpButton,
      helpElement,
      children,
    } = this.props;
    const { date, time, valid, errorString } = this.state;
    const classes = classNames('mol_validation', className, {
      'mol_validation--active': !valid,
    });

    return (
      <fieldset id={`${id}-wrapper`}>
        <div ref={this.wrapperRef} className={classes}>
          <ValidationError isValid={valid} error={errorString} />
          <DateTimePickerLegend
            legend={legend}
            isRequired={isRequired}
            requiredLabel={showRequiredLabel ? requiredLabel : undefined}
            optionalLabel={showOptionalLabel ? optionalLabel : undefined}
            helpButton={helpButton}
            subLabel={subLabel}
          />
          {helpElement ?? null}
          <div className={toolkitstyles.datetimepicker}>
            <div className={toolkitstyles.datetimepicker__date}>
              <DateRangePicker
                ref={this.dateInputRef}
                id={`${id}-date`}
                type={'single'}
                locale={locale}
                resources={resources && resources.dateResources ? resources.dateResources : Phrases}
                errorResources={resources && resources.dateErrorResources ? resources.dateErrorResources : ErrorPhrases}
                singleDateValue={date}
                label={dateLabel}
                placeholder={datePlaceholder}
                className={valid ? dateClassName : `${dateClassName} ${datepickerstyles['datepicker--haserror']}`}
                initialDate={initialDate}
                minimumDate={minimumDateTime}
                maximumDate={maximumDateTime}
                onDateChange={this.onDateChange}
                onValidated={this.onChildDateValidated}
                validationErrorRenderer={<span />}
                isRequired={isRequired || isDateRequired ? true : false}
                isDisabled={isDateDisabled}
                isValidationHidden
              />
            </div>
            <div className={toolkitstyles.datetimepicker__time}>
              <TimeInput
                ref={this.timeInputRef}
                id={`${id}-time`}
                value={time}
                className={`${toolkitstyles.datetimepicker__time__timeinput} ${timeClassName}`}
                inputClassName={!valid ? 'atom_input--state_validationerror' : ''}
                legend={timeLabel}
                onBlur={this.onTimeBlur}
                onTimeChange={this.onTimeChange}
                minHour={minimumHour}
                maxHour={maximumHour}
                minMinute={minimumMinute}
                maxMinute={maximumMinute}
                isRequired={isRequired || isTimeRequired ? true : false}
                readOnly={isTimeDisabled}
                resources={resources?.timeResources}
                logCallback={this.props.logCallback}
                renderFieldset
                isValidationHidden
              />
            </div>
            {children}
          </div>
        </div>
      </fieldset>
    );
  }
}
