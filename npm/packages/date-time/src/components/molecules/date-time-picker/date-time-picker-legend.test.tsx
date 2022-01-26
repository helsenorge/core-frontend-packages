import * as React from 'react';
import { mount } from 'enzyme';

import DateTimePickerLegend from './date-time-picker-legend';

describe('DateTimePicker date-time-picker-legend', () => {
  describe('Gitt at DateTimePickerLegend skal rendres', () => {
    describe('Når den bare har default verdier', () => {
      const wrapper = mount(<DateTimePickerLegend legend={'myLabel'} isRequired={false} />);
      it('Så rendres den med rikitg id legend tekst', () => {
        expect(wrapper.find('legend').text()).toEqual('myLabel');
        expect(wrapper.render()).toMatchSnapshot();
      });
    });

    describe('Når den er required og har requiredLabel', () => {
      const wrapper = mount(<DateTimePickerLegend legend={'myLabel'} isRequired={true} requiredLabel={'MyRequiredLabel'} />);
      it('Så rendres den med rikitg legend (legend med requiredLabel og eksplisitt format)', () => {
        expect(wrapper.find('legend').text()).toEqual('myLabel MyRequiredLabel');
        expect(wrapper.render()).toMatchSnapshot();
      });
    });

    describe('Når den har optionalLabel', () => {
      const wrapper = mount(<DateTimePickerLegend legend={'myLabel'} isRequired={false} optionalLabel={'MyOptionalLabel'} />);
      it('Så rendres den med rikitg legend (legend med optionalLabel og eksplisitt format)', () => {
        expect(wrapper.find('legend').text()).toEqual('myLabel MyOptionalLabel');
        expect(wrapper.render()).toMatchSnapshot();
      });
    });

    describe('Når den har helpButton', () => {
      const wrapper = mount(
        <DateTimePickerLegend legend={'myLabel'} isRequired={false} helpButton={<span className={'helpButton'}>{'helpButton'}</span>} />
      );
      it('Så rendres den med helpButton nederst i legenden', () => {
        expect(wrapper.find('legend').find('.helpButton').length).toEqual(1);
        expect(wrapper.render()).toMatchSnapshot();
      });
    });

    describe('Når den har subLabel', () => {
      const wrapper = mount(
        <DateTimePickerLegend legend={'myLabel'} isRequired={false} subLabel={<span className={'subLabel'}>{'subLabel'}</span>} />
      );
      it('Så rendres den med subLabel nederst i legenden', () => {
        expect(wrapper.find('.subLabel').length).toEqual(1);
        expect(wrapper.render()).toMatchSnapshot();
      });
    });
  });
});
