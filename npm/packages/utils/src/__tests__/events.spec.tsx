import { vi } from 'vitest';

import * as events from '../events';

describe('Gitt at getEventTarget skal kalles', () => {
  describe('Når getEventTarget kalles på en event uten path', () => {
    it('Så kaller den composedPath', () => {
      const composedPathMock = vi.fn().mockImplementation(() => ['/eventcomposedpath']);
      const eventWithoutPath = {
        composedPath: composedPathMock,
      } as unknown as Event;
      const result = events.getEventTarget(eventWithoutPath);

      expect(composedPathMock).toHaveBeenCalled();
      expect(result).toBe('/eventcomposedpath');
    });
  });
});
