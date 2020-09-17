import { InjectionToken } from '@angular/core';
import { SafeAny } from '@ngx-simple/core/types';
import { SimExpansionComponent } from './expansion.component';
import { SimExpansionDisplayMode } from './expansion.typings';

/**
 * `SimExpansionBase` 基本接口 .
 */
export interface SimExpansionBase extends SimExpansionComponent {
  /** 是否隐藏扩展指示箭头 */
  hideToggle: boolean;

  /** 扩展面板的显示模式 */
  displayMode: SimExpansionDisplayMode;

  /** 处理来自面板标题的键盘事件 */
  _handleHeaderKeydown: (event: KeyboardEvent) => void;

  /** 处理来自面板标题的焦点事件 */
  _handleHeaderFocus: (header: SafeAny) => void;
}

export const SIM_EXPANSION = new InjectionToken<SimExpansionBase>('SIM_EXPANSION');
