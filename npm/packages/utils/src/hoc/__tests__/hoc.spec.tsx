import React from 'react';

import { mount } from 'enzyme';
import * as History from 'history';
import { act } from 'react-dom/test-utils';
import { MemoryRouter as Router, Route } from 'react-router-dom';

import * as adobeUtils from '../../adobe-analytics';
import becameVisible from '../became-visible';
import layoutChange from '../layout-change';
import mountHOC from '../mount';
import RenderToBody from '../render-to-body';
import TrackRouteChange from '../track-route-change';

/*
Noen av disse testene er ikke fullverdige fordi de tester ikke logikken inne i class komponenter som instansieres i HOC.
Det testes bare at de mountes og at default state er riktig
*/

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(() => ({
    matches: true,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  })),
});

Object.defineProperty(window, 'getComputedStyle', {
  writable: true,
  value: jest.fn().mockImplementation(() => ({
    matches: true,
    getPropertyValue: jest.fn(),
    removeEventListener: jest.fn(),
  })),
});

// Not implemented: window.computedStyle(elt, pseudoElt)

describe('HOC utils', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('Gitt at en komponent wrappes i mount HOC', () => {
    describe('Når den instansieres', () => {
      const Testmounthoc: React.FC = () => {
        return <div>{'test'}</div>;
      };
      const MyComp = mountHOC(Testmounthoc);
      it('Så mounter den komponenten og kaller mount prop', () => {
        const mountMock = jest.fn();
        const wrapper = mount(<MyComp mount={mountMock} />);
        expect(wrapper.find(Testmounthoc)).toBeTruthy();
        expect(wrapper.name()).toEqual('Mount(Testmounthoc)');
        expect(mountMock).toHaveBeenCalled();
      });
    });
  });

  describe('Gitt at en komponent wrappes i became-visible HOC', () => {
    class Testvisiblehoc extends React.Component<{}, {}> {
      constructor(props: {}) {
        super(props);
      }
      render() {
        return <div>{'test'}</div>;
      }
    }

    const MyComp = becameVisible(Testvisiblehoc, true);
    const wrapper = mount(<MyComp />);

    describe('Når den instansieres', () => {
      it('Så instansierer den VisibleComponent fra became-visible function og får default state', () => {
        expect(wrapper.name()).toEqual('VisibleComponent');
        expect(wrapper.instance().state['visible']).toBeTruthy();
      });
    });
  });

  describe('Gitt at en komponent wrappes i layout-change HOC', () => {
    describe('Når den instansieres', () => {
      const Testlayouthoc: React.FC = () => {
        return <div>{'test'}</div>;
      };
      const MyComp = layoutChange(Testlayouthoc);
      it('Så instansierer den LayoutChangeComponent fra layout-change function og får default state', () => {
        const wrapper = mount(<MyComp />);
        expect(wrapper.find(Testlayouthoc)).toBeTruthy();

        const LayoutChangeComponentInstance = wrapper.children().first();
        expect(LayoutChangeComponentInstance.name()).toEqual('LayoutChangeComponent');

        expect(LayoutChangeComponentInstance.instance().state['nullToXs']).toBeTruthy();
        expect(LayoutChangeComponentInstance.instance().state['xsToSm']).toBeTruthy();
        expect(LayoutChangeComponentInstance.instance().state['smToMd']).toBeTruthy();
        expect(LayoutChangeComponentInstance.instance().state['mdToLg']).toBeTruthy();
        expect(LayoutChangeComponentInstance.instance().state['lgToXl']).toBeTruthy();
      });
    });
  });

  describe('Gitt at en komponent wrappes i render-to-body HOC', () => {
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
