import { debounce } from '../debounce';

jest.useFakeTimers();

describe('Debounce', () => {
  let func: jest.Mock;
  let debouncedFunc: Function;

  beforeEach(() => {
    func = jest.fn();
    debouncedFunc = debounce(func, 1000);
  });

  describe('Gitt at debounce function brukes', () => {
    describe('Når en function brukes mange ganger i en loop', () => {
      it('Så kalles den kun én gang', () => {
        for (let i = 0; i < 100; i++) {
          debouncedFunc();
        }

        jest.runAllTimers();
        expect(func).toBeCalledTimes(1);
      });
    });
  });
});
