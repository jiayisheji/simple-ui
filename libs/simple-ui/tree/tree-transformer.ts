import { Observable } from 'rxjs';
import { SimTreeNodeOptions } from './tree-node.model';

export class SimTreeTransformer<T extends SimTreeNodeOptions> {
  /**
   * 获取key，一个字符串或者数字，表示包含唯一ID的节点的属性
   */
  getKey(node: T): string {
    return node.key;
  }
  /**
   * 获取显示内容，用于显示其内容的节点字段的值
   */
  getDisplay(node: T): string {
    return node.display;
  }
  /**
   * 获取子元素，用于递归子元素
   */
  getChildren(node: T): Observable<T[]> | T[] | undefined | null {
    return node.children as Observable<T[]> | T[] | undefined | null;
  }
  /**
   * 是否有子元素，如果存在标识节点，不存在标识叶子
   */
  isExpandable(node: T): boolean {
    return !!(node.children as T[])?.length;
  }
  /**
   * 设置节点是否可被选中 默认：true
   */
  getSelectable(node: T): boolean {
    return node.selectable;
  }
  /**
   * 设置是否禁用节点(不可进行任何操作)
   */
  getDisabled(node: T): boolean {
    return node.disabled;
  }
  /**
   * 设置节点 Checkbox 是否选中
   */
  getIsChecked(node: T): boolean {
    return node.isChecked;
  }

  /**
   * 设置节点本身是否选中
   */
  getIsSelected(node: T): boolean {
    return node.isSelected;
  }
  /**
   * 设置节点是否展开(叶子节点无效)
   */
  getIsExpanded(node: T): boolean {
    return node.isExpanded;
  }

  /**
   * 设置节点禁用 Checkbox
   */
  getDisableCheckbox(node: T): boolean {
    return node.disableCheckbox;
  }
}
