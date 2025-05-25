function parseQueryString(queryString) {
  if (queryString == null || queryString.trim() === "") {
    return {};
  }

  const params = {};
  const pairs = queryString.split('&');

  for (const pair of pairs) {
    let [key, value] = pair.split('=');

    key = decodeURIComponent(key);
    
    if (value === undefined) {
      value = ""; // Handle cases like "key" or "key="
    } else {
      value = decodeURIComponent(value);
    }
    
    params[key] = value;
  }

  return params;
}
