import { Directive, Inject, Input, isDevMode, OnDestroy, OnInit, Optional, Self } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NumberInput, toNumber } from '@ngx-simple/core/coercion';
import { Observable, of, Subject } from 'rxjs';
import { distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';
import { SimSelectionDirective } from './selection.directive';

/**
 * 使元素成为选择切换项
 *
 * 必须在父`simSelection`指令中使用。
 * 必须提供的值。如果在`simSelection`上使用`trackBy`，则值的索引是必需的。
 * 如果元素实现了`ControlValueAccessor`，例如：`SimCheckbox`,该指令自动将其与`simSelection`指令提供的选择状态连接。
 * 如果没有，使用`checked$`来获取值的检查状态，使用`toggle()`来更改选择状态。
 */
@Directive({
  selector: '[simSelectionToggle]',
  exportAs: 'simSelectionToggle'
})
export class SimSelectionToggleDirective<T> implements OnDestroy, OnInit {
  static ngAcceptInputType_index: NumberInput;

  /** 与切换关联的值 */
  @Input('simSelectionToggleValue') value: T;

  /** 列表中值的索引。与trackBy一起使用时需要 */
  @Input('simSelectionToggleIndex')
  get index(): number | undefined {
    return this._index;
  }
  set index(index: number | undefined) {
    this._index = toNumber(index);
  }
  protected _index?: number;

  /** 选择项的选中状态 */
  readonly checked: Observable<boolean> = this._selection.change.pipe(
    switchMap(() => of(this._isSelected())),
    distinctUntilChanged()
  );

  /** 当指令被销毁时发出 */
  private _destroyed = new Subject<void>();

  constructor(
    @Optional() @Inject(SimSelectionDirective) private _selection: SimSelectionDirective<T>,
    @Optional() @Self() @Inject(NG_VALUE_ACCESSOR) private _controlValueAccessors: ControlValueAccessor[]
  ) {}

  ngOnInit() {
    this._assertValidParentSelection();
    this._configureControlValueAccessor();
  }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }

  /** 切换选择 */
  toggle() {
    this._selection.toggleSelection(this.value, this.index);
  }

  /** 断言父指令`simSelection`是否存在 */
  private _assertValidParentSelection() {
    if (!this._selection && isDevMode()) {
      throw Error('SimSelectionToggle: missing SimSelection in the parent');
    }
  }

  /**
   * 配置 ControlValueAccessor 实现
   */
  private _configureControlValueAccessor() {
    if (this._controlValueAccessors && this._controlValueAccessors.length) {
      this._controlValueAccessors[0].registerOnChange((e: unknown) => {
        if (typeof e === 'boolean') {
          this.toggle();
        }
      });

      this.checked.pipe(takeUntil(this._destroyed)).subscribe(state => {
        this._controlValueAccessors[0].writeValue(state);
      });
    }
  }

  /**
   * 是否选中
   */
  private _isSelected(): boolean {
    return this._selection.isSelected(this.value, this.index);
  }
}
