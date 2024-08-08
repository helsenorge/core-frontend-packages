import * as React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import clickOutside from '../click-outside';

const onClick = vi.fn();

const BasicClickOutsideComponent: React.FC = () => {
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  clickOutside(wrapperRef, onClick);

  return (
    <div>
      <div ref={wrapperRef}>
        <button>{'Innenfor'}</button>
      </div>
      <button>{'Utenfor'}</button>
    </div>
  );
};

describe('Click-outside', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Gitt at clickOutside brukes i en komponent', () => {
    describe('Når det klikkes utenfor komponenten', () => {
      it('Så kalles onClick-handler', async () => {
        render(<BasicClickOutsideComponent />);

        const button = screen.getByRole('button', { name: 'Utenfor' });

        await userEvent.click(button);

        expect(onClick).toHaveBeenCalledTimes(1);
      });
    });

    describe('Når det klikkes innenfor komponenten', () => {
      it('Så kalles ikke onClick-handler', async () => {
        render(<BasicClickOutsideComponent />);

        const button = screen.getByRole('button', { name: 'Innenfor' });

        await userEvent.click(button);

        expect(onClick).not.toHaveBeenCalled();
      });
    });
  });
});
