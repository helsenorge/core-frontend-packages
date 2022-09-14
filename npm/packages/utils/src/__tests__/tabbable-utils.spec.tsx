import React from 'react';

import { render } from '@testing-library/react';

import { setTabIndex, resetTabIndex } from '../tabbable-utils';

// This is a test-helper just to create a container with two tabbable elements
const TabbableTestHelper: React.FC = () => (
  <div>
    <button></button>
    <button tabIndex={2}></button>
  </div>
);

describe('Tabbable-utils', () => {
  describe('Gitt at det finnes en container med flere knapper', () => {
    describe('Når det brukes setTabIndex', () => {
      it('Så settes det tabIndex -1 på alle tabbable children', () => {
        const { container: node } = render(<TabbableTestHelper />);
        const { tabbableElements: updatedTabbableElements, previousTabIndexes } = setTabIndex(node);

        expect(node).toBeInstanceOf(HTMLDivElement);
        expect(previousTabIndexes).toEqual([2, null]);
        expect(updatedTabbableElements).toHaveLength(2);
        expect(updatedTabbableElements[0].tabIndex).toEqual(-1);
        expect(updatedTabbableElements[1].tabIndex).toEqual(-1);
      });
    });

    describe('Når det brukes resetTabindex', () => {
      it('Så nullstilles tabIndex til opprinnelig verdi', () => {
        const { container: node } = render(<TabbableTestHelper />);
        const { tabbableElements, previousTabIndexes } = setTabIndex(node);

        const updatedTabbableElements = resetTabIndex(tabbableElements, previousTabIndexes);
        expect(updatedTabbableElements).toHaveLength(2);
        expect(updatedTabbableElements[0].tabIndex).toEqual(2);
        expect(updatedTabbableElements[1].tabIndex).toEqual(0);
      });
    });
  });
});
