const { parseQueryString } = require('./utils');

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
