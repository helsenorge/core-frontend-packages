import React, { createContext, useContext } from 'react';
import WithStore from '../utils/withStore';
import { shallow, ReactWrapper, mount } from 'enzyme';
import config from '../index';
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'test-component': {};
    }
  }
}
describe('Git når: withstore brukes', () => {
  it('Så skal: ett element har state inni seg:', () => {
    interface typesting {
      tester: string;
    }
    interface action {
      type: string;
    }
    const reducer = (state: typesting, action: action) => {
      switch (action.type) {
        default: {
          return state;
        }
      }
    };
    const StateContext = createContext<typesting>({ tester: 'test' });
    const stateDispatch = createContext<React.Dispatch<action>>(() => {});
    const Test: React.FC = () => {
      const state = useContext(StateContext);
      return <div id="testdiv">{state.tester}</div>;
    };
    let stata: typesting = { tester: 'test' };
    const props = {
      StateContext: StateContext,
      DispatchContext: stateDispatch,
      reducer: reducer,
      initialState: stata,
    };
    let wrapper = mount(
      <WithStore<typesting, action> {...props}>
        <Test />
      </WithStore>
    );
    expect(wrapper.find('#testdiv').text()).toBe('test');
  });
});
