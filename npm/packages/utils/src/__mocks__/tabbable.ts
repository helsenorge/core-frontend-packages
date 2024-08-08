import {
  TabbableOptions,
  CheckOptions,
  tabbable as originalTabbable,
  focusable as originalFocusable,
  isFocusable as originalIsFocusable,
  isTabbable as originalIsTabbable,
} from 'tabbable';
import { vi } from 'vitest';

// Import the actual module with proper typing
const importActualTabbable = async (): Promise<typeof import('tabbable')> => {
  const actual = await vi.importActual<typeof import('tabbable')>('tabbable');
  return actual;
};

// Create the mock with proper typing
/* eslint-disable @typescript-eslint/explicit-function-return-type */
const createMockTabbable = async () => {
  const lib = await importActualTabbable();

  return {
    ...lib,
    tabbable: (node: HTMLElement, options: TabbableOptions & CheckOptions) => originalTabbable(node, { ...options, displayCheck: 'none' }),
    focusable: (node: HTMLElement, options: TabbableOptions & CheckOptions) =>
      originalFocusable(node, { ...options, displayCheck: 'none' }),
    isFocusable: (node: HTMLElement, options: CheckOptions) => originalIsFocusable(node, { ...options, displayCheck: 'none' }),
    isTabbable: (node: HTMLElement, options: CheckOptions) => originalIsTabbable(node, { ...options, displayCheck: 'none' }),
  };
};
/* eslint-enable @typescript-eslint/explicit-function-return-type */

// Export the mock
const mockTabbablePromise = createMockTabbable();
export default mockTabbablePromise;
