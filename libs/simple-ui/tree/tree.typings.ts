import { SimTreeNode } from './tree-node.model';

export interface TreeEvents<T extends SimTreeNode> {
  // 原生事件
  event: MouseEvent | DragEvent;
  // 事件名
  eventName: string;
  // 当前操作节点(拖拽时表示目标节点)
  node?: T;
  // 已选中的节点key(单击时存在)
  selectedNodes?: T[];
  // checkBox 已选中的节点key(点击 checkBox 存在)
  checkedNodes?: T[];
  // 当前选中的node集合的key
  keys?: any[];
  isExpanded?: boolean;
  isChecked?: boolean;
  to?: { parent: T; index: number };
  from?: { parent: T; index: number };
}
