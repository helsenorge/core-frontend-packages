import * as React from 'react';
import { mount } from 'enzyme';
import Icon from '@helsenorge/designsystem-react/components/Icon';
import ChevronLeft from '@helsenorge/designsystem-react/components/Icons/ChevronLeft';
import ChevronRight from '@helsenorge/designsystem-react/components/Icons/ChevronRight';
import ArrowIcon from './arrow-icon';
import InputIcon from './input-icon';
import HeaderNavIcon from './header-nav-icon';

describe('DateRangePicker icons', () => {
  describe('Gitt at ArrowIcon skal rendres', () => {
    describe('Når det brukes optional Prop className', () => {
      const wrapper = mount(<ArrowIcon className={'custom-classname-1'} />);
      it('Så rendres det riktig ikon med custom className', () => {
        expect(wrapper.render()).toMatchSnapshot();
        expect(wrapper.find('svg.custom-classname-1').length).toBe(1);
      });
    });
  });

  describe('Gitt at InputIcon skal rendres', () => {
    const onClickMock = jest.fn();
    const wrapper = mount(<InputIcon onClick={onClickMock} className={'custom-classname-2'} />);
    describe('Når det brukes optional Prop className', () => {
      it('Så rendres det riktig ikon med custom className', () => {
        expect(wrapper.render()).toMatchSnapshot();
        expect(wrapper.find('svg.custom-classname-2').length).toBe(1);
      });
    });
    describe('Når det klikkes på ikonet', () => {
      wrapper.find('span').simulate('click');
      wrapper.update();
      it('Så rendres det riktig ikon med custom className', () => {
        expect(onClickMock).toHaveBeenCalled();
      });
    });
  });

  describe('Gitt at HeaderNavIcon skal rendres', () => {
    describe('Når det brukes direction prev', () => {
      const wrapper = mount(<HeaderNavIcon direction={'prev'} className={'custom-classname-3'} />);
      it('Så rendres det riktig svgIcon og riktig className', () => {
        expect(wrapper.find('span').prop('className')).toEqual('DayPickerNavigation_leftButton__horizontalDefault custom-classname-3');
        expect(wrapper.find(Icon).prop('svgIcon')).toBe(ChevronLeft);
        expect(wrapper.render()).toMatchSnapshot();
      });
    });
    describe('Når det brukes direction next', () => {
      const wrapper = mount(<HeaderNavIcon direction={'next'} className={'custom-classname-4'} />);
      it('Så rendres det riktig svgIcon og riktig className', () => {
        expect(wrapper.find('span').prop('className')).toEqual('DayPickerNavigation_rightButton__horizontalDefault custom-classname-4');
        expect(wrapper.find(Icon).prop('svgIcon')).toBe(ChevronRight);
        expect(wrapper.render()).toMatchSnapshot();
      });
    });
  });
});
