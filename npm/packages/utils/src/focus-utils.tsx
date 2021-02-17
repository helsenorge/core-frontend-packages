import { warn } from './logger';

/**
 * Returnerer document.activeElement (element in focus), uavhengig av om den er i document-dom rllrt shadow-dom
 * @param element HtmlElement som den skal søke i
 */
export const getDocumentActiveElement = (element: HTMLElement | string): Element | null => {
  try {
    const domNode: TabbableElement =
      typeof element === 'string' ? (document.querySelector(element) as TabbableElement) : (element as TabbableElement);
    const root = domNode.getRootNode() as HTMLDocument;
    return root.activeElement;
  } catch (e) {
    warn('Feil ved å ta tak i active element basert på angitt node: ', element, e);
    return null;
  }
};
