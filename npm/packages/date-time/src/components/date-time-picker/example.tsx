import * as React from 'react';

import moment from 'moment';

import { LanguageLocales } from '@helsenorge/core-utils/constants/languages';
import { Validation } from '@helsenorge/form/components/form/validation';

import { Phrases } from './../date-range-picker/date-range-picker-utils';
import { DateTimePickerResources } from './date-time-picker-types';

import DateTimePicker from '.';

export class DateTimePickerExample extends React.Component<{}, {}> {
  refs: {
    datetime1: DateTimePicker;
    datetime2: DateTimePicker;
    datetime3: DateTimePicker;
  };

  constructor(props: {}) {
    super(props);
  }

  onChange = (date: moment.Moment): void => {
    // eslint-disable-next-line no-console
    console.log('onChange full date is: ', date);
  };

  render(): JSX.Element {
    const resources: DateTimePickerResources = {
      dateResources: Phrases,
      dateErrorResources: {
        errorInvalidDate: 'errorInvalidDate',
        errorInvalidDateRange: 'errorInvalidDateRange',
        errorRequiredDate: 'errorRequiredDate',
        errorRequiredDateRange: 'errorRequiredDateRange',
        errorInvalidMinimumNights: 'errorInvalidMinimumNights',
        errorAfterMaxDate: 'errorAfterMaxDate',
        errorBeforeMinDate: 'errorBeforeMinDate',
      },
      timeResources: {
        placeholderHours: 'tt',
        placeholderMinutes: 'mm',
        errorResources: {
          errorInvalidTime: 'errorInvalidTime',
          errorRequiredTime: 'errorRequiredTime',
          errorTimeBeforeMin: 'errorTimeBeforeMin',
          errorTimeAfterMax: 'errorTimeAfterMax',
          errorHoursBeforeMin: 'errorHoursBeforeMin',
          errorHoursAfterMax: 'errorHoursAfterMax',
          errorMinutesBeforeMin: 'errorMinutesBeforeMin',
          errorMinutesAfterMax: 'errorMinutesAfterMax',
        },
      },
    };

    return (
      <>
        <p>{'DateTimePicker uten opprinnelig verdi, isRequired = true og default resources, + English locale'}</p>
        <Validation>
          <DateTimePicker
            ref="datetime1"
            id="datetime1"
            locale={LanguageLocales.ENGLISH}
            legend="Når ble du behandlet? (minDateTime: 18.07.2020 12:10, maxDateTime: 20.07.2020 12:10)"
            dateLabel="date"
            timeLabel="time"
            initialDate={moment('18.07.2020 12:10', 'DD.MM.YYYY HH:mm')}
            minimumDateTime={moment('18.07.2020 12:10', 'DD.MM.YYYY HH:mm')}
            maximumDateTime={moment('20.07.2020 12:10', 'DD.MM.YYYY HH:mm')}
            onChange={this.onChange}
            isRequired
          />
        </Validation>
        <hr />
        <p>{'DateTimePicker med opprinnelig verdi, isRequired = false og custom resources'}</p>
        <Validation>
          <DateTimePicker
            ref="datetime2"
            id="datetime2"
            legend="Når ble du behandlet? (minDateTime: 18.07.2020 12:10, maxDateTime: 20.07.2020 12:10)"
            dateLabel="dato"
            timeLabel="klokke"
            dateValue={moment('14.07.2020', 'DD.MM.YYYY')}
            timeValue={'12:00'}
            minimumDateTime={moment('18.07.2020 12:10', 'DD.MM.YYYY HH:mm')}
            maximumDateTime={moment('20.07.2020 12:10', 'DD.MM.YYYY HH:mm')}
            onChange={this.onChange}
            resources={resources}
          />
        </Validation>
        <hr />
        <p>{'DateTimePicker med opprinnelig verdi for dato (ikke tidspunkt), og isTimeRequired = true'}</p>
        <Validation>
          <DateTimePicker
            ref="datetime2"
            id="datetime2"
            legend="Når ble du behandlet? (minDateTime: 18.07.2020 12:10, maxDateTime: 20.07.2020 12:10)"
            dateLabel="dato"
            timeLabel="klokke"
            dateValue={moment('14.07.2020 12:10', 'DD.MM.YYYY HH:mm')}
            minimumDateTime={moment('18.07.2020 12:10', 'DD.MM.YYYY HH:mm')}
            maximumDateTime={moment('20.07.2020 12:10', 'DD.MM.YYYY HH:mm')}
            onChange={this.onChange}
            resources={resources}
            isTimeRequired
          />
        </Validation>
        <hr />
        <p>{'DateTimePicker med isDateDisabled = true og isTimeDisabled = true'}</p>
        <Validation>
          <DateTimePicker
            ref="datetime2"
            id="datetime2"
            legend="Disablet datetimepicker"
            dateLabel="dato"
            timeLabel="klokke"
            dateValue={moment('14.07.2020 12:10', 'DD.MM.YYYY HH:mm')}
            onChange={this.onChange}
            resources={resources}
            isTimeRequired
            isDateDisabled
            isTimeDisabled
          />
        </Validation>
        <hr />
        <p>{'DateTimePicker på samisk'}</p>
        <Validation>
          <DateTimePicker
            ref="datetime3"
            id="datetime3"
            legend="DateTimePicker på samisk"
            dateLabel="samisk datolabel"
            timeLabel="samisk tidslabel"
            dateValue={moment('14.07.2020 12:10', 'DD.MM.YYYY HH:mm')}
            onChange={this.onChange}
            resources={resources}
            isTimeRequired
            locale={LanguageLocales.SAMI_NORTHERN}
          />
        </Validation>
      </>
    );
  }
}

export default DateTimePickerExample;
