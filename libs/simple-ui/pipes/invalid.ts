/**
 * 无效值 null undefined NaN ''
 * @param value
 */
export function invalid(value: string | number | null | undefined): value is string | number | null | undefined {
  return value == null || value === '' || value !== value;
}
