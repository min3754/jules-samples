const { parseQueryString, parseHeaders } = require('./utils');

describe('parseQueryString', () => {
  it('should return an empty object for an empty string', () => {
    expect(parseQueryString("")).toEqual({});
  });

  it('should return an empty object for null input', () => {
    expect(parseQueryString(null)).toEqual({});
  });

  it('should return an empty object for undefined input', () => {
    expect(parseQueryString(undefined)).toEqual({});
  });

  it('should parse a single key-value pair', () => {
    expect(parseQueryString("name=John")).toEqual({ name: "John" });
  });

  it('should parse multiple key-value pairs', () => {
    expect(parseQueryString("name=John&age=30")).toEqual({ name: "John", age: "30" });
  });

  it('should decode URL-encoded keys and values', () => {
    expect(parseQueryString("name=John%20Doe&city=New%20York")).toEqual({ name: "John Doe", city: "New York" });
  });

  it('should decode URL-encoded special characters', () => {
    expect(parseQueryString("email=test%40example.com")).toEqual({ email: "test@example.com" });
  });

  it('should handle parameters without values', () => {
    expect(parseQueryString("isValid&value=123")).toEqual({ isValid: "", value: "123" });
  });

  it('should handle parameters with empty values (key=)', () => {
    expect(parseQueryString("key=")).toEqual({ key: "" });
  });

  it('should handle parameters with empty values and other parameters', () => {
    expect(parseQueryString("key=&anotherKey=value")).toEqual({ key: "", anotherKey: "value" });
  });

  it('should handle duplicate keys (last one wins)', () => {
    expect(parseQueryString("name=John&name=Jane")).toEqual({ name: "Jane" });
  });

  it('should handle duplicate keys with other parameters (last one wins)', () => {
    expect(parseQueryString("name=John&age=30&name=Mike")).toEqual({ name: "Mike", age: "30" });
  });

  it('should handle mixed scenarios with duplicates and encoding', () => {
    expect(parseQueryString("a=1&b=2&c=3&a=4&b=5%26b")).toEqual({ a: "4", b: "5&b", c: "3" });
  });

  it('should handle complex mixed scenarios', () => {
    expect(parseQueryString("greeting=Hello%20World%21&emptyVal=&encodedKey%20Name=encodedValue")).toEqual({ "greeting": "Hello World!", "emptyVal": "", "encodedKey Name": "encodedValue" });
  });
});

describe('parseHeaders', () => {
  it('should return an empty object for an empty string', () => {
    expect(parseHeaders("")).toEqual({});
  });

  it('should return an empty object for null input', () => {
    expect(parseHeaders(null)).toEqual({});
  });

  it('should return an empty object for undefined input', () => {
    expect(parseHeaders(undefined)).toEqual({});
  });

  it('should parse a single header', () => {
    expect(parseHeaders("Content-Type: application/json")).toEqual({ "content-type": ["application/json"] });
  });

  it('should parse multiple headers', () => {
    expect(parseHeaders("Content-Type: application/json\nUser-Agent: MyClient")).toEqual({
      "content-type": ["application/json"],
      "user-agent": ["MyClient"]
    });
  });

  it('should handle case-insensitivity of keys', () => {
    expect(parseHeaders("CoNtEnT-TyPe: application/json\nuser-agent: MyClient")).toEqual({
      "content-type": ["application/json"],
      "user-agent": ["MyClient"]
    });
  });

  it('should handle duplicate header keys', () => {
    expect(parseHeaders("Accept: text/html\nAccept: application/xml")).toEqual({
      "accept": ["text/html", "application/xml"]
    });
  });

  it('should handle duplicate header keys mixed with other headers', () => {
    expect(parseHeaders("Set-Cookie: id=1\nWarning: warn1\nSet-Cookie: pref=abc")).toEqual({
      "set-cookie": ["id=1", "pref=abc"],
      "warning": ["warn1"]
    });
  });

  it('should ignore malformed lines (no colon)', () => {
    expect(parseHeaders("Valid-Header: Value\nMalformedLine\nAnother-Valid: Value2")).toEqual({
      "valid-header": ["Value"],
      "another-valid": ["Value2"]
    });
  });

  it('should handle lines with a key but missing value (e.g., "MissingValue:")', () => {
    expect(parseHeaders("MissingValue:")).toEqual({ "missingvalue": [""] });
  });

  it('should ignore lines with no key before colon (e.g., ": NoKey")', () => {
    expect(parseHeaders(": NoKey")).toEqual({});
  });
  
  it('should ignore lines with no key and no value (e.g., ":")', () => {
    expect(parseHeaders(":")).toEqual({});
  });

  it('should handle headers with various values', () => {
    expect(parseHeaders("X-Custom-Header: Value with spaces\nContent-Length: 0")).toEqual({
      "x-custom-header": ["Value with spaces"],
      "content-length": ["0"]
    });
  });

  it('should parse a complex multi-line input', () => {
    const input = `Host: example.com
Referer: https://other.com
Accept-Encoding: gzip, deflate
Set-Cookie: SESSID=abcdef
Set-Cookie: lang=en-US
X-Forwarded-For: 10.0.0.1, 192.168.0.1`;
    const expected = {
      "host": ["example.com"],
      "referer": ["https://other.com"],
      "accept-encoding": ["gzip, deflate"],
      "set-cookie": ["SESSID=abcdef", "lang=en-US"],
      "x-forwarded-for": ["10.0.0.1, 192.168.0.1"]
    };
    expect(parseHeaders(input)).toEqual(expected);
  });
  
  it('should handle headers with leading/trailing whitespace around key/value', () => {
    expect(parseHeaders("  Key-With-Spaces  :  Value with spaces  \nAnother:Value")).toEqual({
      "key-with-spaces": ["Value with spaces"],
      "another": ["Value"]
    });
  });

  it('should handle empty lines between headers', () => {
    expect(parseHeaders("Header1: Value1\n\nHeader2: Value2")).toEqual({
        "header1": ["Value1"],
        "header2": ["Value2"]
    });
  });

  it('should handle a header string that ends with a newline', () => {
    expect(parseHeaders("Header1: Value1\n")).toEqual({ "header1": ["Value1"] });
  });
});
