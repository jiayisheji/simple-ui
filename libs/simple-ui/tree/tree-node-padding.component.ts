import { ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, ViewEncapsulation } from '@angular/core';
import { NumberInput, toNumber } from '@ngx-simple/core/coercion';
import { Subject } from 'rxjs';
import { SimTreeNodeComponent } from './tree-node.component';
import { SimTreeNode } from './tree-node.model';
import { SimTreeComponent } from './tree.component';

/** 用于在其CSS单位上拆分字符串的正则表达式 */
const cssUnitPattern = /([A-Za-z%]+)$/;

@Component({
  selector: 'sim-tree-node-padding',
  template: '',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sim-tree-padding'
  }
})
export class SimTreeNodePaddingComponent<T extends SimTreeNode> implements OnDestroy {
  /** 应用于元素的当前填充值。用于避免不必要地击中DOM。 */
  private _currentPadding: string | null;

  /** 当组件被销毁时发射的物体 */
  private _destroyed = new Subject<void>();

  /** 用于缩进值的CSS单位 */
  indentUnits = 'px';

  /**
   * 树节点的深度级别。
   * padding = `${level * indent}px`。
   */
  @Input()
  get level(): number {
    return this._level;
  }
  set level(value: number) {
    this._setLevelInput(value);
  }
  _level: number;

  /**
   * 每个级别的缩进。可以是数字或CSS字符串。
   * @default 24。
   */
  @Input()
  get indent(): number | string {
    return this._indent;
  }
  set indent(indent: number | string) {
    this._setIndentInput(indent);
  }
  _indent: number = 24;

  constructor(private _treeNode: SimTreeNodeComponent<T>, private _tree: SimTreeComponent<T>, private _element: ElementRef<HTMLElement>) {
    this._setPadding();
  }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }

  /** 树节点的填充缩进值。如果不为空，返回px值的字符串。 */
  _paddingIndent(): string | null {
    const nodeLevel = this._treeNode.node && this._tree.treeControl.getLevel ? this._tree.treeControl.getLevel(this._treeNode.node) : null;
    const level = this._level == null ? nodeLevel : this._level;
    return typeof level === 'number' ? `${level * this._indent}${this.indentUnits}` : null;
  }

  _setPadding(forceChange = false) {
    const padding = this._paddingIndent();

    if (padding !== this._currentPadding || forceChange) {
      const element = this._element.nativeElement;
      element.style.paddingLeft = padding || '';
      this._currentPadding = padding;
    }
  }

  protected _setLevelInput(value: number) {
    this._level = toNumber(value, null);
    this._setPadding();
  }

  protected _setIndentInput(indent: number | string) {
    let value = indent;
    let units = 'px';

    if (typeof indent === 'string') {
      const parts = indent.split(cssUnitPattern);
      value = parts[0];
      units = parts[1] || units;
    }

    this.indentUnits = units;
    this._indent = toNumber(value);
    this._setPadding();
  }

  static ngAcceptInputType_level: NumberInput;
}
