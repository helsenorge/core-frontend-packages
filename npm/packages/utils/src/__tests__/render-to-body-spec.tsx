import * as React from "react";
import { shallow } from "enzyme";
import RenderToBody from "./../render-to-body";

describe("RenderToBody", () => {
  it("RenderToBody renders without crashing", () => {
    shallow(<RenderToBody />);
  });
});
