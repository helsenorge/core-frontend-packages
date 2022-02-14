import * as React from 'react';
import { shallow } from 'enzyme';
import { Dropdown } from '.';

describe('Dropdown', () => {
  it('Dropdown renders without crashing', () => {
    shallow(<Dropdown name="test" index={0} toggleDropdown={() => {}} open />);
  });
});
