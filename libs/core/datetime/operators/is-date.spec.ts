import { isDate } from './is-date';

describe('isDate', () => {
  it('returns true if the given value is a date object', () => {
    expect(isDate(new Date())).toBeTruthy();
  });

  it('returns true if the given value is an Invalid Date', () => {
    expect(isDate(new Date(NaN))).toBeFalsy();
  });

  it('returns false if the given value is not a date object', () => {
    [new Date().getTime(), new Date().toISOString(), {}, null, 0].forEach(actual => {
      expect(isDate(actual)).toBeFalsy();
    });
  });

  it('throws TypeError exception if passed less than 1 argument', () => {
    expect(isDate.bind(null)).toThrow(TypeError);
  });
});
