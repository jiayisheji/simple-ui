import { SafeAny } from '@ngx-simple/simple-ui/core/types';
/**
 * 类型描述布尔输入的允许值
 */
export type BooleanInput = string | boolean | null | undefined;

/** 将数据绑定值（通常是字符串）强制为布尔值 */
export function toBoolean(value: SafeAny): boolean {
  return value != null && `${value}` !== 'false';
}
