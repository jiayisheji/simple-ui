import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, NgZone, Output, Renderer2, ViewEncapsulation } from '@angular/core';
import { SimTreeNode } from './tree-node.model';
import { SimTreeComponent } from './tree.component';
import { TreeEvents } from './tree.typings';

@Component({
  selector: 'sim-tree-node',
  templateUrl: './tree-node.component.html',
  encapsulation: ViewEncapsulation.None,
  // changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sim-tree-node',
    role: 'treeitem'
  }
})
export class SimTreeNodeComponent<T extends SimTreeNode> {
  @Input() node: T;
  @Input() checkable: boolean;
  @Input() draggable: boolean;
  @Input() disableCheckbox: boolean;
  @Output() readonly nodeEvent = new EventEmitter<TreeEvents<T>>();

  get treeModel() {
    return this._tree.treeControl;
  }

  constructor(
    private _tree: SimTreeComponent<T>,
    private _elementRef: ElementRef,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  /** 选择状态点击事件 */
  onSelectChange(event: MouseEvent): void {
    event.preventDefault();
    this.treeModel.toggleSelected(this.node as any);

    const selectedNodes = this.treeModel.getSelectedNodeList();
    const keys = this.treeModel.getSelectedKeys();

    this._tree.selectChange.next({
      eventName: 'selectChange',
      node: this.node,
      event,
      keys,
      selectedNodes
    });
  }

  /** 展开收起点击事件 */
  onExpandChange(event: MouseEvent): void {
    event.preventDefault();
    if (!this.node.expandable) {
      return;
    }
    this._tree.recursive ? this.treeModel.toggleDescendants(this.node) : this.treeModel.toggle(this.node);

    this._tree.expandChange.next({
      eventName: 'expandChange',
      node: this.node,
      event,
      isExpanded: this.treeModel.isExpanded(this.node)
    });
  }

  /** 复选框点击事件 */
  onCheckboxChange(event: MouseEvent): void {
    event.stopPropagation();
    this.treeModel.toggleChecked(this.node as any);

    const checkedNodes = this.treeModel.getCheckedNodeList();
    const keys = this.treeModel.getCheckedKeys();

    this._tree.checkedChange.next({
      eventName: 'checkedChange',
      node: this.node,
      event,
      checkedNodes,
      keys,
      isChecked: this.treeModel.isChecked(this.node)
    });
  }
}
