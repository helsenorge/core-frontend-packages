import { AnyAction } from 'redux';
import { configureStoreWithMiddleware } from '../store';

describe('Store', () => {
  describe('Gitt at Redux er tatt i bruk', () => {
    describe('Når configureStoreWithMiddleware kalles', () => {
      it('Så lager den en fullverdig store', () => {
        type stateType = { default: string };
        function testReducer(state: stateType = { default: 'default' }, action: AnyAction) {
          switch (action.type) {
            default:
              return state;
          }
        }
        const fakeAction = { type: 'TYPE' };
        const store = configureStoreWithMiddleware(testReducer, []);

        const d = store.dispatch(fakeAction);
        expect(d).toEqual({ type: 'TYPE' });
        const s = store.getState();
        expect(s).toEqual({ default: 'default' });
      });
    });
  });
});
