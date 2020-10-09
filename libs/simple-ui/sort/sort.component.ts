import { FocusMonitor } from '@angular/cdk/a11y';
import { ENTER, SPACE } from '@angular/cdk/keycodes';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  isDevMode,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { CanDisable, HasInitialized, mixinDisabled, mixinInitialized } from '@ngx-simple/core/common-behaviors';
import { InputBoolean } from '@ngx-simple/core/decorators';
import { merge, Subject, Subscription } from 'rxjs';

/**  */
export type SortDirection = 'asc' | 'desc' | '';

export interface SimSortable {
  /** 正在排序的列的id */
  id: string;

  /** 开始排序方向 */
  start: SortDirection;

  /** 是否禁用清除排序状态 */
  disableClear: boolean;
}

/** 当前排序状态 */
export interface SimSortChange {
  /** 正在排序的列的id */
  active: string;

  /** 正在排序的方向 */
  direction: SortDirection;
  /**
   * 正在排序的方向值
   * - asc => 1
   * - desc => -1
   * - '' => 0
   */
  sort: number;
}

const _SimSortMixinBase = mixinInitialized(mixinDisabled(class {}));

const SORTABLE = {
  asc: 1,
  desc: -1
};

@Directive({
  selector: '[simSort], [sim-sort]',
  exportAs: 'simSort',
  host: {
    class: 'sim-sort'
  }
})
export class SimSortDirective extends _SimSortMixinBase implements CanDisable, HasInitialized, OnChanges, OnInit, OnDestroy {
  // tslint:disable-next-line: no-input-rename
  @Input('simSortDisabled') disabled: boolean;

  /** 最近排序的id是SimSortable */
  @Input() simSortActive: string;

  /** 当 SimSortable 初始排序时要设置的方向。可能会被 SimSortable 的排序开始所覆盖。 */
  @Input() simSortStart: 'asc' | 'desc' = 'asc';

  /** 当前活跃的 SimSortable 的排序方向。 */
  @Input()
  get simSortDirection(): SortDirection {
    return this._simSortDirection;
  }
  set simSortDirection(direction: SortDirection) {
    if (isDevMode() && direction && direction !== 'asc' && direction !== 'desc') {
      throw Error(`${direction} is not a valid sort direction ('asc' or 'desc').`);
    }
    this._simSortDirection = direction;
  }
  private _simSortDirection: SortDirection = '';

  /**
   * 是否禁用用户通过完成排序方向循环清除排序。可能被 SimSortable 的禁用清除输入覆盖。
   */
  @Input()
  @InputBoolean<SimSortDirective, 'simSortDisableClear'>()
  simSortDisableClear: boolean;

  /** 用户更改活跃排序或排序方向时发出的事件。 */
  // tslint:disable-next-line: no-output-rename
  @Output('simSortChange') readonly sortChange: EventEmitter<SimSortChange> = new EventEmitter<SimSortChange>();

  /** 此指令管理的所有注册排序表的集合。 */
  sortableMap = new Map<string, SimSortable>();

  /** 用于通知侦听状态更改的任何子组件 */
  readonly _stateChanges = new Subject<void>();

  ngOnInit() {
    this.markInitialized();
  }

  ngOnChanges() {
    this._stateChanges.next();
  }

  ngOnDestroy() {
    this._stateChanges.complete();
  }

  /**
   * 所包含的 SimSortable 使用的寄存器函数。将 SimSortable 添加到 SimSortableMap 中。
   */
  register(sortable: SimSortable): void {
    const { id } = sortable;
    if (!id) {
      throw Error(`SimSortHeader must be provided with a unique id.`);
    }

    if (this.sortableMap.has(id)) {
      throw Error(`Cannot have two with the same id (${id}).`);
    }
    this.sortableMap.set(id, sortable);
  }

  /**
   * 取消被包含的 SimSortable 使用的注册函数。从包含的 SimSortableMap 中删除 SimSortable 。
   */
  deregister(sortable: SimSortable): void {
    this.sortableMap.delete(sortable.id);
  }

  /** 设置活跃排序id并确定新的排序方向 */
  sort(sortable: SimSortable): void {
    if (this.simSortActive !== sortable.id) {
      this.simSortActive = sortable.id;
      this.simSortDirection = sortable.start ? sortable.start : this.simSortStart;
    } else {
      this.simSortDirection = this.getNextSortDirection(sortable);
    }

    this.sortChange.emit({ active: this.simSortActive, direction: this.simSortDirection, sort: SORTABLE[this.simSortDirection] || 0 });
  }

  /** 返回活跃可排序表的下一个排序方向，检查是否可能覆盖。 */
  getNextSortDirection(sortable: SimSortable): SortDirection | '' {
    if (!sortable) {
      return '';
    }

    // 获取具有潜在可排序覆盖的排序方向循环。
    const disableClear = sortable.disableClear != null ? sortable.disableClear : this.simSortDisableClear;
    const sortDirectionCycle = getSortDirectionCycle(sortable.start || this.simSortStart, disableClear);

    // 在循环中获取并返回下一个方向
    let nextDirectionIndex = sortDirectionCycle.indexOf(this.simSortDirection) + 1;
    if (nextDirectionIndex >= sortDirectionCycle.length) {
      nextDirectionIndex = 0;
    }
    return sortDirectionCycle[nextDirectionIndex];
  }
}

/**
 * 返回排序方向循环使用给定的顺序和清晰参数
 * @param start
 * @param disableClear
 */
function getSortDirectionCycle(start: 'asc' | 'desc', disableClear: boolean): SortDirection[] {
  const sortOrder: SortDirection[] = ['asc', 'desc'];
  if (start === 'desc') {
    sortOrder.reverse();
  }
  if (!disableClear) {
    sortOrder.push('');
  }

  return sortOrder;
}

const _SimSortHeaderMixinBase = mixinDisabled(class {});

interface SimSortHeaderColumnDef {
  name: string;
}

@Component({
  selector: '[sim-sort-header]',
  templateUrl: './sort.component.html',
  styleUrls: ['./sort.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sim-sort-header',
    '[class.sim-sort-header-disabled]': '_isDisabled()'
  }
})
export class SimSortComponent extends _SimSortHeaderMixinBase implements OnInit, AfterViewInit, OnDestroy, SimSortable, CanDisable {
  // tslint:disable-next-line: no-input-rename
  @Input('sim-sort-header') id: string;

  /** 重写此SimSortable的包含SimSort的排序起始值 */
  @Input() start: 'asc' | 'desc';

  @Input() disabled: boolean;

  @Input()
  @InputBoolean<SimSortComponent, 'disableClear'>()
  disableClear: boolean;

  /** 设置排序时显示的箭头的位置 */
  @Input() arrowPosition: 'before' | 'after' = 'after';

  /** 根据当前状态，箭头应该面对的方向。 */
  _arrowDirection: SortDirection = '';

  private _rerenderSubscription: Subscription;

  constructor(
    @Optional() public _sort: SimSortDirective,

    @Inject('SiM_SORT_HEADER_COLUMN_DEF')
    @Optional()
    public _columnDef: SimSortHeaderColumnDef,
    private _focusMonitor: FocusMonitor,
    private _elementRef: ElementRef<HTMLElement>,
    changeDetectorRef: ChangeDetectorRef
  ) {
    super();

    if (!_sort) {
      throw Error(`SimSortHeader must be placed within a parent element with the SimSort directive.`);
    }
    this._rerenderSubscription = merge(_sort.sortChange, _sort._stateChanges).subscribe(() => {
      if (this._isSorted()) {
        this._updateArrowDirection();
      }
      changeDetectorRef.markForCheck();
    });
  }

  ngOnInit(): void {
    if (!this.id && this._columnDef) {
      this.id = this._columnDef.name;
    }
    // 初始化箭头的方向，并将视图状态立即设置为该状态。
    this._updateArrowDirection();
    // 初始化箭头的方向，并将视图状态立即设置为该状态。
    this._sort.register(this);
  }

  ngAfterViewInit() {
    // 我们使用焦点监视器，因为我们还希望根据焦点原点来设计不同的样式。
    this._focusMonitor.monitor(this._elementRef, true).subscribe(origin => this._setIndicatorHintVisible(!!origin));
  }

  ngOnDestroy() {
    this._focusMonitor.stopMonitoring(this._elementRef);
    this._sort.deregister(this);
    this._rerenderSubscription.unsubscribe();
  }

  @HostListener('click')
  _handleClick() {
    if (!this._isDisabled()) {
      this._toggleOnInteraction();
    }
  }

  @HostListener('keydown', ['$event'])
  _handleKeydown(event: KeyboardEvent) {
    // tslint:disable-next-line: deprecation
    if (!this._isDisabled() && (event.keyCode === SPACE || event.keyCode === ENTER)) {
      event.preventDefault();
      this._toggleOnInteraction();
    }
  }

  /** 设置“hint”状态，使箭头作为提示半透明地显示给用户，显示活动排序将变成什么。如果设置为false，箭头将淡出。 */
  _setIndicatorHintVisible(visible: boolean) {
    // No-op(如果排序头被禁用)-不应该使提示可见。
    if (this._isDisabled() && visible) {
      return;
    }

    if (!this._isSorted()) {
      this._updateArrowDirection();
    }
  }

  /** 更新箭头应该指向的方向。如果没有排序，箭头应该面向开始的方向。否则，如果它是排序，箭头应该指向当前活动排序的方向。 */
  private _updateArrowDirection() {
    this._arrowDirection = this._isSorted() ? this._sort.simSortDirection : this.start || (this._sort.simSortStart === 'asc' && '');
  }

  /** 此SimSortHeader当前是否按升序或降序排序 */
  private _isSorted() {
    const { simSortActive, simSortDirection } = this._sort;
    return simSortActive === this.id && (simSortDirection === 'asc' || simSortDirection === 'desc');
  }

  /** 切换排序状态 */
  private _toggleOnInteraction() {
    this._sort.sort(this);
    this._arrowDirection = this._sort.simSortDirection;
  }

  /** 排序头内部的箭头是否应该被呈现 */
  private _isDisabled() {
    return this._sort.disabled || this.disabled;
  }
}
