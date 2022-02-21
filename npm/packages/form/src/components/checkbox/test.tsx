import * as React from 'react';
import { shallow } from 'enzyme';
import { CheckBox } from '.';

it('Checkbox renders without crashing', () => {
  shallow(<CheckBox id="1" label="test" onChange={() => null} />);
});
