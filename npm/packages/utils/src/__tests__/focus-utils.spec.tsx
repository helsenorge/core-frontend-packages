import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as focusUtils from '../focus-utils';

describe('Focus-utils', () => {
  describe('Gitt at getDocumentActiveElement kalles', () => {
    describe('Når den mottar en wrapper med en knapp som er i focus', () => {
      it('Så finner den Document som rootNode og returnerer Button som activeElement', async () => {
        const { container } = render(
          <section id="wrapper">
            <div id="firstElement-test1">{'Hello'}</div>
            <button id="secondElement-test1">{'Test'}</button>
          </section>
        );

        const button = screen.getByRole('button');
        await userEvent.click(button);

        const activeElement = focusUtils.getDocumentActiveElement(container);
        expect(activeElement).toEqual(button);
      });
    });

    describe('Når den mottar en string som param', () => {
      it('Så finner den elementet som rootNode og returnerer Button som activeElement', async () => {
        render(
          <section id="wrapper">
            <div id="firstElement-test1">{'Hello'}</div>
            <button id="secondElement-test1">{'Test'}</button>
          </section>
        );

        const button = screen.getByRole('button');
        await userEvent.click(button);

        const activeElement = focusUtils.getDocumentActiveElement('section');
        expect(activeElement).toEqual(button);
      });
    });
  });
});
