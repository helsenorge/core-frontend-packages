import * as contentAPIService from '../cms-content-api-service';

describe('CMS content API service', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('Gitt at getContentApiUrl kalles', () => {
    describe('Når __CmsContentApiUrl__ er definert i HN objektet', () => {
      it('Så returnerer den riktig url', () => {
        const HN = {
          Rest: {
            __CmsContentApiUrl__: 'testurl',
          },
        };
        const originalWindowHN = global.window['HN'];
        global.window['HN'] = HN;
        const url = contentAPIService.getContentApiUrl();
        expect(url).toEqual('testurl');
        global.window['HN'] = originalWindowHN;
      });
    });
  });

  describe('Gitt at createHeaders kalles', () => {
    it('Så returnerer den riktig Header objekt', () => {
      const headers = contentAPIService.createHeaders();
      expect(headers._headers.accept[0]).toEqual('application/json');
      expect(headers._headers['content-type'][0]).toEqual('application/json');
    });
  });

  describe('Gitt at parseParams kalles', () => {
    it('Så returnerer den riktig params string', () => {
      const params = contentAPIService.parseParams({ first: 'param1', second: 'param2' });
      expect(params).toEqual('?first=param1&second=param2');
    });
  });

  describe('Gitt at checkStatus kalles', () => {
    const headers = contentAPIService.createHeaders();
    const jsonBody = {
      testJson: [{ testName: 'John', testLastName: 'Doe' }],
    };
    describe('Når responsen har status 204', () => {
      it('Så returnerer den undefined', async () => {
        const response = { status: 204, headers };
        const status = contentAPIService.checkStatus(response as Response);
        await expect(status).toEqual(undefined);
      });
    });
    describe('Når responsen har status ok', () => {
      it('Så returnerer den json responsen', async () => {
        const response = new Response(JSON.stringify(jsonBody), { headers, status: 200, statusText: 'OK' });

        const status = await contentAPIService.checkStatus(response as Response);

        await expect(status).toEqual({ testJson: [{ testLastName: 'Doe', testName: 'John' }] });
      });
    });
    describe('Når responsen ikker er ok', () => {
      it('Så kaster den feilmelding med json innholdet', async () => {
        try {
          const response = new Response(JSON.stringify(jsonBody), { headers, status: 404 });

          const status = await contentAPIService.checkStatus(response as Response);
        } catch (e) {
          const r = JSON.stringify(e.testJson);
          expect(r).toEqual('[{"testName":"John","testLastName":"Doe"}]');
        }
      });
    });
  });

  describe('Gitt at get kalles', () => {
    describe('Når fetch kalles', () => {
      it('Så sendes det riktig headers, parameters og den går mot riktig entrypoint', async () => {
        const mockSuccessResponse = {
          responsetest: {
            lorem: 'ipsum',
          },
        };
        const response = new Response(JSON.stringify(mockSuccessResponse), {
          headers: contentAPIService.createHeaders(),
          status: 200,
          statusText: 'OK',
        });
        const mockFetchPromise = Promise.resolve(response);
        const fetchMock = jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise);

        const url = await contentAPIService.get('entrypoint');

        await expect(fetchMock).toBeCalledWith('/contentapi/internal/v1/entrypoint', {
          credentials: 'omit',
          headers: { _headers: { accept: ['application/json'], 'content-type': ['application/json'] } },
          method: 'get',
        });
      });
    });
  });
});
