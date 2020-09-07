import * as React from 'react';
import { mount } from 'enzyme';
import * as focusUtils from '../focus-utils';

describe('Focus-utils', () => {
  // This is a trick to be able to set activeElement property to document
  Object.defineProperty(global.document, 'activeElement', {
    writable: true,
    value: {},
  });

  describe('Gitt at getDocumentActiveElement kalles', () => {
    const wrapperContent = (
      <section id="wrapper">
        <div id="firstElement-test1">{'Hello'}</div>
        <button id="secondElement-test1" />
      </section>
    );
    const wrapper = mount(wrapperContent, { attachTo: document.body });

    describe('Når den mottar en wrapper med en knapp som er i focus', () => {
      it('Så finner den Document som rootNode og returnerer Button som activeElement', () => {
        const original = global.document['body'];

        const node = document.getElementById('wrapper');
        const rootNode = node.getRootNode();

        // Verify that its find its way to the parent rootNode which is Document
        expect(rootNode.constructor.name).toEqual('Document');
        const btn = wrapper.find('button');
        btn.simulate('focus');
        global.document['activeElement'] = btn;
        wrapper.update();

        const element = focusUtils.getDocumentActiveElement(node as HTMLElement);
        expect(element).toEqual(btn);
        global.document['body'] = original;
      });
    });

    describe('Når den mottar en string som param', () => {
      it('Så finner den Document som rootNode og returnerer Button som activeElement', () => {
        const original = global.document['body'];

        const btn = wrapper.find('button');
        btn.simulate('focus');
        global.document['activeElement'] = btn;
        wrapper.update();

        // Verify that its find its way to the section through querySelector
        const domNode = document.querySelector('section');
        expect(domNode.nodeName).toEqual('SECTION');

        // Verify that its find its way to the parent rootNode which is Document
        const rootNode = domNode.getRootNode();
        expect(rootNode.constructor.name).toEqual('Document');

        const element = focusUtils.getDocumentActiveElement('section');
        expect(element).toEqual(btn);
        global.document['body'] = original;
      });
    });
  });
});
