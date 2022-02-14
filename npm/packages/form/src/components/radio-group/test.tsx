import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { RadioGroup } from '.';

const testOptions = [{ type: 'test', label: 'test label' }];

describe('RadioGroup', () => {
  it('RadioGroup renders without crashing', () => {
    shallow(<RadioGroup id="test" onChange={() => null} options={testOptions} />);
  });

  it('RadioGroup renders sublabel', () => {
    const wrapper = mount(
      <RadioGroup
        id="test"
        onChange={() => null}
        options={testOptions}
        legend="radio-group"
        subLabel={<span className="sublabel">{`sublabel`}</span>}
      />
    );
    expect(wrapper.find('.sublabel').length).toEqual(1);
  });
});
