import React from 'react';

import moment from 'moment';
import { render } from 'react-dom';

import DateTimePicker from '../components/date-time-picker';
import { DateRangePickerExample, DateTimePickerExample, TimeInputExample, YearInputExample, YearMonthInputExample } from '../examples';

const anchor: Element | null = document.getElementById('main-content-wrapper');

const TestSide: React.FC = () => {
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h1>{'Date-Time Testside'}</h1>
            <p>{'Her kan du legge inn komponenter og teste dem med "npm run start".'}</p>
            <h2>{'Date-Range-Picker'}</h2>
            <DateRangePickerExample />
            <h2>{'Date-Time-Picker'}</h2>
            <DateTimePickerExample />
            <DateTimePicker
              id="date-time-arrive"
              className="start-date dato-behandling"
              legend={'Velg dato og tid'}
              minimumDateTime={moment('31.03.2022 12:05', 'DD.MM.YYYY HH:mm')}
              maximumDateTime={moment('31.03.2022 12:10', 'DD.MM.YYYY HH:mm')}
              isRequired
            />
            <h2>{'Time-Input'}</h2>
            <TimeInputExample />
            <h2>{'Year-Input'}</h2>
            <YearInputExample />
            <h2>{'Year-Month-Input'}</h2>
            <YearMonthInputExample />
          </div>
        </div>
      </div>
    </>
  );
};

render(<TestSide />, anchor);
