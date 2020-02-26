import { Store, Action, Dispatch, AnyAction, Middleware } from "redux";
import { error } from "./logger";
import { debounce } from "./debounce";

interface Console {
  group: (type: string) => void;
  info: (type: string, action: Action) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  log: (type: string, state: Record<string, any>) => void;
  groupEnd: (type: string) => void;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const logger = (store: Store<{}>) => (
  next: (action: Action) => Dispatch<Action>
) => (action: any) => {
  const info: Console = console;
  info.group(action.type);
  info.info("dispatching", action);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: Record<string, any> = next(action);
  info.log("next state", store.getState());
  info.groupEnd(action.type);
  return result;
};

export const crashReporter: Middleware = () => next => (action: AnyAction) => {
  try {
    return next(action);
  } catch (err) {
    error("Exception in action: " + action.type, err);
  }
};

const debouncers = {};

export const debouncer: Middleware = () => next => (action: AnyAction) => {
  if (!action.debounce) {
    return next(action);
  }

  if (isNaN(action.debounce)) {
    error("the debounce must be an integer (milliseconds)");
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
