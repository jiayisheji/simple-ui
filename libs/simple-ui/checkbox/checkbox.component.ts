import { FocusMonitor, FocusOrigin } from '@angular/cdk/a11y';
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
  DoCheck,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  Inject,
  InjectionToken,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  QueryList,
  Self,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormGroupDirective,
  NgControl,
  NgForm,
  NG_VALIDATORS,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';
import { toBoolean, toNumber } from '@ngx-simple/core/coercion';
import {
  CanColor,
  CanDisable,
  CanUpdateErrorState,
  ErrorStateMatcher,
  HasTabIndex,
  mixinColor,
  mixinDisabled,
  MixinElementRefBase,
  mixinErrorState,
  mixinTabIndex,
  ThemePalette
} from '@ngx-simple/core/common-behaviors';
import { isArray } from '@ngx-simple/core/typeof';
import { OnChangeType, OnTouchedType, SafeAny, ValidatorOnChange } from '@ngx-simple/core/types';
import { hasValidLength, isEmptyInputValue, SimFormFieldControl } from '@ngx-simple/simple-ui/form-field';

export interface SimCheckboxDefaultOptions {
  color?: ThemePalette;
}

/** 注入令牌，用于覆盖'sim-checkbox'的默认选项。 */
export const SIM_CHECKBOX_DEFAULT_OPTIONS = new InjectionToken<SimCheckboxDefaultOptions>('sim-checkbox-default-options', {
  providedIn: 'root',
  factory: SIM_CHECKBOX_DEFAULT_OPTIONS_FACTORY
});

export function SIM_CHECKBOX_DEFAULT_OPTIONS_FACTORY(): SimCheckboxDefaultOptions {
  return {
    color: 'primary'
  };
}

/**
 * 复选框标签显示的位置
 */
export type CheckboxLabelPosition = 'before' | 'after';

/**
 * 表示需要在它们之间进行自定义转换的不同状态。
 */
export enum TransitionCheckState {
  /** 组件在任何用户交互之前的初始状态。 */
  Init,
  /** 当组件选中时，表示该组件的状态。 */
  Checked,
  /** 当组件未选中时，表示该组件的状态。 */
  Unchecked,
  /** 当组件变得不确定时，表示该组件的状态。 */
  Indeterminate
}

/** 更改SimCheckbox发出的事件对象 */
export class SimCheckboxChange {
  constructor(
    /** 发出更改事件的SimCheckbox */
    public source: SimCheckboxComponent,
    /** 复选框是否选中值 */
    public checked: boolean
  ) {}
}

/**
 * 复选框值
 */
type CheckboxValue = Array<string | number>;

/** 更改SimCheckboxGroup发出的事件对象 */
export class SimCheckboxGroupChange {
  constructor(
    /** 发出更改事件的simCheckboxGroup集合。 */
    public source: SimCheckboxGroupDirective,
    /** SimCheckbox的值集合。 */
    public value: CheckboxValue
  ) {}
}

class SimCheckboxGroupBase {
  constructor(
    public _defaultErrorStateMatcher: ErrorStateMatcher,
    public _parentForm: NgForm,
    public _parentFormGroup: FormGroupDirective,
    public ngControl: NgControl
  ) {}
}
const _SimCheckboxGroupMixinBase = mixinErrorState(SimCheckboxGroupBase);

let nextGroupUniqueId = 0;

/** 最小选项的表单控件验证器 */
export function simCheckboxMinValidator(minLength: number): ValidatorFn {
  const validatorFn = (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (isEmptyInputValue(value) || !hasValidLength(value)) {
      return null;
    }
    const { length } = value;
    return length < minLength ? { simCheckboxMinLength: { requiredLength: minLength, actualLength: length } } : null;
  };
  return validatorFn;
}

/** 最大选项的表单控件验证器 */
export function simCheckboxMaxValidator(maxLength: number) {
  const validatorFn = (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (isEmptyInputValue(value) || !hasValidLength(value)) {
      return null;
    }
    const { length } = value;
    return length > maxLength ? { simCheckboxMaxLength: { requiredLength: maxLength, actualLength: length } } : null;
  };
  return validatorFn;
}

@Directive({
  selector: 'sim-checkbox-group',
  exportAs: 'simCheckboxGroup',
  host: {
    role: 'checkboxgroup',
    class: 'sim-checkbox-group',
    '[attr.id]': 'id || name'
  },
  providers: [
    {
      provide: SimFormFieldControl,
      useExisting: SimCheckboxGroupDirective
    },
    {
      provide: NG_VALIDATORS,
      useValue: simCheckboxMinValidator,
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useValue: simCheckboxMaxValidator,
      multi: true
    }
  ]
})
export class SimCheckboxGroupDirective extends _SimCheckboxGroupMixinBase
  implements
    SimFormFieldControl<CheckboxValue>,
    OnChanges,
    DoCheck,
    AfterContentInit,
    OnDestroy,
    CanUpdateErrorState,
    ControlValueAccessor {
  /** 单选按钮组的名称。这个组中的所有单选按钮都将使用这个名称。 */
  @Input()
  get name(): string {
    return this._name;
  }
  set name(value: string) {
    this._name = value;
    this._updateCheckboxesButtonNames();
  }
  private _name: string = `sim-checkbox-group-${nextGroupUniqueId++}`;

  /** 标签应该出现在单选按钮之后还是之前。默认为 after */
  @Input()
  get labelPosition(): CheckboxLabelPosition {
    return this._labelPosition;
  }
  set labelPosition(v) {
    this._labelPosition = v === 'before' ? 'before' : 'after';
    this._markCheckboxesForCheck();
  }
  private _labelPosition: CheckboxLabelPosition = 'after';

  /**
   * 单选按钮组的值。
   * 如果存在一个具有匹配值的单选按钮，则该值应等于所选单选按钮的值。
   * 如果没有这样的单选按钮，则在添加具有匹配值的新单选按钮的情况下，将继续应用此值。
   */
  @Input()
  get value(): CheckboxValue {
    return this._value;
  }
  set value(newValue: CheckboxValue) {
    if (this._value !== newValue) {
      // 在继续进行之前设置此选项，以确保在进行选择时不会出现循环。
      this._value = newValue;
      // this._updateSelectedRadioFromValue();
      // this._checkSelectedRadioButton();
    }
  }
  private _value: CheckboxValue;

  /** 单选按钮组是否禁用 */
  @Input()
  get disabled(): boolean {
    return this.ngControl ? !!this.ngControl.disabled : this._disabled;
  }
  set disabled(value) {
    this._disabled = toBoolean(value);
    this._markCheckboxesForCheck();
  }
  private _disabled: boolean;

  /** 单选按钮组是否必填 */
  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(value: boolean) {
    this._required = toBoolean(value);
    this._markCheckboxesForCheck();
  }
  private _required: boolean;

  /** 最大可以选择的有效项，超过只会，剩余未选中的项被禁用 */
  @Input()
  get maxLength(): number | null {
    return this._maxLength;
  }
  set maxLength(value: number | null) {
    if (value != null) {
      this._maxLength = toNumber(value);
    }
  }
  private _maxLength: number | null = null;

  // Implemented as part of SimFormFieldControl.
  @Input() id: string = this.name;

  /** 复选框主题 */
  @Input() color: ThemePalette;

  // Implemented as part of SimFormFieldControl.
  @Input() errorStateMatcher: ErrorStateMatcher;

  /**
   * 当此单选按钮的选中状态更改时发出的事件。
   * 只有当 value 是由于用户与单选按钮交互而发生更改时才会发出 change 事件(与`<input type="radio">`相同的行为)。
   */
  // tslint:disable-next-line: no-output-native
  @Output() readonly change: EventEmitter<SimCheckboxGroupChange> = new EventEmitter<SimCheckboxGroupChange>();

  @ContentChildren(forwardRef(() => SimCheckboxComponent), { descendants: true })
  _checkboxes: QueryList<SimCheckboxComponent>;

  // Implemented as part of ControlValueAccessor.
  _controlValueAccessorChangeFn: OnChangeType = () => {};
  // Implemented as part of ControlValueAccessor.
  _onTouched: OnTouchedType = () => {};
  // Implemented as part of Validator.
  _validatorOnChange: ValidatorOnChange = () => {};
  // Implemented as part of Validator.
  _validator: ValidatorFn | null;

  // Implemented as part of SimFormFieldControl.
  get empty(): boolean {
    return !this._selectionModel || this._selectionModel.isEmpty();
  }
  // Implemented as part of SimFormFieldControl.
  controlType = 'sim-checkbox';
  // Implemented as part of SimFormFieldControl.
  autofilled = true;
  // Implemented as part of SimFormFieldControl.
  placeholder: string = '';
  // Implemented as part of SimFormFieldControl.
  focused = false;
  // Implemented as part of SimFormFieldControl.

  /** 当前选中的sim-checkbox */
  get selected(): SimCheckboxComponent[] {
    return this._selectionModel.selected;
  }

  /** value 是否被设置为初始值。 */
  private _isInitialized: boolean = false;

  private _selectionModel: SelectionModel<SimCheckboxComponent>;

  /** 缓存超过 maxLength 未禁用的复选框 */
  private _disabledCheckboxes: SimCheckboxComponent[];

  constructor(
    _defaultErrorStateMatcher: ErrorStateMatcher,
    @Optional() @Self() public ngControl: NgControl,
    @Optional() _parentForm: NgForm,
    @Optional() _parentFormGroup: FormGroupDirective,
    private _changeDetector: ChangeDetectorRef
  ) {
    super(_defaultErrorStateMatcher, _parentForm, _parentFormGroup, ngControl);
    if (this.ngControl) {
      // 注意: 我们在这里提供了值访问器，而不是“providers”，以避免`into a circular`错误。
      this.ngControl.valueAccessor = this;
    }
    this._selectionModel = new SelectionModel(true, undefined, false);
  }

  ngOnChanges() {
    if (this.ngControl) {
      this.stateChanges.next();
    }
  }

  ngAfterContentInit() {
    // 在AfterContentInit中将这个组件标记为初始化，
    // 因为在SimRadioGroup上，NgModel可能会设置初始值，
    // 而且NgModel的OnInit可能会在SimRadioGroup的OnInit之后发生。
    this._isInitialized = true;
    this._disabledCheckboxes = [];
    this._checkValueLength();
  }

  ngDoCheck() {
    if (this.ngControl) {
      this.updateErrorState();
    }
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this._disabledCheckboxes.length = 0;
    this._disabledCheckboxes = null;
  }

  // Implemented as part of Validator.
  registerOnValidatorChange(fn: ValidatorOnChange): void {
    this._validatorOnChange = fn;
  }

  // Implemented as part of Validator.
  validate(c: AbstractControl): ValidationErrors | null {
    console.log(c);
    return this._validator ? this._validator(c) : null;
  }

  // Implemented as part of ControlValueAccessor.
  writeValue(value: CheckboxValue) {
    if (isArray(value)) {
      this.value = value;
    } else {
      this.value = null;
    }
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

  // Implemented as part of SimFormFieldControl.
  onContainerClick() {}

  // Implemented as part of SimFormFieldControl.
  setDescribedByIds(ids: string[]) {}

  _touch() {
    if (this._onTouched) {
      this._onTouched();
    }
  }

  /** 检查 value长度是否在合法的给定 maxLength 中 */
  _checkValueLength() {
    if (this.value) {
      if (this.maxLength != null) {
        if (this.value.length >= this.maxLength) {
          this._checkboxes.forEach(checkbox => {
            // 把未选中和未禁用的全部存起来
            // 这里不能直接全部禁用未选中的，防止用户手动设置禁用
            if (!checkbox.checked && !checkbox.disabled) {
              this._disabledCheckboxes.push(checkbox);
              checkbox.disabled = true;
              checkbox._markForCheck();
            }
          });
        } else {
          // 把禁用数组存的复选框恢复未禁用状态
          this._disabledCheckboxes.forEach(checkbox => {
            checkbox.disabled = false;
            checkbox._markForCheck();
          });
          this._disabledCheckboxes = [];
        }
      }
    }
  }

  /** 根据sim-checkbox的checked的状态更新组选择的数组 */
  _selectionCheckbox(checkbox: SimCheckboxComponent, newCheckedState: boolean) {
    if (newCheckedState) {
      this._selectionModel.select(checkbox);
    } else {
      this._selectionModel.deselect(checkbox);
    }
  }

  /** 更新复选框组的值 */
  _groupValueChanged() {
    const values = this._selectionModel.selected.map(v => v.value);
    this.value = values;
    this._controlValueAccessorChangeFn(values);
    this.change.next(new SimCheckboxGroupChange(this, values));
  }

  /** 具有当前选择和组值的派送更改事件。 */
  _emitChangeEvent(): void {
    if (this._isInitialized) {
      this.change.emit(new SimCheckboxGroupChange(this, this._value));
    }
  }

  private _markCheckboxesForCheck() {
    if (this._checkboxes) {
      this._checkboxes.forEach(checkbox => checkbox._markForCheck());
    }
  }

  private _updateCheckboxesButtonNames(): void {
    if (this._checkboxes) {
      this._checkboxes.forEach(checkbox => {
        checkbox.name = this.name;
        checkbox._markForCheck();
      });
    }
  }
}

const _SimCheckboxMixinBase = mixinTabIndex(mixinColor(mixinDisabled(MixinElementRefBase)));

let nextUniqueId = 0;

@Component({
  selector: 'sim-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sim-checkbox',
    role: 'checkbox',
    '[attr.tabindex]': 'null'
  }
})
export class SimCheckboxComponent extends _SimCheckboxMixinBase
  implements ControlValueAccessor, OnInit, AfterViewInit, CanColor, CanDisable, HasTabIndex {
  /** 复选框主题 */
  @Input() color: ThemePalette;
  /** tab 键控制次序 */
  @Input() tabIndex: number;

  private _uniqueId: string = `sim-checkbox-${++nextUniqueId}`;

  /** 复选框输入的唯一id。如果没有提供，它将自动生成。 */
  @Input() id: string = this._uniqueId;

  /** 绑定自定义数据 */
  @Input() data: SafeAny;

  /** 复选框是否必选 */
  @Input()
  get required(): boolean {
    return this._required || (this.checkboxGroup && this.checkboxGroup.required);
  }
  set required(value: boolean) {
    this._required = toBoolean(value);
  }
  private _required: boolean;

  /**
   * 复选框是否选中
   */
  @Input()
  @HostBinding('class.sim-checkbox-checked')
  get checked(): boolean {
    return this._checked;
  }
  set checked(value: boolean) {
    const newCheckedState = toBoolean(value);
    if (value !== this.checked) {
      this._checked = value;
      if (this.checkboxGroup) {
        this.checkboxGroup._selectionCheckbox(this, newCheckedState);
      }
      this._markForCheck();
    }
  }
  private _checked: boolean = false;

  @Input()
  @HostBinding('class.sim-checkbox-indeterminate')
  get indeterminate(): boolean {
    return this._indeterminate;
  }
  set indeterminate(value: boolean) {
    const changed = value !== this._indeterminate;
    this._indeterminate = toBoolean(value);

    if (changed) {
      this.indeterminateChange.emit(this._indeterminate);
    }

    this._syncIndeterminate(this._indeterminate);
  }
  private _indeterminate: boolean = false;

  /** 复选框是否被禁用 */
  @Input()
  @HostBinding('class.sim-checkbox-disabled')
  get disabled() {
    return this._disabled || (this.checkboxGroup && this.checkboxGroup.disabled);
  }
  set disabled(value: any) {
    const newValue = toBoolean(value);

    if (newValue !== this.disabled) {
      this._disabled = newValue;
      this._changeDetector.markForCheck();
    }
  }
  private _disabled: boolean = false;

  /** 标签应该出现在单选按钮之后还是之前。默认为 after */
  @Input()
  get labelPosition(): CheckboxLabelPosition {
    return this._labelPosition || (this.checkboxGroup && this.checkboxGroup.labelPosition) || 'after';
  }
  set labelPosition(value) {
    this._labelPosition = value;
  }
  private _labelPosition: CheckboxLabelPosition = 'after';

  /** 如果存在，将应用到隐藏input元素value值 */
  @Input() value: string | number;

  /** 如果存在，将应用到隐藏input元素name值 */
  @Input() name: string | null = null;

  /** 当复选框的选中值更改时发出的事件 */
  // tslint:disable-next-line: no-output-native
  @Output() readonly change: EventEmitter<SimCheckboxChange> = new EventEmitter<SimCheckboxChange>();

  /** 当复选框的`indeterminate`值发生变化时发出的事件 */
  @Output() readonly indeterminateChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  /** 获取 `<input type="checkbox">` */
  @ViewChild('input') _inputElement: ElementRef<HTMLInputElement>;

  /** 设置隐藏input的id */
  get inputId(): string {
    return `${this.id || this._uniqueId}-input`;
  }

  // Implemented as part of ControlValueAccessor.
  _controlValueAccessorChangeFn: OnChangeType = () => {};
  // Implemented as part of ControlValueAccessor.
  _onTouched: OnTouchedType = () => {};

  checkboxGroup: SimCheckboxGroupDirective;

  constructor(
    @Inject(forwardRef(() => SimCheckboxGroupDirective))
    @Optional()
    checkboxGroup: SimCheckboxGroupDirective,
    _elementRef: ElementRef,
    private _focusMonitor: FocusMonitor,
    @Optional() @Self() public ngControl: NgControl,
    private _changeDetector: ChangeDetectorRef,
    @Attribute('tabindex') tabIndex: string,
    @Optional()
    @Inject(SIM_CHECKBOX_DEFAULT_OPTIONS)
    private _options?: SimCheckboxDefaultOptions
  ) {
    super(_elementRef);
    this.checkboxGroup = checkboxGroup;
    if (this.ngControl) {
      // 注意: 我们在这里提供了值访问器，而不是“providers”，以避免`into a circular`错误。
      this.ngControl.valueAccessor = this;
    }
    this._options = this._options || {};
    if (this._options.color) {
      this.color = this._options.color;
    }
    this.tabIndex = parseInt(tabIndex, 10) || 0;
  }

  ngOnInit(): void {
    if (this.checkboxGroup) {
      // 检查当前值和checkboxGroup值，如果一样就选中状态
      if (isArray(this.checkboxGroup.value)) {
        this.checkboxGroup.value.forEach(v => {
          this.checked = v === this.value;
        });
      } else {
        this.checked = false;
      }
      // radioGroup 的 name 设置给当前 name
      this.name = this.checkboxGroup.name;
    }
  }

  ngAfterViewInit() {
    this._focusMonitor.monitor(this._elementRef, true).subscribe(focusOrigin => {
      if (!focusOrigin) {
        if (this.checkboxGroup) {
          this.checkboxGroup._touch();
        } else {
          Promise.resolve().then(() => {
            this._onTouched();
            this._changeDetector.markForCheck();
          });
        }
      }
    });

    this._syncIndeterminate(this._indeterminate);
  }

  // Implemented as part of ControlValueAccessor.
  writeValue(value: boolean) {
    this.checked = !!value;
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
  }

  /** 复选框获取焦点 */
  focus(origin: FocusOrigin = 'keyboard', options?: FocusOptions): void {
    this._focusMonitor.focusVia(this._inputElement, origin, options);
  }

  /** 切换复选框的“checked”状态 */
  toggle(): void {
    this.checked = !this.checked;
  }

  _onInputClick(event: Event) {
    event.stopPropagation();
    // 如果resetIndeterminate为false，并且当前状态为不确定，则单击时不执行任何操作
    if (!this.disabled) {
      // 当用户手动单击复选框时，“indeterminate”被设置为false。
      if (this.indeterminate) {
        Promise.resolve().then(() => {
          this._indeterminate = false;
          this.indeterminateChange.emit(this._indeterminate);
        });
      }

      this.toggle();

      // 如果本机输入发出更改事件，则发出我们的自定义更改事件。
      // 如果本机输入触发了一个，那么只发出它是很重要的，因为我们不想在‘checked’变量发生更改时触发一个更改事件。
      this._emitChangeEvent();

      if (this.checkboxGroup) {
        this.checkboxGroup._groupValueChanged();
        this.checkboxGroup._checkValueLength();
      }
    } else if (!this.disabled) {
      // 当单击noop时重置本机输入。本机复选框在单击后被选中，将其重置为与‘sim-checkbox’的‘checked’值对齐。
      const nativeCheckbox = this._inputElement;
      if (nativeCheckbox) {
        nativeCheckbox.nativeElement.checked = this.checked;
        nativeCheckbox.nativeElement.indeterminate = this.indeterminate;
      }
    }
  }

  _onInputChange(event: Event) {
    event.stopPropagation();
  }

  /** 每当标签文本更改时调用。 */
  _onLabelTextChange() {
    // 由于复选框使用OnPush策略，需要通知它cdkObserveContent指令已经识别的更改。
    this._changeDetector.detectChanges();
  }

  _markForCheck() {
    this._changeDetector.markForCheck();
  }

  private _emitChangeEvent() {
    const event = new SimCheckboxChange(this, this.checked);
    this._controlValueAccessorChangeFn(this.checked);
    this.change.emit(event);
  }

  /** 将`indeterminate`值与<input type="checkbox">DOM节点同步 */
  private _syncIndeterminate(value: boolean) {
    const nativeCheckbox = this._inputElement;

    if (nativeCheckbox) {
      nativeCheckbox.nativeElement.indeterminate = value;
    }
  }
}
