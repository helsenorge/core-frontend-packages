import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import mountHOC from '../mount';
import RenderToBody from '../render-to-body';

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

  describe('Gitt at en komponent wrappes i render-to-body HOC', () => {
    describe('Når printable er false', () => {
      it('Så rendres det en portal', () => {
        render(
          <RenderToBody>
            <section>{'My first section rendered to document'}</section>
          </RenderToBody>
        );

        expect(document.body).toMatchSnapshot();
      });
    });

    describe('Når printable er true', () => {
      it('Så rendres det en portal med body tag', () => {
        render(
          <RenderToBody printable>
            <section>{'My second section rendered to body (printable)'}</section>
          </RenderToBody>
        );

        expect(document.body).toMatchSnapshot();
      });
    });
  });
});
