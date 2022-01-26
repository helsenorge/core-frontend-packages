import * as React from 'react';
import { mount } from 'enzyme';
import { LanguageLocales } from '@helsenorge/core-utils/constants/languages';
import DateRangePickerLabel from './date-range-picker-label';

describe('DateRangePicker date-range-picker-label', () => {
  describe('Gitt at DateRangePickerLabel skal rendres', () => {
    describe('Når den bare har default verdier', () => {
      const wrapper = mount(<DateRangePickerLabel label={'myLabel'} isRequired={false} />);
      it('Så rendres den med rikitg css classer og legend (label med eksplisitt format)', () => {
        expect(wrapper.find('legend').prop('className')).toEqual('datepicker__legend');
        expect(wrapper.find('legend').text()).toEqual('myLabel (dd.mm.åååå)');
        expect(wrapper.render()).toMatchSnapshot();
      });
    });

    describe('Når den har isLabelHidden', () => {
      const wrapper = mount(<DateRangePickerLabel label={'myLabel'} isRequired={false} isLabelHidden />);
      it('Så rendres den med rikitg css classer', () => {
        expect(wrapper.find('legend').prop('className')).toEqual('datepicker__legend');

        expect(wrapper.render()).toMatchSnapshot();
      });
    });

    describe('Når den er required og har requiredLabel', () => {
      const wrapper = mount(<DateRangePickerLabel label={'myLabel'} isRequired={true} requiredLabel={'MyRequiredLabel'} />);
      it('Så rendres den med rikitg legend (label med requiredLabel og eksplisitt format)', () => {
        expect(wrapper.find('legend').text()).toEqual('myLabel MyRequiredLabel (dd.mm.åååå)');
        expect(wrapper.render()).toMatchSnapshot();
      });
    });

    describe('Når den har optionalLabel', () => {
      const wrapper = mount(<DateRangePickerLabel label={'myLabel'} isRequired={false} optionalLabel={'MyOptionalLabel'} />);
      it('Så rendres den med rikitg legend (label med optionalLabel og eksplisitt format)', () => {
        expect(wrapper.find('legend').text()).toEqual('myLabel (dd.mm.åååå) MyOptionalLabel');
        expect(wrapper.render()).toMatchSnapshot();
      });
    });

    describe('Når den har english locale', () => {
      const wrapper = mount(<DateRangePickerLabel locale={LanguageLocales.ENGLISH} label={'myLabel'} isRequired={false} />);
      it('Så rendres den med riktig legend (riktig engelsk format)', () => {
        expect(wrapper.find('legend').text()).toEqual('myLabel (dd.mm.yyyy)');
        expect(wrapper.render()).toMatchSnapshot();
      });
    });

    describe('Når den har english locale og optionalLabel', () => {
      const wrapper = mount(
        <DateRangePickerLabel locale={LanguageLocales.ENGLISH} label={'myLabel'} isRequired={false} optionalLabel={'MyOptionalLabel'} />
      );
      it('Så rendres den med riktig legend (riktig engelsk format)', () => {
        expect(wrapper.find('legend').text()).toEqual('myLabel (dd.mm.yyyy) MyOptionalLabel');
        expect(wrapper.render()).toMatchSnapshot();
      });
    });

    describe('Når den har helpButton', () => {
      const wrapper = mount(
        <DateRangePickerLabel label={'myLabel'} isRequired={false} helpButton={<span className={'helpButton'}>{'helpButton'}</span>} />
      );
      it('Så rendres den med helpButton nederst', () => {
        expect(wrapper.find('.helpButton').length).toEqual(1);
        expect(wrapper.render()).toMatchSnapshot();
      });
    });

    describe('Når den har subLabel', () => {
      const wrapper = mount(
        <DateRangePickerLabel label={'myLabel'} isRequired={false} subLabel={<span className={'subLabel'}>{'subLabel'}</span>} />
      );
      it('Så rendres den med subLabel nederst i legenden', () => {
        expect(wrapper.find('.subLabel').length).toEqual(1);
        expect(wrapper.render()).toMatchSnapshot();
      });
    });
  });
});
