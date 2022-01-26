import * as React from 'react';
import { mount } from 'enzyme';
import { Label } from '.';

describe('Gitt at Label skal vises', () => {
  describe('Når label skal mountes på siden', () => {
    it('Så vises den riktig med  default styling', () => {
      const wrapper = mount(<Label labelText={'my label'} />);
      expect(wrapper.render()).toMatchSnapshot();
    });
  });
  describe('Når label skal mountes på siden', () => {
    it('Så vises den riktig med custom className prop', () => {
      const wrapper = mount(<Label labelText={'my label'} className="test-css" />);
      expect(wrapper.render()).toMatchSnapshot();
    });
  });
  describe('Når label skal mountes på siden', () => {
    it('Så vises den riktig med custom className prop og sublabel', () => {
      const wrapper = mount(<Label labelText={'my label'} sublabelText={'my sublabel'} className="test-css" />);
      expect(wrapper.render()).toMatchSnapshot();
    });

    it('Så vises helpButton på siden', () => {
      const wrapper = mount(<Label labelText={'my label'} helpButton={<span className="help-button">{`help`}</span>} />);
      expect(wrapper.find('.help-button').length).toEqual(1);
    });
  });
});
