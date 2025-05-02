const queryStringToPairList = (queryString: string): Array<{ key: string; value: string }> => {
  const pairList = new Array<{ key: string; value: string }>();
  queryString.split('&').forEach(e => {
    if (e === undefined || e === null || e.length < 1) {
      return;
    }

    const pair = e.split('=');
    pairList.push({ key: pair[0], value: pair[1] });
  });
  return pairList;
};

const pairListToQueryString = (pairList: Array<{ key: string; value: string }>): string => {
  return pairList.map(e => [e.key, e.value].join('=')).join('&');
};

/**
 * Returnerer URLSearchParams basert på window.location.search
 */
export const getSearchParams = (): URLSearchParams => {
  return new URLSearchParams(window.location.search);
};

/**
 * Returnerer en objekt med alle URL params basert på window.location.search
 */
export const getQueryStrings = (): {} => {
  return Object.fromEntries(getSearchParams());
};

/**
 * Legger til parameter i document.location.search
 * @param key - key til parametren
 * @param value - value til parametren
 */
export const insertParam = (key: string, value: string): void => {
  if (!document.location) {
    return;
  }

  key = encodeURI(key);
  value = encodeURI(value);

  const pairList = queryStringToPairList(document.location.search.substr(1));
  const match = pairList.filter(pair => pair.key === key);
  if (match && match.length > 0) {
    match[0].value = value;
  } else {
    pairList.push({ key, value });
  }
  document.location.search = pairListToQueryString(pairList);
};

/**
 * Fjerner parameter i document.location.search
 * @param key - key til parametren
 */
export const removeParam = (key: string): void => {
  if (!document.location) {
    return;
  }
  key = encodeURI(key);
  const pairList = queryStringToPairList(document.location.search.substr(1));
  const newPairList = pairList.filter(pair => pair.key !== key);

  const x = pairListToQueryString(newPairList);
  document.location.search = x;
};
