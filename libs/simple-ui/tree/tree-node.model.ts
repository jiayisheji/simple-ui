import { Observable } from 'rxjs';

export class SimTreeNode {
  /** 整个树范围内的所有节点的 key 值不能重复且不为空 ，表示包含唯一ID的节点的属性 */
  key: string;
  /** 用于显示其内容的节点字段的值 */
  display: string;
  /**
   * 树中的级别(从0开始)
   *
   * 每个节点的左填充值为level * levelPadding，而不是为子节点使用默认padding。
   *
   * 也可以使用tree-node-level-X类在每个级别上进行设置padding
   */
  level: number;
  /** 设置节点是否展开(叶子节点无效) */
  isExpanded?: boolean;
  /** 设置节点本身是否选中 */
  isSelected?: boolean;
  /** 设置节点 Checkbox 是否选中 */
  isChecked?: boolean;
  /** 是否是叶子节点 */
  isLeaf?: boolean;
  /** 节点可展开 */
  expandable?: boolean;
  /** 设置节点是否可被选中 默认：true */
  selectable: boolean;
  /** 设置是否禁用节点(不可进行任何操作) */
  disabled?: boolean;
  /** 设置节点禁用 Checkbox */
  disableCheckbox?: boolean;
  /** 原始数据 */
  data: any;
}

/**
 * 节点数据配置
 */
export interface SimTreeNodeOptions {
  /** 整个树范围内的所有节点的 key 值不能重复且不为空 ，表示包含唯一ID的节点的属性 */
  key: string;
  /** 用于显示其内容的节点字段 */
  display: string;
  /** 子节点 */
  children: Observable<SimTreeNodeOptions[]> | SimTreeNodeOptions[] | undefined | null;
  /** 设置节点是否展开(叶子节点无效) */
  isExpanded: boolean;
  /** 设置节点本身是否选中 */
  isSelected?: boolean;
  /** 设置节点 Checkbox 是否选中 */
  isChecked?: boolean;
  /** 设置节点是否可被选中 默认：true */
  selectable: boolean;
  /** 设置是否禁用节点(不可进行任何操作) */
  disabled?: boolean;
  /** 设置节点禁用 Checkbox */
  disableCheckbox?: boolean;
  /** 可展开 */
  expandable?: boolean;
  /** 自定义数据,可通过 SimTreeNode 的 data 字段获取 */
  [key: string]: any;
}
