import React from 'react';

import { mount } from 'enzyme';
import { setTabIndex, resetTabIndex, TabbableContentWithTabIndexes } from '../tabbable-utils';

// This is a test-helper just to create a container with two tabbable elements
const TabbableTestHelper: React.FC<{}> = () => {
  const containerRef: React.RefObject<HTMLDivElement> = React.useRef(null);

  return (
    <div id="container" ref={containerRef}>
      <button></button>
      <button tabIndex={2}></button>
    </div>
  );
};

// This is a trick to be able to set offsetParent property to elements - this to make sure tabbable sees it
Object.defineProperty(window.HTMLElement.prototype, 'offsetParent', {
  writable: true,
  value: {},
});

interface TabbableElement extends HTMLInputElement {
  setAttribute: (tabIndex: string, num: string) => void;
  removeAttribute: (attribute: string) => void;
}

describe('Tabbable-utils test', () => {
  describe('Gitt at det finnes en container med flere knapper', () => {
    const wrapper = mount(<TabbableTestHelper />, { attachTo: document.body });
    const node = wrapper.getDOMNode();
    const returnedChildren = node.children;
    const returnedNodeList = Array.from(returnedChildren);

    returnedNodeList.forEach(child => {
      child.offsetParent = {};
    });

    let previousTabIndexes: Array<number | null> = [];
    let updatedTabbableElements: Array<TabbableElement> = [];

    describe('Når det brukes setTabIndex', () => {
      jest.spyOn(node, 'querySelectorAll').mockReturnValue(returnedNodeList);
      const updatedTabbableContent: TabbableContentWithTabIndexes = setTabIndex(node);

      updatedTabbableElements = updatedTabbableContent.tabbableElements;
      previousTabIndexes = updatedTabbableContent.previousTabIndexes;

      it('Så settes det tabIndex -1 på alle tabbable children', () => {
        expect(node).toBeInstanceOf(HTMLDivElement);
        expect(previousTabIndexes).toEqual([2, null]);
        expect(updatedTabbableElements.length).toEqual(2);
        expect(updatedTabbableElements[0].tabIndex).toEqual(-1);
        expect(updatedTabbableElements[1].tabIndex).toEqual(-1);
      });
    });

    describe('Når det brukes resetTabindex', () => {
      it('Så settes det tabIndex -1 på alle tabbable children', () => {
        updatedTabbableElements = resetTabIndex(updatedTabbableElements, previousTabIndexes);
        expect(updatedTabbableElements.length).toEqual(2);
        expect(updatedTabbableElements[0].tabIndex).toEqual(2);
        expect(updatedTabbableElements[1].tabIndex).toEqual(0);
      });
    });
  });
});
