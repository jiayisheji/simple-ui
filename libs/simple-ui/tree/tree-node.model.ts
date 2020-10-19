export class SimTreeNode {
  /** 一个字符串，表示包含唯一ID的节点的属性。 */
  id: string;
  /** 用于显示其内容的节点字段的值 */
  display: string;
  /** 获取父节点 */
  getParentNode: any;
  /** 子节点 */
  children: string;
  /** 展开状态 */
  isExpanded: boolean;
  /** 选中状态 */
  isSelected: boolean;
  /** 是否是叶子节点 */
  isLeaf: boolean;
  /**
   * 树中的级别(从0开始)
   *
   * 每个节点的左填充值为level * levelPadding，而不是为子节点使用默认padding。
   *
   * 也可以使用tree-node-level-X类在每个级别上进行设置padding
   */
  level: number;
  /** 是否有子节点 */
  expandable?: boolean;
  /**
   * 原始数据
   */
  data: any;
}

export interface SimTreeNodeOptions {
  /** 一个字符串，表示包含唯一ID的节点的属性。 */
  id: string;
  /** 用于显示其内容的节点字段的值 */
  display: string;
  /** 子节点 */
  children: string;
  /** 展开状态 */
  isExpanded: boolean;
  /** 选中状态 */
  isSelected: boolean;
}
