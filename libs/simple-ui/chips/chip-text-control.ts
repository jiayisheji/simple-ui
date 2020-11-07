/** 用于驱动与sim-chip-list交互的input控件的接口 */
export interface SimChipTextControl {
  /** input控件的唯一标识符 */
  id: string;

  /** input控件的placeholder */
  placeholder: string;

  /** input控件是否具有浏览器焦点 */
  focused: boolean;

  /** input控件是否为空 */
  empty: boolean;

  /** input控件聚焦方法 */
  focus(options?: FocusOptions): void;
}
