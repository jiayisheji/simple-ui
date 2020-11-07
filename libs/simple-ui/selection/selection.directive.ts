import { CollectionViewer, DataSource, isDataSource, ListRange } from '@angular/cdk/collections';
import { AfterContentChecked, Directive, EventEmitter, Input, isDevMode, OnDestroy, OnInit, Output, TrackByFunction } from '@angular/core';
import { BooleanInput, toBoolean } from '@ngx-simple/core/coercion';
import { Observable, of, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SelectableWithIndex, SelectionSet } from './selection-set';

class SelectionChange<T> {}

type SelectAllState = 'all' | 'none' | 'partial';
type TableDataSource<T> = DataSource<T> | Observable<ReadonlyArray<T> | T[]> | ReadonlyArray<T> | T[];

/**
 * 管理项目的选择状态，并提供检查和更新选择状态的方法。
 * 如果应用了`simSelectionToggle`、`simSelectAll`、`simRowSelection`和`simSelectionColumn`，则必须将其应用于父元素。
 */
@Directive({
  selector: '[simSelection]',
  exportAs: 'simSelection'
})
export class SimSelectionDirective<T> implements OnInit, AfterContentChecked, OnDestroy, CollectionViewer {
  static ngAcceptInputType_multiple: BooleanInput;

  /** 是否支持多选择 */
  @Input('simSelectionMultiple')
  get multiple(): boolean {
    return this._multiple;
  }
  set multiple(multiple: boolean) {
    this._multiple = toBoolean(multiple);
  }
  private _multiple: boolean;

  /** 选择更改时发出 */
  // tslint:disable-next-line: no-output-rename
  @Output('simSelectionChange') change = new EventEmitter<SelectionChange<T>>();

  viewChange: Observable<ListRange>;

  @Input()
  get dataSource(): TableDataSource<T> {
    return this._dataSource;
  }
  set dataSource(dataSource: TableDataSource<T>) {
    if (this._dataSource !== dataSource) {
      this._switchDataSource(dataSource);
    }
  }
  private _dataSource: TableDataSource<T>;

  @Input() trackBy: TrackByFunction<T>;

  /** 数据源提供的最新数据 */
  private _data: T[] | readonly T[];

  /** 侦听数据源提供的数据的订阅  */
  private _renderChangeSubscription: Subscription | null;

  private _destroyed = new Subject<void>();

  private _selection: SelectionSet<T>;

  private _switchDataSource(dataSource: TableDataSource<T>) {
    this._data = [];

    if (isDataSource(this._dataSource)) {
      this._dataSource.disconnect(this);
    }

    if (this._renderChangeSubscription) {
      this._renderChangeSubscription.unsubscribe();
      this._renderChangeSubscription = null;
    }

    this._dataSource = dataSource;
  }

  private _observeRenderChanges() {
    if (!this._dataSource) {
      return;
    }

    let dataStream: Observable<T[] | ReadonlyArray<T>> | undefined;

    if (isDataSource(this._dataSource)) {
      dataStream = this._dataSource.connect(this);
    } else if (this._dataSource instanceof Observable) {
      dataStream = this._dataSource;
    } else if (Array.isArray(this._dataSource)) {
      dataStream = of(this._dataSource);
    }

    if (dataStream == null && isDevMode()) {
      throw Error('Unknown data source');
    }

    this._renderChangeSubscription = dataStream.pipe(takeUntil(this._destroyed)).subscribe(data => {
      this._data = data || [];
    });
  }

  ngOnInit() {
    this._selection = new SelectionSet<T>(this._multiple, this.trackBy);
    this._selection.changed.pipe(takeUntil(this._destroyed)).subscribe(change => {
      this._updateSelectAllState();
      this.change.emit(change);
    });
  }

  ngAfterContentChecked() {
    if (this._dataSource && !this._renderChangeSubscription) {
      this._observeRenderChanges();
    }
  }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();

    if (isDataSource(this._dataSource)) {
      this._dataSource.disconnect(this);
    }
  }

  /** 切换给定值的选择。如果使用“trackBy”，则需要使用“index” */
  toggleSelection(value: T, index?: number) {
    if (this.trackBy && index == null && isDevMode()) {
      throw Error('SimSelection: index required when trackBy is used');
    }

    if (this.isSelected(value, index)) {
      this._selection.deselect({ value, index });
    } else {
      this._selection.select({ value, index });
    }
  }

  /**
   * 切换选择所有。如果没有选择值，则选择所有值。如果选择了所有值或部分值，取消选择所有值。
   */
  toggleSelectAll() {
    if (!this._multiple && isDevMode()) {
      throw Error('SimSelection: multiple selection not enabled');
    }

    if (this.selectAllState === 'none') {
      this._selectAll();
    } else {
      this._clearAll();
    }
  }

  /** 检查是否选择了某个值。如果使用“trackBy”，则需要使用“index”。 */
  isSelected(value: T, index?: number) {
    if (this.trackBy && index == null && isDevMode()) {
      throw Error('SimSelection: index required when trackBy is used');
    }

    return this._selection.isSelected({ value, index });
  }

  /** 检查是否选择了所有值 */
  isAllSelected(): boolean {
    return this._data.every((value, index) => this._selection.isSelected({ value, index }));
  }

  /** 检查是否部分选中 */
  isPartialSelected(): boolean {
    return !this.isAllSelected() && this._data.some((value, index) => this._selection.isSelected({ value, index }));
  }

  /** 全部选中 */
  private _selectAll() {
    const toSelect: SelectableWithIndex<T>[] = [];

    let index = -1;
    const length = this._data.length;

    while (++index < length) {
      const value = this._data[index];
      toSelect.push({ value, index });
    }

    this._selection.select(...toSelect);
  }

  /** 清除全部选中 */
  private _clearAll() {
    const toDeselect: SelectableWithIndex<T>[] = [];

    let index = -1;
    const length = this._data.length;

    while (++index < length) {
      const value = this._data[index];
      toDeselect.push({ value, index });
    }

    this._selection.deselect(...toDeselect);
  }

  /** 更新全选状态 */
  private _updateSelectAllState() {
    if (this.isAllSelected()) {
      this.selectAllState = 'all';
    } else if (this.isPartialSelected()) {
      this.selectAllState = 'partial';
    } else {
      this.selectAllState = 'none';
    }
  }

  /**
   * 全选状态
   * - all 全选
   * - partial 部分选
   * - none 不选
   */
  selectAllState: SelectAllState = 'none';
}
