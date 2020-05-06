import React, { createContext, useContext } from 'react';
import { mount } from 'enzyme';
import WithStore from '../with-store';

interface State {
  tester: string;
}
interface Action {
  type: string;
}

describe('Gitt at web component skal testes', () => {
  describe('Når withstore brukes', () => {
    it('Så skal elementer som er inni kunne bruke context', () => {
      const reducer = (state: State, action: Action): State => {
        switch (action.type) {
          default: {
            return state;
          }
        }
      };

      const StateContext = createContext<State>({ tester: 'test' });
      const stateDispatch = createContext<React.Dispatch<Action>>(() => {});

      const Test: React.FC = () => {
        const state = useContext(StateContext);
        return <div id="testdiv">{state.tester}</div>;
      };

      const state: State = { tester: 'test' };

      const props = {
        StateContext: StateContext,
        DispatchContext: stateDispatch,
        reducer: reducer,
        initialState: state,
      };

      const wrapper = mount(
        <WithStore<State, Action> {...props}>
          <Test />
        </WithStore>
      );

      expect(wrapper.find('#testdiv').text()).toBe('test');
    });
  });
});
