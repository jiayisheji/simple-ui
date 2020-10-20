/**
 * 将数据绑定值(通常是字符串)强制转换为指定值
 * js是动态语言，只保证使用`JSON.parse`处理字符串，其他值如果是对象直接返回，如果是其他值返回回退值
 *
 * @param value 任意值 期望是字符串
 * @param fallbackValue 回退值
 * @returns 返回`JSON.parse`处理值
 */
export function toJson<D>(value: string): D;
export function toJson<D, T>(value: string, fallbackValue: D): T | D;
export function toJson(value: string, fallbackValue = null) {
  if (value == null) {
    return fallbackValue;
  }
  if (typeof value !== 'string') {
    return value;
  }
  try {
    return JSON.parse(value);
  } catch (_ignoreError) {
    return fallbackValue;
  }
}

/**
 * 将数据绑定值(通常是`{}|[]`)强制转换为字符串
 * js是动态语言，只保证使用`JSON.stringify`处理`{}|[]`，其他值如果处理失败直接返回回退值。
 *
 * @param value 任意值 期望是{}|[]
 * @param fallbackValue 回退值
 * @param config JSON.stringify 剩余参数 replacer 和 space
 * @returns 返回`JSON.stringify`处理值
 */
export function fromJson(value: null | undefined): null;
export function fromJson<D>(value: D): string;
export function fromJson<D>(
  value: D | null | undefined,
  fallbackValue = null,
  config?: {
    replacer?: (this: any, key: string, value: any) => any;
    space?: string | number;
  }
): string | null {
  if (value == null) {
    return fallbackValue;
  }
  try {
    const { replacer, space } = config || {};
    return JSON.stringify(value, replacer, space);
  } catch (_ignoreError) {
    return fallbackValue;
  }
}
