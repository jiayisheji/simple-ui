import { remove } from './remove';

function isEven(i: number): boolean {
  return i % 2 === 0;
}

describe('remove', () => {
  it('should modify the empty array and not array', () => {
    const array = [],
      actual = remove(array, isEven);
    expect(array).toStrictEqual(actual);
  });

  it('should modify the array and return removed elements', () => {
    const array = [1, 2, 3, 4],
      actual = remove(array, isEven);
    expect(array).toStrictEqual([1, 3]);
    expect(actual).toStrictEqual([2, 4]);
  });

  it('should provide correct `predicate` arguments', () => {
    const argsList = [];
    const array = [1, 2, 3];
    const clone = array.slice();

    remove(array, (n, index, collection) => {
      collection = collection.slice();
      argsList.push([n, index, collection]);
      return isEven(index);
    });

    expect(argsList).toStrictEqual([
      [1, 0, clone],
      [2, 1, clone],
      [3, 2, clone]
    ]);
  });

  it('should work with `matches` shorthands', () => {
    const objects = [
      { a: 0, b: 1 },
      { a: 1, b: 2 }
    ];
    const matches = { a: 1 };
    remove(objects, item => {
      return item.a === matches.a;
    });

    expect(objects).toStrictEqual([{ a: 0, b: 1 }]);
  });

  it('should work with not `matches` shorthands', () => {
    const objects = [
      { a: 0, b: 1 },
      { a: 1, b: 2 }
    ];
    const matches = { a: 2 };
    const actual = remove(objects, item => {
      return item.a === matches.a;
    });

    expect(objects).toStrictEqual([
      { a: 0, b: 1 },
      { a: 1, b: 2 }
    ]);
    expect(actual).toStrictEqual([]);
  });

  it('should preserve holes in arrays', () => {
    const array = [1, 2, 3, 4];
    delete array[1];
    delete array[3];

    remove(array, n => {
      return n === 1;
    });

    expect(!('0' in array)).toBeTruthy();
    expect(!('2' in array)).toBeTruthy();
  });

  it('should treat holes as `undefined`', () => {
    const array = [1, 2, 3];
    delete array[1];

    remove(array, n => n == null);

    expect(array).toStrictEqual([1, 3]);
  });

  it('should not mutate the array until all elements to remove are determined', () => {
    const array = [1, 2, 3];

    remove(array, (n, index) => isEven(index));

    expect(array).toStrictEqual([2]);
  });
});
