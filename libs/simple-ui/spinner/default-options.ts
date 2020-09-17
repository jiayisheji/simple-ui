import { InjectionToken, TemplateRef } from '@angular/core';

/**
 * 表示可配置的默认选项
 * using the `SIM_SPINNER_DEFAULT_OPTIONS` injection token.
 */
export type SimSpinnerDefaultOptions = TemplateRef<void>;

/**
 * 注入令牌，可用于配置应用程序中所有 `spinner` 的默认选项。
 */
export const SIM_SPINNER_DEFAULT_OPTIONS = new InjectionToken<SimSpinnerDefaultOptions>('SIM_SPINNER_DEFAULT_OPTIONS');
