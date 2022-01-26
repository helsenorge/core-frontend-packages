import * as hasPdfFunctions from '../has-pdf';

describe('Has-pdf', () => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(_query => ({
      matches: true,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    })),
  });
  Object.defineProperty(global.navigator, 'mimeTypes', {
    writable: true,
    value: {},
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('Gitt at det kalles hasPdf', () => {
    describe('Når nettleseren ikke støtter PDF', () => {
      it('Så sjekkes den navigator mimetype og PDF ActiveXObject og returnerer false', () => {
        const pdfCheck = hasPdfFunctions.hasPdf();
        expect(pdfCheck).toBeFalsy();
      });
    });
    describe('Når nettleseren støtter PDF', () => {
      it('Så returnerer den true', () => {
        const originalNavigatorMimeTypes = global.navigator['mimeTypes'];
        global.navigator.mimeTypes = { 'application/pdf': true };
        const pdfCheck = hasPdfFunctions.hasPdf();
        expect(pdfCheck).toBeTruthy();
        global.navigator['mimeTypes'] = originalNavigatorMimeTypes;
      });
    });
  });

  describe('Gitt at det kalles handlePdfOpening', () => {
    let originalWindowOpen;
    beforeEach(async () => {
      jest.useFakeTimers();

      originalWindowOpen = global.window['open'];
      delete window.open;
      window.open = jest.fn();
    });

    describe('Når pdf er støttet (android, firefox og i nettleseren returnerer true) ', () => {
      it('Så kaller den window.open', async () => {
        const originalNavigatorMimeTypes = global.navigator['mimeTypes'];
        global.navigator.mimeTypes = { 'application/pdf': true };

        // Issue with jest spyOn - kan ikke sjekke at isAndroid og isFirefox er called, returnerer stadig false pga async
        const urlString = 'lorem/ipsum';
        await hasPdfFunctions.handlePdfOpening(urlString).then((incompatible: boolean) => {
          expect(incompatible).toBeFalsy();
        });

        jest.runAllTimers();
        expect(window.open).toHaveBeenCalled();
        global.navigator['mimeTypes'] = originalNavigatorMimeTypes;
      });
    });
    describe('Når plattform er iOS', () => {
      it('Så kaller den window.open', async () => {
        const originalNavigatorMimeTypes = global.navigator['mimeTypes'];
        global.navigator.mimeTypes = {};

        const originalPlatform = window.navigator.platform;

        Object.defineProperty(window.navigator, 'platform', {
          value: 'iPhone',
          writable: true,
        });

        // Issue with jest spyOn - kan ikke sjekke at isAndroid og isFirefox er called, returnerer stadig false pga async
        const urlString = 'lorem/ipsum';
        await hasPdfFunctions.handlePdfOpening(urlString).then((incompatible: boolean) => {
          expect(incompatible).toBeFalsy();
        });

        jest.runAllTimers();

        expect(window.open).toHaveBeenCalled();
        global.navigator['mimeTypes'] = originalNavigatorMimeTypes;
        window['open'] = originalWindowOpen;
        global.navigator['platform'] = originalPlatform;
      });
    });

    afterEach(async () => {
      window['open'] = originalWindowOpen;
    });
  });
});
