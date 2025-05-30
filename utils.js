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

function parseHeaders(headerString) {
  if (headerString == null || headerString.trim() === "") {
    return {};
  }

  const headers = {};
  const lines = headerString.split('\n');

  for (const line of lines) {
    const colonIndex = line.indexOf(':');

    if (colonIndex === -1) {
      // Ignore lines without a colon
      continue;
    }

    const key = line.substring(0, colonIndex).trim().toLowerCase();
    const value = line.substring(colonIndex + 1).trim();

    if (key === "") {
        // Ignore lines with empty key
        continue;
    }

    if (headers[key]) {
      headers[key].push(value);
    } else {
      headers[key] = [value];
    }
  }

  return headers;
}

module.exports = {
  parseQueryString,
  parseHeaders
};
