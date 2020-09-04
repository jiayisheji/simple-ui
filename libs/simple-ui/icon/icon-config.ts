import { InjectionToken } from '@angular/core';

/**
 * 注入令牌，可用于配置空组件的默认选项
 */
export const SIM_ICON_MODULE_DEFAULT_OPTIONS = new InjectionToken<SimIconModuleDefaultOptions>('SIM_ICON_MODULE_DEFAULT_OPTIONS');

/**
 * 获取默认配置里面的icon映射别名
 * @param defaultOptions 默认配置
 * @param module 模块标识名
 * @param alias 别名
 * @returns icon name
 */
export function getDefaultIconNameByAlias(defaultOptions: SimIconModuleDefaultOptions, module: string, alias: string): string {
  if (!defaultOptions) {
    throw Error('The default module icon needs to be configured');
  }
  const icon = (defaultOptions || {})[module] || (defaultOptions || {})['global'];
  if (alias && !icon) {
    throw foundModuleDefaultIconError(module);
  }
  return icon[alias];
}

export function foundModuleDefaultIconError(module: string) {
  return Error(`The default configuration for '${module}' could not be found in SIM_ICON_MODULE_DEFAULT_OPTIONS`);
}

/**
 * icon组件全局默认选项
 * 优先取私有 找不到取全局
 */
export interface SimIconModuleDefaultOptions {
  // 全局配置
  global: {
    // 加载
    loading?: string;
    // 关闭
    close?: string;
    // 信息
    info?: string;
    // 警告
    warning?: string;
    // 成功
    success?: string;
    // 危险/失败
    danger?: string;
  };

  // toast notification
  notification?: {
    // 关闭
    close?: string;
    // 信息
    info?: string;
    // 警告
    warning?: string;
    // 成功
    success?: string;
    // 危险/失败
    danger?: string;
  };

  // toast message
  message?: {
    // 信息
    info?: string;
    // 警告
    warning?: string;
    // 成功
    success?: string;
    // 危险/失败
    danger?: string;
  };

  // toast confirm
  confirm?: {
    // 警告
    warning?: string;
  };

  // alert
  alert?: {
    // 信息
    info?: string;
    // 警告
    warning?: string;
    // 成功
    success?: string;
    // 危险/失败
    danger?: string;
  };

  // input
  input?: {
    search?: string;
  };

  // 模块标识
  [module: string]:
    | string
    | {
        // icon映射名字
        [key: string]: string;
      };
}
