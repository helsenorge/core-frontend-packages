import { vi } from 'vitest';
import '@testing-library/jest-dom';
import 'whatwg-fetch';

declare global {
  interface Window {
    HN: Record<string, unknown>;
  }
}

window.HN = {
  Page: {},
  Rest: {},
  User: {},
  Commands: {},
  PortalCommands: {},
};

const mockWindowMatchMedia = vi.fn().mockImplementation(() => ({
  matches: true,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
}));

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: mockWindowMatchMedia,
});

class IntersectionObserver {
  observe(): void {
    // do nothing
  }
  unobserve(): void {
    // do nothing
  }
  disconnect(): void {
    // do nothing
  }
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: IntersectionObserver,
});

class ResizeObserver {
  observe() {
    // do nothing
  }
  unobserve() {
    // do nothing
  }
  disconnect() {
    // do nothing
  }
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: ResizeObserver,
});

class MutationObserver {
  observe(): void {
    // do nothing
  }
  disconnect(): void {
    // do nothing
  }
}

Object.defineProperty(window, 'MutationObserver', {
  writable: true,
  value: MutationObserver,
});
