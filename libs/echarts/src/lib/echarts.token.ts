import { InjectionToken } from '@angular/core';
import { SimEChartsDefaultOptions } from './default-options';

/**
 * 注入令牌，可用于配置应用程序中所有 `ECharts` 的默认选项。
 */
export const SIM_ECHARTS_OPTIONS = new InjectionToken<SimEChartsDefaultOptions>('SIM_ECHARTS_OPTIONS');
