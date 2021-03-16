import * as contentAPIService from '../cms-content-api-service';
import * as mockLogger from '../logger';

jest.mock('../logger.ts', () => ({
  warn: jest.fn(),
}));

describe('CMS content API service', () => {
  afterEach(() => {
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

  describe('Gitt at getContentApiPreviewUrl kalles', () => {
    describe('Når __CmsContentApiPreviewUrl__ er definert i HN objektet', () => {
      it('Så returnerer den riktig url', () => {
        const HN = {
          Rest: {
            __CmsContentApiPreviewUrl__: 'https://redaktordomene',
          },
        };
        const originalWindowHN = global.window['HN'];
        global.window['HN'] = HN;
        const url = contentAPIService.getContentApiPreviewUrl();
        expect(url).toEqual('https://redaktordomene');
        global.window['HN'] = originalWindowHN;
      });
    });
  });

  describe('Gitt at enableContentApiPreview kalles', () => {
    describe('Når URLen inneholder content-api-preview=true', () => {
      it('Så returnerer den true', () => {
        const originalLocation = window.location;
        delete window.location;
        window.location = new URL('https://tjenester.helsenorge.no/samvalg/?content-api-preview=true');

        const enableContentApiPreview = contentAPIService.enableContentApiPreview();
        expect(enableContentApiPreview).toEqual(true);
        window.location = originalLocation;
      });
    });
    describe('Når URLen ikke inneholder content-api-preview=true', () => {
      it('Så returnerer den false', () => {
        const originalLocation = window.location;
        delete window.location;
        window.location = new URL('https://tjenester.helsenorge.no/samvalg/');

        const enableContentApiPreview = contentAPIService.enableContentApiPreview();
        expect(enableContentApiPreview).toEqual(false);
        window.location = originalLocation;
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
    describe('Når fetch ikke klarer å koble til content-apiet på grunn av nettverksfeil', () => {
      it('Så kastes det en exception, og det logges en warning', async () => {
        jest.spyOn(global, 'fetch').mockRejectedValue(new TypeError('Failed to fetch'));

        await expect(contentAPIService.get('entrypoint')).rejects.toThrow('Failed to fetch');

        expect(mockLogger.warn).toHaveBeenCalledTimes(1);
        expect(mockLogger.warn).toHaveBeenCalledWith(
          'Kall til content-apiet feilet: /contentapi/internal/v1/entrypoint. Mottok ingen respons fra tjenesten.'
        );
      });
    });
    describe('Når content-apiet returnerer 404', () => {
      it('Så kastes det en exception, og det logges en warning', async () => {
        const mockErrorResponse = {
          error: {
            message: 'Fant ikke siden',
          },
        };
        const response = new Response(JSON.stringify(mockErrorResponse), {
          headers: contentAPIService.createHeaders(),
          status: 404,
          statusText: 'Not Found',
        });
        const mockFetchPromise = Promise.resolve(response);
        jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise);

        try {
          await contentAPIService.get('entrypoint');
        } catch (error) {
          expect(error).toEqual(mockErrorResponse);
        }

        expect(mockLogger.warn).toHaveBeenCalledTimes(1);
        expect(mockLogger.warn).toHaveBeenCalledWith(
          'Kall til content-apiet feilet: /contentapi/internal/v1/entrypoint. Feilmelding: {"error":{"message":"Fant ikke siden"}}'
        );
      });
    });
  });
  describe('Gitt at get kalles i forhåndsvisningsmodus', () => {
    describe('Når fetch kalles', () => {
      it('Så sendes det riktig headers, parameters og den går mot riktig entrypoint', async () => {
        const originalLocation = window.location;
        delete window.location;
        window.location = new URL('https://tjenester.helsenorge.no/samvalg/?content-api-preview=true');

        const HN = {
          Rest: {
            __CmsContentApiPreviewUrl__: 'https://redaktordomene',
          },
        };
        const originalWindowHN = global.window['HN'];
        global.window['HN'] = HN;
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

        await contentAPIService.get('samvalgverktoypage');

        await expect(fetchMock).toBeCalledWith('https://redaktordomene/contentapi/internal/v1/samvalgverktoypage', {
          credentials: 'include',
          headers: { _headers: { 'x-preview': ['true'], accept: ['application/json'], 'content-type': ['application/json'] } },
          method: 'get',
        });
        global.window['HN'] = originalWindowHN;
        window.location = originalLocation;
      });
    });
  });
});
