import { toArray } from './array';

describe('toArray', () => {
  it('should wrap a string in an array', () => {
    const stringVal = 'just a string';
    expect(toArray(stringVal)).toEqual([stringVal]);
  });

  it('should wrap a number in an array', () => {
    const numberVal = 42;
    expect(toArray(numberVal)).toEqual([numberVal]);
  });

  it('should wrap an object in an array', () => {
    const objectVal = { something: 'clever' };
    expect(toArray(objectVal)).toEqual([objectVal]);
  });

  it('should wrap a null value in an array', () => {
    const nullVal = null;
    expect(toArray(nullVal)).toEqual([nullVal]);
  });

  it('should wrap an undefined value in an array', () => {
    const undefinedVal = undefined;
    expect(toArray(undefinedVal)).toEqual([undefinedVal]);
  });

  it('should not wrap an array in an array', () => {
    const arrayVal = [1, 2, 3];
    expect(toArray(arrayVal)).toBe(arrayVal);
  });
});
