import { isDate } from './is-date';
import { startOfDay, startOfHour, startOfMinute, startOfMonth, startOfQuarter, startOfSecond, startOfWeek, startOfYear } from './start-of';

describe('startOfYear', () => {
  it('returns the date with the time set to 00:00:00 and the date set to the first day of a year', () => {
    const actual = new Date(2020, 9, 18, 11, 55, 0);
    const expected = new Date(2020, 0, 1, 0, 0, 0, 0);
    expect(startOfYear(actual)).toStrictEqual(expected);
  });

  it('accepts a timestamp', () => {
    const actual = new Date(2020, 9, 18, 11, 55, 0).getTime();
    const expected = new Date(2020, 0, 1, 0, 0, 0, 0);
    expect(startOfYear(actual)).toStrictEqual(expected);
  });

  it('does not mutate the original date', () => {
    const actual = new Date(2020, 9, 18, 11, 55, 0);
    startOfYear(actual);
    expect(actual).toStrictEqual(new Date(2020, 9, 18, 11, 55, 0));
  });

  it('returns `Invalid Date` if the given date is invalid', () => {
    const actual = startOfYear(new Date(NaN));
    expect(isDate(actual)).toBeFalsy();
  });

  it('throws TypeError exception if passed less than 1 argument', () => {
    expect(startOfYear.bind(null)).toThrow(TypeError);
  });
});

describe('startOfQuarter', () => {
  it('returns the date with the time set to 00:00:00 and the date set to the first day of a quarter', () => {
    const actual = new Date(2020, 9, 18, 11, 55, 0);
    const expected = new Date(2020, 9, 1, 0, 0, 0, 0);
    expect(startOfQuarter(actual)).toStrictEqual(expected);
  });

  it('accepts a timestamp', () => {
    const actual = new Date(2020, 9, 18, 11, 55, 0).getTime();
    const expected = new Date(2020, 9, 1, 0, 0, 0, 0);
    expect(startOfQuarter(actual)).toStrictEqual(expected);
  });

  it('does not mutate the original date', () => {
    const actual = new Date(2020, 9, 18, 11, 55, 0);
    startOfQuarter(actual);
    expect(actual).toStrictEqual(new Date(2020, 9, 18, 11, 55, 0));
  });

  it('returns `Invalid Date` if the given date is invalid', () => {
    const actual = startOfQuarter(new Date(NaN));
    expect(isDate(actual)).toBeFalsy();
  });

  it('throws TypeError exception if passed less than 1 argument', () => {
    expect(startOfQuarter.bind(null)).toThrow(TypeError);
  });
});

describe('startOfMonth', () => {
  it('returns the date with the time set to 00:00:00 and the date set to the first day of a month', () => {
    const actual = new Date(2020, 9, 18, 11, 55, 0);
    const expected = new Date(2020, 9, 1, 0, 0, 0, 0);
    expect(startOfMonth(actual)).toStrictEqual(expected);
  });

  it('accepts a timestamp', () => {
    const actual = new Date(2020, 9, 18, 11, 55, 0).getTime();
    const expected = new Date(2020, 9, 1, 0, 0, 0, 0);
    expect(startOfMonth(actual)).toStrictEqual(expected);
  });

  it('does not mutate the original date', () => {
    const actual = new Date(2020, 9, 18, 11, 55, 0);
    startOfMonth(actual);
    expect(actual).toStrictEqual(new Date(2020, 9, 18, 11, 55, 0));
  });

  it('returns `Invalid Date` if the given date is invalid', () => {
    const actual = startOfMonth(new Date(NaN));
    expect(isDate(actual)).toBeFalsy();
  });

  it('throws TypeError exception if passed less than 1 argument', () => {
    expect(startOfMonth.bind(null)).toThrow(TypeError);
  });
});

describe('startOfWeek', () => {
  it('returns the date with the time set to 00:00:00', () => {
    const actual = new Date(2020, 9, 18, 11, 55, 0);
    const expected = new Date(2020, 9, 18, 0, 0, 0, 0);
    expect(startOfWeek(actual)).toStrictEqual(expected);
  });

  it('accepts a timestamp', () => {
    const actual = new Date(2020, 9, 18, 11, 55, 0).getTime();
    const expected = new Date(2020, 9, 18, 0, 0, 0, 0);
    expect(startOfWeek(actual)).toStrictEqual(expected);
  });

  it('does not mutate the original date', () => {
    const actual = new Date(2020, 9, 18, 11, 55, 0);
    startOfWeek(actual);
    expect(actual).toStrictEqual(new Date(2020, 9, 18, 11, 55, 0));
  });

  it('returns `Invalid Date` if the given date is invalid', () => {
    const actual = startOfWeek(new Date(NaN));
    expect(isDate(actual)).toBeFalsy();
  });

  it('throws TypeError exception if passed less than 1 argument', () => {
    expect(startOfWeek.bind(null)).toThrow(TypeError);
  });

  it('allows to specify which day is the first day of the week', () => {
    const actual = new Date(2020, 9, 18, 11, 55, 0);
    const expected = new Date(2020, 9, 12, 0, 0, 0, 0);
    expect(startOfWeek(actual, 1)).toStrictEqual(expected);
  });

  it('implicitly converts options', () => {
    const actual = new Date(2020, 9, 18, 11, 55, 0);
    const expected = new Date(2020, 9, 12, 0, 0, 0, 0);
    expect(startOfWeek(actual, ('1' as unknown) as number)).toStrictEqual(expected);
  });

  it('throws `RangeError` if `weekStartsOn` is not convertable to 0, 1, ..., 6 or undefined', () => {
    const actual = new Date(2020, 9, 18, 11, 55, 0);
    expect(() => startOfWeek(actual, 7)).toThrow(RangeError);
  });

  describe('edge cases', () => {
    it('when the given day is before the start of a week it returns the start of a week', () => {
      const actual = new Date(2020, 9, 20, 11, 55, 0);
      const expected = new Date(2020, 9, 14, 0, 0, 0, 0);
      expect(startOfWeek(actual, 3)).toStrictEqual(expected);
    });

    it('when the given day is the start of a week it returns the start of a week', () => {
      const actual = new Date(2020, 9, 21, 11, 55, 0);
      const expected = new Date(2020, 9, 21, 0, 0, 0, 0);
      expect(startOfWeek(actual, 3)).toStrictEqual(expected);
    });

    it('when the given day is after the start of a week it returns the start of a week', () => {
      const actual = new Date(2020, 9, 24, 11, 55, 0);
      const expected = new Date(2020, 9, 21, 0, 0, 0, 0);
      expect(startOfWeek(actual, 3)).toStrictEqual(expected);
    });

    it('handles the week at the start of a year', () => {
      const actual = new Date(2021, 0, 1);
      const expected = new Date(2020, 11, 27);
      expect(startOfWeek(actual)).toStrictEqual(expected);
    });
  });
});

describe('startOfDay', () => {
  it('returns the date with the time set to 00:00:00', () => {
    const actual = new Date(2020, 9, 18, 11, 55, 0);
    const expected = new Date(2020, 9, 18, 0, 0, 0, 0);
    expect(startOfDay(actual)).toStrictEqual(expected);
  });

  it('accepts a timestamp', () => {
    const actual = new Date(2020, 9, 18, 11, 55, 0).getTime();
    const expected = new Date(2020, 9, 18, 0, 0, 0, 0);
    expect(startOfDay(actual)).toStrictEqual(expected);
  });

  it('does not mutate the original date', () => {
    const actual = new Date(2020, 9, 18, 11, 55, 0);
    startOfDay(actual);
    expect(actual).toStrictEqual(new Date(2020, 9, 18, 11, 55, 0));
  });

  it('returns `Invalid Date` if the given date is invalid', () => {
    const actual = startOfDay(new Date(NaN));
    expect(isDate(actual)).toBeFalsy();
  });

  it('throws TypeError exception if passed less than 1 argument', () => {
    expect(startOfDay.bind(null)).toThrow(TypeError);
  });
});

describe('startOfHour', () => {
  it('returns the date with the time set to 00:00', () => {
    const actual = new Date(2020, 9, 18, 11, 55, 0);
    const expected = new Date(2020, 9, 18, 11, 0, 0, 0);
    expect(startOfHour(actual)).toStrictEqual(expected);
  });

  it('accepts a timestamp', () => {
    const actual = new Date(2020, 9, 18, 11, 55, 0).getTime();
    const expected = new Date(2020, 9, 18, 11, 0, 0, 0);
    expect(startOfHour(actual)).toStrictEqual(expected);
  });

  it('does not mutate the original date', () => {
    const actual = new Date(2020, 9, 18, 11, 55, 0);
    startOfHour(actual);
    expect(actual).toStrictEqual(new Date(2020, 9, 18, 11, 55, 0));
  });

  it('returns `Invalid Date` if the given date is invalid', () => {
    const actual = startOfHour(new Date(NaN));
    expect(isDate(actual)).toBeFalsy();
  });

  it('throws TypeError exception if passed less than 1 argument', () => {
    expect(startOfHour.bind(null)).toThrow(TypeError);
  });
});

describe('startOfHour', () => {
  it('returns the date with the time set to the first millisecond of an hour', () => {
    const actual = new Date(2020, 9, 18, 11, 55, 0);
    const expected = new Date(2020, 9, 18, 11, 0, 0, 0);
    expect(startOfHour(actual)).toStrictEqual(expected);
  });

  it('accepts a timestamp', () => {
    const actual = new Date(2020, 9, 18, 11, 55, 0).getTime();
    const expected = new Date(2020, 9, 18, 11, 0, 0, 0);
    expect(startOfHour(actual)).toStrictEqual(expected);
  });

  it('does not mutate the original date', () => {
    const actual = new Date(2020, 9, 18, 11, 55, 0);
    startOfHour(actual);
    expect(actual).toStrictEqual(new Date(2020, 9, 18, 11, 55, 0));
  });

  it('returns `Invalid Date` if the given date is invalid', () => {
    const actual = startOfHour(new Date(NaN));
    expect(isDate(actual)).toBeFalsy();
  });

  it('throws TypeError exception if passed less than 1 argument', () => {
    expect(startOfHour.bind(null)).toThrow(TypeError);
  });
});

describe('startOfMinute', () => {
  it('returns the date with the time set to the first millisecond of a minute', () => {
    const actual = new Date(2020, 9, 18, 11, 55, 0);
    const expected = new Date(2020, 9, 18, 11, 55, 0, 0);
    expect(startOfMinute(actual)).toStrictEqual(expected);
  });

  it('accepts a timestamp', () => {
    const actual = new Date(2020, 9, 18, 11, 55, 0).getTime();
    const expected = new Date(2020, 9, 18, 11, 55, 0, 0);
    expect(startOfMinute(actual)).toStrictEqual(expected);
  });

  it('does not mutate the original date', () => {
    const actual = new Date(2020, 9, 18, 11, 55, 0);
    startOfMinute(actual);
    expect(actual).toStrictEqual(new Date(2020, 9, 18, 11, 55, 0));
  });

  it('returns `Invalid Date` if the given date is invalid', () => {
    const actual = startOfMinute(new Date(NaN));
    expect(isDate(actual)).toBeFalsy();
  });

  it('throws TypeError exception if passed less than 1 argument', () => {
    expect(startOfMinute.bind(null)).toThrow(TypeError);
  });
});

describe('startOfSecond', () => {
  it('returns the date with the time set to the first millisecond of a second', () => {
    const actual = new Date(2020, 9, 18, 11, 55, 25, 135);
    const expected = new Date(2020, 9, 18, 11, 55, 25, 0);
    expect(startOfSecond(actual)).toStrictEqual(expected);
  });

  it('accepts a timestamp', () => {
    const actual = new Date(2020, 9, 18, 11, 55, 25, 135).getTime();
    const expected = new Date(2020, 9, 18, 11, 55, 25, 0);
    expect(startOfSecond(actual)).toStrictEqual(expected);
  });

  it('does not mutate the original date', () => {
    const actual = new Date(2020, 9, 18, 11, 55, 0);
    startOfSecond(actual);
    expect(actual).toStrictEqual(new Date(2020, 9, 18, 11, 55, 0));
  });

  it('returns `Invalid Date` if the given date is invalid', () => {
    const actual = startOfSecond(new Date(NaN));
    expect(isDate(actual)).toBeFalsy();
  });

  it('throws TypeError exception if passed less than 1 argument', () => {
    expect(startOfSecond.bind(null)).toThrow(TypeError);
  });
});
