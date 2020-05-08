import React from 'react';

import { mount } from 'enzyme';
import TabbableTestContainer from './../_devonly/tabbable-test-container';
import { setTabIndex, resetTabIndex, TabbableContentWithTabIndexes } from '../tabbable-utils';

// This is a trick to be able to set offsetParent property to elements - this to make sure tabbable sees it
Object.defineProperty(window.HTMLElement.prototype, 'offsetParent', {
  writable: true,
  value: {},
});

describe('Gitt at det finnes en container med flere knapper', () => {
  describe('Når det brukes setTabIndex', () => {
    const wrapper = mount(<TabbableTestContainer />, { attachTo: document.body });
    const node = wrapper.getDOMNode();
    const returnedChildren = node.children;
    const returnedNodeList = Array.from(returnedChildren);

    returnedNodeList.forEach(child => {
      child.offsetParent = {};
    });

    jest.spyOn(node, 'querySelectorAll').mockReturnValue(returnedNodeList);
    const updatedTabbableContent: TabbableContentWithTabIndexes = setTabIndex(node);

    it('Så settes det tabIndex -1 på alle tabbable children', () => {
      expect(node).toBeInstanceOf(HTMLDivElement);

      expect(updatedTabbableContent.previousTabIndexes).toEqual([2, null]);

      expect(updatedTabbableContent.tabbableElements.length).toEqual(2);
      expect(updatedTabbableContent.tabbableElements[0].tabIndex).toEqual(-1);
      expect(updatedTabbableContent.tabbableElements[1].tabIndex).toEqual(-1);
    });
  });
});
