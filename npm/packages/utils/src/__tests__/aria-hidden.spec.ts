import { vi } from 'vitest';

import aria from '../aria-hidden';

describe('Aria-hidden', () => {
  afterAll(() => {
    vi.clearAllMocks();
  });

  describe('Gitt at to HTMLelements er paa samme nivå på document objektet', () => {
    describe('Når det kalles aria function på den ene', () => {
      it('Så får den andre (sibling) aria-hidden attribute', () => {
        const original = global.document['body'];

        document.body.innerHTML =
          '<div>' + '  <div id="firstElement-test1" >Hello</div>' + '  <button id="secondElement-test1" />' + '</div>';
        const el = document.getElementById('firstElement-test1');
        const result = aria.setAriaHidden(el);

        expect(result.allSiblings.length).toEqual(1);
        expect(result.allSiblings[0].id).toEqual('secondElement-test1');
        expect(result.allSiblings[0].getAttribute('aria-hidden')).toBeTruthy();

        document.body.innerHTML = '';
        global.document['body'] = original;
      });
    });

    describe('Når diven har en aria-hidden attribute', () => {
      it('Så lagres den i ariaHiddens array', () => {
        const original = global.document['body'];

        document.body.innerHTML =
          '<div>' + '  <div id="firstElement-test2" >Hello</div>' + '  <button id="secondElement-test2" aria-hidden="true" />' + '</div>';
        const el = document.getElementById('firstElement-test2');
        const result = aria.setAriaHidden(el);

        expect(result.allSiblings.length).toEqual(1);
        expect(result.ariaHiddens.length).toEqual(1);

        document.body.innerHTML = '';
        global.document['body'] = original;
      });
    });

    describe('Når det kalles resetAriaHidden på sibling', () => {
      it('Så settes attributet tilbake til hva den opprinnelig var', () => {
        const original = global.document['body'];

        document.body.innerHTML =
          '<div>' + '  <div id="firstElement-test3" >Hello</div>' + '  <button id="secondElement-test3" />' + '</div>';
        const el = document.getElementById('firstElement-test3');
        const result = aria.setAriaHidden(el);

        expect(result.allSiblings.length).toEqual(1);
        expect(result.ariaHiddens.length).toEqual(0);
        expect(result.allSiblings[0].getAttribute('aria-hidden')).toBeTruthy();

        const resultReset = aria.resetAriaHidden(result);
        const siblingAttr = resultReset.allSiblings[0].getAttribute('aria-hidden');

        expect(siblingAttr).toEqual(null);

        document.body.innerHTML = '';
        global.document['body'] = original;
      });
    });
  });
});
