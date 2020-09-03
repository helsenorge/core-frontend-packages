import { AnyAction, Middleware } from 'redux';
import { error } from './logger';
import { debounce } from './debounce';

export const crashReporter: Middleware = () => next => (action: AnyAction) => {
  try {
    return next(action);
  } catch (err) {
    error('Exception in action: ' + action.type, err);
  }
};

const debouncers = {};

export const debouncer: Middleware = () => next => (action: AnyAction) => {
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
