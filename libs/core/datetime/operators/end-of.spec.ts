import { endOfDay, endOfHour, endOfMinute, endOfMonth, endOfQuarter, endOfSecond, endOfWeek, endOfYear } from './end-of';
import { isDate } from './is-date';

describe('endOfYear', () => {
  it('returns the date with the time set to 23:59:59.999 and the date set to the last day of a year', () => {
    const actual = new Date(2020, 9, 18, 11, 55, 0);
    const expected = new Date(2020, 11, 31, 23, 59, 59, 999);
    expect(endOfYear(actual)).toStrictEqual(expected);
  });

  it('accepts a timestamp', () => {
    const actual = new Date(2020, 9, 18, 11, 55, 0).getTime();
    const expected = new Date(2020, 11, 31, 23, 59, 59, 999);
    expect(endOfYear(actual)).toStrictEqual(expected);
  });

  it('does not mutate the original date', () => {
    const actual = new Date(2020, 9, 18, 11, 55, 0);
    endOfYear(actual);
    expect(actual).toStrictEqual(new Date(2020, 9, 18, 11, 55, 0));
  });

  it('returns `Invalid Date` if the given date is invalid', () => {
    const actual = endOfYear(new Date(NaN));
    expect(isDate(actual)).toBeFalsy();
  });

  it('throws TypeError exception if passed less than 1 argument', () => {
    expect(endOfYear.bind(null)).toThrow(TypeError);
  });
});

describe('endOfQuarter', () => {
  it('returns the date with the time set to 23:59:59.999 and the date set to the last day of a quarter', () => {
    const actual = new Date(2020, 9, 18, 11, 55, 0);
    const expected = new Date(2020, 11, 31, 23, 59, 59, 999);
    expect(endOfQuarter(actual)).toStrictEqual(expected);
  });

  it('accepts a timestamp', () => {
    const actual = new Date(2020, 9, 18, 11, 55, 0).getTime();
    const expected = new Date(2020, 11, 31, 23, 59, 59, 999);
    expect(endOfQuarter(actual)).toStrictEqual(expected);
  });

  it('does not mutate the original date', () => {
    const actual = new Date(2020, 9, 18, 11, 55, 0);
    endOfQuarter(actual);
    expect(actual).toStrictEqual(new Date(2020, 9, 18, 11, 55, 0));
  });

  it('returns `Invalid Date` if the given date is invalid', () => {
    const actual = endOfQuarter(new Date(NaN));
    expect(isDate(actual)).toBeFalsy();
  });

  it('throws TypeError exception if passed less than 1 argument', () => {
    expect(endOfQuarter.bind(null)).toThrow(TypeError);
  });
});

describe('endOfMonth', () => {
  it('returns the date with the time set to 23:59:59.999 and the date set to the last day of a month', () => {
    const actual = new Date(2020, 9, 18, 11, 55, 0);
    const expected = new Date(2020, 9, 31, 23, 59, 59, 999);
    expect(endOfMonth(actual)).toStrictEqual(expected);
  });

  it('accepts a timestamp', () => {
    const actual = new Date(2020, 9, 18, 11, 55, 0).getTime();
    const expected = new Date(2020, 9, 31, 23, 59, 59, 999);
    expect(endOfMonth(actual)).toStrictEqual(expected);
  });

  it('does not mutate the original date', () => {
    const actual = new Date(2020, 9, 18, 11, 55, 0);
    endOfMonth(actual);
    expect(actual).toStrictEqual(new Date(2020, 9, 18, 11, 55, 0));
  });

  it('returns `Invalid Date` if the given date is invalid', () => {
    const actual = endOfMonth(new Date(NaN));
    expect(isDate(actual)).toBeFalsy();
  });

  it('throws TypeError exception if passed less than 1 argument', () => {
    expect(endOfMonth.bind(null)).toThrow(TypeError);
  });

  describe('edge cases', () => {
    it('works for last month in year', () => {
      const actual = new Date(2020, 11, 1, 0, 0, 0);
      const expected = new Date(2020, 11, 31, 23, 59, 59, 999);
      expect(endOfMonth(actual)).toStrictEqual(expected);
    });

    it('works for last month in year', () => {
      const actual = new Date(2020, 9, 31);
      const expected = new Date(2020, 9, 31, 23, 59, 59, 999);
      expect(endOfMonth(actual)).toStrictEqual(expected);
    });
  });
});

describe('endOfWeek', () => {
  it('returns the date with the time set to 23:59:59:999 and the date set to the last day of a week', () => {
    const actual = new Date(2020, 9, 18, 11, 55, 0);
    const expected = new Date(2020, 9, 24, 23, 59, 59, 999);
    expect(endOfWeek(actual)).toStrictEqual(expected);
  });

  it('accepts a timestamp', () => {
    const actual = new Date(2020, 9, 18, 11, 55, 0).getTime();
    const expected = new Date(2020, 9, 24, 23, 59, 59, 999);
    expect(endOfWeek(actual)).toStrictEqual(expected);
  });

  it('does not mutate the original date', () => {
    const actual = new Date(2020, 9, 18, 11, 55, 0);
    endOfWeek(actual);
    expect(actual).toStrictEqual(new Date(2020, 9, 18, 11, 55, 0));
  });

  it('returns `Invalid Date` if the given date is invalid', () => {
    const actual = endOfWeek(new Date(NaN));
    expect(isDate(actual)).toBeFalsy();
  });

  it('throws TypeError exception if passed less than 1 argument', () => {
    expect(endOfWeek.bind(null)).toThrow(TypeError);
  });

  it('allows to specify which day is the first day of the week', () => {
    const actual = new Date(2020, 9, 18, 11, 55, 0);
    const expected = new Date(2020, 9, 18, 23, 59, 59, 999);
    expect(endOfWeek(actual, 1)).toStrictEqual(expected);
  });

  it('implicitly converts options', () => {
    const actual = new Date(2020, 9, 18, 11, 55, 0);
    const expected = new Date(2020, 9, 18, 23, 59, 59, 999);
    expect(endOfWeek(actual, ('1' as unknown) as number)).toStrictEqual(expected);
  });

  it('throws `RangeError` if `weekStartsOn` is not convertable to 0, 1, ..., 6 or undefined', () => {
    const actual = new Date(2020, 9, 18, 11, 55, 0);
    expect(() => endOfWeek(actual, 7)).toThrow(RangeError);
  });

  describe('edge cases', () => {
    it('when the given day is before the start of a week it returns the end of a week', function () {
      const actual = new Date(2020, 9, 14, 11, 55, 0);
      const expected = new Date(2020, 9, 20, 23, 59, 59, 999);
      expect(endOfWeek(actual, 3)).toStrictEqual(expected);
    });

    it('when the given day is the start of a week it returns the end of a week', function () {
      const actual = new Date(2020, 9, 15, 11, 55, 0);
      const expected = new Date(2020, 9, 20, 23, 59, 59, 999);
      expect(endOfWeek(actual, 3)).toStrictEqual(expected);
    });

    it('when the given day is after the start of a week it returns the end of a week', function () {
      const actual = new Date(2020, 9, 18, 11, 55, 0);
      const expected = new Date(2020, 9, 20, 23, 59, 59, 999);
      expect(endOfWeek(actual, 3)).toStrictEqual(expected);
    });

    it('handles the week at the end of a year', function () {
      const actual = new Date(2020, 11, 29);
      const expected = new Date(2020, 11, 31, 23, 59, 59, 999);
      expect(endOfWeek(actual, 5)).toStrictEqual(expected);
    });
  });
});

describe('endOfDay', () => {
  it('returns the date with the time set to 23:59:59.999', () => {
    const actual = new Date(2020, 9, 18, 11, 55, 0);
    const expected = new Date(2020, 9, 18, 23, 59, 59, 999);
    expect(endOfDay(actual)).toStrictEqual(expected);
  });

  it('accepts a timestamp', () => {
    const actual = new Date(2020, 9, 18, 11, 55, 0).getTime();
    const expected = new Date(2020, 9, 18, 23, 59, 59, 999);
    expect(endOfDay(actual)).toStrictEqual(expected);
  });

  it('does not mutate the original date', () => {
    const actual = new Date(2020, 9, 18, 11, 55, 0);
    endOfDay(actual);
    expect(actual).toStrictEqual(new Date(2020, 9, 18, 11, 55, 0));
  });

  it('returns `Invalid Date` if the given date is invalid', () => {
    const actual = endOfDay(new Date(NaN));
    expect(isDate(actual)).toBeFalsy();
  });

  it('throws TypeError exception if passed less than 1 argument', () => {
    expect(endOfDay.bind(null)).toThrow(TypeError);
  });
});

describe('endOfHour', () => {
  it('returns the date with the time set to the last millisecond before an hour ends', () => {
    const actual = new Date(2020, 9, 18, 11, 55, 0);
    const expected = new Date(2020, 9, 18, 11, 59, 59, 999);
    expect(endOfHour(actual)).toStrictEqual(expected);
  });

  it('accepts a timestamp', () => {
    const actual = new Date(2020, 9, 18, 11, 55, 0).getTime();
    const expected = new Date(2020, 9, 18, 11, 59, 59, 999);
    expect(endOfHour(actual)).toStrictEqual(expected);
  });

  it('does not mutate the original date', () => {
    const actual = new Date(2020, 9, 18, 11, 55, 0);
    endOfHour(actual);
    expect(actual).toStrictEqual(new Date(2020, 9, 18, 11, 55, 0));
  });

  it('returns `Invalid Date` if the given date is invalid', () => {
    const actual = endOfHour(new Date(NaN));
    expect(isDate(actual)).toBeFalsy();
  });

  it('throws TypeError exception if passed less than 1 argument', () => {
    expect(endOfHour.bind(null)).toThrow(TypeError);
  });
});

describe('endOfMinute', () => {
  it('returns the date with the time set to the last millisecond before a minute ends', () => {
    const actual = new Date(2020, 9, 18, 11, 55, 0);
    const expected = new Date(2020, 9, 18, 11, 55, 59, 999);
    expect(endOfMinute(actual)).toStrictEqual(expected);
  });

  it('accepts a timestamp', () => {
    const actual = new Date(2020, 9, 18, 11, 55, 0).getTime();
    const expected = new Date(2020, 9, 18, 11, 55, 59, 999);
    expect(endOfMinute(actual)).toStrictEqual(expected);
  });

  it('does not mutate the original date', () => {
    const actual = new Date(2020, 9, 18, 11, 55, 0);
    endOfMinute(actual);
    expect(actual).toStrictEqual(new Date(2020, 9, 18, 11, 55, 0));
  });

  it('returns `Invalid Date` if the given date is invalid', () => {
    const actual = endOfMinute(new Date(NaN));
    expect(isDate(actual)).toBeFalsy();
  });

  it('throws TypeError exception if passed less than 1 argument', () => {
    expect(endOfMinute.bind(null)).toThrow(TypeError);
  });
});

describe('endOfSecond', () => {
  it('returns the date with the time set to the last millisecond before a second ends', () => {
    const actual = new Date(2020, 9, 18, 11, 55, 0);
    const expected = new Date(2020, 9, 18, 11, 55, 0, 999);
    expect(endOfSecond(actual)).toStrictEqual(expected);
  });

  it('accepts a timestamp', () => {
    const actual = new Date(2020, 9, 18, 11, 55, 0).getTime();
    const expected = new Date(2020, 9, 18, 11, 55, 0, 999);
    expect(endOfSecond(actual)).toStrictEqual(expected);
  });

  it('does not mutate the original date', () => {
    const actual = new Date(2020, 9, 18, 11, 55, 0);
    endOfSecond(actual);
    expect(actual).toStrictEqual(new Date(2020, 9, 18, 11, 55, 0));
  });

  it('returns `Invalid Date` if the given date is invalid', () => {
    const actual = endOfSecond(new Date(NaN));
    expect(isDate(actual)).toBeFalsy();
  });

  it('throws TypeError exception if passed less than 1 argument', () => {
    expect(endOfMinute.bind(null)).toThrow(TypeError);
  });
});
