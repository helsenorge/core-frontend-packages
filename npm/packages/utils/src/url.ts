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

/**
 * Sørger for at en path alltid starter med / og aldri slutter på /
 * @param path Path som skal normaliseres (uten query string eller domene)
 * @returns Normalisert path
 */
export const normalizePath = (path: string): string => {
  // Path skal alltid starte med /
  if (!path.startsWith('/')) {
    path = '/' + path;
  }
  // Path skal ikke slutte med /, med mindre det er rotsiden
  if (path.endsWith('/') && path !== '/') {
    path = path.slice(0, -1);
  }

  return path;
};

/**
 * Sørger for at en query string starter med ?, og ikke slutter med &
 * @param query Query string som skal normaliseres (uten path eller domene)
 * @returns Normalisert query
 */
export const normalizeQuery = (query: string): string => {
  // Query skal starte med ?, og skal ikke slutte med &
  if (query && !query.startsWith('?')) {
    query = '?' + query;
  }
  if (query && query.endsWith('&')) {
    query = query.slice(0, -1);
  }

  return query;
};
