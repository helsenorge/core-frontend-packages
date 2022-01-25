import * as webcompEvents from '../events';

describe('Gitt at web component events skal kalles', () => {
  describe('Når getEventTarget kalles på en event med path', () => {
    it('Så returnerer den event.path', () => {
      const eventWithPath = ({
        path: ['/eventpath'],
      } as unknown) as Event;
      const result = webcompEvents.getEventTarget(eventWithPath);

      expect(result).toBe('/eventpath');
    });
  });

  describe('Når getEventTarget kalles på en event uten path', () => {
    it('Så kaller den composedPath', () => {
      const composedPathMock = jest.fn().mockImplementation(() => ['/eventcomposedpath']);
      const eventWithoutPath = ({
        composedPath: composedPathMock,
      } as unknown) as Event;
      const result = webcompEvents.getEventTarget(eventWithoutPath);

      expect(composedPathMock).toHaveBeenCalled();
      expect(result).toBe('/eventcomposedpath');
    });
  });
});
