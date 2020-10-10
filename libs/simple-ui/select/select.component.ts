import { ActiveDescendantKeyManager, LiveAnnouncer } from '@angular/cdk/a11y';
import { SelectionModel } from '@angular/cdk/collections';
import { A, DOWN_ARROW, END, ENTER, hasModifierKey, HOME, LEFT_ARROW, RIGHT_ARROW, SPACE, UP_ARROW } from '@angular/cdk/keycodes';
import { CdkConnectedOverlay, ConnectedPosition, Overlay, ScrollStrategy, ViewportRuler } from '@angular/cdk/overlay';
import {
  AfterContentInit,
  Attribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  DoCheck,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Inject,
  InjectionToken,
  Input,
  isDevMode,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  QueryList,
  Self,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { toBoolean, toNumber } from '@ngx-simple/core/coercion';
import {
  CanColor,
  CanDisable,
  CanUpdateErrorState,
  ErrorStateMatcher,
  HasTabIndex,
  mixinDisabled,
  mixinErrorState,
  mixinSize,
  mixinTabIndex,
  mixinUnsubscribe,
  ThemePalette,
  ThemeSize,
  untilUnmounted
} from '@ngx-simple/core/common-behaviors';
import { InputBoolean } from '@ngx-simple/core/decorators';
import { isArray, isFunction } from '@ngx-simple/core/typeof';
import { NgClassInterface, NgStringOrTemplateRef, OnChangeType, OnTouchedType, SafeAny } from '@ngx-simple/core/types';
import { SimFormFieldComponent, SimFormFieldControl } from '@ngx-simple/simple-ui/form-field';
import {
  SimOptgroupComponent,
  SimOptionComponent,
  SimOptionSelectionChange,
  SIM_OPTION_PARENT_COMPONENT,
  _countGroupLabelsBeforeOption,
  _getOptionScrollPosition
} from '@ngx-simple/simple-ui/option';
import { SimPseudoCheckboxState } from '@ngx-simple/simple-ui/pseudo-checkbox';
import { defer, merge, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, startWith, switchMap, take, takeUntil } from 'rxjs/operators';
import { simSelectAnimations } from './select-animations';
import { SimSelectTriggerDirective } from './select.directive';

/**
 * Select可以接收的值 字符串 数字
 */
export type SelectValue = Array<string | number> | string | number;

/** 当选择值发生更改时发出的更改事件对象。 */
export class SimSelectChange<T> {
  constructor(
    /** 引用发出更改事件的select。 */
    public source: SimSelectComponent,
    /** 发出事件的select的当前值。 */
    public value: T | T[]
  ) {}
}

class SimSelectBase {
  constructor(
    public _elementRef: ElementRef,
    public _defaultErrorStateMatcher: ErrorStateMatcher,
    public _parentForm: NgForm,
    public _parentFormGroup: FormGroupDirective,
    public ngControl: NgControl
  ) {}
}

/** 注入令牌，用于在打开选择面板时确定滚动处理。 */
export const SIM_SELECT_SCROLL_STRATEGY = new InjectionToken<() => ScrollStrategy>('sim-select-scroll-strategy');

export function SIM_SELECT_SCROLL_STRATEGY_PROVIDER_FACTORY(overlay: Overlay): () => ScrollStrategy {
  return () => overlay.scrollStrategies.reposition();
}

export const SIM_SELECT_SCROLL_STRATEGY_PROVIDER = {
  provide: SIM_SELECT_SCROLL_STRATEGY,
  deps: [Overlay],
  useFactory: SIM_SELECT_SCROLL_STRATEGY_PROVIDER_FACTORY
};

const _SimSelectMixinBase = mixinUnsubscribe(mixinTabIndex(mixinSize(mixinDisabled(mixinErrorState(SimSelectBase)), 'medium')));

let nextUniqueId = 0;

@Component({
  selector: 'sim-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [simSelectAnimations.transformPanelWrap, simSelectAnimations.transformPanel],
  providers: [
    { provide: SimFormFieldControl, useExisting: SimSelectComponent },
    { provide: SIM_OPTION_PARENT_COMPONENT, useExisting: SimSelectComponent }
  ],
  host: {
    class: 'sim-select',
    role: 'listbox',
    '[attr.id]': 'id',
    '[attr.tabindex]': 'tabIndex',
    '[class.sim-select-disabled]': 'disabled',
    '[class.sim-select-invalid]': 'errorState'
  }
})
export class SimSelectComponent extends _SimSelectMixinBase
  implements
    OnChanges,
    OnInit,
    AfterContentInit,
    DoCheck,
    OnDestroy,
    ControlValueAccessor,
    CanDisable,
    CanColor,
    HasTabIndex,
    CanUpdateErrorState,
    SimFormFieldControl<SelectValue> {
  @Input() size: ThemeSize;

  @Input() disabled: boolean;

  @Input() color: ThemePalette;

  /**
   * 是否多选模式
   * 注意：初始化成功以后不能修改，简单理解这个属性时单次设置，不能动态绑定
   */
  @Input()
  get multiple(): boolean {
    return this._multiple;
  }
  set multiple(value: boolean) {
    if (this._selectionModel) {
      throw Error('Cannot change `multiple` mode of select after initialization');
    }
    this._multiple = toBoolean(value);
  }
  private _multiple: boolean;

  /** 是否只读 */
  @Input()
  @InputBoolean<SimSelectComponent, 'readonly'>()
  @HostBinding('class.sim-select-readonly')
  readonly: boolean;

  // Implemented as part of SimFormFieldControl.
  @Input()
  get value(): SelectValue {
    return this._value;
  }
  set value(newValue: SelectValue) {
    if (newValue !== this._value) {
      this.writeValue(newValue);
      this._value = newValue;
    }
  }
  private _value: SelectValue;

  // Implemented as part of SimFormFieldControl.
  @Input()
  get placeholder(): string {
    return this._placeholder;
  }
  set placeholder(value: string) {
    this._placeholder = value;
    this.stateChanges.next();
  }
  private _placeholder: string;

  // Implemented as part of SimFormFieldControl.
  @Input()
  @HostBinding('class.sim-select-required')
  get required(): boolean {
    return this._required;
  }
  set required(value: boolean) {
    this._required = toBoolean(value);
    this.stateChanges.next();
  }
  private _required: boolean;

  // Implemented as part of SimFormFieldControl.
  @Input()
  get id(): string {
    return this._id;
  }
  set id(value: string) {
    this._id = value || this._uid;
    this.stateChanges.next();
  }
  private _id: string;

  /**
   * 函数的作用是: 将选项值与所选值进行比较。
   * 第一个参数是一个选项的值。
   * 第二个是来自选择的值。
   * 返回一个布尔值。
   */
  @Input()
  get compareWith(): (o1: SafeAny, o2: SafeAny) => boolean {
    return this._compareWith;
  }
  set compareWith(fn: (o1: SafeAny, o2: SafeAny) => boolean) {
    if (isFunction(fn)) {
      throw TypeError('`compareWith` must be a function.');
    }
    this._compareWith = fn;
    if (this._selectionModel) {
      // 不同的比较器意味着选择可能会改变
      this._initializeSelection();
    }
  }
  private _compareWith: (o1: SafeAny, o2: SafeAny) => boolean = (o1: SafeAny, o2: SafeAny) => o1 === o2;

  /** 防抖 在上一次按键之后等待的毫秒数，然后将焦点移到某个项目上。 */
  @Input()
  get typeaheadDebounceInterval(): number {
    return this._typeaheadDebounceInterval;
  }
  set typeaheadDebounceInterval(value: number) {
    this._typeaheadDebounceInterval = toNumber(value);
  }
  private _typeaheadDebounceInterval: number;

  /**
   * 用于在多模式下的选择中对值进行排序的函数。
   * 遵循与Array.prototype.sort相同的逻辑。
   */
  @Input() sortComparator: (a: SimOptionComponent, b: SimOptionComponent, options: SimOptionComponent[]) => number;

  /**
   * 要传递给选择面板的class。支持与`ngClass`相同的语法
   * 注意：class要在`ViewEncapsulation.none`模式下才会生效
   */
  @Input() panelClass: NgClassInterface;

  /** 没有内容 */
  @Input() notFoundContent: NgStringOrTemplateRef = '暂无数据';

  /** 全选标签 */
  @Input() selectAllLabel: string = '全选';

  // Implemented as part of SimFormFieldControl.
  @Input() errorStateMatcher: ErrorStateMatcher;

  /** 切换选择面板时发出的事件 */
  @Output() readonly openedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  /** 打开选择时发出的事件 */
  @Output() readonly opened: Observable<void> = this.openedChange.pipe(
    filter(o => o),
    map(() => {})
  );

  /** 关闭选择时发出的事件 */
  @Output() readonly closed: Observable<void> = this.openedChange.pipe(
    filter(o => !o),
    map(() => {})
  );

  /**
   * 当用户更改所选值时发出的事件
   */
  @Output() readonly selectionChange: EventEmitter<SimSelectChange<SelectValue>> = new EventEmitter<SimSelectChange<SelectValue>>();

  /**
   * 该事件在选择的原始值发生更改时发出。这主要是为了方便"[(Value)]"输入的双向绑定
   */
  @Output() readonly valueChange: EventEmitter<SelectValue> = new EventEmitter<SelectValue>();

  /** 包含选择选项的面板 */
  @ViewChild('panel') panel: ElementRef;

  /** 触发打开select面板的DOM。 */
  @ViewChild('trigger') trigger: ElementRef<HTMLDivElement>;

  /** 包含选项的选择面板 */
  @ViewChild(CdkConnectedOverlay) overlayDir: CdkConnectedOverlay;

  /** 用户提供的触发器元素 */
  @ContentChild(SimSelectTriggerDirective)
  customTrigger: SimSelectTriggerDirective;

  /** 所有定义的选择选项 */
  @ContentChildren(SimOptionComponent, { descendants: true })
  options: QueryList<SimOptionComponent>;

  /** 所有定义的选择选项组 */
  @ContentChildren(SimOptgroupComponent, { descendants: true })
  optionGroups: QueryList<SimOptgroupComponent>;

  // Implemented as part of SimFormFieldControl.
  @HostBinding('class.sim-select-empty')
  get empty(): boolean {
    return !this._selectionModel || this._selectionModel.isEmpty();
  }

  /** 触发器的值 */
  get triggerValue(): string {
    if (this.empty) {
      return '';
    }

    if (this._multiple) {
      const selectedOptions = this._selectionModel.selected.map(option => option.viewValue);

      // 分隔符应该是可配置的，以便进行适当的本地化。
      return selectedOptions.join(', ');
    }

    return this._selectionModel.selected[0].viewValue;
  }

  /** 获取选中的项 */
  get selected(): SimOptionComponent | SimOptionComponent[] {
    return this.multiple ? this._selectionModel.selected : this._selectionModel.selected[0];
  }

  /** 获取面板主题 */
  get panelTheme(): string {
    const color = this.color || this._parentFormField;
    return color ? `sim-${color}` : '';
  }

  /** 处理选择逻辑 */
  _selectionModel: SelectionModel<SimOptionComponent>;

  /** 选择面板的 transform-origin 属性的值 */
  _transformOrigin: string = 'top';

  /**
   * 位置策略，如果不满足展示将会选择回退处理
   */
  _positions: ConnectedPosition[] = [
    {
      originX: 'start',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'top'
    },
    {
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'bottom'
    }
  ];

  /** 选择面板相对于触发器顶部开始的y偏移量。 */
  _offsetY = 0;

  /** 搜索中 */
  searching: boolean;

  // Implemented as part of ControlValueAccessor.
  _controlValueAccessorChangeFn: OnChangeType = () => {};
  // Implemented as part of ControlValueAccessor.
  _onTouched: OnTouchedType = () => {};

  // Implemented as part of SimFormFieldControl.
  get focused() {
    return this._focused || this._panelOpen;
  }
  private _focused = false;

  // Implemented as part of SimFormFieldControl.
  controlType = 'sim-select';
  // Implemented as part of SimFormFieldControl.
  autofilled = false;

  /** 在选择面板打开时将用于处理滚动的策略 */
  _scrollStrategy: ScrollStrategy;

  /** 触发器的客户端边界矩形的最后一个测量值 */
  _triggerRect: ClientRect;

  /** 当面板元素动画完成后发出 */
  _panelDoneAnimatingStream = new Subject<string>();

  /** 全选复选框的状态 */
  _selectAllState: SimPseudoCheckboxState = 'unchecked';

  /** 所有子选项的更改事件的组合流 */
  readonly optionSelectionChanges: Observable<SimOptionSelectionChange> = defer(() => {
    const options = this.options;

    if (options) {
      return options.changes.pipe(
        startWith(options),
        switchMap(() => merge(...options.map(option => option.selectionChange)))
      );
    }

    return this._ngZone.onStable.asObservable().pipe(
      take(1),
      switchMap(() => this.optionSelectionChanges)
    );
  }) as Observable<SimOptionSelectionChange>;

  /** 覆盖面板是否打开 */
  get panelOpen(): boolean {
    return this._panelOpen;
  }

  private _scrollStrategyFactory: () => ScrollStrategy;

  private _uid = `sim-select-${nextUniqueId++}`;
  private _panelOpen: boolean;

  /** 覆盖面板的滚动位置，计算以使所选选项居中 */
  private _scrollTop = 0;

  /** 滚动的索引 */
  private scrolledIndex = 0;

  /** 管理面板中选项的键盘事件 */
  private _keyManager: ActiveDescendantKeyManager<SimOptionComponent>;

  constructor(
    private _viewportRuler: ViewportRuler,
    private _changeDetector: ChangeDetectorRef,
    private _ngZone: NgZone,
    _defaultErrorStateMatcher: ErrorStateMatcher,
    elementRef: ElementRef,
    @Optional() _parentForm: NgForm,
    @Optional() _parentFormGroup: FormGroupDirective,
    @Optional() private _parentFormField: SimFormFieldComponent,
    @Self() @Optional() public ngControl: NgControl,
    @Attribute('tabindex') tabIndex: string,
    @Inject(SIM_SELECT_SCROLL_STRATEGY) scrollStrategyFactory: any,
    private _liveAnnouncer: LiveAnnouncer
  ) {
    super(elementRef, _defaultErrorStateMatcher, _parentForm, _parentFormGroup, ngControl);
    if (this.ngControl) {
      // 注意: 我们在这里提供了值访问器，而不是“providers”，以避免`into a circular`错误。
      this.ngControl.valueAccessor = this;
    }
    this._scrollStrategyFactory = scrollStrategyFactory;
    this._scrollStrategy = this._scrollStrategyFactory();
    this.tabIndex = parseInt(tabIndex, 10) || 0;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['disabled']) {
      this.stateChanges.next();
    }

    if (changes['typeaheadDebounceInterval'] && this._keyManager) {
      this._keyManager.withTypeAhead(this._typeaheadDebounceInterval);
    }
  }

  ngOnInit(): void {
    this._selectionModel = new SelectionModel<SimOptionComponent>(this.multiple);

    this._viewportRuler
      .change()
      .pipe(untilUnmounted(this))
      .subscribe(() => {
        if (this.panelOpen) {
          this._triggerRect = this.trigger.nativeElement.getBoundingClientRect();
          this._markForCheck();
        }
      });

    this.stateChanges.next();
    this._panelDoneAnimatingStream.pipe(distinctUntilChanged(), untilUnmounted(this)).subscribe(() => {
      if (this.panelOpen) {
        this._scrollTop = 0;
        this.openedChange.emit(true);
      } else {
        this.openedChange.emit(false);
        this.overlayDir.offsetX = 0;
        this._markForCheck();
      }
    });
  }

  ngDoCheck() {
    if (this.ngControl) {
      this.updateErrorState();
    }
  }

  ngAfterContentInit(): void {
    this._initKeyManager();

    this._selectionModel.changed.pipe(untilUnmounted(this)).subscribe(event => {
      event.added.forEach((option: SimOptionComponent) => option.select());
      event.removed.forEach((option: SimOptionComponent) => option.deselect());
    });

    this.options.changes.pipe(startWith(null as SimOptionComponent), untilUnmounted(this)).subscribe(() => {
      this._resetOptions();
      this._initializeSelection();
    });
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.stateChanges.complete();
  }

  // Implemented as part of ControlValueAccessor.
  writeValue(value: SelectValue) {
    if (this.options) {
      this._setSelectionByValue(value);
    }
  }

  // Implemented as part of ControlValueAccessor.
  registerOnChange(fn: OnChangeType) {
    this._controlValueAccessorChangeFn = fn;
  }

  // Implemented as part of ControlValueAccessor.
  registerOnTouched(fn: OnTouchedType) {
    this._onTouched = fn;
  }

  // Implemented as part of ControlValueAccessor.
  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
    this._markForCheck();
    this.stateChanges.next();
  }

  /** 确保从键盘激活时选择该选项 */
  @HostListener('keydown', ['$event'])
  _handleKeydown(event: KeyboardEvent): void {
    if (!this.disabled) {
      this.panelOpen ? this._handleOpenKeydown(event) : this._handleClosedKeydown(event);
    }
  }

  @HostListener('focus')
  _onFocus() {
    if (!this.disabled) {
      this._focused = true;
      this.stateChanges.next();
    }
  }

  @HostListener('blur')
  _onBlur() {
    this._focused = false;

    if (!this.disabled && !this.panelOpen) {
      this._onTouched();
      this._markForCheck();
      this.stateChanges.next();
    }
  }

  /**
   * 在附加覆盖面板时调用的回调
   */
  _onAttached(): void {
    this.overlayDir.positionChange.pipe(take(1)).subscribe(() => {
      this._changeDetector.detectChanges();
      this.panel.nativeElement.scrollTop = this._scrollTop;
    });
  }

  // Implemented as part of SimFormFieldControl.
  onContainerClick() {}

  // Implemented as part of SimFormFieldControl.
  setDescribedByIds(ids: string[]) {}

  /** 清除value */
  clearValue(event: Event) {
    event.stopPropagation();
    // 请选中的集合
    this._selectionModel.clear();
    // 更新值和状态
    this._propagateChanges();
    this.stateChanges.next();
  }

  /** 全选处理 */
  selectAll(event: Event) {
    event.stopPropagation();

    // 如果不是多选和打开 直接跳出
    if (!(this.multiple && this._panelOpen)) {
      return;
    }

    // 获取当前状态 检查是否勾选状态
    const unselected = this._selectAllState !== 'checked';

    this._selectAllState = unselected ? 'checked' : 'unchecked';

    if (unselected) {
      // 把未选中的都勾选上
      this.options.forEach(option => {
        if (!option.selected) {
          option.select();
          this._selectionModel.select(option);
        }
      });
    } else {
      // 清除所有选中状态
      this.options.forEach(option => {
        option.deselect();
        this._selectionModel.deselect(option);
      });
    }

    this._propagateChanges();
    this._keyManager.setFirstItemActive();
  }

  /** 切换覆盖面板的打开或关闭 */
  toggle(): void {
    this.panelOpen ? this.close() : this.open();
  }

  open(): void {
    if (this.disabled || this.readonly || !this.options || !this.options.length || this._panelOpen) {
      return;
    }
    this._triggerRect = this.trigger.nativeElement.getBoundingClientRect();

    this._panelOpen = true;

    this._keyManager.withHorizontalOrientation(null);
    this._calculateOverlayPosition();
    this._highlightCorrectOption();
    this.setSelectAllState();
    this._offsetY = this._triggerRect.height + 2;
    this._markForCheck();
  }

  close(): void {
    // 只有打开状态才能关闭 减少不必要调用
    if (this._panelOpen) {
      this._panelOpen = false;
      this._markForCheck();
      this._onTouched();
    }
  }

  /** 聚焦当前元素 */
  focus(options?: FocusOptions): void {
    this._elementRef.nativeElement.focus(options);
  }

  private _initializeSelection(): void {
    // 推迟设置该值
    // 以避免出现"Expression has changed after it was checked"的Angular的错误。
    Promise.resolve().then(() => {
      this._setSelectionByValue(this.ngControl ? this.ngControl.value : this._value);
      this.stateChanges.next();
    });
  }

  /** 设置按键管理器以监听覆盖面板上的键盘事件 */
  private _initKeyManager() {
    this._keyManager = new ActiveDescendantKeyManager<SimOptionComponent>(this.options)
      .withTypeAhead(this._typeaheadDebounceInterval)
      .withVerticalOrientation()
      .withAllowedModifierKeys(['shiftKey']);

    this._keyManager.tabOut.pipe(untilUnmounted(this)).subscribe(() => {
      if (this.panelOpen) {
        // 移开时选择活动项目，这与<select></select>的行为方式一致。注意，只在单选模式下执行此操作。
        if (!this.multiple && this._keyManager.activeItem) {
          this._keyManager.activeItem._selectViaInteraction();
        }

        // 关闭前将焦点恢复到触发器. 如果用户将焦点集中到浮层上，则焦点位置不会丢失。
        this.focus();
        this.close();
      }
    });

    this._keyManager.change.pipe(untilUnmounted(this)).subscribe(() => {
      if (this._panelOpen && this.panel) {
        this._scrollActiveOptionIntoView();
      } else if (!this._panelOpen && !this.multiple && this._keyManager.activeItem) {
        this._keyManager.activeItem._selectViaInteraction();
      }
    });
  }

  /**
   * 突出显示选中的项目。如果没有选择，它将突出显示第一项。
   */
  private _highlightCorrectOption() {
    if (this._keyManager) {
      if (this.empty) {
        this._keyManager.setFirstItemActive();
      } else {
        this._keyManager.setActiveItem(this._selectionModel.selected[0]);
      }
    }
  }

  /** 将活动选项滚动到视图中 */
  private _scrollActiveOptionIntoView(): void {
    const activeOptionIndex = this._keyManager.activeItemIndex || 0;
    const labelCount = _countGroupLabelsBeforeOption(activeOptionIndex, this.options, this.optionGroups);
    const all = this.multiple ? 1 : 0;
    const panel = this.panel.nativeElement;
    panel.scrollTop = _getOptionScrollPosition(activeOptionIndex + labelCount + all, this._getItemHeight(), panel.scrollTop, 256);
  }

  /** 单击选项时调用 */
  private _onSelect(option: SimOptionComponent, isUserInput: boolean): void {
    const wasSelected = this._selectionModel.isSelected(option);
    if (option.value == null && !this._multiple) {
      option.deselect();
      this._selectionModel.clear();
      this._propagateChanges(option.value);
    } else {
      if (wasSelected !== option.selected) {
        option.selected ? this._selectionModel.select(option) : this._selectionModel.deselect(option);
      }

      if (isUserInput) {
        this._keyManager.setActiveItem(option);
      }

      if (this.multiple) {
        this._sortValues();

        if (isUserInput) {
          // 如果用户用鼠标选择了该选项，我们要将焦点恢复到触发器，以便防止选择键盘控件与来自“sim-option”的对象
          this.focus();
        }
      }
    }

    if (wasSelected !== this._selectionModel.isSelected(option)) {
      this._propagateChanges();
    }

    this.stateChanges.next();
  }

  /** 发出change事件以设置模型值 */
  private _propagateChanges(fallbackValue?: SafeAny): void {
    let valueToEmit: SafeAny = null;

    if (this.multiple) {
      valueToEmit = (this.selected as SimOptionComponent[]).map(option => option.value);
    } else {
      valueToEmit = this.selected ? (this.selected as SimOptionComponent).value : fallbackValue;
    }

    this._value = valueToEmit;
    this.valueChange.emit(valueToEmit);
    this._controlValueAccessorChangeFn(valueToEmit);
    this.selectionChange.emit(new SimSelectChange(this, valueToEmit));
    this._markForCheck();
  }

  /** 根据面板中所选值的顺序对所选值进行排序 */
  private _sortValues() {
    if (this.multiple) {
      const options = this.options.toArray();

      this._selectionModel.sort((a, b) => {
        return this.sortComparator ? this.sortComparator(a, b, options) : options.indexOf(a) - options.indexOf(b);
      });
      this.stateChanges.next();
    }
  }

  /** 删除当前的选项订阅和ID并从头开始重置 */
  private _resetOptions(): void {
    const changedOrDestroyed = merge(this.options.changes, this.simUnsubscribe$);

    this.optionSelectionChanges
      .pipe(
        filter(event => event.isUserInput),
        takeUntil(changedOrDestroyed)
      )
      .subscribe(event => {
        this._onSelect(event.source, event.isUserInput);
        // 面板打开
        if (this._panelOpen) {
          if (this.multiple) {
            // 多选模式设置全选的状态
            this.setSelectAllState();
          } else {
            // 单选模式直接关闭
            this.close();
            this.focus();
          }
        }
      });

    // 监听选项内部状态的变化并做出相应的反应
    // 处理诸如所选选项的标签更改之类的情况
    merge(...this.options.map(option => option._stateChanges))
      .pipe(takeUntil(changedOrDestroyed))
      .subscribe(() => {
        this._markForCheck();
        this.stateChanges.next();
      });
  }

  private _calculateOverlayPosition(): void {
    const itemHeight = this._getItemHeight();
    const items = this._getItemCount();
    const panelHeight = Math.min(items * itemHeight, 256);
    const scrollContainerHeight = items * itemHeight;
    // 在面板触底之前可以滚动到最远的位置
    const maxScroll = scrollContainerHeight - panelHeight;
    // 如果未选择任何值，则将弹出窗口打开到第一项。
    let selectedOptionOffset = this.empty ? 0 : this._getOptionIndex(this._selectionModel.selected[0]);

    selectedOptionOffset += _countGroupLabelsBeforeOption(selectedOptionOffset, this.options, this.optionGroups);

    this._scrollTop = this._calculateOverlayScroll(selectedOptionOffset, panelHeight / 2, maxScroll);
  }

  private _calculateOverlayScroll(selectedIndex: number, scrollBuffer: number, maxScroll: number): number {
    const itemHeight = this._getItemHeight();
    const optionOffsetFromScrollTop = itemHeight * selectedIndex;
    const halfOptionHeight = itemHeight / 2;

    // 从选项 offsetFromScrollTop 开始，它会将选项滚动到滚动容器的顶部，然后减去滚动缓冲区，以便将该选项滚动到覆盖面板的中心。
    // 必须将选项高度的一半重新添加到滚动顶部，这样选项就会基于它的中间而不是顶部边缘居中。
    const optimalScrollPosition = optionOffsetFromScrollTop - scrollBuffer + halfOptionHeight;
    return Math.min(Math.max(0, optimalScrollPosition), maxScroll);
  }

  /** 获取选项列表中提供的选项的索引 */
  private _getOptionIndex(option: SimOptionComponent): number | undefined {
    return this.options.reduce((result: number | undefined, current: SimOptionComponent, index: number) => {
      if (result !== undefined) {
        return result;
      }

      return option === current ? index : undefined;
    }, undefined);
  }

  /** 计算选择项的数量。 这包括选项和组标签。 */
  private _getItemCount(): number {
    return this.options.length + this.optionGroups.length;
  }

  /** 计算选择选项的高度 */
  private _getItemHeight(): number {
    return 48;
  }

  /**
   * 根据值设置所选选项。如果无法找到具有指定值的选项，则清除select触发器。
   */
  private _setSelectionByValue(value: SelectValue) {
    // 处理多选
    if (this.multiple && value) {
      // 如果不是一个数组 抛出异常
      if (!isArray(value)) {
        throw Error('Value must be an array in multiple-selection mode.');
      }
      this._selectionModel.clear();
    } else {
      this._selectionModel.clear();

      const correspondingOption = this._selectValue(value);

      // 将焦点移到活动项目。请注意，我们不处理多选模式，因为我们不知道用户最后一次交互的选项是谁。
      if (correspondingOption) {
        this._keyManager.setActiveItem(correspondingOption);
      } else {
        // 否则重置突出显示的选项。请注意，我们只想在关闭时这样做，因为在打开时这样做会不必要地转移用户的焦点。
        this._keyManager.setActiveItem(-1);
      }
    }
    this._markForCheck();
  }

  /**
   * 查找并选择，然后根据其值进行选择
   * @returns 具有相应值的选项
   */
  private _selectValue(value: SafeAny): SimOptionComponent | undefined {
    const correspondingOption = this.options.find((option: SimOptionComponent) => {
      try {
        // 将null视为特殊的重置值
        return option.value != null && this._compareWith(option.value, value);
      } catch (error) {
        if (isDevMode()) {
          // 通知开发人员他们的比较器中的错误
          console.warn(error);
        }
        return false;
      }
    });

    if (correspondingOption) {
      this._selectionModel.select(correspondingOption);
    }

    return correspondingOption;
  }

  /** 设置全选的状态 */
  private setSelectAllState() {
    if (this.multiple) {
      const selectedCount = this._selectionModel.selected.length;
      const optionsCount = this.options.length;
      const checkState = selectedCount === optionsCount;
      if (checkState) {
        this._selectAllState = 'checked';
      } else {
        this._selectAllState = selectedCount ? 'indeterminate' : 'unchecked';
      }
    }
  }

  /** 处理选择器打开时的键盘事件 */
  private _handleOpenKeydown(event: KeyboardEvent): void {
    const manager = this._keyManager;
    // tslint:disable-next-line: deprecation
    const keyCode = event.keyCode;
    const isArrowKey = keyCode === DOWN_ARROW || keyCode === UP_ARROW;

    if (keyCode === HOME || keyCode === END) {
      event.preventDefault();
      keyCode === HOME ? manager.setFirstItemActive() : manager.setLastItemActive();
    } else if (isArrowKey && event.altKey) {
      // 关闭ALT+上箭头键的选择以匹配原生<select>
      event.preventDefault();
      this.close();
      // 如果用户正在输入，则请勿执行任何操作，
      // 因为键入序列可以包含空格键
    } else if ((keyCode === ENTER || keyCode === SPACE) && manager.activeItem && !hasModifierKey(event)) {
      event.preventDefault();
      manager.activeItem._selectViaInteraction();
    } else if (this._multiple && keyCode === A && event.ctrlKey) {
      event.preventDefault();
      const hasDeselectedOptions = this.options.some(opt => !opt.disabled && !opt.selected);

      this._selectAllState = hasDeselectedOptions ? 'checked' : 'unchecked';

      this.options.forEach(option => {
        if (!option.disabled) {
          hasDeselectedOptions ? option.select() : option.deselect();
        }
      });
    } else {
      const previouslyFocusedIndex = manager.activeItemIndex;

      manager.onKeydown(event);

      if (this._multiple && isArrowKey && event.shiftKey && manager.activeItem && manager.activeItemIndex !== previouslyFocusedIndex) {
        manager.activeItem._selectViaInteraction();
      }
    }
  }

  /** 在选择器关闭时处理键盘事件 */
  private _handleClosedKeydown(event: KeyboardEvent): void {
    // tslint:disable-next-line: deprecation
    const keyCode = event.keyCode;
    const isArrowKey = keyCode === DOWN_ARROW || keyCode === UP_ARROW || keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW;
    const isOpenKey = keyCode === ENTER || keyCode === SPACE;
    const manager = this._keyManager;

    // 打开ALT+上方向键的select以匹配本机<select>
    if ((isOpenKey && !hasModifierKey(event)) || ((this.multiple || event.altKey) && isArrowKey)) {
      event.preventDefault(); // 防止按下空格键时页面向下滚动
      this.open();
    } else if (!this.multiple) {
      const previouslySelectedOption = this.selected;

      if (keyCode === HOME || keyCode === END) {
        keyCode === HOME ? manager.setFirstItemActive() : manager.setLastItemActive();
        event.preventDefault();
      } else {
        manager.onKeydown(event);
      }

      const selectedOption = this.selected;

      // 由于值发生了变化，我们需要自己进行声明
      if (selectedOption && previouslySelectedOption !== selectedOption) {
        // 我们在直播中设置了持续时间，因为我们希望直播元素是会在一段时间后清除，以使用户无法使用箭头键导航到该位置。
        this._liveAnnouncer.announce((selectedOption as SimOptionComponent).viewValue);
      }
    }
  }

  private _markForCheck() {
    this._changeDetector.markForCheck();
  }
}
