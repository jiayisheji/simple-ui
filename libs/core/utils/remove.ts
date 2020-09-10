import { isArray } from '@ngx-simple/core/typeof';

/**
 * 移除数组中 predicate（断言）返回为真值的所有元素，并返回移除元素组成的数组
 * @param array 要修改的数组
 * @param predicate 每次迭代调用的函数
 * @returns 返回移除元素组成的数组
 */
export function remove<T>(array: T[], predicate: (value: T, index: number, collection: T[]) => {} | null | undefined): T[] {
  // 如果不是数组或者是空数组 直接返回空数组
  if (!isArray(array) || !array.length) {
    return [];
  }
  // 创建移除元素组成的数组
  const result: T[] = [];
  let i = -1;
  // 移除元素的索引数组
  const indexes: number[] = [];
  const length = array.length;
  while (++i < length) {
    const value = array[i];
    // 返回为 true 的所有元素
    if (predicate(value, i, array)) {
      // 放到移除元素数组种
      result.push(value);
      // 保留当前索引备用
      indexes.push(i);
    }
  }
  // 获取删除元素索引数组
  let j = indexes.length;
  // 如果是空的直接返回
  if (j === 0) {
    return result;
  }
  const lastIndex = j - 1;
  let previous: number;
  // 移除删除的元素，这里需要倒叙循环，不然 splice 会出现bug
  while (j--) {
    const index = indexes[j];
    if (j === lastIndex || index !== previous) {
      previous = i;
      array.splice(index, 1);
    }
  }
  return result;
}
