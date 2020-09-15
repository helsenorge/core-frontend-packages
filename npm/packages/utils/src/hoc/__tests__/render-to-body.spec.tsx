import * as React from 'react';

import { mount } from 'enzyme';

import RenderToBody from '../render-to-body';

describe('render-to-body', () => {
  describe('Gitt at RenderToBody wrapper en vanlig Element', () => {
    describe('Når printable er false', () => {
      it('Så renderes det en portal', () => {
        const wrapper = mount(
          <RenderToBody>
            <section>{'My first section rendered to document'}</section>
          </RenderToBody>
        );

        expect(wrapper).toMatchSnapshot();
      });
    });

    describe('Når printable er true', () => {
      it('Så renderes det en portal med body tag', () => {
        const wrapper = mount(
          <RenderToBody printable>
            <section>{'My second section rendered to body (printable)'}</section>
          </RenderToBody>
        );

        expect(wrapper).toMatchSnapshot();
      });
    });
  });
});
