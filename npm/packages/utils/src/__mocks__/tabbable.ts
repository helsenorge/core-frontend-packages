// __mocks__/tabbable.js

import { TabbableOptions, CheckOptions } from 'tabbable';

const lib = jest.requireActual('tabbable');

const tabbable = {
  ...lib,
  tabbable: (node: HTMLElement, options: TabbableOptions & CheckOptions) => lib.tabbable(node, { ...options, displayCheck: 'none' }),
  focusable: (node: HTMLElement, options: TabbableOptions & CheckOptions) => lib.focusable(node, { ...options, displayCheck: 'none' }),
  isFocusable: (node: HTMLElement, options: CheckOptions) => lib.isFocusable(node, { ...options, displayCheck: 'none' }),
  isTabbable: (node: HTMLElement, options: CheckOptions) => lib.isTabbable(node, { ...options, displayCheck: 'none' }),
};

module.exports = tabbable;
