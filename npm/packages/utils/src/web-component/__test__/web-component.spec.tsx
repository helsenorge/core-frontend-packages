

import React, { createContext } from 'react';
import WithStore from "../utils/withStore";
import { shallow, ReactWrapper } from 'enzyme';
describe('Web components', () => {
   const reducer = (state: {}, action: { type: string }) => {
    switch (action.type) {
      default: {
        return state;
      }
    }
  };

  
  const StateContext = createContext({})
  const stateDispatch = createContext<React.Dispatch<{ type: string }>>(() => { });
  const Test = () => <div></div>;
let stata = {}

  const props = { 
    StateContext: StateContext,
    DispatchContext: stateDispatch,
    reducer: reducer,
    initialState: stata
  
 }
  WithStore<{}, { type: string }>(props)
  let wrapper = shallow(<WithStore  {}  ><Test /></WithStore>);
  expect(wrapper).toMatchSnapshot();
  // test stuff
});
