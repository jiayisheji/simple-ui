import { InjectionToken } from '@angular/core';

/**
 * 表示可配置的默认选项
 * using the `SIM_EXPANSION_PANEL_DEFAULT_OPTIONS` injection token.
 */
export interface SimExpansionPanelDefaultOptions {
  /** 面板展开时标题的高度 */
  expandedHeight: string;

  /** 面板折叠时标题的高度 */
  collapsedHeight: string;

  /** 是否应该隐藏切换指示符 */
  hideToggle: boolean;
}

/**
 * 注入令牌，可用于配置应用程序中所有 `expansion-panel` 的默认选项。
 */
export const SIM_EXPANSION_PANEL_DEFAULT_OPTIONS = new InjectionToken<SimExpansionPanelDefaultOptions>(
  'SIM_EXPANSION_PANEL_DEFAULT_OPTIONS'
);
