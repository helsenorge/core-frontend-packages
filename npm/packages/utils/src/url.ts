/**
 * Hent hostname fra en URL
 * @param url En gyldig URL, f.eks. https://www.helsenorge.no/sykdom/
 * @returns hostname, f.eks. www.helsenorge.no
 */
export const getUrlHostname = (url: string): string | undefined => {
  try {
    const urlObject = new URL(url);

    return urlObject.hostname;
  } catch {
    return;
  }
};

/**
 * Sjekk om URL bruker https eller ikke
 * @returns true dersom protokollen er https
 */
export const isHttps = (): boolean => window.location.protocol === 'https:';
