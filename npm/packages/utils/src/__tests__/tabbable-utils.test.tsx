import React from 'react';

// const fixtures = require('./../_devonly/fixtures');

import { shallow, mount } from 'enzyme';
import TabbableTestContainer from './../_devonly/tabbable-test-container';
import { setTabIndex, resetTabIndex, TabbableContentWithTabIndexes } from '../tabbable-utils';

/*
let fixtureRoots = [];

function getTabbableIds(node, options) {
  return tabbable(node, options).map(el => el.getAttribute('id'));
}

function createRootNode(doc: Document, fixtureName: string) {
  let html = fixtures[fixtureName];
  let root = doc.createElement('div');
  root.innerHTML = html;
  doc.body.appendChild(root);
  console.log('create root', doc.body);
  return root;
}

function fixture(fixtureName: string) {
  let root = createRootNode(document, fixtureName);
  fixtureRoots.push(root);
  return {
    getTabbableIds: getTabbableIds.bind(null, root),
    getDocument() {
      console.log('return document', document);
      return document;
    },
  };
}

function cleanupFixtures() {
  fixtureRoots.forEach(root => {
    document.body.removeChild(root);
  });
  fixtureRoots = [];
}
*/

describe('Gitt at det finnes en container med flere knapper', () => {
  describe('Når ...', () => {
    it('Så ...', () => {
      /*
      let actualDocument = fixture('basic').getDocument();
      let actualIds = fixture('basic').getTabbableIds();
      let actualContainer = actualDocument.getElementById('container');
      console.log('actualDocument.body', actualDocument.body);
      console.log('document.body', document.body);
      console.log('actualIds', actualIds);
      */

      //const updatedTabbableElements: Array<TabbableElement> = tabbable(actualDocument);
      //console.log('actual', actualDocument);
      //console.log('updatedTabbableElements', updatedTabbableElements);

      /*
      const html = document.createElement('div');
      html.innerHTML = `<div class="lang-grid" id="language">This is a sample</div>`;
      document.body.appendChild(html);

      let container = document.createElement('div');
      let button_1 = document.createElement('button');
      let button_2 = document.createElement('a');
      container.setAttribute('id', 'container');
      button_2.setAttribute('href', '#');
      button_2.setAttribute('tabindex', '2');
      container.appendChild(button_1);
      container.appendChild(button_2);
      html.appendChild(container);
      let containerToBeTested = document.getElementById('container');

      console.log('container', container);
      console.log('containerToBeTested', containerToBeTested);
      const updatedTabbableContent: TabbableContentWithTabIndexes = setTabIndex(container);
      const updatedTabbableContent_2: TabbableContentWithTabIndexes = setTabIndex(containerToBeTested);
      console.log('updatedTabbableContent', updatedTabbableContent);

      */

      /* tslint:disable */
      const wrapper = mount(<TabbableTestContainer />, { attachTo: document.body });
      var node = wrapper.getDOMNode();
      const returnedChildren = node.children;
      const updatedReturnedChildren = (returnedChildren[0].offsetParent = {});

      const returnedNodeList = Array.from(updatedReturnedChildren);
      /*
      returnedNodeList.forEach(child => {
        console.log('vhild', child);
        child.offsetParent = {};
      });
      */
      jest.spyOn(node, 'querySelectorAll').mockReturnValue(returnedNodeList);

      //const node = window.document.getElementById('container');
      //const antallButtons = node.querySelectorAll('button');
      console.log('node', node);
      //console.log('liste over nested nodes - should not be empty', antallButtons);

      expect(node).toBeInstanceOf(HTMLDivElement);
      const updatedTabbableContent: TabbableContentWithTabIndexes = setTabIndex(node);
      expect(updatedTabbableContent.previousTabIndexes).toEqual(['null', '2']);
      //expect(updatedTabbableContent.tabbableElements).toEqual([]);
    });
  });
});
