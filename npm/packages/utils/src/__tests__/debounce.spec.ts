import { vi } from 'vitest';

import { debounce } from '../debounce';

vi.useFakeTimers();

describe('Debounce', () => {
  const func = vi.fn();
  let debouncedFunc: Function;

  beforeEach(() => {
    debouncedFunc = debounce(func, 1000);
  });
  afterAll(() => {
    vi.clearAllMocks();
  });

  describe('Gitt at debounce function brukes', () => {
    describe('Når en function brukes mange ganger i en loop', () => {
      it('Så kalles den kun én gang', () => {
        for (let i = 0; i < 100; i++) {
          debouncedFunc();
        }

        vi.runAllTimers();
        expect(func).toHaveBeenCalledTimes(1);
      });
    });
  });
});
