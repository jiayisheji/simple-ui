import { FocusKeyManager } from '@angular/cdk/a11y';
import { SelectionModel } from '@angular/cdk/collections';
import { BACKSPACE } from '@angular/cdk/keycodes';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  DoCheck,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  QueryList,
  Self,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { BooleanInput, toBoolean } from '@ngx-simple/core/coercion';
import { CanUpdateErrorState, CanUpdateErrorStateCtor, ErrorStateMatcher, mixinErrorState } from '@ngx-simple/core/common-behaviors';
import { OnChangeType, OnTouchedType } from '@ngx-simple/core/types';
import { SimFormFieldControl } from '@ngx-simple/simple-ui/form-field';
import { merge, Observable, Subject, Subscription } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';
import { SimChipAnimations } from './chip-animations';
import { SimChipTextControl } from './chip-text-control';
import { SimChipComponent, SimChipEvent, SimChipSelectionChange } from './chip.component';

// 应用mixin到MatChipList的样板
/** @docs-private */
class SimChipListBase {
  constructor(
    public _defaultErrorStateMatcher: ErrorStateMatcher,
    public _parentForm: NgForm,
    public _parentFormGroup: FormGroupDirective,
    /** @docs-private */
    public ngControl: NgControl
  ) {}
}
const _SimChipListMixinBase: CanUpdateErrorStateCtor & typeof SimChipListBase = mixinErrorState(SimChipListBase);

// 递增整数，用于为芯片列表组件生成惟一id
let nextUniqueId = 0;

/** 当芯片列表值发生更改时发出的更改事件对象 */
export class SimChipListChange<T> {
  constructor(
    /** Chip list that emitted the event. */
    public source: SimChipListComponent<T>,
    /** Value of the chip list when the event was emitted. */
    public value: any
  ) {}
}

/**
 * 芯片列表组件
 */
@Component({
  selector: 'sim-chip-list',
  exportAs: 'simChipList',
  template: '<ng-content></ng-content>',
  styleUrls: ['./chip.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: SimFormFieldControl, useExisting: SimChipListComponent }],
  host: {
    class: 'sim-chip-list',
    role: 'listbox',
    '[id]': '_uid',
    '[@chipFadeMotion]': 'chips.length',
    '[attr.tabindex]': 'disabled ? null : _tabIndex',
    '[class.sim-chip-list-disabled]': 'disabled',
    '[class.sim-chip-list-invalid]': 'errorState',
    '[class.sim-chip-list-required]': 'required'
  },
  animations: [SimChipAnimations]
})
export class SimChipListComponent<T> extends _SimChipListMixinBase
  implements SimFormFieldControl<T>, ControlValueAccessor, AfterContentInit, DoCheck, OnInit, OnDestroy, CanUpdateErrorState {
  /** 兼容ivy编译 */
  static ngAcceptInputType_multiple: BooleanInput;
  static ngAcceptInputType_required: BooleanInput;
  static ngAcceptInputType_disabled: BooleanInput;
  static ngAcceptInputType_selectable: BooleanInput;

  /**
   * 这个芯片列表是否可选择的。当芯片列表不可选时，芯片列表内所有芯片的选择状态总是被忽略。
   */
  @Input()
  get selectable(): boolean {
    return this._selectable;
  }
  set selectable(value: boolean) {
    this._selectable = toBoolean(value);
    this._syncChipsSelectable();
  }
  private _selectable: boolean = false;

  /** 用户是否应该被允许选择多个芯片 */
  @Input()
  get multiple(): boolean {
    return this._multiple;
  }
  set multiple(value: boolean) {
    this._multiple = toBoolean(value);
    this._syncChipsState();
  }
  private _multiple: boolean = false;

  /**
   * Implemented as part of SimFormFieldControl.
   * @docs-private
   */
  @Input()
  get value(): T {
    return this._value;
  }
  set value(value: T) {
    this.writeValue(value);
    this._value = value;
  }
  private _value: T;

  /**
   * Implemented as part of SimFormFieldControl.
   * @docs-private
   */
  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(value: boolean) {
    this._required = toBoolean(value);
    this.stateChanges.next();
  }
  protected _required: boolean = false;

  /**
   * Implemented as part of SimFormFieldControl.
   * @docs-private
   */
  @Input()
  get placeholder(): string {
    return this._chipInput ? this._chipInput.placeholder : this._placeholder;
  }
  set placeholder(value: string) {
    this._placeholder = value;
    this.stateChanges.next();
  }
  protected _placeholder: string;

  /**
   * Implemented as part of SimFormFieldControl.
   * @docs-private
   */
  @Input()
  get disabled(): boolean {
    return this.ngControl ? !!this.ngControl.disabled : this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = toBoolean(value);
    this._syncChipsState();
  }
  protected _disabled: boolean = false;

  /**
   * 将选项值与所选值进行比较的函数。
   * - 第一个参数是选项的值
   * - 第二个是选择的值
   * - 返回一个布尔值
   */
  @Input()
  get compareWith(): (o1: any, o2: any) => boolean {
    return this._compareWith;
  }
  set compareWith(fn: (o1: any, o2: any) => boolean) {
    this._compareWith = fn;
    if (this._selectionModel) {
      // 不同的比较器意味着选择可能会改变。
      this._initializeSelection();
    }
  }
  private _compareWith = (o1: any, o2: any) => o1 === o2;

  @Input()
  set tabIndex(value: number) {
    this._userTabIndex = value;
    this._tabIndex = value;
  }

  /** 当用户更改所选芯片列表的值时发出的事件 */
  // tslint:disable-next-line: no-output-native
  @Output() readonly change: EventEmitter<SimChipListChange<T>> = new EventEmitter();

  /**
   * 每当芯片列表的原始值发生更改时发出。这里主要是为了方便`value`输入的双向绑定。
   * @docs-private
   */
  @Output() readonly valueChange: EventEmitter<T> = new EventEmitter();

  /** 包含在此芯片列表中的芯片组件 */
  @ContentChildren(SimChipComponent, {
    descendants: true
  })
  chips: QueryList<SimChipComponent<T>>;

  /** 芯片列表的Uid */
  _uid: string = `sim-chip-list-${nextUniqueId++}`;

  /**
   * Implemented as part of SimFormFieldControl.
   * @docs-private
   */
  get id(): string {
    return this._chipInput ? this._chipInput.id : this._uid;
  }

  /** 是否任何芯片或simChipInput内部的这个芯片列表有焦点 */
  get focused(): boolean {
    return (this._chipInput && this._chipInput.focused) || this._hasFocusedChip();
  }

  /**
   * Implemented as part of SimFormFieldControl.
   * @docs-private
   */
  get empty(): boolean {
    return (!this._chipInput || this._chipInput.empty) && (!this.chips || this.chips.length === 0);
  }

  /**
   * Implemented as part of SimFormFieldControl.
   * @docs-private
   */
  controlType = 'sim-chip-list';

  /**
   * Implemented as part of SimFormFieldControl.
   * @docs-private
   */
  get shouldLabelFloat(): boolean {
    return !this.empty || this.focused;
  }

  /** 芯片列表中所选芯片的数组 */
  get selected(): SimChipComponent<T>[] | SimChipComponent<T> {
    return this.multiple ? this._selectionModel.selected : this._selectionModel.selected[0];
  }

  /** 芯片列表的tabindex */
  _tabIndex = 0;

  /**
   * 用户定义tabindex
   * 当不为空时，使用用户定义的tabindex。否则使用_tabIndex
   */
  _userTabIndex: number | null = null;

  /** 处理焦点的 FocusKeyManager */
  _keyManager: FocusKeyManager<SimChipComponent<T>>;

  // Implemented as part of ControlValueAccessor.
  _controlValueAccessorChangeFn: OnChangeType = () => {};
  // Implemented as part of ControlValueAccessor.
  _onTouched: OnTouchedType = () => {};

  /** 合并所有子芯片的选择变化事件的组合流 */
  get chipSelectionChanges(): Observable<SimChipSelectionChange<T>> {
    return merge(...this.chips.map(chip => chip.selectionChange));
  }

  /** 合并所有子芯片的聚焦变化事件的组合流 */
  get chipFocusChanges(): Observable<SimChipEvent<T>> {
    return merge(...this.chips.map(chip => chip._onFocus));
  }

  /** 合并所有子芯片的失焦变化事件的组合流 */
  get chipBlurChanges(): Observable<SimChipEvent<T>> {
    return merge(...this.chips.map(chip => chip._onBlur));
  }

  /** 合并所有子芯片的移除更改事件的组合流 */
  get chipRemoveChanges(): Observable<SimChipEvent<T>> {
    return merge(...this.chips.map(chip => chip.destroyed));
  }

  /**
   * 当芯片被销毁时，我们存储被销毁芯片的索引，直到芯片查询列表通知更新。
   * 这是必要的，因为我们不能确定一个适当的芯片应该接收焦点，直到芯片阵列更新完全。
   */
  private _lastDestroyedChipIndex: number | null = null;

  private _selectionModel: SelectionModel<SimChipComponent<T>>;

  private _chipInput: SimChipTextControl;

  /** 当组件被销毁时发送 */
  private _destroyed = new Subject<void>();

  /** 订阅聚焦于芯片的变化 */
  private _chipFocusSubscription: Subscription | null;

  /** 订阅芯片的失焦变化 */
  private _chipBlurSubscription: Subscription | null;

  /** 订阅芯片的选择变化 */
  private _chipSelectionSubscription: Subscription | null;

  /** 订阅删除芯片中的更改 */
  private _chipRemoveSubscription: Subscription | null;

  constructor(
    protected _elementRef: ElementRef<HTMLElement>,
    private _changeDetectorRef: ChangeDetectorRef,
    @Optional() _parentForm: NgForm,
    @Optional() _parentFormGroup: FormGroupDirective,
    _defaultErrorStateMatcher: ErrorStateMatcher,
    /** @docs-private */
    @Optional() @Self() public ngControl: NgControl
  ) {
    super(_defaultErrorStateMatcher, _parentForm, _parentFormGroup, ngControl);
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit(): void {
    this._selectionModel = new SelectionModel<SimChipComponent<T>>(this.multiple, undefined, false);
    this.stateChanges.next();
  }

  ngAfterContentInit() {
    this._keyManager = new FocusKeyManager<SimChipComponent<T>>(this.chips).withWrap().withVerticalOrientation().withHomeAndEnd();

    this._keyManager.tabOut.pipe(takeUntil(this._destroyed)).subscribe(() => {
      this._allowFocusEscape();
    });

    this._syncChipsSelectable();
    // 当列表更改时，重新订阅
    this.chips.changes.pipe(startWith(null as void), takeUntil(this._destroyed)).subscribe(() => {
      if (this.disabled) {
        // 因为这是在内容被选中之后发生的，所以我们需要将其推迟到下一个事件循环。
        Promise.resolve().then(() => {
          this._syncChipsState();
        });
      }

      this._resetChips();

      // 重置已选/未选芯片状态
      this._initializeSelection();

      // 检查我们是否需要更新我们的标签索引
      this._updateTabIndex();

      // 检查一下是否有销毁的芯片需要重新聚焦
      this._updateFocusForDestroyedChips();

      this.stateChanges.next();
    });
  }

  ngDoCheck() {
    if (this.ngControl) {
      // 我们需要在每一个变更检测周期中重新评估这一点，因为有一些我们无法订阅的错误触发器(例如父表单提交)。
      // 这意味着，无论这里的逻辑是什么，都必须非常精简，否则我们就有可能破坏性能。
      this.updateErrorState();

      if (this.ngControl.disabled !== this._disabled) {
        this.disabled = !!this.ngControl.disabled;
      }
    }
  }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
    this.stateChanges.complete();

    this._dropSubscriptions();
  }

  // Implemented as part of ControlValueAccessor.
  writeValue(value: any): void {
    if (this.chips) {
      this._setSelectionByValue(value, false);
    }
  }

  // Implemented as part of ControlValueAccessor.
  registerOnChange(fn: (value: any) => void): void {
    this._controlValueAccessorChangeFn = fn;
  }

  // Implemented as part of ControlValueAccessor.
  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  // Implemented as part of ControlValueAccessor.
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.stateChanges.next();
  }

  /**
   * Implemented as part of SimFormFieldControl.
   * @docs-private
   */
  setDescribedByIds(ids: string[]) {}

  /**
   * Implemented as part of SimFormFieldControl.
   * @docs-private
   */
  onContainerClick(event: MouseEvent) {
    if (!this._originatesFromChip(event)) {
      this.focus();
    }
  }

  /** 将事件传递给键盘管理器 */
  @HostListener('keydown', ['$event'])
  _keydown(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;

    // 如果他们是在一个空的input和按退格，焦点最后的芯片
    // tslint:disable-next-line: deprecation
    if (event.keyCode === BACKSPACE && this._isInputEmpty(target)) {
      this._keyManager.setLastItemActive();
      event.preventDefault();
    } else if (target && target.classList.contains('sim-chip')) {
      this._keyManager.onKeydown(event);
      this.stateChanges.next();
    }
  }

  /** 允许编程聚焦芯片 */
  @HostListener('focus', [])
  focus(options?: FocusOptions): void {
    if (this.disabled) {
      return;
    }

    // 如果在芯片列表中没有芯片输入，则聚焦第一个元素
    if (this._chipInput && this._chipInput.focused) {
      // 暂时什么都不做
    } else if (this.chips.length > 0) {
      this._keyManager.setFirstItemActive();
      this.stateChanges.next();
    } else {
      this._focusInput(options);
      this.stateChanges.next();
    }
  }

  /** 当失去焦点时，当焦点移到芯片列表外时，将字段标记为touched。 */
  @HostListener('blur', [])
  _blur(): void {
    if (!this._hasFocusedChip()) {
      this._keyManager.setActiveItem(-1);
    }

    if (!this.disabled) {
      if (this._chipInput) {
        // 如果有芯片输入，我们应该检查焦点是否移动到芯片输入。
        // 如果焦点没有移动到芯片输入，将字段标记为触摸。如果焦点移到芯片输入处，什么也不要做。
        // 需要延迟异步来等待芯片输入上的focus()事件触发。
        setTimeout(() => {
          if (!this.focused) {
            this._markAsTouched();
          }
        });
      } else {
        // 如果没有芯片输入，则将字段标记为touched
        this._markAsTouched();
      }
    }
  }

  /** 如果我们有一个输入，尝试集中注意力 */
  _focusInput(options?: FocusOptions) {
    if (this._chipInput) {
      this._chipInput.focus(options);
    }
  }

  /** 将字段标记为touched */
  _markAsTouched() {
    this._onTouched();
    this._changeDetectorRef.markForCheck();
    this.stateChanges.next();
  }

  /** 将一个input元素与这个芯片列表关联 */
  registerInput(inputElement: SimChipTextControl): void {
    this._chipInput = inputElement;

    // 我们使用这个属性来匹配芯片列表和它在测试用例中的输入。
    // 在这里直接设置属性，以避免 "changed after checked" 错误.
    this._elementRef.nativeElement.setAttribute('data-sim-chip-input', inputElement.id);
  }

  /**
   * 从芯片列表中移除`tabindex`，然后将其重新设置，允许用户从它中退出。
   * 这将防止列表捕获焦点并将其重定向回第一个芯片，从而在用户试图离开时创建一个焦点捕获。
   */
  _allowFocusEscape() {
    if (this._tabIndex !== -1) {
      this._tabIndex = -1;

      setTimeout(() => {
        this._tabIndex = this._userTabIndex || 0;
        this._changeDetectorRef.markForCheck();
      });
    }
  }

  _setSelectionByValue(value: any, isUserInput: boolean = true) {
    this._clearSelection();
    this.chips.forEach(chip => chip.deselect());

    if (Array.isArray(value)) {
      value.forEach(currentValue => this._selectValue(currentValue, isUserInput));
      this._sortValues();
    } else {
      const correspondingChip = this._selectValue(value, isUserInput);

      // 将焦点移到活动项目。
      // 请注意，我们不应该在多种模式下执行此操作，因为我们不知道用户最后与哪个芯片进行了交互。
      if (correspondingChip) {
        if (isUserInput) {
          this._keyManager.setActiveItem(correspondingChip);
        }
      }
    }
  }

  /** 检查事件是否来自芯片元素内部 */
  private _originatesFromChip(event: Event): boolean {
    let currentElement = event.target as HTMLElement | null;

    while (currentElement && currentElement !== this._elementRef.nativeElement) {
      if (currentElement.classList.contains('sim-chip')) {
        return true;
      }

      currentElement = currentElement.parentElement;
    }

    return false;
  }

  private _resetChips() {
    this._dropSubscriptions();
    this._listenToChipsFocus();
    this._listenToChipsSelection();
    this._listenToChipsRemoved();
  }

  /** 在每个芯片上侦听用户生成的选择事件 */
  private _listenToChipsSelection(): void {
    this._chipSelectionSubscription = this.chipSelectionChanges.subscribe(event => {
      event.source.selected ? this._selectionModel.select(event.source) : this._selectionModel.deselect(event.source);

      // 对于单个选择芯片列表，确保未选择的值未被选中
      if (!this.multiple) {
        this.chips.forEach(chip => {
          if (!this._selectionModel.isSelected(chip) && chip.selected) {
            chip.deselect();
          }
        });
      }

      if (event.isUserInput) {
        this._propagateChanges();
      }
    });
  }

  /** 在每个芯片上侦听用户生成的焦点事件 */
  private _listenToChipsFocus(): void {
    this._chipFocusSubscription = this.chipFocusChanges.subscribe(event => {
      const chipIndex: number = this.chips.toArray().indexOf(event.chip);

      if (this._isValidIndex(chipIndex)) {
        this._keyManager.updateActiveItem(chipIndex);
      }
      this.stateChanges.next();
    });

    this._chipBlurSubscription = this.chipBlurChanges.subscribe(() => {
      this._blur();
      this.stateChanges.next();
    });
  }

  private _listenToChipsRemoved(): void {
    this._chipRemoveSubscription = this.chipRemoveChanges.subscribe(event => {
      const chip = event.chip;
      const chipIndex = this.chips.toArray().indexOf(event.chip);

      // 如果要删除的芯片目前是焦点，我们临时存储索引，以便能够确定将接收焦点的适当的兄弟芯片。
      if (this._isValidIndex(chipIndex) && chip._hasFocus) {
        this._lastDestroyedChipIndex = chipIndex;
      }
    });
  }

  private _dropSubscriptions() {
    if (this._chipFocusSubscription) {
      this._chipFocusSubscription.unsubscribe();
      this._chipFocusSubscription = null;
    }

    if (this._chipBlurSubscription) {
      this._chipBlurSubscription.unsubscribe();
      this._chipBlurSubscription = null;
    }

    if (this._chipSelectionSubscription) {
      this._chipSelectionSubscription.unsubscribe();
      this._chipSelectionSubscription = null;
    }

    if (this._chipRemoveSubscription) {
      this._chipRemoveSubscription.unsubscribe();
      this._chipRemoveSubscription = null;
    }
  }

  /** 发出更改事件来设置模型值 */
  private _propagateChanges(fallbackValue?: any): void {
    let valueToEmit: any = null;

    if (Array.isArray(this.selected)) {
      valueToEmit = this.selected.map(chip => chip.value);
    } else {
      valueToEmit = this.selected ? this.selected.value : fallbackValue;
    }
    this._value = valueToEmit;
    this.change.emit(new SimChipListChange(this, valueToEmit));
    this.valueChange.emit(valueToEmit);
    this._controlValueAccessorChangeFn(valueToEmit);
    this._changeDetectorRef.markForCheck();
  }

  /**
   * 实用程序以确保所有tabindex都是有效的
   *
   * @param index 要检查的tabindex值
   * @returns 如果tabindex对我们的芯片列表有效，则为true
   */
  private _isValidIndex(index: number): boolean {
    return index >= 0 && index < this.chips.length;
  }

  /**
   * 检查tabindex，因为不允许对空列表进行聚焦。
   */
  private _updateTabIndex(): void {
    // 如果我们有0个芯片，我们不应该允许键盘焦点
    this._tabIndex = this._userTabIndex || (this.chips.length === 0 ? -1 : 0);
  }

  /**
   * 如果芯片的数量发生了变化，我们需要更新密钥管理器状态并聚焦下一个最近的芯片。
   */
  protected _updateFocusForDestroyedChips() {
    // 将焦点移到最近的芯片上。如果没有其他芯片，关注芯片列表本身。
    if (this._lastDestroyedChipIndex != null) {
      if (this.chips.length) {
        const newChipIndex = Math.min(this._lastDestroyedChipIndex, this.chips.length - 1);
        this._keyManager.setActiveItem(newChipIndex);
      } else {
        this.focus();
      }
    }

    this._lastDestroyedChipIndex = null;
  }

  /**
   * 对模型值进行排序，确保它们保持与面板中相同的顺序。
   */
  private _sortValues(): void {
    if (this._multiple) {
      this._selectionModel.clear();

      this.chips.forEach(chip => {
        if (chip.selected) {
          this._selectionModel.select(chip);
        }
      });
      this.stateChanges.next();
    }
  }

  /**
   * 根据芯片的值查找并选择芯片
   * @returns 具有相应值的芯片
   */
  private _selectValue(value: any, isUserInput: boolean = true): SimChipComponent<T> | undefined {
    const correspondingChip = this.chips.find(chip => {
      return chip.value != null && this._compareWith(chip.value, value);
    });

    if (correspondingChip) {
      isUserInput ? correspondingChip.selectViaInteraction() : correspondingChip.select();
      this._selectionModel.select(correspondingChip);
    }

    return correspondingChip;
  }

  /**
   * 检查input的值是否为空
   */
  private _isInputEmpty(element: HTMLElement): boolean {
    if (element && element.nodeName.toLowerCase() === 'input') {
      return !(element as HTMLInputElement).value;
    }

    return false;
  }

  /** 检查是否有芯片被聚焦 */
  private _hasFocusedChip(): boolean {
    return this.chips && this.chips.some(chip => chip._hasFocus);
  }

  /** 初始化选择 */
  private _initializeSelection(): void {
    // 延迟该值的设置，以避免Angular给出的“Expression has changed after it was checked”错误。
    Promise.resolve().then(() => {
      if (this.ngControl || this._value) {
        this._setSelectionByValue(this.ngControl ? this.ngControl.value : this._value, false);
        this.stateChanges.next();
      }
    });
  }

  /**
   * 取消选择列表中的每一个芯片
   * @param skip 跳过不应该被取消选中的芯片
   */
  private _clearSelection(skip?: SimChipComponent<T>): void {
    this._selectionModel.clear();
    this.chips.forEach(chip => {
      if (chip !== skip) {
        chip.deselect();
      }
    });
    this.stateChanges.next();
  }

  /** 将列表的状态与各个芯片同步 */
  private _syncChipsState() {
    if (this.chips) {
      this.chips.forEach(chip => {
        chip._chipListDisabled = this._disabled;
        chip._chipListMultiple = this.multiple;
      });
    }
  }

  private _syncChipsSelectable() {
    if (this.chips) {
      this.chips.forEach(chip => {
        chip.selectable = this.selectable;
      });
    }
  }
}
