import { Inject, InjectionToken, Optional, Pipe, PipeTransform } from '@angular/core';

/**
 * 注入令牌，可用于配置应用程序中所有 `empty` 的默认选项。
 */
export const SIM_FALLBACK_DEFAULT_OPTIONS = new InjectionToken<string>('SIM_FALLBACK_DEFAULT_OPTIONS');

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
    this._defaultOptions = defaultOptions ?? '';
  }

  transform(value: T | string | number | null | undefined, defaultValue: string = this._defaultOptions): T {
    // 处理异常情况
    if (value == null || value === '' || value !== value) {
      return (defaultValue as unknown) as T;
    }
    // 返回原值
    return (value as unknown) as T;
  }
}
