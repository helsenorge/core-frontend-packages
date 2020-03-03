/// <reference path="../node_modules/@types/node/module.d.ts" />

import { createStore, applyMiddleware, Store, Reducer, Middleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { crashReporter, debouncer } from './middleware';
import { Window, NodeModule } from './types/dev';

export function configureStoreWithMiddleware(rootReducer: Reducer<{}>, middleware: Middleware[] = []): Store<{}> {
  const baseMiddleware: Middleware[] = [crashReporter, debouncer, thunkMiddleware].concat(middleware);

  const windowObject = window as Window;
  let composeEnhancers: Function;
  if (typeof windowObject === 'object' && windowObject.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
    composeEnhancers = windowObject.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({});
  } else {
    composeEnhancers = compose;
  }

  const enhancer: Function = composeEnhancers(applyMiddleware(...baseMiddleware));
  const store: Store<{}> = createStore(rootReducer, enhancer);

  const moduleObj: NodeModule = module as NodeModule;

  if (typeof moduleObj.hot !== 'undefined') {
    moduleObj.hot.accept();
  }

  return store;
}
