import { describe, expect, it, vi } from 'vitest';

import { isMobileUA } from '../user-agents-utils';

describe('User-agents-utils', () => {
  afterAll(() => {
    vi.unstubAllGlobals();
  });
  describe('Gitt at window.navigator er uendret', () => {
    describe('Når isMobileUA kalles', () => {
      it('Så returnerer den false', () => {
        const mobile = isMobileUA();
        expect(mobile).toBeFalsy();
      });
    });
  });

  describe('Gitt at window.navigator er satt til android', () => {
    describe('Når isMobileUA kalles', () => {
      it('Så returnerer den true', () => {
        vi.stubGlobal('navigator', {
          userAgent:
            'Mozilla/5.0 (Linux; Android 5.1.1; SM-N750K Build/LMY47X; ko-kr) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Mobile Safari/537.36 Puffin/6.0.8.15804AP',
        });

        const mobile = isMobileUA();
        expect(mobile).toBeTruthy();
      });
    });
  });
});
