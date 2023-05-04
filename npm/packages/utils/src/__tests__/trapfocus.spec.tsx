import React from 'react';

import { render } from '@testing-library/react';

import * as webcomputils from '../events';
import TrapFocus from '../trapfocus';

// For some reason Istanbul soverage does not mark previousFocusableRadioButton and nextFocusableRadioButton as covered while they are

// This is a test-helper just to create a container with two tabbable elements
const TrapFocusTestHelper: React.FC<{}> = () => {
  const containerRef: React.RefObject<HTMLDivElement> = React.useRef(null);
  return (
    <div id="container" ref={containerRef}>
      <button tabIndex={2}></button>
      <button></button>
      <input type="radio" id="male" name="gender" value="male" />
      <input type="radio" id="female" name="gender" value="female" />
      <a href="#">{'anchorlink'}</a>
    </div>
  );
};

// This is a trick to be able to set offsetParent property to elements - this to make sure tabbable sees it
Object.defineProperty(window.HTMLElement.prototype, 'offsetParent', {
  writable: true,
  value: {},
});
describe('Trapfocus', () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });
  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('Gitt at TrapFocus initialiseres og at DOMen inneholder en container med to knapper', () => {
    describe('Når TrapFocus initialiseres med en string', () => {
      it('Så ...', () => {
        render(<TrapFocusTestHelper />);

        const trapfocusFromString: TrapFocus = new TrapFocus('div', true);

        expect(trapfocusFromString.focusableItems.length).toEqual(5);
      });
    });

    describe('Når TrapFocus initialiseres', () => {
      it('Så har den registrert riktig domNode og focusable elements fra DOMen', () => {
        const { container: node } = render(<TrapFocusTestHelper />);
        const trapfocus = new TrapFocus(node, false);

        expect(trapfocus.domNode?.outerHTML).toEqual(
          '<div><div id="container"><button tabindex="2"></button><button></button><input type="radio" id="male" name="gender" value="male"><input type="radio" id="female" name="gender" value="female"><a href="#">anchorlink</a></div></div>'
        );
        expect(trapfocus.focusableItems.length).toEqual(5);
        expect(trapfocus.previouslyFocusedItem?.outerHTML).toEqual(
          '<body><div><div id="container"><button tabindex="2"></button><button></button><input type="radio" id="male" name="gender" value="male"><input type="radio" id="female" name="gender" value="female"><a href="#">anchorlink</a></div></div></body>'
        );
      });
    });

    describe('Når nextFocusableItem kalles', () => {
      it('Så returnerer den neste TabbaleElement som er button', () => {
        const { container: node } = render(<TrapFocusTestHelper />);
        const trapfocus = new TrapFocus(node, false);

        const currentElement = trapfocus.focusableItems[0];
        expect(currentElement.outerHTML).toEqual('<button tabindex="2"></button>');
        const nextElement = trapfocus.nextFocusableItem(currentElement);
        expect(nextElement.outerHTML).toEqual('<button></button>');
      });
    });

    describe('Når previousFocusableItem kalles', () => {
      it('Så returnerer den forrige TabbaleElement som er button med tabindex 2', () => {
        const { container: node } = render(<TrapFocusTestHelper />);
        const trapfocus = new TrapFocus(node, false);

        const currentElement = trapfocus.focusableItems[1];
        expect(currentElement.outerHTML).toEqual('<button></button>');
        const nextElement = trapfocus.previousFocusableItem(currentElement);
        expect(nextElement.outerHTML).toEqual('<button tabindex="2"></button>');
      });
    });

    describe('Når nextFocusableItem kalles på en radio button', () => {
      it('Så kaller den nextFocusableRadioButton, hopper over radio buttons fra samme gruppe og går til neste TabbaleElement', () => {
        const { container: node } = render(<TrapFocusTestHelper />);
        const trapfocus = new TrapFocus(node, false);

        const currentElement = trapfocus.focusableItems[2];
        expect(currentElement.outerHTML).toEqual('<input type="radio" id="male" name="gender" value="male">');
        const nextElement = trapfocus.nextFocusableItem(currentElement);
        expect(nextElement.outerHTML).toEqual('<a href="#">anchorlink</a>');
      });
    });

    describe('Når previousFocusableItem kalles på en radio button', () => {
      it('Så kaller den previousFocusableRadioButton, hopper over radio buttons fra samme gruppe og går tilbake til forrige TabbaleElement', () => {
        const { container: node } = render(<TrapFocusTestHelper />);
        const trapfocus = new TrapFocus(node, false);

        const currentElement = trapfocus.focusableItems[3];
        expect(currentElement.outerHTML).toEqual('<input type="radio" id="female" name="gender" value="female">');
        const nextElement = trapfocus.previousFocusableItem(currentElement);

        expect(nextElement.outerHTML).toEqual('<button></button>');
      });
    });

    describe('Når getSelectedRadioInGroup kalles på en radio button', () => {
      it('Så returnerer den den første som ikke er checked', () => {
        const { container: node } = render(<TrapFocusTestHelper />);
        const trapfocus = new TrapFocus(node, false);

        const currentElement = trapfocus.focusableItems[2];
        expect(currentElement.outerHTML).toEqual('<input type="radio" id="male" name="gender" value="male">');
        const el = trapfocus.getSelectedRadioInGroup(currentElement);
        expect(el.outerHTML).toEqual('<input type="radio" id="male" name="gender" value="male">');
      });
    });

    describe('Når handleEvent er triggered med noe annet enn TAB', () => {
      it('Så returnerer den null', () => {
        const { container: node } = render(<TrapFocusTestHelper />);
        const trapfocus = new TrapFocus(node, false);

        const event = new KeyboardEvent('keydown', { keyCode: 39 });
        const eventReturn = trapfocus.handleEvent(event);
        expect(eventReturn).toEqual(null);
      });
    });

    describe('Når handleEvent er triggered med TAB og at ingenting er i fokus', () => {
      it('Så returnerer den null', () => {
        const { container: node } = render(<TrapFocusTestHelper />);
        const trapfocus = new TrapFocus(node, false);

        const event = new KeyboardEvent('keydown', { keyCode: 9 });
        const eventReturn = trapfocus.handleEvent(event);
        expect(eventReturn).toEqual(null);
      });
    });

    describe('Når handleEvent er triggered med TAB og shiftKey', () => {
      it('Så flytter den focus og returnerer den null', () => {
        const { container: node } = render(<TrapFocusTestHelper />);
        const trapfocus = new TrapFocus(node, false);

        jest.spyOn(trapfocus, 'getItemIndex').mockImplementation(() => 0);
        jest.spyOn(webcomputils, 'getEventTarget').mockImplementation(() => trapfocus.focusableItems[0]);
        const prev = jest.spyOn(trapfocus, 'previousFocusableItem');
        const event = new KeyboardEvent('keydown', { keyCode: 9, shiftKey: 1 });
        const eventReturn = trapfocus.handleEvent(event);

        expect(prev).toHaveBeenCalled();
        expect(eventReturn).toEqual(null);
      });
    });

    describe('Når deactivate kalles', () => {
      it('Så er focusableItems array tømt og domNode satt til null', () => {
        const { container: node } = render(<TrapFocusTestHelper />);
        const trapfocus = new TrapFocus(node, false);

        trapfocus.deactivate();

        expect(trapfocus.focusableItems.length).toEqual(0);
        expect(trapfocus.domNode).toEqual(null);
      });
    });
  });
});
