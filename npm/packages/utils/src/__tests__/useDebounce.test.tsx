import { ChangeEvent, ReactElement, useState } from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useDebounce } from '../useDebounce';

describe('Gitt at useDebounce brukes', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });
  describe('Når bruker skriver i søkefeltet', () => {
    it('Så kalles callbacken ikke mer enn én gang', () => {
      const wait = 180;
      const debouncedHandler = vi.fn();

      const TestComponent = (): ReactElement => {
        const [value, setValue] = useState('');
        const debouncedChange = useDebounce(debouncedHandler, wait);

        const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
          const nextValue = event.target.value;
          setValue(nextValue);
          debouncedChange(nextValue);
        };

        return (
          <label>
            {'Search'}
            <input aria-label="search" value={value} onChange={handleChange} />
          </label>
        );
      };

      render(<TestComponent />);

      const input = screen.getByLabelText('search') as HTMLInputElement;

      fireEvent.change(input, { target: { value: 'h' } });
      fireEvent.change(input, { target: { value: 'he' } });
      fireEvent.change(input, { target: { value: 'hei' } });

      expect(debouncedHandler).not.toHaveBeenCalled();

      vi.advanceTimersByTime(wait - 5);
      expect(debouncedHandler).not.toHaveBeenCalled();

      vi.advanceTimersByTime(5);
      expect(debouncedHandler).toHaveBeenCalledTimes(1);
      expect(debouncedHandler).toHaveBeenCalledWith('hei');
    });
  });
});
