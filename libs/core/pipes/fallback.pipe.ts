import { Inject, InjectionToken, Optional, Pipe, PipeTransform } from '@angular/core';

/**
 * 注入令牌，可用于配置应用程序中所有 `empty` 的默认选项。
 */
export const SIM_FALLBACK_DEFAULT_OPTIONS = new InjectionToken<string>('SIM_FALLBACK_DEFAULT_OPTIONS');

/**
 * 回退值
 *
 * 如果出现`null`、`undefined`、`NaN`、`''`将会使用默认值，
 *
 * @example
 * {
 *    value: string
 * }
 *
 * <p>{{ value | fallback }}</p>
 * // '--'
 *
 * <p>{{ value | fallback: 'value' }}</p>
 * // 'value'
 *
 * {
 *    value: string = 'New value';
 * }
 *
 * <p>{{ value | fallback: 'value' }}</p>
 * // 'New value'
 *
 */
@Pipe({
  name: 'fallback'
})
export class SimFallbackPipe<T> implements PipeTransform {
  private _defaultOptions: string;

  constructor(
    @Inject(SIM_FALLBACK_DEFAULT_OPTIONS)
    @Optional()
    defaultOptions?: string
  ) {
    this._defaultOptions = defaultOptions ?? '--';
  }

  transform(value: null | undefined | string): string;
  transform(value: T): T;
  transform(value: T | null | undefined | string, defaultValue: string = this._defaultOptions): string | T {
    // 处理异常情况
    if (value == null || value === '' || value !== value) {
      return defaultValue;
    }
    // 返回原值
    return value;
  }
}
