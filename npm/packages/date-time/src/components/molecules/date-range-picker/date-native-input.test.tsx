import * as React from 'react';
import { mount } from 'enzyme';
import moment from 'moment';

import DateNativeInput from './date-native-input';

describe('DateRangePicker date-native-input', () => {
  describe('Gitt at DateNativeInput skal rendres', () => {
    const momentLocale = moment();
    const onChangeMock = jest.fn();

    describe('Når den bare har default verdier', () => {
      const wrapper = mount(<DateNativeInput id={'id'} dateValue={null} onChange={onChangeMock} locale={momentLocale.localeData()} />);
      it('Så rendres den med rikitg id og locale', () => {
        expect(wrapper.find('input').prop('id')).toEqual('id');
        expect(wrapper.find('input').prop('type')).toEqual('date');
        expect(wrapper.find('input').prop('className')).toEqual('datepicker__native-input');
        expect(wrapper.find('input').prop('value')).toEqual(undefined);
        expect(wrapper.find('input').prop('disabled')).toBeFalsy();
        expect(wrapper.render()).toMatchSnapshot();
      });

      it('Så reagerer den riktig til onChange, og transformerer incomingValue til moment dato', () => {
        const inputInstance = wrapper.find('input');
        inputInstance.props().onChange({ currentTarget: { value: undefined } });
        expect(onChangeMock.mock.calls[0][0]).toBe(undefined);
        inputInstance.props().onChange({ currentTarget: { value: '2019-09-10' } });
        expect(onChangeMock.mock.calls[1][0].toString()).toBe('Tue Sep 10 2019 00:00:00 GMT+0200');
      });
    });

    describe('Når den er disabled', () => {
      const wrapper = mount(
        <DateNativeInput id={'id'} dateValue={null} onChange={onChangeMock} locale={momentLocale.localeData()} disabled />
      );
      it('Så rendres det med disabled input og riktig className', () => {
        expect(wrapper.find('input').prop('className')).toEqual('datepicker__native-input datepicker__native-input--disabled');
        expect(wrapper.find('input').prop('disabled')).toBeTruthy();
        expect(wrapper.find('input').prop('aria-disabled')).toBeTruthy();
      });
    });

    describe('Når den har full-width', () => {
      const wrapper = mount(
        <DateNativeInput id={'id'} dateValue={null} onChange={onChangeMock} locale={momentLocale.localeData()} hasFullWidth />
      );
      it('Så rendres det med riktig className', () => {
        expect(wrapper.find('input').prop('className')).toEqual('datepicker__native-input datepicker__native-input--fullwidth');
      });
    });

    describe('Når den har values og min/max begrensninger', () => {
      const wrapper = mount(
        <DateNativeInput
          id={'id'}
          onChange={onChangeMock}
          locale={momentLocale.localeData()}
          dateValue={moment('10.09.2019', 'DD.MM.YYYY')}
          minimumDate={moment('05.09.2019', 'DD.MM.YYYY')}
          maximumDate={moment('15.09.2019', 'DD.MM.YYYY')}
        />
      );
      it('Så rendres det med riktig attributer på input felter', () => {
        expect(wrapper.find('input').prop('value')).toEqual('2019-09-10');
        expect(wrapper.find('input').prop('min')).toEqual('2019-09-05');
        expect(wrapper.find('input').prop('max')).toEqual('2019-09-15');
      });
    });
  });
});
