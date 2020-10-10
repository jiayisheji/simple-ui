import { NgControl } from '@angular/forms';
import { Observable } from 'rxjs';

/**
 * 允许控件在 SimFormField 内部工作的接口。
 */
export abstract class SimFormFieldControl<T> {
  /**
   * 控件的值。
   */
  value: T | null;

  /**
   * 当控件状态发生更改时发出的流, 以便父 SimFormField 需要运行更改检测。
   */
  readonly stateChanges: Observable<void>;

  /** 此控件的元素 ID。 */
  readonly id: string;

  /** 此控件的占位符。 */
  readonly placeholder: string;

  /**
   * 获取此控件的 NgControl。
   */
  readonly ngControl: NgControl | null;

  /**
   * 控件是否聚焦。
   */
  readonly focused: boolean;

  /**
   * 控件是否为空。
   */
  readonly empty: boolean;

  /**
   * 是否需要控件。
   */
  readonly required: boolean;

  /**
   * 控件是否已禁用。
   */
  readonly disabled: boolean;

  /**
   * 控件是否处于错误状态。
   */
  readonly errorState: boolean;

  /**
   * 控件类型的可选名称, 可用于根据它们的控件类型区分基板表单字段元素。"表单" 域将向其根元素添加类、垫型字段类型 controlType。
   */
  readonly controlType?: string;

  /**
   * 输入当前是否处于自动填充状态。如果该控件上没有属性, 则假定其为 false。
   */
  readonly autofilled?: boolean;

  /**
   * 设置当前描述此控件的元素 id 的列表。
   */
  abstract setDescribedByIds(ids: string[]): void;

  /**
   * 处理控件容器上的单击。
   */
  abstract onContainerClick(event: MouseEvent): void;
}
