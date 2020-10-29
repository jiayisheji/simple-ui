import { SelectionModel } from '@angular/cdk/collections';
import { SimTreeNode } from './tree-node.model';

export class SimTreeControl<T, K = T> {
  /** 为`expandAll`操作保存的树节点数据 */
  dataNodes: T[];

  /** 一种多选择跟踪扩展状态的选择模型 */
  expansionModel: SelectionModel<K> = new SelectionModel<K>(true);

  /** 一种选择跟踪selected状态的选择模型 支持单/多选 */
  private selectionModel: SelectionModel<K>;

  /** tree的checkbox的选中状态的选择模型 */
  private checklistModel: SelectionModel<K> = new SelectionModel<K>(true);

  /** 选择模式 */
  private _multiple: boolean;

  /**
   * 初始化节点状态
   * - isChecked 复选框状态
   * - isSelected 节点选中状态
   * - isExpanded 节点展开状态
   */
  setNodeInitState() {
    const nodes = this.dataNodes;
    const checkedList = [];
    const selectedList = [];
    const expandedList = [];
    for (let index = 0; index < nodes.length; index++) {
      const node = (nodes[index] as unknown) as SimTreeNode;
      if (node.isChecked) {
        checkedList.push(node.key);
      }
      if (node.selectable && node.isSelected) {
        selectedList.push(node.key);
      }
      if (node.expandable && node.isExpanded) {
        expandedList.push(node.key);
      }
    }
    if (checkedList.length) {
      this.setCheckedKeys(checkedList);
    }
    if (selectedList.length) {
      this.setSelectedKeys(selectedList);
    }
    if (expandedList.length) {
      this.setExpandedKeys(expandedList);
    }
  }

  /** 设置 checkBox 被选中的节点的key列表 */
  setCheckedKeys(keys: K[]) {
    keys.forEach(key => {
      const node = this.getNodeByKey(key);
      if (node != null) {
        this.toggleChecked(node);
      }
    });
  }

  /** 设置节点被选中的节点的key列表 */
  setSelectedKeys(keys: K[]) {
    if (!this.selectionModel) {
      this.setSelectMode(false, true);
    }
    keys.forEach(key => {
      const node = this.getNodeByKey(key);
      if (node != null) {
        this.toggleSelected(node);
      }
    });
  }
  /** 设置节点展开的节点的key列表 */
  setExpandedKeys(keys: K[]) {
    keys.forEach(key => {
      const node = this.getNodeByKey(key);
      if (node != null) {
        this.toggle(node);
      }
    });
  }

  /**
   * 设置选择模式
   * @throws 设置以后之前的选中状态全部丢失，请慎重操作
   * @param multiple 节点是否多选
   * @param selectable 节点是否可被选中
   */
  setSelectMode(multiple: boolean, selectable: boolean = true) {
    this._multiple = multiple;
    if (selectable) {
      const selected = this.selectionModel?.selected ?? [];
      this.selectionModel = new SelectionModel(multiple, multiple ? selected : [selected.pop()]);
    } else {
      this.selectionModel = null;
    }
  }

  /** 按 key 获取 TreeNode 节点 */
  getNodeByKey(key: K): T | null {
    return this.dataNodes.find((node: T) => this._trackByValue(node) === key);
  }

  /** 获取组件被选中的节点集合 */
  getSelectedNodeList(): T[] {
    if (this.selectionModel) {
      return this.selectionModel.selected.map(id => this.getNodeByKey(id));
    }
    return [];
  }

  /** 获取组件被选中的节点集合key */
  getSelectedKeys(): K[] {
    if (this.selectionModel) {
      return this.selectionModel.selected;
    }
    return [];
  }

  /** 获取组件 checkBox 被点击选中的节点集合 */
  getCheckedNodeList(): T[] {
    return this.checklistModel.selected.map(id => this.getNodeByKey(id));
  }

  /** 获取组件 checkBox 被点击半选中的节点集合 */
  getIndeterminateNodeList(): T[] {
    const indeterminateness = [];
    const selected = this.checklistModel.selected;
    for (let i = 0; i <= selected.length - 1; i++) {
      let parentNode = this.getParentNode(this.getNodeByKey(selected[i]));
      /** 检查父级是否存在 */
      while (parentNode != null) {
        // 父节点去重
        if (indeterminateness.indexOf(parentNode) === -1 && !this.checklistModel.isSelected(this._trackByValue(parentNode))) {
          indeterminateness.push(parentNode);
        }
        // 递归查找当前父节点
        parentNode = this.getParentNode(parentNode);
      }
    }
    return indeterminateness;
  }

  /** 获取组件 checkBox 被点击选中的节点集合key */
  getCheckedKeys(): K[] {
    return this.checklistModel.selected;
  }

  /* 获取派生数据节点的父节点 */
  getParentNode(node: T): T | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  /**
   * 获取派生数据节点的数据节点子树的列表。
   */
  getDescendants(dataNode: T): T[] {
    const startIndex = this.dataNodes.indexOf(dataNode);
    const results: T[] = [];

    // 遍历`dataNodes`数组中的扁平化树节点，并获取所有后代。树节点的后代级别必须大于给定树节点的级别。
    // 如果我们到达一个与树节点同级相同的节点，我们就到达了一个兄弟节点。
    // 如果我们到达的节点的级别大于树节点的级别，我们就到达了祖先的兄弟节点。
    for (let i = startIndex + 1; i < this.dataNodes.length && this.getLevel(dataNode) < this.getLevel(this.dataNodes[i]); i++) {
      results.push(this.dataNodes[i]);
    }
    return results;
  }

  /** 切换单个数据节点的扩展/折叠状态 */
  toggle(dataNode: T): void {
    this.expansionModel.toggle(this._trackByValue(dataNode));
  }

  /** 展开单个数据节点 */
  expand(dataNode: T): void {
    this.expansionModel.select(this._trackByValue(dataNode));
  }

  /** 折叠单个数据节点 */
  collapse(dataNode: T): void {
    this.expansionModel.deselect(this._trackByValue(dataNode));
  }

  /** 给定数据节点是否展开。如果数据节点展开，则返回true。 */
  isExpanded(dataNode: T): boolean {
    return this.expansionModel.isSelected(this._trackByValue(dataNode));
  }

  /**
   * 展开树中的所有数据节点
   */
  expandAll(): void {
    this.expansionModel.select(...this.dataNodes.map(node => this._trackByValue(node)));
  }

  /** 折叠树中的所有数据 */
  collapseAll(): void {
    this.expansionModel.clear();
  }

  /** 递归地切换以`node`为根的子树 */
  toggleDescendants(dataNode: T): void {
    this.expansionModel.isSelected(this._trackByValue(dataNode)) ? this.collapseDescendants(dataNode) : this.expandDescendants(dataNode);
  }

  /** 递归展开以给定数据节点为根的子树 */
  expandDescendants(dataNode: T): void {
    const toBeProcessed = [dataNode];
    toBeProcessed.push(...this.getDescendants(dataNode));
    this.expansionModel.select(...toBeProcessed.map(value => this._trackByValue(value)));
  }

  /** 递归地折叠以给定数据节点为根的子树 */
  collapseDescendants(dataNode: T): void {
    const toBeProcessed = [dataNode];
    toBeProcessed.push(...this.getDescendants(dataNode));
    this.expansionModel.deselect(...toBeProcessed.map(value => this._trackByValue(value)));
  }

  /** 给定数据节点是否选中。如果数据节点选中，则返回true。 */
  isSelected(dataNode: T): boolean {
    if (this.selectionModel) {
      return this.selectionModel.isSelected(this._trackByValue(dataNode));
    }
    return false;
  }

  /** 切换单个数据节点的选中状态 */
  toggleSelected(dataNode: T): void {
    if (this.selectionModel) {
      this.selectionModel.toggle(this._trackByValue(dataNode));
    }
  }

  /** 给定数据节点是否选中。如果数据节点选中，则返回true。 */
  isChecked(dataNode: T): boolean {
    if (this.isExpandable(dataNode)) {
      return this.descendantsAllSelected(dataNode);
    }
    return this.checklistModel.isSelected(this._trackByValue(dataNode));
  }

  /** 给定数据节点是否半选中。如果数据节点半选中，则返回true。 */
  isIndeterminate(dataNode: T) {
    if (this.isExpandable(dataNode)) {
      return this.descendantsPartiallySelected(dataNode);
    }
    return false;
  }

  /**
   * 切换节点Checked状态。选择/取消选择所有的后代节点
   */
  toggleChecked(dataNode: T): void {
    this.checklistModel.toggle(this._trackByValue(dataNode));
    // 如果是节点需要更新所有的后代节点
    if (this.isExpandable(dataNode)) {
      const descendants = this.getDescendants(dataNode);
      descendants.forEach(child => {
        this.checklistModel.isSelected(this._trackByValue(dataNode))
          ? this.checklistModel.select(this._trackByValue(child))
          : this.checklistModel.deselect(this._trackByValue(child));
      });
      // 强制更新父组件
      descendants.forEach(child => this.checklistModel.isSelected(this._trackByValue(child)));
    }
    this.checkAllParentsSelection(dataNode);
  }

  /* 当一个叶节点被选中/取消选中时，检查所有父节点 */
  checkAllParentsSelection(dataNode: T): void {
    let parent: T | null = this.getParentNode(dataNode);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** 检查根节点的检查状态并相应地更改它 */
  checkRootNodeSelection(dataNode: T): void {
    const nodeSelected = this.checklistModel.isSelected(this._trackByValue(dataNode));
    const descendants = this.getDescendants(dataNode);
    const descAllSelected =
      descendants.length > 0 &&
      descendants.every(child => {
        return this.checklistModel.isSelected(this._trackByValue(child));
      });
    if (nodeSelected && !descAllSelected) {
      this.checklistModel.deselect(this._trackByValue(dataNode));
    } else if (!nodeSelected && descAllSelected) {
      this.checklistModel.select(this._trackByValue(dataNode));
    }
  }

  /** 是否选择节点的所有后代 */
  descendantsAllSelected(node: T): boolean {
    const descendants = this.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 &&
      descendants.every(child => {
        return this.checklistModel.isSelected(this._trackByValue(child)) || ((child as unknown) as SimTreeNode).disableCheckbox;
      });
    return descAllSelected;
  }

  /** 是否有部分后代被选中 */
  descendantsPartiallySelected(node: T): boolean {
    const descendants = this.getDescendants(node);
    const result = descendants.some(child => this.checklistModel.isSelected(this._trackByValue(child)));
    return result && !this.descendantsAllSelected(node);
  }

  /** 是否有子元素，如果存在标识节点，不存在标识叶子 */
  isExpandable(node: T): boolean {
    return (node as T & { expandable: boolean }).expandable;
  }

  /** 获取给定数据节点的深度，返回级别序号 */
  getLevel(node: T): number {
    return (node as T & { level: number }).level;
  }

  /**
   * 返回一个标识符，在dataNode的引用发生变化时，根据该标识符跟踪dataNode。
   *
   * 类似于`*ngFor`的`trackBy`
   */
  private _trackByValue(value: T): K {
    return (value as T & { key: K }).key;
  }
}
