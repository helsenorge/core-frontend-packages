import { vi } from 'vitest';

import { isMobileUA, handleIOSSafariUA } from '../user-agents-utils';

describe('User-agents-utils', () => {
  const originalUserAgent = global.navigator.userAgent;
  beforeAll(() => {
    Object.defineProperty(
      window.navigator,
      'userAgent',
      (value => ({
        get() {
          return value;
        },
        set(v) {
          value = v;
        },
      }))(window.navigator['userAgent'])
    );
  });

  afterAll(() => {
    vi.clearAllMocks();
  });

  describe('Gitt at window.navigator er uendret', () => {
    describe('Når isMobileUA kalles', () => {
      it('Så returnerer den false', () => {
        const mobile = isMobileUA();
        expect(mobile).toBeFalsy();
      });
    });

    describe('Når handleIOSSafariUA kalles', () => {
      it('Så er body uendret', () => {
        handleIOSSafariUA();
        expect(document.body.classList.contains('ios-safari')).toBeFalsy();
      });
    });
  });

  describe('Gitt at window.navigator er satt til android', () => {
    describe('Når isMobileUA kalles', () => {
      it('Så returnerer den true', () => {
        global.navigator.userAgent =
          'Mozilla/5.0 (Linux; Android 5.1.1; SM-N750K Build/LMY47X; ko-kr) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Mobile Safari/537.36 Puffin/6.0.8.15804AP';

        const mobile = isMobileUA();
        expect(mobile).toBeTruthy();
        global.navigator.userAgent = originalUserAgent;
      });
    });
  });

  describe('Gitt at window.navigator er satt til safari', () => {
    describe('Når handleIOSSafariUA kalles', () => {
      it('Så ...', () => {
        global.navigator.userAgent =
          'Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1 Mobile/15E148 Safari/604.1';

        handleIOSSafariUA();

        expect(document.body.classList.contains('ios-safari')).toBeTruthy();
        global.navigator.userAgent = originalUserAgent;
      });
    });
  });
});
