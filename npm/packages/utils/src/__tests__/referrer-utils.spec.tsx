import { vi } from 'vitest';

import { isReferrer } from '../referrer-utils';

describe('referrer-utils', () => {
  const oldWindowLocation = global.window.location;

  const setObject = (param: string) => {
    delete global.window.location;
    global.window.location = Object.defineProperties(
      {},
      {
        ...Object.getOwnPropertyDescriptors(oldWindowLocation),
        assign: {
          configurable: true,
          value: vi.fn(),
        },
        search: {
          configurable: true,
          value: param,
        },
      }
    );
  };
  afterAll(() => {
    global.window.location = oldWindowLocation;
    vi.clearAllMocks();
  });
  describe('Gitt at det er referrer i urlen', () => {
    describe('Når referrer er lik som etterspurt referrer', () => {
      it('Så returneres true', () => {
        setObject('?referrer=oidc');
        const isGivenReferrer = isReferrer('oidc');
        expect(isGivenReferrer).toEqual(true);
      });
    });
    describe('Når referrer er ulik som etterspurt referrer', () => {
      it('Så returneres false', () => {
        setObject('?referrer=helsenorge');
        const isGivenReferrer = isReferrer('oidc');
        expect(isGivenReferrer).toEqual(false);
      });
    });
  });
  describe('Gitt at det ikke er referrer i urlen', () => {
    describe('Når referrer etterspørres', () => {
      it('Så returneres false', () => {
        setObject('');
        const isGivenReferrer = isReferrer('oidc');
        expect(isGivenReferrer).toEqual(false);
      });
    });
  });
});
