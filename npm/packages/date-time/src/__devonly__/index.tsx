import React from 'react';

import moment from 'moment';
import { render } from 'react-dom';
import '@helsenorge/core-build/lib/polyfills';

import DateTimePicker from '../components/date-time-picker';

const anchor: Element | null = document.getElementById('main-content-wrapper');

const TestSide: React.FC = () => {
  return (
    <>
      <h1>{'Testside'}</h1>
      <p>{'Her kan du legge inn komponenter og teste dem med "npm run start".'}</p>
      <DateTimePicker
        id="date-time-arrive"
        className="start-date dato-behandling"
        legend={'Velg dato og tid'}
        minimumDateTime={moment('31.03.2022 12:05', 'DD.MM.YYYY HH:mm')}
        maximumDateTime={moment('31.03.2022 12:10', 'DD.MM.YYYY HH:mm')}
        isRequired
      />
    </>
  );
};

render(<TestSide />, anchor);
