import { FocusMonitor } from '@angular/cdk/a11y';
import { UniqueSelectionDispatcher } from '@angular/cdk/collections';
import {
  AfterContentInit,
  AfterViewInit,
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
  Self,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { toBoolean } from '@ngx-simple/core/coercion';
import { ThemePalette } from '@ngx-simple/core/common-behaviors';
import { OnChangeType, OnTouchedType, SafeAny } from '@ngx-simple/core/types';

export interface SimRadioDefaultOptions {
  color: ThemePalette;
}

export const SIM_RADIO_DEFAULT_OPTIONS = new InjectionToken<SimRadioDefaultOptions>('sim-radio-default-options', {
  providedIn: 'root',
  factory: SIM_RADIO_DEFAULT_OPTIONS_FACTORY
});

export function SIM_RADIO_DEFAULT_OPTIONS_FACTORY(): SimRadioDefaultOptions {
  return {
    color: 'primary'
  };
}

/**
 * Radio可以接收的值 字符串 数字 布尔值
 */
export type RadioValue = string | number | boolean;

/**
 * 单选按钮标签显示的位置
 */
export type RadioLabelPosition = 'before' | 'after';

/** SimRadio 和 SimRadioGroup 发出的 change事件对象。 */
export class SimRadioChange {
  constructor(
    /** 发出change事件的sim-radio */
    public source: SimRadioComponent,
    /** sim-radio的值 */
    public value: RadioValue
  ) {}
}

let nextUniqueId = 0;
let nextGroupUniqueId = 0;

@Directive({
  selector: 'sim-radio-group',
  exportAs: 'simRadioGroup',
  host: {
    role: 'radiogroup',
    class: 'sim-radio-group',
    '[attr.id]': 'id || name'
  }
})
export class SimRadioGroupDirective implements AfterContentInit, ControlValueAccessor {
  /** 单选按钮组的名称。这个组中的所有单选按钮都将使用这个名称。 */
  @Input()
  get name(): string {
    return this._name;
  }
  set name(value: string) {
    this._name = value;
    this._updateRadioButtonNames();
  }
  private _name: string = `sim-radio-group-${nextGroupUniqueId++}`;

  /** 标签应该出现在单选按钮之后还是之前。默认为 after */
  @Input()
  get labelPosition(): RadioLabelPosition {
    return this._labelPosition;
  }
  set labelPosition(v) {
    this._labelPosition = v === 'before' ? 'before' : 'after';
    this._markRadiosForCheck();
  }

  /**
   * 单选按钮组的值。
   * 如果存在一个具有匹配值的单选按钮，则该值应等于所选单选按钮的值。
   * 如果没有这样的单选按钮，则在添加具有匹配值的新单选按钮的情况下，将继续应用此值。
   */
  @Input()
  get value(): RadioValue {
    return this._value;
  }
  set value(newValue: RadioValue) {
    if (this._value !== newValue) {
      // 在继续进行之前设置此选项，以确保在进行选择时不会出现循环。
      this._value = newValue;
      this._updateSelectedRadioFromValue();
      this._checkSelectedRadioButton();
    }
  }

  /**
   * 当前选择的单选按钮。如果设置为新的单选按钮，则单选组值将被更新以匹配新选中的按钮。
   */
  @Input()
  get selected() {
    return this._selected;
  }
  set selected(selected: SimRadioComponent | null) {
    this._selected = selected;
    this.value = selected ? selected.value : null;
    this._checkSelectedRadioButton();
  }

  /** 单选按钮组是否禁用 */
  @Input()
  get disabled(): boolean {
    return this.ngControl ? !!this.ngControl.disabled : this._disabled;
  }
  set disabled(value) {
    this._disabled = toBoolean(value);
    this._markRadiosForCheck();
  }

  /** 单选按钮组是否必填 */
  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(value: boolean) {
    this._required = toBoolean(value);
    this._markRadiosForCheck();
  }

  /** 单选按钮主题 */
  @Input() color: ThemePalette;

  /**
   * 当此单选按钮的选中状态更改时发出的事件。
   * 只有当 value 是由于用户与单选按钮交互而发生更改时才会发出 change 事件(与`<input type="radio">`相同的行为)。
   */
  // tslint:disable-next-line: no-output-native
  @Output() readonly change: EventEmitter<SimRadioChange> = new EventEmitter<SimRadioChange>();

  @ContentChildren(forwardRef(() => SimRadioComponent), { descendants: true })
  _radios: QueryList<SimRadioComponent>;

  private _labelPosition: RadioLabelPosition;
  private _value: RadioValue;
  private _selected: SimRadioComponent;
  private _disabled: boolean;
  private _required: boolean;

  /** value 是否被设置为初始值。 */
  private _isInitialized: boolean = false;

  // Implemented as part of ControlValueAccessor.
  _controlValueAccessorChangeFn: OnChangeType = () => {};
  // Implemented as part of ControlValueAccessor.
  _onTouched: OnTouchedType = () => {};

  constructor(@Optional() @Self() public ngControl: NgControl, private _changeDetector: ChangeDetectorRef) {
    if (this.ngControl) {
      // 注意: 我们在这里提供了值访问器，而不是“providers”，以避免`into a circular`错误。
      this.ngControl.valueAccessor = this;
    }
  }

  ngAfterContentInit() {
    // 在AfterContentInit中将这个组件标记为初始化，
    // 因为在SimRadioGroup上，NgModel可能会设置初始值，
    // 而且NgModel的OnInit可能会在SimRadioGroup的OnInit之后发生。
    this._isInitialized = true;
  }

  // Implemented as part of ControlValueAccessor.
  writeValue(value: RadioValue) {
    this.value = value;
    this._changeDetector.markForCheck();
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
    this._changeDetector.markForCheck();
  }

  _checkSelectedRadioButton() {
    if (this._selected && !this._selected.checked) {
      this._selected.checked = true;
    }
  }

  _touch() {
    if (this._onTouched) {
      this._onTouched();
    }
  }

  /** 具有当前选择和组值的派送更改事件。 */
  _emitChangeEvent(): void {
    if (this._isInitialized) {
      this.change.emit(new SimRadioChange(this._selected, this._value));
    }
  }

  private _markRadiosForCheck() {
    if (this._radios) {
      this._radios.forEach(radio => radio._markForCheck());
    }
  }

  /** 从内部_value状态更新selected单选按钮。 */
  private _updateSelectedRadioFromValue(): void {
    // 如果该值已经匹配所选的单选，则不执行任何操作。
    const isAlreadySelected = this._selected != null && this._selected.value === this._value;
    if (this._radios && !isAlreadySelected) {
      this._selected = null;
      this._radios.forEach(radio => {
        radio.checked = this.value === radio.value;
        if (radio.checked) {
          this._selected = radio;
        }
      });
    }
  }

  private _updateRadioButtonNames(): void {
    if (this._radios) {
      this._radios.forEach(radio => {
        radio.name = this.name;
        radio._markForCheck();
      });
    }
  }
}

@Component({
  selector: 'sim-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sim-radio',
    role: 'radio',
    '[class.sim-primary]': 'color === "primary"',
    '[class.sim-secondary]': 'color === "secondary"',
    '[class.sim-success]': 'color === "success"',
    '[class.sim-info]': 'color === "info"',
    '[class.sim-warning]': 'color === "warning"',
    '[class.sim-danger]': 'color === "danger"',
    '[attr.tabindex]': 'null',
    '[attr.id]': 'id'
  }
})
export class SimRadioComponent implements OnInit, AfterViewInit, OnDestroy {
  /** 单选按钮主题 */
  @Input()
  get color(): ThemePalette {
    return (
      this._color || (this.radioGroup && this.radioGroup.color) || (this._providerOverride && this._providerOverride.color) || 'primary'
    );
  }
  set color(value: ThemePalette) {
    this._color = value;
  }
  private _color: ThemePalette = 'primary';

  /** 单选按钮是否选中 */
  @Input()
  @HostBinding('class.sim-radio-checked')
  get checked(): boolean {
    return this._checked;
  }
  set checked(value: boolean) {
    const newCheckedState = toBoolean(value);
    if (this._checked !== newCheckedState) {
      this._checked = newCheckedState;
      if (this.radioGroup) {
        if (newCheckedState && this.radioGroup.value !== this.value) {
          this.radioGroup.selected = this;
        } else if (!newCheckedState && this.radioGroup.value === this.value) {
          // 取消选中所选单选按钮时，更新组中所选的单选属性
          this.radioGroup.selected = null;
        }
      }

      if (newCheckedState) {
        // 通知所有具有相同名称的单选按钮以取消选中。
        this._radioDispatcher.notify(this.id, this.name);
      }
      this._markForCheck();
    }
  }

  /** 单选按钮是否禁用 */
  @Input()
  @HostBinding('class.sim-radio-disabled')
  get disabled(): boolean {
    return this._disabled || (this.radioGroup && this.radioGroup.disabled);
  }

  set disabled(value: boolean) {
    this._setDisabled(toBoolean(value));
  }

  /** 单选按钮的焦点 */
  @Input()
  get tabIndex(): number {
    return this.disabled ? -1 : this._tabIndex;
  }
  set tabIndex(value: number) {
    // 如果指定的tabIndex值为null或undefined，则返回默认值。
    this._tabIndex = value != null ? value : 0;
  }
  private _tabIndex: number = 0;

  /** 单选按钮的值 */
  @Input()
  get value(): RadioValue {
    return this._value;
  }
  set value(value: RadioValue) {
    if (this._value !== value) {
      this._value = value;
      if (this.radioGroup !== null) {
        if (!this.checked) {
          // 当值更改为与 radioGroup 的值匹配时，更新检查
          this.checked = this.radioGroup.value === value;
        }
        if (this.checked) {
          this.radioGroup.selected = this;
        }
      }
    }
  }

  /** 标签应该出现在单选按钮之后还是之前。默认为 after */
  @Input()
  get labelPosition(): RadioLabelPosition {
    return this._labelPosition || (this.radioGroup && this.radioGroup.labelPosition) || 'after';
  }
  set labelPosition(value) {
    this._labelPosition = value;
  }
  private _labelPosition: RadioLabelPosition = 'after';

  /** 单选按钮是否必填 */
  @Input()
  get required(): boolean {
    return this._required || (this.radioGroup && this.radioGroup.required);
  }
  set required(value: boolean) {
    this._required = toBoolean(value);
  }
  private _required: boolean;

  /**
   * 当此单选按钮的选中状态更改时发出的事件。
   * 只有当 value 是由于用户与单选按钮交互而发生更改时才会发出 change 事件(与`<input type="radio">`相同的行为)。
   */
  // tslint:disable-next-line: no-output-native
  @Output() readonly change: EventEmitter<SimRadioChange> = new EventEmitter<SimRadioChange>();

  /** 绑定自定义数据 */
  @Input() data: SafeAny;

  /** 单选按钮的唯一ID */
  @Input() id: string;

  /** 与HTML的name属性类似，用于对radio-group以进行唯一选择 */
  @Input() name: string;

  /** 获取 `<input type=radio>` */
  @ViewChild('input') _inputElement: ElementRef<HTMLInputElement>;

  /** 设置隐藏input的id */
  get inputId(): string {
    return `${this.id || this._uniqueId}-input`;
  }

  radioGroup: SimRadioGroupDirective;

  private _checked: boolean;
  private _disabled: boolean;
  private _uniqueId = `sim-radio-${++nextUniqueId}`;
  private _value: RadioValue;
  private _removeUniqueSelectionListener: () => void = () => {};

  constructor(
    radioGroup: SimRadioGroupDirective,
    private _elementRef: ElementRef,
    private _changeDetectorRef: ChangeDetectorRef,
    private _focusMonitor: FocusMonitor,
    private _radioDispatcher: UniqueSelectionDispatcher,
    @Optional()
    @Inject(SIM_RADIO_DEFAULT_OPTIONS)
    private _providerOverride?: SimRadioDefaultOptions
  ) {
    this.radioGroup = radioGroup;
    this._removeUniqueSelectionListener = _radioDispatcher.listen((id: string, name: string) => {
      if (id !== this.id && name === this.name) {
        this.checked = false;
      }
    });
  }

  ngOnInit(): void {
    this.id = this.id || this._uniqueId;
    if (this.radioGroup) {
      // 检查当前值和radioGroup值，如果一样就选中状态
      this.checked = this.radioGroup.value === this._value;
      // radioGroup 的 name 设置给当前 name
      this.name = this.radioGroup.name;
    }
  }

  ngAfterViewInit() {
    this._focusMonitor.monitor(this._elementRef, true).subscribe(focusOrigin => {
      if (!focusOrigin && this.radioGroup) {
        this.radioGroup._touch();
      }
    });
  }

  ngOnDestroy(): void {
    this._focusMonitor.stopMonitoring(this._elementRef);
    this._removeUniqueSelectionListener();
  }

  /**
   * 在正常情况下，焦点不应该落在这个元素上，但是它可以通过编程设置，
   * 例如在焦点捕捉中，在这种情况下，我们希望将焦点转发给原生元素。
   */
  @HostListener('focus')
  _focus() {
    this._inputElement.nativeElement.focus();
  }

  /** radio 键盘聚焦 */
  focus(options?: FocusOptions): void {
    this._focusMonitor.focusVia(this._inputElement, 'keyboard', options);
  }

  _markForCheck() {
    this._changeDetectorRef.markForCheck();
  }

  /** 当单选按钮接收到单击或<input>意识到更改时触发。单击 <label> 元素，将触发关联<input>上的change事件。 */
  _onInputChange(event: Event) {
    event.stopPropagation();

    this.checked = true;
    this._emitChangeEvent();

    if (this.radioGroup) {
      const groupValueChanged = this.value !== this.radioGroup.value;
      this.radioGroup._controlValueAccessorChangeFn(this.value);
      if (groupValueChanged) {
        this.radioGroup._emitChangeEvent();
      }
    }
  }

  _onInputClick(event: Event) {
    event.stopPropagation();
  }

  private _setDisabled(value: boolean) {
    if (this._disabled !== value) {
      this._disabled = value;
      this._markForCheck();
    }
  }

  private _emitChangeEvent(): void {
    this.change.emit(new SimRadioChange(this, this._value));
  }
}
