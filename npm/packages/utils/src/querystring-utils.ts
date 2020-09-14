const queryStringToPairList = (queryString: string): Array<{ key: string; value: string }> => {
  console.log('queryStringToPairList', queryString);
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

export const getQueryStrings = (): {} => {
  let match: RegExpExecArray | null;
  const pl = /\+/g; // Regex for replacing addition symbol with a space
  const search = /([^&=]+)=?([^&]*)/g;
  function decodeFunction(s: string): string {
    return decodeURIComponent(s.replace(pl, ' '));
  }
  const query: string = window.location.search.substring(1);
  const urlParams = {};
  match = search.exec(query);
  while (match) {
    urlParams[decodeFunction(match[1])] = decodeFunction(match[2]);
    match = search.exec(query);
  }
  return urlParams;
};

export const insertParam = (key: string, value: string): void => {
  console.log('>>>>> insertParam', document.location.search);
  if (!document.location) {
    console.log('RETURN');
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
