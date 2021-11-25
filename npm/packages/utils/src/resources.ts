import { Dispatch, Action } from 'redux';

import { OperationResponse, TextMessage, EmptyAction } from './types/entities';
import { erHelsenorge, get as getTjenesterProxy } from './hn-proxy-service';
import { getHelsenorgeProxy } from './cms-content-api-service';
import { getVersion } from './hn-page';
import LanguageLocales from './constants/languages';

interface SotProxyOperationResponse {
  resources: string;
}

type ResourceItem = { [key: string]: string } | {};
export interface Resource {
  items: ResourceItem | null;
  loading: boolean;
  loaded: boolean;
  error: boolean;
}

/* Resource State where a key is a stringified projectName with language:
f.ex '{"project":"projectname","language":"language"}' */
export type ResourcesState = { [key: string]: Resource };

export interface GlobalStateWithResources {
  resources: ResourcesState;
}
/**************** ACTIONS TYPES *****************/
type REQUEST = 'resources/REQUEST';
export const REQUEST: REQUEST = 'resources/REQUEST';
type RECEIVE = 'resources/RECEIVE';
export const RECEIVE: RECEIVE = 'resources/RECEIVE';
type FAILURE = 'resources/FAILURE';
export const FAILURE: FAILURE = 'resources/FAILURE';

/******************* ACTIONS *******************/
export type RequestResourcesAction = {
  type: REQUEST;
  project: string;
  language: string;
};

export type ReceiveResourcesAction = {
  type: RECEIVE;
  data: ResourceItem;
  project: string;
  language: string;
};

export type ReceiveResourcesFailedAction = {
  type: FAILURE;
  project: string;
  language: string;
};

export type ResourcesAction = RequestResourcesAction | ReceiveResourcesAction | ReceiveResourcesFailedAction | EmptyAction;

/******************* REDUCERS *******************/
function requestResources(project: string, language: string): RequestResourcesAction {
  return {
    type: REQUEST,
    project,
    language,
  };
}

function receiveResources(data: ResourceItem, project: string, language: string): ReceiveResourcesAction {
  return {
    type: RECEIVE,
    data,
    project,
    language,
  };
}

function receiveResourcesFailed(project: string, language: string): ReceiveResourcesFailedAction {
  return {
    type: FAILURE,
    project,
    language,
  };
}

/**
 * Returnerer ResourcesState med oppdatert status avhengig av Action
 * @param resourcesState - incoming ResourcesState
 * @param action - ønsket ResourcesAction (Request, Receive, Failure, Empty)
 */
export const resources = (resourcesState: ResourcesState = {}, action: ResourcesAction): ResourcesState => {
  const project: string | undefined = 'project' in action ? action.project : undefined;
  const language: string | undefined = 'language' in action ? action.language : undefined;
  const key = { project: project, language: language };
  const stringifiedKey: string = JSON.stringify(key);
  const resources: ResourcesState = { ...resourcesState };

  switch (action.type) {
    case REQUEST:
      resources[stringifiedKey] = {
        error: false,
        loading: true,
        loaded: false,
        items: null,
      };

      return resources;

    case RECEIVE:
      resources[stringifiedKey] = {
        error: false,
        loading: false,
        loaded: true,
        items: (action as ReceiveResourcesAction).data,
      };

      return resources;
    case FAILURE:
      resources[stringifiedKey] = {
        error: true,
        loading: false,
        loaded: false,
        items: null,
      };
      return resources;

    default:
      return resourcesState;
  }
};

/**
 * Returnerer ResourceItem fra resourcesState basert på project og language
 * @param resourcesState - incoming ResourcesState
 * @param project - project string
 * @param language - language string
 */
export const getResources = (resourcesState: ResourcesState, project: string, language: string): ResourceItem | null => {
  const key: string = JSON.stringify({ project: project, language: language });
  return key in resourcesState ? resourcesState[key].items : {};
};

/**
 * Returnerer ResourceItem fra global Staten basert på project og language
 * @param state - incoming GlobalStateWithResources
 * @param project - project string
 * @param language - language string
 */
export const getResourcesFromState = (state: GlobalStateWithResources, project: string, language: string): ResourceItem | null => {
  const key: string = JSON.stringify({ project: project, language: language });
  const value = state.resources[key];
  return value && value.loaded ? value.items : null;
};

/**
 * Returnerer Resource fra global Staten basert på project og language
 * Returnerer ny Resource med default status hvis den ikke finnes
 * @param state - incoming GlobalStateWithResources
 * @param project - project string
 * @param language - language string
 */
export const getResourcesObjectFromState = (state: GlobalStateWithResources, project: string, language: string): Resource => {
  const key: string = JSON.stringify({ project: project, language: language });
  return key in state.resources ? state.resources[key] : { error: false, loading: false, items: {}, loaded: false };
};

function getResourceWithId(json: ResourceItem): ResourceItem {
  return Object.keys(json).reduce((previous, current: string) => {
    const resourceText = json[current] as string;
    if (resourceText.startsWith('{') && resourceText.endsWith('}')) {
      previous[current] = resourceText;
    } else {
      previous[current] = resourceText + ' [' + current + ']';
    }

    return previous;
  }, {});
}

function parseResult(resources: string, success: (data: ResourceItem) => void): void {
  if (resources) {
    let json: ResourceItem = JSON.parse(resources);
    if (window.HN.Debug && window.document.URL.includes('hjelpetekst=true')) {
      json = getResourceWithId(json);
    }
    success(json);
  }
}

/**
 * Kaller get gjennom hn-proxy-service (benytter helsenorgeProxy utenfor tjenester)
 * @param name - Filename param som sendes til SOT UIResource
 * @param culture - Culture param som sendes til SOT UIResource
 * @param success - methode som kalles ved success. Tar imot ResourceItem som param
 * @param failure - methode som kalles ved failure. Tar imot TextMessage som param
 */
export const getProxyResx = (
  name: string,
  culture: string,
  success: (data: ResourceItem) => void,
  failure?: (error?: TextMessage) => void
): void => {
  let getMethod: (proxyName: string, endpoint: string, params?: object) => Promise<{} | Response | undefined | null>;

  if (erHelsenorge()) {
    getMethod = getHelsenorgeProxy;
  } else {
    getMethod = getTjenesterProxy;
  }

  getMethod('sot', 'api/v1/UIResource', {
    Culture: culture,
    Filename: name,
    Rev: getVersion() || new Date().getDate(),
  })
    .then((data: SotProxyOperationResponse) => {
      parseResult(data.resources, success);
    })
    .catch((error: OperationResponse) => {
      if (failure) {
        failure(error.ErrorMessage);
      }
    });
};

/**
 * Returnerer false om resources allerede ligger i staten
 * @param state - incoming GlobalStateWithResources
 * @param project - project string
 * @param language - language string
 */
export const shouldFetchResources = (state: GlobalStateWithResources, project: string, language: string): boolean => {
  const key: string = JSON.stringify({ project: project, language: language });
  return !(key in state.resources);
};

/**
 * Returnerer en dispatch av requestResources basert på project name og language
 * @param project - project string
 * @param language - language string
 */
export const fetchResources = (
  project: string,
  language: string
): ((dispatch: Dispatch<Action>, getState: () => GlobalStateWithResources) => null) => {
  return (dispatch: Dispatch<Action>, getState: () => GlobalStateWithResources): null => {
    if (!language) {
      language = LanguageLocales.NORWEGIAN;
    }
    if (shouldFetchResources(getState(), project, language)) {
      dispatch(requestResources(project, language));
      const success = (data: ResourceItem) => dispatch(receiveResources(data, project, language));
      const failure = () => dispatch(receiveResourcesFailed(project, language));
      getProxyResx(project, language, success, failure);
    }
    return null;
  };
};
