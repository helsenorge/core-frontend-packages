import { createStore, applyMiddleware, Store, Reducer, AnyAction, Middleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';

import { Window, NodeModule } from './types/dev';
import { error } from './logger';
import { debounce } from './debounce';

const debouncers = {};

/**
 * Hjelper for å rapportere exceptions
 * @param next - function som kalles for å gå videre til neste Action
 */
export const crashReporter: Middleware = () => next => (action: AnyAction): AnyAction | undefined => {
  try {
    return next(action);
  } catch (err) {
    error('Exception in action: ' + action.type, err);
  }
};

/**
 * Hjelper for å debounce store actions
 */
export const debouncer: Middleware = () => next => (action: AnyAction): AnyAction | undefined => {
  if (!action.debounce) {
    return next(action);
  }

  if (isNaN(action.debounce)) {
    error('the debounce must be an integer (milliseconds)');
    return next(action);
  }

  let currentDebouncer;
  if (debouncers.hasOwnProperty(action.type)) {
    currentDebouncer = debouncers[action.type];
  } else {
    currentDebouncer = debounce(next, action.debounce);
    debouncers[action.type] = currentDebouncer;
  }

  const newAction = Object.assign({}, action);
  delete newAction.debounce;

  return currentDebouncer(newAction);
};

/**
 * Returnerer en Redux store med default config
 * F.eks: const store = configureStoreWithMiddleware(rootReducer);
 * @param reducer - Redux globalReducer
 * @param middleware - Array med optional middlewares
 */
export const configureStoreWithMiddleware = (rootReducer: Reducer<{}>, middleware: Middleware[] = []): Store<{}> => {
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
};
