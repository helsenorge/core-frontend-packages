import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import mountHOC from '../mount';

describe('HOC utils', () => {
  describe('Gitt at en komponent wrappes i mount HOC', () => {
    describe('Når den instansieres', () => {
      it('Så mounter den komponenten og kaller mount prop', () => {
        const MountExample = mountHOC(() => <div>{'test'}</div>);
        const mountMock = vi.fn();

        render(<MountExample mount={mountMock} />);

        const text = screen.getByText('test');
        expect(text).toBeVisible();

        expect(mountMock).toHaveBeenCalled();
      });
    });
  });
});
