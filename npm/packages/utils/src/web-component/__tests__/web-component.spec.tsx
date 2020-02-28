import React, { createContext, useContext } from 'react';
import WithStore from '../utils/withStore';
import { mount } from 'enzyme';
import config from '../index';
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'test-component': {};
    }
  }
}
describe('Git når: withstore brukes', () => {
  it('Så skal: elementer som er inni kunne bruke context:', () => {
    interface state {
      tester: string;
    }
    interface action {
      type: string;
    }
    const reducer = (state: state, action: action) => {
      switch (action.type) {
        default: {
          return state;
        }
      }
    };
    const StateContext = createContext<state>({ tester: 'test' });
    const stateDispatch = createContext<React.Dispatch<action>>(() => {});
    const Test: React.FC = () => {
      const state = useContext(StateContext);
      return <div id="testdiv">{state.tester}</div>;
    };
    let stata: state = { tester: 'test' };
    const props = {
      StateContext: StateContext,
      DispatchContext: stateDispatch,
      reducer: reducer,
      initialState: stata,
    };
    let wrapper = mount(
      <WithStore<state, action> {...props}>
        <Test />
      </WithStore>
    );
    expect(wrapper.find('#testdiv').text()).toBe('test');
  });
});
