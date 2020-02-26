import * as React from "react";
import { shallow } from "enzyme";
import PhoneLink from ".";

describe("PhoneLink", () => {
  it("PhoneLink renders without crashing", () => {
    const wrapper = shallow(<PhoneLink />);
    expect(wrapper.render()).toMatchSnapshot();
  });
});
