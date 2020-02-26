///<reference path="./types/dev.d.ts"/>
import { Dispatch, Action } from "redux";
import { get, ProxyOperationResponse } from "./hn_proxy_service";

import { getVersion } from "./page";
import { EmptyAction } from "./reducer";

import {
  OperationResponse,
  TextMessage
} from "../generated-types/minhelseentities";

interface SotProxyOperationResponse extends ProxyOperationResponse {
  resources: string;
}

type REQUEST = "resources/REQUEST";
const REQUEST: REQUEST = "resources/REQUEST";
type RECEIVE = "resources/RECEIVE";
export const RECEIVE: RECEIVE = "resources/RECEIVE";
type FAILURE = "resources/FAILURE";
const FAILURE: FAILURE = "resources/FAILURE";

export interface Resource {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: any;
  loading: boolean;
  loaded: boolean;
  error: boolean;
}

type ResourcesState = { [key: string]: Resource };

export interface GlobalStateWithResources {
  resources: ResourcesState;
}

export type ResourcesAction =
  | RequestResourcesAction
  | ReceiveResourcesAction
  | ReceiveResourcesFailedAction
  | EmptyAction;

export function resources(
  resourcesState: ResourcesState = {},
  action: ResourcesAction
): ResourcesState {
  const project: string | undefined =
    "project" in action ? action.project : undefined;
  const language: string | undefined =
    "language" in action ? action.language : undefined;
  const key = { project: project, language: language };
  const stringifiedKey: string = JSON.stringify(key);
  const resources: ResourcesState = { ...resourcesState };

  switch (action.type) {
    case REQUEST:
      resources[stringifiedKey] = {
        error: false,
        loading: true,
        loaded: false,
        items: null
      };

      return resources;

    case RECEIVE:
      resources[stringifiedKey] = {
        error: false,
        loading: false,
        loaded: true,
        items: (action as ReceiveResourcesAction).data
      };

      return resources;
    case FAILURE:
      resources[stringifiedKey] = {
        error: true,
        loading: false,
        loaded: false,
        items: null
      };
      return resources;

    default:
      return resourcesState;
  }
}

function requestResources(
  project: string,
  language: string
): RequestResourcesAction {
  return {
    type: REQUEST,
    project,
    language
  };
}

export type RequestResourcesAction = {
  type: REQUEST;
  project: string;
  language: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function receiveResources(
  data: Record<string, any>,
  project: string,
  language: string
): ReceiveResourcesAction {
  return {
    type: RECEIVE,
    data,
    project,
    language
  };
}
export type ReceiveResourcesAction = {
  type: RECEIVE;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
  project: string;
  language: string;
};

function receiveResourcesFailed(
  project: string,
  language: string
): ReceiveResourcesFailedAction {
  return {
    type: FAILURE,
    project,
    language
  };
}
export type ReceiveResourcesFailedAction = {
  type: FAILURE;
  project: string;
  language: string;
};

export function shouldFetchResources(
  state: GlobalStateWithResources,
  project: string,
  language: string
): boolean {
  const key: string = JSON.stringify({ project: project, language: language });
  return !(key in state.resources);
}

export function fetchResources(
  project: string,
  language: string
): (
  dispatch: Dispatch<Action>,
  getState: () => GlobalStateWithResources
) => null {
  return (
    dispatch: Dispatch<Action>,
    getState: () => GlobalStateWithResources
  ) => {
    if (!language) {
      language = "nb-NO";
    }
    if (shouldFetchResources(getState(), project, language)) {
      dispatch(requestResources(project, language));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const success = (data: Record<string, any>) =>
        dispatch(receiveResources(data, project, language));
      const failure = () => dispatch(receiveResourcesFailed(project, language));
      getProxyResx(project, language, success, failure);
    }
    return null;
  };
}

export function getResources(
  resources: ResourcesState,
  project: string,
  language: string
): {} {
  const key: string = JSON.stringify({ project: project, language: language });
  return key in resources ? resources[key].items : {};
}

export function getResourcesFromState(
  state: GlobalStateWithResources,
  project: string,
  language: string
): {} {
  const key: string = JSON.stringify({ project: project, language: language });
  const value = state.resources[key];
  return value && value.loaded ? value.items : null;
}

export function getResourcesObjectFromState(
  state: GlobalStateWithResources,
  project: string,
  language: string
): Resource {
  const key: string = JSON.stringify({ project: project, language: language });
  return key in state.resources
    ? state.resources[key]
    : { error: false, loading: false, items: {}, loaded: false };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getProxyResx(
  name: string,
  culture: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  success: (data: Record<string, any>) => void,
  failure?: (error?: TextMessage) => void
) {
  get("UIResource", "sot", {
    Culture: culture,
    Filename: name,
    Rev: getVersion() || new Date().getDate()
  })
    .then((data: SotProxyOperationResponse) => {
      parseResult(data.resources, success);
    })
    .catch((error: OperationResponse) => {
      if (failure) {
        failure(error.ErrorMessage);
      }
    });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseResult(
  resources: string,
  success: (data: Record<string, any>) => void
) {
  if (resources) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let json: Record<string, any> = JSON.parse(resources);
    if (window.HN.Debug && window.document.URL.includes("hjelpetekst=true")) {
      json = getResourceWithId(json);
    }
    success(json);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getResourceWithId(json: Record<string, any>) {
  return Object.keys(json).reduce((previous, current) => {
    previous[current] = json[current] + " [" + current + "]";
    return previous;
  }, {});
}
