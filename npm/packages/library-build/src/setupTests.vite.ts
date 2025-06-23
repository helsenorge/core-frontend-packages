import { vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

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

const MatchMediaMock = vi.fn(() => ({
  matches: true,
  addListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
}));

vi.stubGlobal('matchMedia', MatchMediaMock);

const IntersectionObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

vi.stubGlobal('ResizeObserver', ResizeObserverMock);

const MutationObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  disconnect: vi.fn(),
}));

vi.stubGlobal('MutationObserver', MutationObserverMock);

window.HTMLElement.prototype.scrollIntoView = vi.fn();
