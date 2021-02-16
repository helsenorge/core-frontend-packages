import * as resourcesFunctions from '../resources';
import * as HNProxyServiceFunctions from '../hn-proxy-service';
import * as CmsContentApiService from '../cms-content-api-service';

describe('Resources', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });
  const fakeResourcesState: resourcesFunctions.ResourcesState = {};

  describe('Gitt at ResourcesState er tom', () => {
    describe('Når resources kalles med REQUEST action', () => {
      it('Så returnerer den tilsvarende json stringified key med riktig status', () => {
        const testAction = {
          type: resourcesFunctions.REQUEST,
          project: 'projectname',
          language: 'language',
        };

        const expectedReturned = {
          myprojectkey: fakeResourcesState.randomprojectkey,
          '{"project":"projectname","language":"language"}': { error: false, items: null, loaded: false, loading: true },
        };
        const returnedResources = resourcesFunctions.resources(fakeResourcesState, testAction);
        expect(returnedResources).toEqual(expectedReturned);
      });
    });

    describe('Når resources kalles med RECEIVE action', () => {
      it('Så returnerer den tilsvarende json stringified key med riktig status', () => {
        const testAction = {
          type: resourcesFunctions.RECEIVE,
          project: 'projectname',
          language: 'language',
          data: {},
        };

        const expectedReturned = {
          randomprojectkey: fakeResourcesState.randomprojectkey,
          '{"project":"projectname","language":"language"}': { error: false, items: {}, loaded: true, loading: false },
        };
        const returnedResources = resourcesFunctions.resources(fakeResourcesState, testAction);
        expect(returnedResources).toEqual(expectedReturned);
      });
    });

    describe('Når resources kalles med FAILURE action', () => {
      it('Så returnerer den tilsvarende json stringified key med riktig status', () => {
        const testAction = {
          type: resourcesFunctions.FAILURE,
          project: 'projectname',
          language: 'language',
        };

        const expectedReturned = {
          randomprojectkey: fakeResourcesState.randomprojectkey,
          '{"project":"projectname","language":"language"}': { error: true, items: null, loaded: false, loading: false },
        };
        const returnedResources = resourcesFunctions.resources(fakeResourcesState, testAction);
        expect(returnedResources).toEqual(expectedReturned);
      });
    });
  });

  describe('Gitt at ResourcesState inneholder et prosjekt', () => {
    const stringifiedProjectKey: string = JSON.stringify({ project: 'projectname', language: 'language' });
    const fakeResourcesStateWithItems: resourcesFunctions.ResourcesState = {
      [stringifiedProjectKey]: { error: false, items: { myresourcekey: 'This is my text' }, loaded: true, loading: false },
    };

    describe('Når getResources kalles med prosjektnavnet og language', () => {
      it('Så returnerer den data items i resources', () => {
        const returnedResources = resourcesFunctions.getResources(fakeResourcesStateWithItems, 'projectname', 'language');
        expect(returnedResources).toEqual({ myresourcekey: 'This is my text' });
      });
    });
  });

  describe('Gitt at global state inneholder resources med et prosjekt', () => {
    const stringifiedProjectKey: string = JSON.stringify({ project: 'projectname', language: 'language' });
    const fakeResourcesStateWithItems: resourcesFunctions.ResourcesState = {
      [stringifiedProjectKey]: { error: false, items: { myresourcekey: 'This is my text' }, loaded: true, loading: false },
    };
    const fakeGlobalState: resourcesFunctions.GlobalStateWithResources = {
      resources: fakeResourcesStateWithItems,
    };

    describe('Når getResources kalles med prosjektnavnet og language', () => {
      it('Så returnerer den data items i resources', () => {
        const returnedResources = resourcesFunctions.getResourcesFromState(fakeGlobalState, 'projectname', 'language');
        expect(returnedResources).toEqual({ myresourcekey: 'This is my text' });
      });
    });

    describe('Når getResources kalles og at resources har status loaded false', () => {
      it('Så returnerer den null', () => {
        const fakeGlobalStateWithLoadedFalse = {
          resources: {
            [stringifiedProjectKey]: { ...fakeResourcesStateWithItems[stringifiedProjectKey], loaded: false },
          },
        };
        const returnedResources = resourcesFunctions.getResourcesFromState(fakeGlobalStateWithLoadedFalse, 'projectname', 'language');
        expect(returnedResources).toEqual(null);
      });
    });

    describe('Når getResourcesObjectFromState kalles med prosjektnavnet og language', () => {
      it('Så returnerer riktig Resource object', () => {
        const returnedResources = resourcesFunctions.getResourcesObjectFromState(fakeGlobalState, 'projectname', 'language');
        expect(returnedResources).toEqual(fakeGlobalState.resources[stringifiedProjectKey]);
      });
    });

    describe('Når getResourcesObjectFromState kalles et prosjekt som ikke finnes', () => {
      it('Så returnerer en ny Resource ocject med default status', () => {
        const returnedResources = resourcesFunctions.getResourcesObjectFromState(fakeGlobalState, 'smthgrandom', 'language');
        expect(returnedResources).toEqual({ error: false, loading: false, items: {}, loaded: false });
      });
    });

    describe('Når shouldFetchResources kalles med et prosjekt som allerede ble fetchet', () => {
      it('Så returnerer den false', () => {
        const shouldFetch = resourcesFunctions.shouldFetchResources(fakeGlobalState, 'projectname', 'language');
        expect(shouldFetch).toBeFalsy();
      });
    });
  });

  describe('Gitt at hn-proxy-service fungerer og er på tjenester', () => {
    beforeEach(() => {
      jest.resetAllMocks();
      jest.spyOn(HNProxyServiceFunctions, 'erTjenester').mockImplementation(() => true);
    });

    describe('Når getProxyResx kalles', () => {
      it('Så kalles det get med riktig parameters', () => {
        const mockSuccessResponse = {
          resources: 'smthg',
        };
        const response = new Response(JSON.stringify(mockSuccessResponse), {
          headers: {},
          status: 200,
          statusText: 'OK',
        });
        const mockFetchPromise = Promise.resolve(response);

        const getMock = jest.spyOn(HNProxyServiceFunctions, 'get').mockImplementation(() => mockFetchPromise);
        resourcesFunctions.getProxyResx(
          'name',
          'culture',
          () => {},
          () => {}
        );
        expect(getMock).toBeCalled();
        expect(getMock.mock.calls[0][0]).toEqual('UIResource');
        expect(getMock.mock.calls[0][1]).toEqual('sot');
        expect(getMock.mock.calls[0][2].Culture).toEqual('culture');
        expect(getMock.mock.calls[0][2].Filename).toEqual('name');

        const getMockHelsenorgeProxy = jest.spyOn(CmsContentApiService, 'getHelsenorgeProxy');
        expect(getMockHelsenorgeProxy).not.toBeCalled();
      });
    });
  });

  describe('Gitt at helsenorge proxy fungerer og ikke er på tjenester', () => {
    beforeEach(() => {
      jest.resetAllMocks();
      jest.spyOn(HNProxyServiceFunctions, 'erTjenester').mockImplementation(() => false);
    });

    describe('Når getProxyResx kalles', () => {
      it('Så kalles det get i cmscontent med riktig parameters', () => {
        const mockSuccessResponse = {
          resources: 'smthg',
        };
        const response = new Response(JSON.stringify(mockSuccessResponse), {
          headers: {},
          status: 200,
          statusText: 'OK',
        });
        const mockFetchPromise = Promise.resolve(response);

        const getHelsenorgeProxyMock = jest.spyOn(CmsContentApiService, 'getHelsenorgeProxy').mockImplementation(() => mockFetchPromise);
        resourcesFunctions.getProxyResx(
          'name',
          'culture',
          () => {},
          () => {}
        );
        expect(getHelsenorgeProxyMock).toBeCalled();
        expect(getHelsenorgeProxyMock.mock.calls[0][0]).toEqual('UIResource');
        expect(getHelsenorgeProxyMock.mock.calls[0][1]).toEqual('sot');
        expect(getHelsenorgeProxyMock.mock.calls[0][2].Culture).toEqual('culture');
        expect(getHelsenorgeProxyMock.mock.calls[0][2].Filename).toEqual('name');

        const getMock = jest.spyOn(HNProxyServiceFunctions, 'get');
        expect(getMock).not.toBeCalled();
      });
    });
  });

  describe('Gitt at Redux store er på plass', () => {
    describe('Når fetchResources kalles', () => {
      it('Så disptacher den riktig action', () => {
        const fakeResourcesStateWithItems: resourcesFunctions.ResourcesState = {};
        const fakeGlobalState: resourcesFunctions.GlobalStateWithResources = {
          resources: fakeResourcesStateWithItems,
        };

        const dispatchMock = jest.fn();
        const dispatchFunction = resourcesFunctions.fetchResources('project', 'language');
        const r = dispatchFunction(dispatchMock, () => fakeGlobalState);
        expect(dispatchMock).toHaveBeenCalledWith({ language: 'language', project: 'project', type: 'resources/REQUEST' });
        expect(r).toEqual(null);
      });
    });
  });
});
