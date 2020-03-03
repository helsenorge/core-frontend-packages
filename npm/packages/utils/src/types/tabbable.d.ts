interface TabbableElement extends HTMLInputElement {
  setAttribute: (tabIndex: string, num: string) => void;
  removeAttribute: (attribute: string) => void;
}

declare module 'tabbable' {
  const tabbable: (container: Object) => Array<TabbableElement>;
  export = tabbable;
}
