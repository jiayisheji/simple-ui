/** 除非提供的值是数组，否则将提供的值包装在数组中。 */
export function toArray<T>(value: T | T[]): T[];
export function toArray<T>(value: T | readonly T[]): readonly T[];
export function toArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}
