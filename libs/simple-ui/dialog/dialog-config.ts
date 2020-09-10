import { ScrollStrategy } from '@angular/cdk/overlay';
import { ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { SafeAny } from '@ngx-simple/core/types';

/** 对话框元素的ARIA role */
export type DialogRole = 'dialog' | 'alertdialog';

/** 对话框位置 */
export interface DialogPosition {
  /** 浮层对话框的顶部位置 */
  top?: string;

  /** 浮层对话框的底部位置 */
  bottom?: string;

  /** 浮层对话框的左侧位置 */
  left?: string;

  /** 浮层对话框的右侧位置 */
  right?: string;
}

/**
 * 使用SimDialogService服务打开对话框的配置
 */
export class SimDialogConfig<D = SafeAny> {
  /** 对话框的ID。如果缺失，将自动生成一个唯一 */
  id?: string;

  /** 被注入到子组件中的数据 */
  data?: D | null = null;

  /** dialog元素的 ARIA role */
  role?: DialogRole = 'dialog';

  /** 浮层面板的自定义类 */
  panelClass?: string | string[] = '';

  /** 对话框是否有遮罩背景 */
  hasBackdrop?: boolean = true;

  /** 遮罩背景的自定义类 */
  backdropClass?: string = '';

  /** 用户是否可以使用Escape键或单击背景关闭模式 */
  disableClose?: boolean = false;

  /** 对话框宽度 */
  width?: string = '';

  /** 对话框高度 */
  height?: string = '';

  /** 对话框的最小宽度。如果提供了数字，认定为px单位 */
  minWidth?: number | string;

  /** 对话框的最小高度。如果提供了数字，认定为px单位 */
  minHeight?: number | string;

  /** 对话框的最大宽度。如果提供了数字，认定为px单位 默认为80vw */
  maxWidth?: number | string = '80vw';

  /** 对话框的最大高度。如果提供了数字，认定为px单位 */
  maxHeight?: number | string;

  /** 浮层位置 */
  position?: DialogPosition;

  /** 对话框是否应该在打开后将第一个可聚焦元素自动聚焦 */
  autoFocus?: boolean = true;

  /** 对话框是否应该在关闭后将焦点恢复到以前的焦点元素 */
  restoreFocus?: boolean = true;

  /** 当用户在history中go backward/forward 移动时，对话框是否应该关闭。 */
  closeOnNavigation?: boolean = true;

  /** 对话框使用的滚动策略 */
  scrollStrategy?: ScrollStrategy;

  /** 对话框内容是否固定 如果为否表示滚动，其他地方固定，默认为滚动 */
  contentFixed?: boolean = false;

  /** 对话框动作对齐方式 */
  actionsAlign?: 'start' | 'center' | 'end' = 'end';

  /**
   * 附上的组件应该位于Angular的`logical`(逻辑)组件树中。
   * 这将影响可用于注入的内容以及对话框内实例化的组件的更改检测顺序。这并不影响对话框内容的呈现位置。
   */
  viewContainerRef?: ViewContainerRef;

  /** `ComponentFactoryResolver`在解析相关组件时使用 */
  componentFactoryResolver?: ComponentFactoryResolver;
}
