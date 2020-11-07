import { Directive, Inject, isDevMode, OnDestroy, OnInit, Optional, Self } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable, of as observableOf, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { SimSelectionDirective } from './selection.directive';

/**
 * 使元素成为选择全部切换
 *
 * 必须在父`simSelection`指令中使用。
 * 它切换与`simSelection`指令连接的所有选择切换的选择状态。
 * 如果元素实现了`ControlValueAccessor`，例如：`SimCheckbox`，指令会自动将它与`simSelection`指令提供的`selectAll`状态连接起来。
 * 如果没有，则使用`checked$`来获取已检查的状态，`indeterminate$`来获取不确定状态，`toggle()`来更改选择状态。
 */
@Directive({
  selector: '[simSelectionAll]',
  exportAs: 'simSelectionAll'
})
export class SimSelectionAllDirective<T> implements OnDestroy, OnInit {
  /**
   * 切换项的选中状态
   * - true 选择了所有值
   * - false 没有选择值
   */
  readonly checked: Observable<boolean> = this._selection.change.pipe(switchMap(() => observableOf(this._selection.isAllSelected())));

  /**
   * 切换的不确定状态
   * - true 选择了部分(而不是全部)值
   * - false 选择了所有值或根本没有选择值
   */
  readonly indeterminate: Observable<boolean> = this._selection.change.pipe(
    switchMap(() => observableOf(this._selection.isPartialSelected()))
  );

  private readonly _destroyed = new Subject<void>();

  constructor(
    @Optional() @Inject(SimSelectionDirective) private _selection: SimSelectionDirective<T>,
    @Optional() @Self() @Inject(NG_VALUE_ACCESSOR) private readonly _controlValueAccessor: ControlValueAccessor[]
  ) {}

  ngOnInit() {
    this._assertValidParentSelection();
    this._configureControlValueAccessor();
  }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }

  /**
   * 切换选择全部状态
   * @param event 单击事件，如果切换是由单击(鼠标或键盘)触发的。如果与`<input type="checkbox">`一起使用，则`indeterminate`状态必须使用该参数才能正常工作。
   */
  toggle(event?: MouseEvent) {
    // 这是需要应用指令的<input type="checkbox">复选框。为了支持`indeterminate`状态，需要阻止默认行为。
    // 还需要异步延迟，以便复选框可以显示最新的状态。
    if (event) {
      event.preventDefault();
    }

    setTimeout(() => {
      this._selection.toggleSelectAll();
    });
  }

  /** 断言父指令`simSelection`是否存在 */
  private _assertValidParentSelection() {
    if (!this._selection && isDevMode()) {
      throw Error('simSelectionAll: missing SimSelection in the parent');
    }

    if (!this._selection.multiple && isDevMode()) {
      throw Error('simSelectionAll: SimSelection must have simSelectionMultiple set to true');
    }
  }

  /**
   * 配置 ControlValueAccessor 实现
   */
  private _configureControlValueAccessor() {
    if (this._controlValueAccessor && this._controlValueAccessor.length) {
      this._controlValueAccessor[0].registerOnChange((e: unknown) => {
        if (e === true || e === false) {
          this.toggle();
        }
      });
      this.checked.pipe(takeUntil(this._destroyed)).subscribe(state => {
        this._controlValueAccessor[0].writeValue(state);
      });
    }
  }
}
