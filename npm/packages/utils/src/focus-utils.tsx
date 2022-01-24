import { log } from './logger';

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
    log('Feil ved å ta tak i active element basert på angitt node: ', element, e); // TODO: forut for framework-utils brukte vi error() her som også logget til server
    return null;
  }
};
