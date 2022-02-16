interface TabbableElement extends HTMLInputElement {
  setAttribute: (tabIndex: string, num: string) => void;
  removeAttribute: (attribute: string) => void;
}

declare module 'tabbable' {
  export const tabbable: (container: Object) => Array<TabbableElement>;
}
