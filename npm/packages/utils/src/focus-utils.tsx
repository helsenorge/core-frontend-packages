import { log } from './logger';

/**
 * Returnerer document.activeElement (element in focus), uavhengig av om den er i document-dom rllrt shadow-dom
 * @param element HtmlElement som den skal søke i
 * @param logCallback Funksjon som om det oppstår en feil. Brukes for å logge til server.
 */
export const getDocumentActiveElement = (
  element: HTMLElement | string,
  logCallback?: (message?: string, ...optionalParams: unknown[]) => void
): Element | null => {
  try {
    const domNode: TabbableElement =
      typeof element === 'string' ? (document.querySelector(element) as TabbableElement) : (element as TabbableElement);
    const root = domNode.getRootNode() as HTMLDocument;
    return root.activeElement;
  } catch (e) {
    const logger = logCallback || log;

    logger('Feil ved å ta tak i active element basert på angitt node: ', element, e);
    return null;
  }
};
