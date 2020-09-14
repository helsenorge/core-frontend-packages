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
    describe('Når pdf er støttet (android, firefox og i nettleseren returnerer true) ', () => {
      it('Så kaller den window.open', async () => {
        jest.useFakeTimers();
        const originalNavigatorMimeTypes = global.navigator['mimeTypes'];
        global.navigator.mimeTypes = { 'application/pdf': true };

        const originalWindowOpen = global.window['open'];
        delete window.open;
        window.open = jest.fn();

        // Issue with jest spyOn - kan ikke sjekke at isAndroid og isFirefox er called, returnerer stadig false pga async
        const urlString = 'lorem/ipsum';
        await hasPdfFunctions.handlePdfOpening(urlString).then((incompatible: boolean) => {
          expect(incompatible).toBeFalsy();
        });

        jest.runAllTimers();
        const flushPromises = () => new Promise(setImmediate);
        await flushPromises();
        expect(window.open).toHaveBeenCalled();
        global.navigator['mimeTypes'] = originalNavigatorMimeTypes;
        window['open'] = originalWindowOpen;
      });
    });
  });
});
