import * as events from '../events';

describe('Gitt at getEventTarget skal kalles', () => {
  describe('Når getEventTarget kalles på en event med path', () => {
    it('Så returnerer den event.path', () => {
      const eventWithPath = ({
        path: ['/eventpath'],
      } as unknown) as Event;
      const result = events.getEventTarget(eventWithPath);

      expect(result).toBe('/eventpath');
    });
  });

  describe('Når getEventTarget kalles på en event uten path', () => {
    it('Så kaller den composedPath', () => {
      const composedPathMock = jest.fn().mockImplementation(() => ['/eventcomposedpath']);
      const eventWithoutPath = ({
        composedPath: composedPathMock,
      } as unknown) as Event;
      const result = events.getEventTarget(eventWithoutPath);

      expect(composedPathMock).toHaveBeenCalled();
      expect(result).toBe('/eventcomposedpath');
    });
  });
});
