import { FocusMonitor } from '@angular/cdk/a11y';
import { SelectionModel } from '@angular/cdk/collections';
import {
  AfterContentInit,
  AfterViewInit,
  Attribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  Directive,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  HostListener,
  Inject,
  InjectionToken,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  QueryList,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { toBoolean } from '@ngx-simple/simple-ui/core/coercion';
import { mixinColor, MixinElementRefBase, mixinSize, ThemePalette, ThemeSize } from '@ngx-simple/simple-ui/core/common-behaviors';
import { InputBoolean } from '@ngx-simple/simple-ui/core/decorators';
import { isArray } from '@ngx-simple/simple-ui/core/typeof';
import { OnChangeType, OnTouchedType, SafeAny } from '@ngx-simple/simple-ui/core/types';

export class SimButtonToggleChange<T> {
  constructor(
    /** 发出事件的 SatButtonToggle */
    public source: SimButtonToggleComponent<T>,

    /** 分配给 SatButtonToggle 的值 */
    public value: T
  ) {}
}

export type SimButtonToggleAppearance = 'standard' | 'outline';

export interface SimButtonToggleDefaultOptions {
  appearance?: SimButtonToggleAppearance;
}

/**
 * 注入令牌，可用于配置应用程序中所有切换按钮的默认选项。
 */
export const SIM_BUTTON_TOGGLE_DEFAULT_OPTIONS = new InjectionToken<SimButtonToggleDefaultOptions>('SIM_BUTTON_TOGGLE_DEFAULT_OPTIONS');

let _uniqueIdCounter = 0;

@Directive({
  selector: 'sim-button-toggle-group',
  exportAs: 'simButtonToggleGroup',
  host: {
    class: 'sim-button-toggle-group',
    role: 'group'
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SimButtonToggleGroupDirective),
      multi: true
    }
  ]
})
export class SimButtonToggleGroupDirective<T> implements ControlValueAccessor, OnInit, AfterContentInit {
  /** 切换组是否多选模式 */
  @Input()
  @InputBoolean<SimButtonToggleGroupDirective<T>, 'multiple'>()
  @HostBinding('class.sim-button-toggle-group-multiple')
  multiple: boolean;

  /** 切换组是否垂直显示 */
  @Input()
  @InputBoolean<SimButtonToggleGroupDirective<T>, 'vertical'>()
  @HostBinding('class.sim-button-toggle-group-vertical')
  vertical: boolean;

  /** 切换组 html name */
  @Input()
  get name(): string {
    return this._name;
  }
  set name(value: string) {
    this._name = value;

    if (this._buttonToggles) {
      this._buttonToggles.forEach(toggle => {
        toggle.name = this._name;
        toggle._markForCheck();
      });
    }
  }
  private _name = `sim-button-toggle-group-${_uniqueIdCounter++}`;

  /** 切换组是否禁用 */
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = toBoolean(value);

    if (this._buttonToggles) {
      this._buttonToggles.forEach(toggle => toggle._markForCheck());
    }
  }
  private _disabled: boolean;

  /** 切换组传递给切换按钮外观 */
  @Input()
  get appearance(): SimButtonToggleAppearance {
    return this._appearance;
  }
  set appearance(value: SimButtonToggleAppearance) {
    if (this._appearance !== value) {
      this._appearance = value;
      if (this._buttonToggles) {
        this._buttonToggles.forEach(toggle => {
          toggle.appearance = this._appearance;
          toggle._markForCheck();
        });
      }
    }
  }
  private _appearance: SimButtonToggleAppearance = 'standard';

  /** 切换组传递给切换按钮颜色 */
  @Input()
  get color(): ThemePalette {
    return this._color;
  }
  set color(value: ThemePalette) {
    if (this._color !== value) {
      this._color = value;
      if (this._buttonToggles) {
        this._buttonToggles.forEach(toggle => {
          toggle.color = this._color;
          toggle._markForCheck();
        });
      }
    }
  }
  private _color: ThemePalette;

  /** 切换组传递给切换按钮尺寸 */
  @Input()
  get size(): ThemeSize {
    return this._size;
  }
  set size(value: ThemeSize) {
    if (this._size !== value) {
      this._size = value;
      if (this._buttonToggles) {
        this._buttonToggles.forEach(toggle => {
          toggle.size = this._size;
          toggle._markForCheck();
        });
      }
    }
  }
  private _size: ThemeSize = 'medium';

  /** 切换组的值 */
  @Input()
  get value(): T | T[] {
    const selected = this._selectionModel ? this._selectionModel.selected : [];

    if (this.multiple) {
      return selected.map(toggle => toggle.value);
    }

    return selected[0] ? selected[0].value : undefined;
  }
  set value(newValue: T | T[]) {
    this._setSelectionByValue(newValue);
    this.valueChange.emit(this.value);
  }

  /** 切换组的值发生更改发出 */
  @Output() readonly valueChange = new EventEmitter<T | T[]>();

  /** 切换按钮状态发生更改发出 */
  // tslint:disable-next-line: no-output-native
  @Output() readonly change: EventEmitter<SimButtonToggleChange<T | T[]>> = new EventEmitter<SimButtonToggleChange<T | T[]>>();

  /** 获取sim-button-toggle */
  @ContentChildren(forwardRef(() => SimButtonToggleComponent), {
    descendants: true
  })
  _buttonToggles: QueryList<SimButtonToggleComponent<T>>;

  /** 获取所有选中状态的切换按钮 */
  get selected() {
    const selected = this._selectionModel ? this._selectionModel.selected : [];
    return this.multiple ? selected : selected[0] || null;
  }

  private _selectionModel: SelectionModel<SimButtonToggleComponent<T>>;

  /** 初始化之前的原始值 */
  private _rawValue: T | T[];

  _controlValueAccessorChangeFn: OnChangeType = () => {};

  _onTouched: OnTouchedType = () => {};

  constructor(
    private _changeDetector: ChangeDetectorRef,
    @Optional()
    @Inject(SIM_BUTTON_TOGGLE_DEFAULT_OPTIONS)
    defaultOptions?: SimButtonToggleDefaultOptions
  ) {
    this.appearance = defaultOptions && defaultOptions.appearance ? defaultOptions.appearance : 'standard';
  }

  ngOnInit(): void {
    this._selectionModel = new SelectionModel<SimButtonToggleComponent<T>>(this.multiple, undefined, false);
  }

  ngAfterContentInit() {
    this._selectionModel.select(...this._buttonToggles.filter(toggle => toggle.checked));
  }

  writeValue(value: any) {
    this.value = value;
    this._changeDetector.markForCheck();
  }

  // Implemented as part of ControlValueAccessor.
  registerOnChange(fn: (value: any) => void) {
    this._controlValueAccessorChangeFn = fn;
  }

  // Implemented as part of ControlValueAccessor.
  registerOnTouched(fn: any) {
    this._onTouched = fn;
  }

  // Implemented as part of ControlValueAccessor.
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /** 检查切换按钮是否选中状态 */
  _isSelected(toggle: SimButtonToggleComponent<T>): boolean {
    return this._selectionModel && this._selectionModel.isSelected(toggle);
  }

  /** 确定是否在init中检查按钮切换 */
  _isPrechecked(toggle: SimButtonToggleComponent<T>): boolean {
    if (typeof this._rawValue === 'undefined') {
      return false;
    }

    if (this.multiple && isArray(this._rawValue)) {
      return this._rawValue.some(value => toggle.value != null && value === toggle.value);
    }

    return toggle.value === this._rawValue;
  }

  /** 同步切换按钮状态 */
  _syncButtonToggle(toggle: SimButtonToggleComponent<T>, select: boolean, isUserInput = false, deferEvents = false) {
    // 取消当前选择的切换，如果我们是在单选模式和被切换的按钮没有选择的时候。
    if (!this.multiple && this.selected && !toggle.checked) {
      (this.selected as SimButtonToggleComponent<T>).checked = false;
    }

    if (this._selectionModel) {
      if (select) {
        this._selectionModel.select(toggle);
      } else {
        this._selectionModel.deselect(toggle);
      }
    } else {
      deferEvents = true;
    }

    // 在某些情况下，为了避免“changed after checked errors”，我们需要延迟，
    // 但副作用是，我们可能会以不按顺序更新模型值而结束，
    // 而在其他情况下，'deferEvents'标志允许我们决定是否按具体情况进行更新。
    if (deferEvents) {
      Promise.resolve().then(() => this._updateModelValue(isUserInput));
    } else {
      this._updateModelValue(isUserInput);
    }
  }

  _emitChangeEvent(): void {
    const selected = this.selected;
    const source = isArray(selected) ? selected[selected.length - 1] : selected;
    const event = new SimButtonToggleChange(source, this.value);
    this._controlValueAccessorChangeFn(event.value);
    this.change.emit(event);
  }

  /** 将分组的值与模型同步，并发出变更事件 */
  private _updateModelValue(isUserInput: boolean) {
    // 仅为用户输入发出更改事件
    if (isUserInput) {
      this._emitChangeEvent();
    }

    // 无论是否用户交互，我们都会发出这个，因为Angular使用它来同步双向数据绑定。
    this.valueChange.emit(this.value);
  }

  /** 基于值更新组中切换项的选择状态 */
  private _setSelectionByValue(value: any | any[]) {
    this._rawValue = value;

    if (!this._buttonToggles) {
      return;
    }

    if (this.multiple && value) {
      if (!isArray(value)) {
        throw Error('Value must be an array in multiple-selection mode.');
      }

      this._clearSelection();
      value.forEach((currentValue: any) => this._selectValue(currentValue));
    } else {
      this._clearSelection();
      this._selectValue(value);
    }
  }

  /** 清除选定的切换项 */
  private _clearSelection() {
    this._selectionModel.clear();
    this._buttonToggles.forEach(toggle => (toggle.checked = false));
  }

  /** 如果有对应于该值的切换，则选择该值。 */
  private _selectValue(value: any) {
    const correspondingOption = this._buttonToggles.find(toggle => {
      return toggle.value != null && toggle.value === value;
    });

    if (correspondingOption) {
      correspondingOption.checked = true;
      this._selectionModel.select(correspondingOption);
    }
  }
}

const _SimButtonToggleMixinBase = mixinColor(mixinSize(MixinElementRefBase, 'medium'));

@Component({
  selector: 'sim-button-toggle',
  templateUrl: './button-toggle.component.html',
  styleUrls: ['./button-toggle.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sim-button-toggle',
    '[class.sim-button-toggle-appearance-standard]': 'appearance === "standard"',
    '[class.sim-button-toggle-appearance-outline]': 'appearance === "outline"'
  }
})
export class SimButtonToggleComponent<T> extends _SimButtonToggleMixinBase implements OnInit, AfterViewInit, OnDestroy {
  @Input() appearance: SimButtonToggleAppearance = 'standard';

  /**
   * 按钮主题
   */
  @Input()
  color: ThemePalette;

  /**
   * 按钮尺寸
   */
  @Input()
  size: ThemeSize;

  /** 切换按钮的惟一ID */
  @Input() id: string;

  /** 切换按钮 html name */
  @Input() name: string;

  /** 切换按钮的值 */
  @Input() value: T;

  /** 切换按钮绑定任意值 */
  @Input() data: SafeAny;

  /** 切换按钮的TabIndex */
  @Input() tabIndex: number | null;

  /** 切换按钮是否被选中 */
  @Input()
  @HostBinding('class.sim-button-toggle-checked')
  get checked(): boolean {
    return this.buttonToggleGroup ? this.buttonToggleGroup._isSelected(this) : this._checked;
  }
  set checked(value: boolean) {
    const newValue = toBoolean(value);

    if (newValue !== this._checked) {
      this._checked = newValue;

      if (this.buttonToggleGroup) {
        this.buttonToggleGroup._syncButtonToggle(this, this._checked);
      }

      this._changeDetectorRef.markForCheck();
    }
  }
  private _checked: boolean = false;

  /** 切换按钮是否被禁用  */
  @Input()
  @HostBinding('class.sim-button-toggle-disabled')
  get disabled(): boolean {
    return this._disabled || (this.buttonToggleGroup && this.buttonToggleGroup.disabled);
  }
  set disabled(value: boolean) {
    this._disabled = toBoolean(value);
  }
  private _disabled: boolean = false;

  /** 当切换按钮值更改时触发 */
  // tslint:disable-next-line: no-output-native
  @Output() readonly change: EventEmitter<SimButtonToggleChange<T>> = new EventEmitter<SimButtonToggleChange<T>>();

  @ViewChild('button') _buttonElement: ElementRef<HTMLButtonElement>;

  get buttonId(): string {
    return `${this.id}-button`;
  }

  private _isSingleSelector = false;
  private buttonToggleGroup: SimButtonToggleGroupDirective<T>;

  constructor(
    _elementRef: ElementRef<HTMLElement>,
    @Optional() toggleGroup: SimButtonToggleGroupDirective<T>,
    private _changeDetectorRef: ChangeDetectorRef,
    private _focusMonitor: FocusMonitor,
    @Attribute('tabindex') defaultTabIndex: string,
    @Optional()
    @Inject(SIM_BUTTON_TOGGLE_DEFAULT_OPTIONS)
    defaultOptions?: SimButtonToggleDefaultOptions
  ) {
    super(_elementRef);
    this.buttonToggleGroup = toggleGroup;
    const parsedTabIndex = Number(defaultTabIndex);
    this.tabIndex = parsedTabIndex || parsedTabIndex === 0 ? parsedTabIndex : null;
    this.appearance = defaultOptions && defaultOptions.appearance ? defaultOptions.appearance : 'standard';
  }

  ngOnInit(): void {
    this.id = this.id || `sim-button-toggle-${_uniqueIdCounter++}`;
    const group = this.buttonToggleGroup;
    if (group) {
      this._isSingleSelector = !group.multiple;
      if (this._isSingleSelector) {
        this.name = group.name;
      }

      this.appearance = group.appearance;
      this.color = group.color;
      this.size = group.size;

      if (group._isPrechecked(this)) {
        this.checked = true;
      } else if (group._isSelected(this) !== this._checked) {
        group._syncButtonToggle(this, this._checked);
      }
    }
  }

  ngAfterViewInit() {
    this._focusMonitor.monitor(this._elementRef, true);
  }

  ngOnDestroy() {
    const group = this.buttonToggleGroup;

    this._focusMonitor.stopMonitoring(this._elementRef);

    // 一旦切换按钮被破坏，请将其从选择中移除。需要发生在下一个tick，以避免“更改后检查”错误。
    if (group && group._isSelected(this)) {
      group._syncButtonToggle(this, false, false, true);
    }
  }

  @HostListener('focus')
  focus(options?: FocusOptions): void {
    this._buttonElement.nativeElement.focus(options);
  }

  /** 检查与原生按钮交互而导致的按钮切换 */
  _onButtonClick() {
    const newChecked = this._isSingleSelector ? true : !this._checked;

    if (newChecked !== this._checked) {
      this._checked = newChecked;
      if (this.buttonToggleGroup) {
        this.buttonToggleGroup._syncButtonToggle(this, this._checked, true);
        this.buttonToggleGroup._onTouched();
      }
    }

    this.change.emit(new SimButtonToggleChange(this, this.value));
  }

  _markForCheck() {
    this._changeDetectorRef.markForCheck();
  }
}
