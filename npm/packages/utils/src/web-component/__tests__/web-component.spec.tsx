import React, { createContext, useContext } from 'react';
import { mount } from 'enzyme';

import * as HNFunctions from '../../hn-service';

import WithStore from '../with-store';
import registerWebComp from '../register';
import WebCompConsumer from '../consumer';
import * as webcompEvents from '../events';

interface State {
  tester: string;
}
interface Action {
  type: string;
}

/*

const unmockedFetch = global.fetch;


beforeAll(() => {
  global.fetch = () => {
    console.log('>>>>>>>>>>>>FEEEETCH GLOBAL');
    Promise.resolve({ status: 200, json: () => [] });
  };
  window.fetch = () => {
    console.log('>>>>>>>>>>>>FEEEETCH WINDOW ');
    Promise.resolve({ status: 200, json: () => [] });
  };
});

afterAll(() => {
  global.fetch = unmockedFetch;
});
*/

describe('Gitt at web component skal instansieres', () => {
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

      const TestStateDiv: React.FC = () => {
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
          <TestStateDiv />
        </WithStore>
      );

      expect(wrapper.find('#testdiv').text()).toBe('test');
    });
  });
});

describe('Gitt at web component skal registreres', () => {
  describe('Når det defineres et navn og en komponent på window objektet', () => {
    it('Så er komponenten registrert på det navnet', () => {
      const Testwebcomp: React.FC = () => {
        return <div id="testdiv">{'test'}</div>;
      };
      registerWebComp(Testwebcomp, 'hn-webcomp-test', { events: true, styledComponents: true }, 'hn-webcomp-test-template');

      const webCompName = window.customElements.get('hn-webcomp-test');
      expect(webCompName).toBeTruthy();
    });
  });
});

describe('Gitt at web component skal consumeres', () => {
  describe('Når den fetcher assets-manifest', () => {
    it('Så fetcher den ressurser fra riktig url og instansierer komponent', async () => {
      jest.spyOn(HNFunctions, 'getAssetsUrl').mockImplementation(() => 'assetsUrl');

      const mockSuccessResponse = {
        assets: {
          'entryname.css': '/header-footer/static/css/header-footer.26b379af.css',
          'entryname.js': '/header-footer/static/js/header-footer.3f68cbb6.js',
          'entryname.js.map': '/header-footer/static/js/header-footer.3f68cbb6.js.map',
          'index.html': '/header-footer/index.html',
          'static/css/entryname.26b379af.css.map': '/header-footer/static/css/header-footer.26b379af.css.map',
        },
        entrypoints: {
          entryname: ['static/css/entryname.26b379af.css', 'static/js/entryname.3f68cbb6.js', 'static/js/entryname.3f68cbb6.js.map'],
        },
      };
      const mockJsonPromise = Promise.resolve(mockSuccessResponse);
      const mockFetchPromise = Promise.resolve({
        status: 200,
        response: {},
        json: () => mockJsonPromise,
      });
      jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise);

      const webCompFromMicroFrontend = await mount(
        <WebCompConsumer
          domain="mydomain"
          entryName="entryname"
          componentName={'Component'}
          componentProps={{ id: 'testdiv' }}
          includeResetCss
        />
      );
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith('mydomain/assets.json');
      expect(webCompFromMicroFrontend.render()).toMatchSnapshot();
    });
  });
});

describe('Gitt at web component events skal kalles', () => {
  describe('Når getEventTarget kalles på en event med path', () => {
    it('Så returnerer den event.path', () => {
      const eventWithPath = ({
        path: ['/eventpath'],
      } as unknown) as Event;
      const result = webcompEvents.getEventTarget(eventWithPath);

      expect(result).toBe('/eventpath');
    });
  });

  describe('Når getEventTarget kalles på en event uten path', () => {
    it('Så kaller den composedPath', () => {
      const composedPathMock = jest.fn().mockImplementation(() => ['/eventcomposedpath']);
      const eventWithoutPath = ({
        composedPath: composedPathMock,
      } as unknown) as Event;
      const result = webcompEvents.getEventTarget(eventWithoutPath);

      expect(composedPathMock).toHaveBeenCalled();
      expect(result).toBe('/eventcomposedpath');
    });
  });
});
