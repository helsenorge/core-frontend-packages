const allowConsoleOutput = (): boolean => !['production', 'test'].includes(process.env.NODE_ENV ?? '');

const log = (message?: string, ...optionalParams: unknown[]): void => {
  if (!allowConsoleOutput()) return;
  // eslint-disable-next-line no-console
  console.log(message, optionalParams);
};

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
    const domNode = typeof element === 'string' ? document.querySelector(element) : element;
    const root = domNode?.getRootNode() as Document;
    return root?.activeElement;
  } catch (e) {
    const logger = logCallback ?? log;

    logger('Feil ved å ta tak i active element basert på angitt node: ', element, e);

    return null;
  }
};
