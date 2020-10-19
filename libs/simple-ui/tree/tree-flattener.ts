import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { SimTreeControl } from './tree-control';
import { SimTreeDefaultTransformer, SimTreeTransformer } from './tree-transformer';

export class TreeFlatNode<T> {
  key: string | number;
  display: string;
  level: number;
  expandable: boolean;
  data: T;
}

export class SimTreeFlattener<T, F> {
  /** 从嵌套节点映射到扁平节点。这有助于我们保持相同的对象进行选择 */
  private nestedNodeMap = new Map<T, F>();
  /** 从平面节点映射到嵌套节点。这有助于我们找到要修改的嵌套节点 */
  private flatNodeMap = new Map<F, T>();

  isExpandable: (node: T) => boolean;

  getChildren: (node: T) => Observable<T[]> | T[] | undefined | null;

  getKey: (node: T) => string | number;

  getDisplay: (node: T) => string;

  constructor(transformer: SimTreeTransformer<T> = new SimTreeDefaultTransformer<T>()) {
    this.isExpandable = transformer.isExpandable;
    this.getChildren = transformer.getChildren;
    this.getKey = transformer.getKey;
    this.getDisplay = transformer.getDisplay;
  }

  /**
   * 将节点类型T的列表扁平化为节点F的扁平化版本。
   * 请注意，类型T可能是嵌套的，“structuredData”的长度可能与返回列表“F[]”的长度不同。
   * @param structuredData 结构数据
   * @returns 扁平数据
   */
  flattenNodes(structuredData: T[]): F[] {
    const resultNodes: F[] = [];
    structuredData.forEach(node => this._flattenNode(node, 0, resultNodes, []));
    return resultNodes;
  }

  /**
   * 以当前展开状态展开扁平节点。返回的列表可能有不同的长度。
   */
  expandFlattenedNodes(nodes: F[], treeControl: SimTreeControl<F>): F[] {
    const results: F[] = [];
    const currentExpand: boolean[] = [];
    currentExpand[0] = true;

    nodes.forEach(node => {
      let expand = true;
      for (let i = 0; i <= this._getLevel(node); i++) {
        expand = expand && currentExpand[i];
      }
      if (expand) {
        results.push(node);
      }
      if (this._getExpandable(node)) {
        currentExpand[this._getLevel(node) + 1] = treeControl.isExpanded(node);
      }
    });
    return results;
  }

  /** 获取给定数据节点的深度，返回级别序号 */
  private _getLevel(node: F): number {
    return (node as F & { level: number }).level;
  }

  /** 获取给定数据节点的深度，返回级别序号 */
  private _getExpandable(node: F): boolean {
    return (node as F & { expandable: boolean }).expandable;
  }

  /**
   * 转换嵌套节点到平面节点。在映射中记录节点，以便以后使用。
   * @param node 节点
   * @param level 等级
   */
  private _transformer(node: T, level: number): F {
    const key = this.getKey(node);
    const existingNode = (this.nestedNodeMap.get(node) as unknown) as TreeFlatNode<T>;
    const flatNode = existingNode && existingNode.key === key ? existingNode : new TreeFlatNode<T>();
    flatNode.display = this.getDisplay(node);
    flatNode.key = key;
    flatNode.level = level;
    flatNode.expandable = this.isExpandable(node);
    flatNode.data = node;
    this.flatNodeMap.set((flatNode as unknown) as F, node);
    this.nestedNodeMap.set(node, (flatNode as unknown) as F);
    return (flatNode as unknown) as F;
  }

  /**
   * 摊平节点
   */
  private _flattenNode(node: T, level: number, resultNodes: F[], parentMap: boolean[]): F[] {
    const flatNode = this._transformer(node, level);
    resultNodes.push(flatNode);
    if (this._getExpandable(flatNode)) {
      const childrenNodes = this.getChildren(node);
      if (childrenNodes) {
        if (Array.isArray(childrenNodes)) {
          this._flattenChildren(childrenNodes, level, resultNodes, parentMap);
        } else {
          childrenNodes.pipe(take(1)).subscribe(children => {
            this._flattenChildren(children, level, resultNodes, parentMap);
          });
        }
      }
    }
    return resultNodes;
  }

  /**
   * 摊平子节点
   */
  private _flattenChildren(children: T[], level: number, resultNodes: F[], parentMap: boolean[]): void {
    children.forEach((child, index) => {
      const childParentMap: boolean[] = parentMap.slice();
      childParentMap.push(index !== children.length - 1);
      this._flattenNode(child, level + 1, resultNodes, childParentMap);
    });
  }
}
