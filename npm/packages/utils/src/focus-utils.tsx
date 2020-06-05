// This is a util to find document.activeElement (element in focus), whereas it is in the document-dom or in the shadow-dom
export const getDocumentActiveElement = (element: HTMLElement | string): Element | null => {
  const domNode: TabbableElement =
    typeof element === 'string' ? (document.querySelector(element) as TabbableElement) : (element as TabbableElement);
  const root = domNode.getRootNode() as HTMLDocument;
  return root.activeElement;
};
