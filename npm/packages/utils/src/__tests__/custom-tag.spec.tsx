import React from 'react';

import { mount } from 'enzyme';

import CustomTag from '../custom-tag';

describe('Custom-tag', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  const wrapper = mount(<CustomTag tagName="h1" />);
  describe('Gitt at Customtag lages, Når den bruker tagName h1 ', () => {
    it('Så innholder wrapper h1', () => {
      expect(wrapper.html()).toContain('<h1></h1>');
    });
  });
});
