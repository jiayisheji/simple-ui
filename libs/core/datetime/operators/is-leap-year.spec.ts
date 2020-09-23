import { isDate } from './is-date';
import { isLeapYear } from './is-leap-year';

describe('isLeapYear', () => {
  it('returns true if the given date is in the leap year', () => {
    expect(isLeapYear(new Date(2012, 6, 2))).toBeTruthy();
  });

  it('returns false if the given date is not in the leap year', () => {
    expect(isLeapYear(new Date(2014, 6, 2))).toBeFalsy();
  });

  it('works for the years divisible by 100 but not by 400', () => {
    expect(isLeapYear(new Date(2100, 6, 2))).toBeFalsy();
  });

  it('works for the years divisible by 400', () => {
    expect(isLeapYear(new Date(2000, 6, 2))).toBeTruthy();
  });

  it('accepts a timestamp', () => {
    expect(isLeapYear(new Date(2012, 6, 2).getTime())).toBeTruthy();
  });

  it('returns false if the given date is `Invalid Date`', () => {
    const actual = isLeapYear(new Date(NaN));
    expect(isDate(actual)).toBeFalsy();
  });

  it('throws TypeError exception if passed less than 1 argument', () => {
    expect(isLeapYear.bind(null)).toThrow(TypeError);
  });
});
