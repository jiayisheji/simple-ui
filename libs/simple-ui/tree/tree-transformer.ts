import { Observable } from 'rxjs';

interface TreeTransformerNode<T> {
  key: string | number;
  display: string;
  children: Observable<T[]> | T[] | undefined | null;
  expandable: boolean;
}

export abstract class SimTreeTransformer<T> {
  /**
   * 获取id，一个字符串或者数字，表示包含唯一ID的节点的属性
   */
  abstract getKey(node: T): string | number;
  /**
   * 获取显示内容，用于显示其内容的节点字段的值
   */
  abstract getDisplay(node: T): string;
  /**
   * 获取子元素，用于递归子元素
   */
  abstract getChildren(node: T): Observable<T[]> | T[] | undefined | null;
  /**
   * 是否有子元素，如果存在标识节点，不存在标识叶子
   */
  abstract isExpandable(node: T): boolean;
}

export class SimTreeDefaultTransformer<T> extends SimTreeTransformer<T> {
  /**
   * 获取key，一个字符串或者数字，表示包含唯一ID的节点的属性
   */
  getKey(node: T & TreeTransformerNode<T>): string | number {
    return node.key;
  }
  /**
   * 获取显示内容，用于显示其内容的节点字段的值
   */
  getDisplay(node: T & TreeTransformerNode<T>): string {
    return node.display;
  }
  /**
   * 获取子元素，用于递归子元素
   */
  getChildren(node: T & TreeTransformerNode<T>): Observable<T[]> | T[] | undefined | null {
    return node.children;
  }
  /**
   * 是否有子元素，如果存在标识节点，不存在标识叶子
   */
  isExpandable(node: T & TreeTransformerNode<T>): boolean {
    return !!(node.children as T[])?.length;
  }
}
