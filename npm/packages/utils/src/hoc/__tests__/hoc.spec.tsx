import React from 'react';

import { render, screen } from '@testing-library/react';

import layoutChange, { OriginalProps } from '../layout-change';
import mountHOC from '../mount';
import RenderToBody from '../render-to-body';

describe('HOC utils', () => {
  describe('Gitt at en komponent wrappes i mount HOC', () => {
    describe('Når den instansieres', () => {
      it('Så mounter den komponenten og kaller mount prop', () => {
        const MountExample = mountHOC(() => <div>{'test'}</div>);
        const mountMock = jest.fn();

        render(<MountExample mount={mountMock} />);

        const text = screen.getByText('test');
        expect(text).toBeVisible();

        expect(mountMock).toHaveBeenCalled();
      });
    });
  });

  describe('Gitt at en komponent wrappes i layout-change HOC', () => {
    describe('Når den instansieres', () => {
      it('Så instansierer den LayoutChangeComponent fra layout-change function og får default state', () => {
        const LayoutExample = layoutChange(({ nullToXs, xsToSm, smToMd, mdToLg, lgToXl }: OriginalProps) => {
          return (
            <>
              <div>{`nullToXs: ${nullToXs?.toString()}`}</div>
              <div>{`xsToSm: ${xsToSm?.toString()}`}</div>
              <div>{`smToMd: ${smToMd?.toString()}`}</div>
              <div>{`mdToLg: ${mdToLg?.toString()}`}</div>
              <div>{`lgToXl: ${lgToXl?.toString()}`}</div>
            </>
          );
        });

        render(<LayoutExample />);

        const nullToXs = screen.getByText('nullToXs: true');
        expect(nullToXs).toBeVisible();
        const xsToSm = screen.getByText('xsToSm: true');
        expect(xsToSm).toBeVisible();
        const smToMd = screen.getByText('smToMd: true');
        expect(smToMd).toBeVisible();
        const mdToLg = screen.getByText('mdToLg: true');
        expect(mdToLg).toBeVisible();
        const lgToXl = screen.getByText('lgToXl: true');
        expect(lgToXl).toBeVisible();
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
