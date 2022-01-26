import * as React from 'react';
import { mount } from 'enzyme';
import CheckBoxGroup, { Option } from '.';

const checkboxes = new Array<Option>();
checkboxes.push({ label: 'Option1', id: '1', checked: false }, { label: 'Option2', id: '2', checked: true });

it('CheckBoxGroup renders without crashing', () => {
  mount(<CheckBoxGroup id="1" checkboxes={checkboxes} handleChange={() => null} />);
});

it('CheckBoxGroup renders sublabel', () => {
  const wrapper = mount(
    <CheckBoxGroup
      id="1"
      handleChange={() => null}
      checkboxes={checkboxes}
      legend="checkbox-group"
      subLabel={<span className="sublabel">{`sublabel`}</span>}
    />
  );
  expect(wrapper.find('.sublabel').length).toEqual(1);
});
