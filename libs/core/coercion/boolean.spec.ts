import { toBoolean } from './boolean';

describe('toBoolean', () => {
  it('should coerce undefined to false', () => {
    expect(toBoolean(undefined)).toBe(false);
  });

  it('should coerce null to false', () => {
    expect(toBoolean(null)).toBe(false);
  });

  it('should coerce the empty string to true', () => {
    expect(toBoolean('')).toBe(true);
  });

  it('should coerce zero to true', () => {
    expect(toBoolean(0)).toBe(true);
  });

  it('should coerce the string "false" to false', () => {
    expect(toBoolean('false')).toBe(false);
  });

  it('should coerce the boolean false to false', () => {
    expect(toBoolean(false)).toBe(false);
  });

  it('should coerce the boolean true to true', () => {
    expect(toBoolean(true)).toBe(true);
  });

  it('should coerce the string "true" to true', () => {
    expect(toBoolean('true')).toBe(true);
  });

  it('should coerce an arbitrary string to true', () => {
    expect(toBoolean('pink')).toBe(true);
  });

  it('should coerce an object to true', () => {
    expect(toBoolean({})).toBe(true);
  });

  it('should coerce an array to true', () => {
    expect(toBoolean([])).toBe(true);
  });
});
