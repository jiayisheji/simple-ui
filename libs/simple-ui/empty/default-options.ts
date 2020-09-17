import { InjectionToken } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { NgStringOrTemplateRef } from '@ngx-simple/core/types';

/**
 * 表示可配置的默认选项
 * using the `SIM_EMPTY_DEFAULT_OPTIONS` injection token.
 */
export interface SimEmptyDefaultOptions {
  /** 图片的地址 */
  src?: SafeResourceUrl;

  /** 提示描述 */
  content?: NgStringOrTemplateRef;
}

/**
 * 注入令牌，可用于配置应用程序中所有 `empty` 的默认选项。
 */
export const SIM_EMPTY_DEFAULT_OPTIONS = new InjectionToken<SimEmptyDefaultOptions>('SIM_EMPTY_DEFAULT_OPTIONS');
