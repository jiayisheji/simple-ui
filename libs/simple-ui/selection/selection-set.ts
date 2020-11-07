import { isDevMode, TrackByFunction } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * 维护一组选定的值。可以向选择添加或从选择中删除一个或多个值。
 */
interface TrackBySelection<T> {
  isSelected(value: SelectableWithIndex<T>): boolean;
  select(...values: SelectableWithIndex<T>[]): void;
  deselect(...values: SelectableWithIndex<T>[]): void;
  changed: Subject<SelectionChange<T>>;
}

/**
 * 带有可选`index`的可选值。当选择与`trackBy`一起使用时，`index`是必需的。
 */
export interface SelectableWithIndex<T> {
  value: T;
  index?: number;
}

/**
 * 表示选择集中的更改
 */
export interface SelectionChange<T> {
  before: SelectableWithIndex<T>[];
  after: SelectableWithIndex<T>[];
}

/**
 * 维护一组选定的项。支持选择和取消选择项目，并检查是否选择了一个值。
 * 当用`trackBy`构造时，所有的项目将通过在它们上应用`trackBy`来识别。
 * 因为`trackBy`需要传递条目的索引，所以在调用`isSelected`、`select`和`deselect`时，`index`字段应该被设置。
 */
export class SelectionSet<T> implements TrackBySelection<T> {
  private _selectionMap = new Map<T | ReturnType<TrackByFunction<T>>, SelectableWithIndex<T>>();
  changed = new Subject<SelectionChange<T>>();

  constructor(private _multiple = false, private _trackByFn?: TrackByFunction<T>) {}

  /**
   * 检查是否被选中
   * @param value
   */
  isSelected(value: SelectableWithIndex<T>): boolean {
    return this._selectionMap.has(this._getTrackedByValue(value));
  }

  /**
   * 设置选中
   * @param selects
   */
  select(...selects: SelectableWithIndex<T>[]) {
    if (!this._multiple && selects.length > 1 && isDevMode()) {
      throw Error('SelectionSet: not multiple selection');
    }

    const before = this._getCurrentSelection();

    if (!this._multiple) {
      this._selectionMap.clear();
    }

    const toSelect: SelectableWithIndex<T>[] = [];
    for (const select of selects) {
      if (this.isSelected(select)) {
        continue;
      }

      toSelect.push(select);
      this._markSelected(this._getTrackedByValue(select), select);
    }

    const after = this._getCurrentSelection();

    this.changed.next({ before, after });
  }

  /**
   * 取消选中
   * @param selects
   */
  deselect(...selects: SelectableWithIndex<T>[]) {
    if (!this._multiple && selects.length > 1 && isDevMode()) {
      throw Error('SelectionSet: not multiple selection');
    }

    const before = this._getCurrentSelection();
    const toDeselect: SelectableWithIndex<T>[] = [];

    for (const select of selects) {
      if (!this.isSelected(select)) {
        continue;
      }

      toDeselect.push(select);
      this._markDeselected(this._getTrackedByValue(select));
    }

    const after = this._getCurrentSelection();
    this.changed.next({ before, after });
  }

  private _markSelected(key: T | ReturnType<TrackByFunction<T>>, toSelect: SelectableWithIndex<T>) {
    this._selectionMap.set(key, toSelect);
  }

  private _markDeselected(key: T | ReturnType<TrackByFunction<T>>) {
    this._selectionMap.delete(key);
  }

  private _getTrackedByValue(select: SelectableWithIndex<T>) {
    if (!this._trackByFn) {
      return select.value;
    }

    if (select.index == null && isDevMode()) {
      throw Error('SelectionSet: index required when trackByFn is used.');
    }

    return this._trackByFn(select.index, select.value);
  }

  /**
   * 获取当前选中的列表
   */
  private _getCurrentSelection(): SelectableWithIndex<T>[] {
    return Array.from(this._selectionMap.values());
  }
}
