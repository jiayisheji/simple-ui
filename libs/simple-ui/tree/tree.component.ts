import { DataSource, isDataSource } from '@angular/cdk/collections';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  isDevMode,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  TrackByFunction,
  ViewEncapsulation
} from '@angular/core';
import { toBoolean } from '@ngx-simple/core/coercion';
import { Observable, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SimTreeAnimations } from './tree-animations';
import { SimTreeControl } from './tree-control';
import { SimTreeNode } from './tree-node.model';
import { TreeEvents } from './tree.typings';

@Component({
  selector: 'sim-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default,
  host: {
    class: 'sim-tree sim-primary',
    role: 'tree'
  },
  animations: [SimTreeAnimations]
})
export class SimTreeComponent<T extends SimTreeNode> implements OnChanges, OnInit, OnDestroy {
  /**
   * 提供包含要呈现的最新数据数组的流。受树的视图流窗口(屏幕上当前的数据阳极)的影响。
   * 数据源可以是一个可观察的数据数组，也可以是要呈现的数据数组。
   */
  @Input()
  get dataSource(): DataSource<T> | Observable<T[]> | T[] {
    return this._dataSource;
  }
  set dataSource(dataSource: DataSource<T> | Observable<T[]> | T[]) {
    if (this._dataSource !== dataSource) {
      if (this._dataSource && typeof (this._dataSource as DataSource<T>).disconnect === 'function') {
        (this.dataSource as DataSource<T>).disconnect(null);
      }

      if (this._dataSubscription) {
        this._dataSubscription.unsubscribe();
        this._dataSubscription = null;
      }

      this._dataSource = dataSource;

      if (isDataSource(this._dataSource)) {
        this._dataSubscription = this._dataSource
          .connect(null)
          .pipe(takeUntil(this._destroyed$))
          .subscribe(data => {
            this._flattenNodes = data;
          });
      }
    }
  }
  private _dataSource: DataSource<T> | Observable<T[]> | T[];

  /**
   * 是否多选模式
   * 注意：初始化成功以后不能修改，简单理解这个属性时单次设置，不能动态绑定
   */
  @Input()
  get multiple(): boolean {
    return this._multiple;
  }
  set multiple(value: boolean) {
    this._multiple = toBoolean(value);
  }
  private _multiple: boolean = false;

  /** `*ngFor`的`trackBy` */
  @Input()
  get trackBy(): TrackByFunction<T> {
    return this._trackByFn;
  }
  set trackBy(fn: TrackByFunction<T>) {
    if (isDevMode() && fn != null && typeof fn !== 'function' && <any>console && <any>console.warn) {
      console.warn(`trackBy must be a function, but received ${JSON.stringify(fn)}.`);
    }
    this._trackByFn = fn;
  }
  private _trackByFn: TrackByFunction<T>;

  /** 虚拟滚动的总高度 */
  @Input() virtualHeight: string;

  /**
   * 虚拟滚动时每一列的高度
   * cdk itemSize @see https://material.angular.io/cdk/scrolling/api
   * @default 28
   */
  @Input() virtualItemSize: number = 28;
  /**
   * 缓冲区最大像素高度
   * cdk maxBufferPx @see https://material.angular.io/cdk/scrolling/api
   * @default 500
   */
  @Input() virtualMaxBufferPx: number = 500;
  /**
   * 缓冲区最小像素高度，低于该值时将加载新结构
   * cdk minBufferPx @see https://material.angular.io/cdk/scrolling/api
   * @default 28
   */
  @Input() virtualMinBufferPx: number = 28;

  /** 是否递归展开/折叠节点 */
  @Input()
  get recursive(): boolean {
    return this._recursive;
  }
  set recursive(value: boolean) {
    this._recursive = toBoolean(value);
  }
  protected _recursive = false;

  /** 节点前添加 Checkbox 复选框 */
  @Input()
  get checkable(): boolean {
    return this._checkable;
  }
  set checkable(value: boolean) {
    this._checkable = toBoolean(value);
  }
  private _checkable = false;

  /** 设置节点是否可被选中 */
  @Input()
  get selectable(): boolean {
    return this._selectable;
  }
  set selectable(value: boolean) {
    const selectable = toBoolean(value);
    if (this._selectable !== selectable) {
      this._selectable = selectable;
      this.treeControl.setSelectMode(this.multiple, selectable);
    }
  }
  private _selectable = true;

  /** 是否支持节点拖拽 */
  @Input()
  get draggable(): boolean {
    return this._draggable;
  }
  set draggable(value: boolean) {
    this._draggable = toBoolean(value);
  }
  private _draggable = false;

  /** 树控件。它在单个数据节点上具有基本的切换/展开/折叠等操作 */
  @Input() treeControl: SimTreeControl<T>;

  /** 订阅事件 */
  /** 点击节点 expander 触发事件发送 */
  @Output() expandChange: EventEmitter<TreeEvents<T>> = new EventEmitter();
  /** 点击节点内容触发事件发生 */
  @Output() selectChange: EventEmitter<TreeEvents<T>> = new EventEmitter();
  /** 点击节点 checkBox 触发事件发生 */
  @Output() checkedChange: EventEmitter<TreeEvents<T>> = new EventEmitter();

  /** 呈现的数据数组 */
  _flattenNodes: T[] | readonly T[] = [];

  /** 数据订阅 */
  private _dataSubscription: Subscription | null;

  /** 当组件被销毁时发送的主题 */
  private _destroyed$ = new Subject<void>();

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnInit(): void {
    // treeControl 是必须存在，如果不存在强制抛出异常
    if (!this.treeControl) {
      throw Error(`SimTree: No provider found for SimTreeControl. You must binding one @Input() of the treeControl`);
    }
    this.treeControl.setSelectMode(this.multiple, this.selectable);
  }

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
    if (this._dataSource && typeof (this._dataSource as DataSource<T>).disconnect === 'function') {
      (this.dataSource as DataSource<T>).disconnect(null);
    }

    if (this._dataSubscription) {
      this._dataSubscription.unsubscribe();
      this._dataSubscription = null;
    }
  }
}
