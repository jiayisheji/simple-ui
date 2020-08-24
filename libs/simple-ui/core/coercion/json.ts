/**
 * 将数据绑定值(通常是字符串)强制转换为指定值
 * js是动态语言，只保证使用`JSON.parse`处理字符串，其他值如果是对象直接返回，如果是其他值返回回退值
 *
 * @param value 任意值 期望是字符串
 * @returns 返回`JSON.parse`处理值
 */
export function toJson<D>(value: string): D;
export function toJson<D, T>(value: string, fallbackValue: D): T | D;
export function toJson(value: string, fallbackValue = null) {
  const type = typeof value;
  if (value == null) {
    return fallbackValue;
  }
  if (type === 'object') {
    return value;
  }
  if (type !== 'string') {
    return fallbackValue;
  }
  try {
    return JSON.parse(value);
  } catch (_ignoreError) {
    return fallbackValue;
  }
}
