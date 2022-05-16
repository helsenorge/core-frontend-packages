import * as React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { shallow, mount, ReactWrapper } from 'enzyme';
import moment from 'moment';

import { parseDate, buildNewDate } from './date-core';

import TimeInput from '.';

describe('TimeInput', () => {
  let wrapper: ReactWrapper<{}, {}>;

  it('Renders without crashing', () => {
    shallow(<TimeInput id="1" />);
  });

  it('Renders correctly', () => {
    wrapper = mount(<TimeInput id="2" />);
    expect(wrapper.render()).toMatchSnapshot();
  });

  it('Renders legend', () => {
    wrapper = mount(<TimeInput id="3" legend="Klokkeslett" />);
    expect(wrapper.render()).toMatchSnapshot();
  });

  it('Renders sublabel', () => {
    wrapper = mount(<TimeInput id="3" legend="Klokkeslett" subLabel={<span className="sublabel">{`sublLabel`}</span>} />);
    expect(wrapper.find('.sublabel').length).toEqual(1);
  });

  describe('Når man skriver inn et klokkeslett', () => {
    it('Så har inputfeltene fått riktige verdier og onTimeChange har blitt kalt', async () => {
      const handleTimeChange = jest.fn();
      render(<TimeInput onTimeChange={handleTimeChange} />);

      const hour = screen.getByLabelText('Timer');
      expect(hour).toBeVisible();
      await userEvent.type(hour, '23');

      expect((hour as HTMLInputElement).value).toBe('23');

      const minutes = screen.getByLabelText('Minutter');
      expect(minutes).toBeVisible();
      await userEvent.type(minutes, '59');

      expect((minutes as HTMLInputElement).value).toBe('59');

      expect(handleTimeChange).toHaveBeenCalledTimes(4);
      expect(handleTimeChange).toHaveBeenNthCalledWith(1, '02:');
      expect(handleTimeChange).toHaveBeenNthCalledWith(2, '23:');
      expect(handleTimeChange).toHaveBeenNthCalledWith(3, '23:05');
      expect(handleTimeChange).toHaveBeenNthCalledWith(4, '23:59');
    });
  });
});

describe('TimeInput utils', () => {
  describe('Gitt at parseDate kalles', () => {
    describe('Når den for en dato som argument', () => {
      it('så returnerer den new js date', () => {
        const d = parseDate('2017-05-18T05:28:45Z');
        expect(d).toBeDefined();
        expect(d instanceof Date).toEqual(true);
      });
    });

    describe('Når den for en dato og tidspunkt som argument', () => {
      it('så returnerer den new js date', () => {
        const d = parseDate('2017-05-18T05:28:45Z');
        const newDate = buildNewDate(d, '05:15');
        expect(newDate).not.toBeNull();

        if (newDate) {
          expect(moment(d).isSame(newDate, 'day')).toBeTruthy();
          expect(newDate.getHours()).toEqual(5);
          expect(newDate.getMinutes()).toEqual(15);
        }
      });
    });
  });
});
