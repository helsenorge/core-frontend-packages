import { merge } from '../object-utils';

describe('merge', () => {
  describe('Gitt at a og b er to forskjellige objekter', () => {
    describe('Når merge kalles', () => {
      it('Så returnerer den a og b slått sammen', () => {
        const merged = merge({ a: 'foo' }, { b: 'bar' });

        expect(merged).toEqual({
          a: 'foo',
          b: 'bar',
        });
      });
    });
  });
  describe('Gitt at a har en string-verdi i argument 1', () => {
    describe('Gitt at a er undefined i argument 2', () => {
      describe('Når merge kalles', () => {
        it('Så returnerer den a-stringen fra argument 1 ', () => {
          const merged = merge({ a: 'foo' }, { a: undefined, b: 'bar', c: 'bar' });

          expect(merged).toEqual({
            a: 'foo',
            b: 'bar',
            c: 'bar',
          });
        });
      });
    });
    describe('Gitt at a er null i argument 2', () => {
      describe('Når merge kalles', () => {
        it('Så returnerer den a-stringen fra argument 1 ', () => {
          const merged = merge({ a: 'foo' }, { a: null, b: 'bar', c: 'bar' });

          expect(merged).toEqual({
            a: 'foo',
            b: 'bar',
            c: 'bar',
          });
        });
      });
    });
    describe('Gitt at a ikke eksisterer i argument 2', () => {
      describe('Når merge kalles', () => {
        it('Så returnerer den a-stringen fra argument 1 ', () => {
          const merged = merge({ a: 'foo' }, { b: 'bar', c: 'bar' });

          expect(merged).toEqual({
            a: 'foo',
            b: 'bar',
            c: 'bar',
          });
        });
      });
    });
  });
  describe('Gitt at a har en objekt-verdi i argument 1', () => {
    describe('Gitt at a er undefined i argument 2', () => {
      describe('Når merge kalles', () => {
        it('Så returnerer den a-objektet fra argument 1 ', () => {
          const merged = merge({ a: { header: 'foo' } }, { a: undefined, b: 'bar', c: 'bar' });

          expect(merged).toEqual({
            a: { header: 'foo' },
            b: 'bar',
            c: 'bar',
          });
        });
      });
    });

    describe('Gitt at a er null i argument 2', () => {
      describe('Når merge kalles', () => {
        it('Så returnerer den a-objektet fra argument 1 ', () => {
          const merged = merge({ a: { header: 'foo' } }, { a: null, b: 'bar', c: 'bar' });

          expect(merged).toEqual({
            a: { header: 'foo' },
            b: 'bar',
            c: 'bar',
          });
        });
      });
    });

    describe('Gitt at a ikke eksisterer i argument 2', () => {
      describe('Når merge kalles', () => {
        it('Så returnerer den a-objektet fra argument 1 ', () => {
          const merged = merge({ a: { header: 'foo' } }, { b: 'bar', c: 'bar' });

          expect(merged).toEqual({
            a: { header: 'foo' },
            b: 'bar',
            c: 'bar',
          });
        });
      });
    });

    describe('Gitt at objektet a ikke eksisterer i argument 2', () => {
      describe('Når merge kalles', () => {
        it('Så returnerer den a-objektet fra argument 1 ', () => {
          const merged = merge({ a: { header: { title: 'foo' } } }, { b: 'bar', c: 'bar' });

          expect(merged).toEqual({
            a: { header: { title: 'foo' } },
            b: 'bar',
            c: 'bar',
          });
        });
      });
    });
  });
  describe('Gitt at a har en objekt-verdi i argument 1 med flere underverdier', () => {
    describe('Gitt at a har en objekt-verdi i argument 2 med flere underverdier', () => {
      describe('Når merge kalles', () => {
        it('Så returnerer den a-objektet fra argument 1 ', () => {
          const merged = merge({ a: { header: 'foo' } }, { a: { header: undefined, footer: 'bar' }, b: 'bar', c: 'bar' });

          expect(merged).toEqual({
            a: { header: 'foo', footer: 'bar' },
            b: 'bar',
            c: 'bar',
          });
        });
      });
    });
  });
});
