import { SafeAny } from '@ngx-simple/core/types';
import { EChartsLoadingOption } from 'echarts';

export interface SimEChartsRegisterMapOption {
  // 目录地址
  assets?: string;
  // 跨域安全策略
  withCredentials?: boolean;
  // 缓存key前缀
  cacheKeyPrefix?: string;
  // 存储类型 默认 localStorage
  cacheType?: 'localStorage' | 'sessionStorage';
}

/**
 * 表示可配置的默认选项
 * using the `SIM_ECHARTS_OPTIONS` injection token.
 */
export interface SimEChartsDefaultOptions {
  /** 加载 echarts 库 */
  echarts?: () => Promise<SafeAny>;
  /**
   * 加载 自定义 echarts 主题
   *
   */
  themes?: Array<{ name: string; url: string; withCredentials: boolean }>;
  /** 初始化配置 */
  initOpts?: {
    devicePixelRatio?: number;
    renderer?: string;
    width?: number | string;
    height?: number | string;
  };
  /** loading配置 */
  loadingOpts?: {
    type: string;
  } & EChartsLoadingOption;
  /** 高度 默认：400px */
  height?: string;
  /** 注册地图全局配置 */
  registerMap?: SimEChartsRegisterMapOption;
}
