import { download } from '../hn-service';
import * as AdobeAnalytics from '../adobe-analytics';
// TODO: Kan tas i bruk når isomorphic-fetch er oppgradert til 3.0.0
// Nåværende versjon bruker en gammel node-fetch som ikke støtter blob()
//import * as DateUtils from '../date-utils';

describe('gitt at download kalles', () => {
  const fetchMock = jest.spyOn(global, 'fetch');
  const trackErrorMock = jest.spyOn(AdobeAnalytics, 'trackError');
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // TODO: Kan tas i bruk når isomorphic-fetch er oppgradert til 3.0.0
  // describe('Når window.navigator.msSaveOrOpenBlob eksisterer', () => {
  //   it('Så kalles msSaveOrOpenBlob med riktige parametere', async () => {
  //     const originalMsSaveOrOpenBlob = window.navigator.msSaveOrOpenBlob;
  //     const mockMsSaveOrOpenBlob = jest.fn();
  //     window.navigator.msSaveOrOpenBlob = mockMsSaveOrOpenBlob;
  //     const response = new Response(new Blob([], { type: 'application/pdf' }), {
  //       status: 200,
  //       headers: {
  //         'content-disposition': 'filename="test.pdf"',
  //       },
  //     });
  //     fetchMock.mockResolvedValueOnce(response);

  //     await download('DownloadJournalDocument');

  //     expect(mockMsSaveOrOpenBlob).toBeCalledTimes(1);
  //     expect(mockMsSaveOrOpenBlob).toBeCalledWith(expect.any(Object), 'test.pdf');

  //     window.navigator.msSaveOrOpenBlob = originalMsSaveOrOpenBlob;
  //   });
  // });

  // describe('Når requesten mangler filename', () => {
  //   it('Så kalles msSaveOrOpenBlob med et automatisk generert filnavn', async () => {
  //     jest.spyOn(DateUtils, 'todaysDate').mockReturnValueOnce('2021-3-15');

  //     const originalMsSaveOrOpenBlob = window.navigator.msSaveOrOpenBlob;
  //     const mockMsSaveOrOpenBlob = jest.fn();
  //     window.navigator.msSaveOrOpenBlob = mockMsSaveOrOpenBlob;
  //     const response = new Response(new Blob([], { type: 'application/pdf' }), {
  //       status: 200,
  //     });
  //     fetchMock.mockResolvedValueOnce(response);

  //     await download('DownloadJournalDocument');

  //     expect(mockMsSaveOrOpenBlob).toBeCalledTimes(1);
  //     expect(mockMsSaveOrOpenBlob).toBeCalledWith(expect.any(Object), 'nedlasting-2021-3-15-helseNorge');

  //     window.navigator.msSaveOrOpenBlob = originalMsSaveOrOpenBlob;
  //   });
  // });

  // describe('Når window.navigator.msSaveOrOpenBlob ikke eksisterer', () => {
  //   it('Så opprettes en link til PDFen', async () => {
  //     window.URL.createObjectURL = jest.fn().mockReturnValue('mock-href');
  //     window.URL.revokeObjectURL = jest.fn();

  //     const response = new Response(new Blob([], { type: 'application/pdf' }), {
  //       status: 200,
  //       headers: {
  //         'content-disposition': 'filename="test.pdf"',
  //       },
  //     });
  //     fetchMock.mockResolvedValueOnce(response);

  //     await download('DownloadJournalDocument');

  //     const linkList = document.getElementsByTagName('a');

  //     expect(linkList.length).toEqual(1);
  //     expect(linkList[0].getAttribute('download')).toEqual('test.pdf');
  //   });
  // });
  describe('Når fetch ikke klarer å koble til på grunn av nettverksfeil', () => {
    it('Så returneres en feilmelding', async () => {
      fetchMock.mockRejectedValueOnce(new TypeError('Failed to fetch'));

      try {
        await download('DownloadJournalDocument');
      } catch (error) {
        expect(error).toEqual({
          ErrorMessage: {
            Title: 'Det har skjedd en teknisk feil.',
            Body: 'Prøv igjen senere.',
          },
        });
      }
    });
  });

  describe('Når fetch klarer å hente, men APIet svarer med et feilmeldings-objekt', () => {
    it('Så returneres en feilmelding og trackError kalles', async () => {
      const response = new Response('{ "Code":"EHAPI-100000", "Message":"Teknisk feil", "ErrorCategory": 0}', {
        status: 500,
      });
      fetchMock.mockResolvedValueOnce(response);

      try {
        await download('DownloadJournalDocument');
      } catch (error) {
        expect(error).toEqual({
          ErrorMessage: {
            Title: 'Det har skjedd en teknisk feil.',
            Body: '',
          },
        });
      }
      expect(trackErrorMock).toBeCalledTimes(1);
      expect(trackErrorMock).toBeCalledWith('level1');
    });
  });

  describe('Når fetch klarer å hente, men APIet svarer med et feilmeldings-objekt som inneholder ErrorMessage', () => {
    it('Så returneres feilmeldingen fra APIet og trackError kalles', async () => {
      const response = new Response(
        '{"ErrorMessage": {"Title": "Dette er feilmeldingens Title.","Body": "Dette er feilmeldingens Body."}}"',
        {
          status: 500,
        }
      );
      fetchMock.mockResolvedValueOnce(response);

      try {
        await download('DownloadJournalDocument');
      } catch (error) {
        expect(error).toEqual({
          ErrorMessage: {
            Title: 'Dette er feilmeldingens Title.',
            Body: 'Dette er feilmeldingens Body.',
          },
        });
      }
      expect(trackErrorMock).toBeCalledTimes(1);
      expect(trackErrorMock).toBeCalledWith('level1');
    });
  });

  describe('Når fetch klarer å hente, men APIet svarer med 401 i body', () => {
    it('Så lastes vinduet på nytt', async () => {
      const originalLocation = window.location;
      const reloadMock = jest.fn();
      delete (window as Partial<Window>).location;
      window.location = Object.defineProperties(
        // start with an empty object on which to define properties
        {},
        {
          // grab all of the property descriptors for the
          // `jsdom` `Location` object
          ...Object.getOwnPropertyDescriptors(originalLocation),

          // overwrite a mocked method for `window.location.assign`
          reload: {
            configurable: true,
            value: reloadMock,
          },

          // more mocked methods here as needed
        }
      ) as Window['location'];

      const response = new Response('401', {
        status: 401,
      });
      fetchMock.mockResolvedValueOnce(response);

      try {
        await download('DownloadJournalDocument');
      } catch (error) {
        expect(error).toEqual('401');
      }
      expect(reloadMock).toBeCalledTimes(1);
      expect(reloadMock).toBeCalledWith();

      window.location = originalLocation;
    });
  });

  describe('Når fetch klarer å hente, men APIet svarer med en tom streng', () => {
    it('Så returneres en feilmelding', async () => {
      const response = new Response('', {
        status: 500,
      });
      fetchMock.mockResolvedValueOnce(response);

      try {
        await download('DownloadJournalDocument');
      } catch (error) {
        expect(error).toEqual({
          ErrorMessage: {
            Title: 'Det har skjedd en teknisk feil.',
            Body: '',
          },
        });
      }
    });
  });
});
