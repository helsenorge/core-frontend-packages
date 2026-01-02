import { base64ToBlob, downloadFileInBrowser } from '../blob';

vi.stubGlobal('URL', {
  createObjectURL: vi.fn().mockReturnValue('blob:http://localhost/fake-blob-url'),
  revokeObjectURL: vi.fn(),
});

describe('Gitt at base64ToBlob kalles', () => {
  describe('Når input er base64-encoded tekst', () => {
    it('Så returnerer den en blob med riktig MIME-type', async () => {
      const result = base64ToBlob('SGVsbG8gV29ybGQ=', 'application/pdf');

      expect(result).toBeInstanceOf(Blob);
      expect(result.type).toBe('application/pdf');
    });
  });
});

describe('Gitt at downloadFileInBrowser kalles', () => {
  describe('Når input er en Blob', () => {
    it('Så lages det en link og klikkes på den', async () => {
      const originalClick = HTMLAnchorElement.prototype.click;
      const clickMock = vi.fn();
      HTMLAnchorElement.prototype.click = clickMock;

      downloadFileInBrowser(await base64ToBlob('SGVsbG8gV29ybGQ=', 'application/pdf'), 'test.pdf');

      expect(clickMock).toHaveBeenCalled();

      HTMLAnchorElement.prototype.click = originalClick;
    });
  });

  describe('Når input er en ArrayBuffer', () => {
    it('Så lages det en link og klikkes på den', async () => {
      const originalClick = HTMLAnchorElement.prototype.click;
      const clickMock = vi.fn();
      HTMLAnchorElement.prototype.click = clickMock;

      const buffer = new TextEncoder().encode('Hello World').buffer;

      downloadFileInBrowser(buffer, 'test.pdf', 'application/pdf');

      expect(clickMock).toHaveBeenCalled();

      HTMLAnchorElement.prototype.click = originalClick;
    });

    describe('Når MIME-type mangler', () => {
      it('Så kastes det en Error', async () => {
        const originalClick = HTMLAnchorElement.prototype.click;
        const clickMock = vi.fn();
        HTMLAnchorElement.prototype.click = clickMock;

        const buffer = new TextEncoder().encode('Hello World').buffer;

        try {
          downloadFileInBrowser(buffer, 'test.pdf');
        } catch (e) {
          expect(e).toBeInstanceOf(Error);
          expect((e as Error).message).toBe('MIME-type må oppgis når filen er en ArrayBuffer');
        }

        expect(clickMock).not.toHaveBeenCalled();

        HTMLAnchorElement.prototype.click = originalClick;
      });
    });
  });
});
