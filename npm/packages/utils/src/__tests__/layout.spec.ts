import { vi } from 'vitest';

import layout from '../layout';

const originalMatchMedia = window.matchMedia;
const mockMatchMedia = vi.fn();

describe('gitt at skjermbredden skal sjekkes', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      // jsdom støtter ikke window.matchMedia, så det beste
      // vi kan gjøre er å sjekke om utilsene kaller matchMedia
      // som forventet
      value: mockMatchMedia.mockImplementation(() => ({
        matches: false,
      })),
    });
  });
  beforeEach(() => {
    vi.clearAllMocks();
  });
  describe('når isNullToXs kalles', () => {
    it('så sjekkes skjermstørrelsen med max-width: 360px', () => {
      layout.isNullToXs();

      expect(mockMatchMedia).toBeCalledWith('screen and (max-width: 360px)');
    });
  });
  describe('når isXsToSm kalles', () => {
    it('så sjekkes skjermstørrelsen med max-width: 564px', () => {
      layout.isXsToSm();

      expect(mockMatchMedia).toBeCalledWith('screen and (max-width: 564px)');
    });
  });
  describe('når isSmToMd kalles', () => {
    it('så sjekkes skjermstørrelsen med max-width: 768px', () => {
      layout.isSmToMd();

      expect(mockMatchMedia).toBeCalledWith('screen and (max-width: 768px)');
    });
  });
  describe('når isMdToLg kalles', () => {
    it('så sjekkes skjermstørrelsen med max-width: 1088px', () => {
      layout.isMdToLg();

      expect(mockMatchMedia).toBeCalledWith('screen and (max-width: 1088px)');
    });
  });
  describe('når isLgToXl kalles', () => {
    it('så sjekkes skjermstørrelsen med max-width: 1450px', () => {
      layout.isLgToXl();

      expect(mockMatchMedia).toBeCalledWith('screen and (max-width: 1450px)');
    });
  });
  afterAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: originalMatchMedia,
    });
  });
});
