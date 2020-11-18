import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  Input,
  isDevMode,
  OnDestroy,
  Optional,
  Output
} from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, ValidatorFn } from '@angular/forms';
import { toBoolean } from '@ngx-simple/core/coercion';
import { ThemePalette } from '@ngx-simple/core/common-behaviors';
import { SimDateAdapter } from '@ngx-simple/core/datetime';
import { OnChangeType, OnTouchedType, ValidatorOnChange } from '@ngx-simple/core/types';
import { SimFormFieldComponent } from '@ngx-simple/simple-ui/form-field';
import { SIM_INPUT_VALUE_ACCESSOR } from '@ngx-simple/simple-ui/input';
import { Subject, Subscription } from 'rxjs';
import { DateFilterFn } from './time-view.component';
import { createMissingDateImplError } from './timepicker-errors';
import { SimTimepickerComponent } from './timepicker.component';

export class SimDatepickerInputEvent<D> {
  /** 与时间选择器关联 `simTimepickerInput` 的新值 */
  value: D | null;

  constructor(
    /** 对发出事件的`simTimepickerInput`组件的引用 */
    public target: SimTimepickerDirective<D>,
    /** 引用与日期选择器`simTimepickerInput`关联的<input />元素。 */
    public targetElement: HTMLElement
  ) {
    this.value = this.target.value;
  }
}

@Directive({
  selector: 'input[simTimepicker]',
  exportAs: 'simTimepickerInput',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SimTimepickerDirective),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SimTimepickerDirective),
      multi: true
    },
    { provide: SIM_INPUT_VALUE_ACCESSOR, useExisting: SimTimepickerDirective }
  ],
  host: {
    class: 'sim-timepicker-input',
    '[attr.min]': 'min ? _dateAdapter.toIso8601(min) : null',
    '[attr.max]': 'max ? _dateAdapter.toIso8601(max) : null'
  }
})
export class SimTimepickerDirective<D> implements ControlValueAccessor, AfterViewInit, OnDestroy {
  @Input()
  set simTimepicker(timepicker: SimTimepickerComponent<D>) {
    if (timepicker) {
      this._timepicker = timepicker;
      timepicker._registerInput(this);
    }
  }
  _timepicker: SimTimepickerComponent<D>;

  /** 最小有效时间 */
  @Input()
  get min(): D | null {
    return this._min;
  }
  set min(value: D | null) {
    const validValue = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));

    if (!this._dateAdapter.sameDate(validValue, this._min)) {
      this._min = validValue;
      this._validatorOnChange();
    }
  }
  private _min: D | null;

  /** 最大有效时间 */
  @Input()
  get max(): D | null {
    return this._max;
  }
  set max(value: D | null) {
    const validValue = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));

    if (!this._dateAdapter.sameDate(validValue, this._max)) {
      this._max = validValue;
      this._validatorOnChange();
    }
  }
  private _max: D | null;

  /** 可用于过滤时间选择器中时间的方法。 */
  @Input('simTimepickerFilter')
  get dateFilter() {
    return this._dateFilter;
  }
  set dateFilter(value: DateFilterFn<D | null>) {
    this._dateFilter = value;
    this._validatorOnChange();
  }
  private _dateFilter: DateFilterFn<D | null>;

  /** 输入的值 */
  @Input()
  get value(): D | null {
    return this._pendingValue;
  }
  set value(value: D | null) {
    value = this._dateAdapter.deserialize(value);
    this._lastValueValid = this._isValidValue(value);
    value = this._dateAdapter.getValidDateOrNull(value);
    const oldDate = this.value;
    this._pendingValue = value;
    this._formatValue(value);
    if (!this._dateAdapter.sameDatetime(oldDate, value)) {
      this._valueChange.emit(value);
    }
  }

  /** timepicker-input是否被禁用 */
  @Input()
  get disabled(): boolean {
    return !!this._disabled;
  }
  set disabled(value: boolean) {
    const newValue = toBoolean(value);
    const element = this._elementRef.nativeElement;

    if (this._disabled !== newValue) {
      this._disabled = newValue;
      this.stateChanges.next(undefined);
    }

    // 我们需要对`blur`方法进行空检查，因为在SSR中它是未定义的。
    // 在Ivy中，在元素附加到DOM之前，会更早地调用静态绑定。
    // 这可能会导致某些浏览器（IE / Edge）抛出错误，这些浏览器断言元素已插入。
    if (newValue && this._isInitialized && element.blur) {
      // 通常，如果本机输入元素被禁用，它们会自动模糊。
      // 这种行为是有问题的，因为这意味着它会触发另一个变更检测周期，
      // 如果输入元素之前位于焦点上，则它将导致检查后错误发生更改。
      element.blur();
    }
  }
  private _disabled: boolean;

  /**
   * 格式化input显示的时间字符串样式
   * - h 12小时字段的小时格式，不加零
   * - hh 12小时字段的小时格式，个位补零
   * - H 24小时字段的小时格式，不加零
   * - HH 24小时字段的小时格式，个位补零
   * - m 分钟字段，不加零
   * - mm 分钟字段，个位补零
   * - s 秒钟字段，不加零
   * - ss 秒钟字段，个位补零
   * - a 2个字符串，表示`AM/PM`字段
   */
  @Input() format: string = 'HH:mm:ss';

  /** 触发`change`事件时发出。 */
  @Output() readonly timeChange: EventEmitter<SimDatepickerInputEvent<D>> = new EventEmitter();

  /** 触发`input`事件时发出。 */
  @Output() readonly timeInput: EventEmitter<SimDatepickerInputEvent<D>> = new EventEmitter();

  // Implemented as part of ControlValueAccessor.
  _controlValueAccessorChangeFn: OnChangeType = () => {};
  // Implemented as part of ControlValueAccessor.
  _onTouched: OnTouchedType = () => {};
  // Implemented as part of Validator.
  _validatorOnChange: ValidatorOnChange = () => {};

  empty: boolean;

  /** 当内部状态发生变化时发出 */
  stateChanges = new Subject<void>();

  /** 值更改时（由于用户输入或程序更改）而发出 */
  _valueChange = new EventEmitter<D | null>();

  // Implemented as part of Validator.
  private _validator: ValidatorFn | null;
  private _pendingValue: D;
  private _lastValueValid: boolean;
  private _valueChangesSubscription: Subscription;

  /** 组件是否已初始化 */
  private _isInitialized: boolean;
  constructor(
    protected _elementRef: ElementRef<HTMLInputElement>,
    @Optional() public _dateAdapter: SimDateAdapter<D>,
    @Optional() private _formField: SimFormFieldComponent
  ) {
    if (!this._dateAdapter && isDevMode) {
      throw createMissingDateImplError('simDateAdapter');
    }
  }

  ngAfterViewInit() {
    this._isInitialized = true;
    this._valueChangesSubscription = this._timepicker._selectedChanged.subscribe((date: D) => {
      this.value = date;
      this._controlValueAccessorChangeFn(date);
      this._onTouched();
    });
  }

  ngOnDestroy() {
    this._valueChangesSubscription.unsubscribe();
    this._valueChange.complete();
    this.stateChanges.complete();
  }

  // Implemented as part of Validator.
  registerOnValidatorChange(fn: () => void): void {
    this._validatorOnChange = fn;
  }

  // Implemented as part of Validator.
  validate(c: AbstractControl): ValidationErrors | null {
    return this._validator ? this._validator(c) : null;
  }

  // Implemented as part of ControlValueAccessor.
  writeValue(value: D): void {
    this.value = value;
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
  }

  /**
   * 如果alt+ArrowDown
   */
  @HostListener('keydown.Alt.ArrowDown', ['$event'])
  _onKeydown(event: KeyboardEvent) {
    if (!this._elementRef.nativeElement.readOnly) {
      event.preventDefault();
      this._openPopup();
    }
  }

  /** 空格切换 */
  @HostListener('keydown.spacebar', ['$event'])
  @HostListener('keydown.space', ['$event'])
  _onKeydownSpace(event: KeyboardEvent) {
    if (!this._elementRef.nativeElement.readOnly) {
      event.preventDefault();
      this._openPopup();
    }
  }

  @HostListener('input', ['$event.target.value'])
  _onInput(value: string) {
    const lastValueWasValid = this._lastValueValid;
    let date = this._parseTime(value);
    this._lastValueValid = this._isValidValue(date);
    date = this._dateAdapter.getValidDateOrNull(date);
    if (!this._dateAdapter.sameDatetime(date, this.value)) {
      this._controlValueAccessorChangeFn(date);
      this._valueChange.emit(date);
      this.timeInput.emit(new SimDatepickerInputEvent(this, this._elementRef.nativeElement));
    } else {
      // 调用CVA更改处理程序以获取无效值, 因为这是将控件标记为脏的。
      if (value && !this.value) {
        this._controlValueAccessorChangeFn(date);
      }

      if (lastValueWasValid !== this._lastValueValid) {
        this._validatorOnChange();
      }
    }
  }

  @HostListener('change')
  _onChange() {
    this.timeChange.emit(new SimDatepickerInputEvent(this, this._elementRef.nativeElement));
  }

  @HostListener('click', ['$event'])
  _onClick(event: Event) {
    event.stopPropagation();
    this._openPopup();
  }

  /** 处理输入上的blur事件 */
  @HostListener('blur')
  _onBlur() {
    // 只有当我们有一个有效值时，才重新格式化输入
    if (this.value) {
      this._formatValue(this.value);
    }

    this._onTouched();
  }

  /** 获取主题 */
  getThemePalette(): ThemePalette {
    return this._formField ? this._formField.color : undefined;
  }

  /** 获取覆盖层相对dom */
  getConnectedOverlayOrigin() {
    return this._formField ? this._formField._connectionContainerRef : this._elementRef;
  }

  /** 解析时间字符串 */
  private _parseTime(time: string): D | null {
    console.log('_parseTime', time);
    // 暂未实现
    return null;
  }

  /** 值是否被视为有效 */
  private _isValidValue(value: D | null): boolean {
    return !value || this._dateAdapter.isValid(value);
  }

  private _openPopup() {
    if (this._timepicker) {
      this._timepicker.open();
    }
  }

  /** 格式化值并将其设置在输入元素上 */
  private _formatValue(value: D | null) {
    this._elementRef.nativeElement.value = value ? this._formatTime(value, this.format) : '';
    this.empty = !value;
  }

  private _formatTime(value: D, format: string): string {
    if (!value) {
      return '';
    } else {
      let hour = this._dateAdapter.getHours(value);
      let formattedSeconds: string, formattedMinute: string, formattedHour: string;

      const minute = this._dateAdapter.getMinutes(value);
      const seconds = this._dateAdapter.getSeconds(value);
      const amPM = hour > 11 ? 'PM' : 'AM';

      if (format.indexOf('h') !== -1) {
        if (hour > 12) {
          hour -= 12;
          formattedHour = hour < 10 && format.indexOf('hh') !== -1 ? '0' + hour : `${hour}`;
        } else if (hour === 0) {
          formattedHour = '12';
        } else if (hour < 10 && format.indexOf('hh') !== -1) {
          formattedHour = '0' + hour;
        } else {
          formattedHour = `${hour}`;
        }
      } else {
        if (hour < 10 && format.indexOf('HH') !== -1) {
          formattedHour = '0' + hour;
        } else {
          formattedHour = `${hour}`;
        }
      }

      formattedMinute = minute < 10 && format.indexOf('mm') !== -1 ? '0' + minute : `${minute}`;

      formattedSeconds = seconds < 10 && format.indexOf('ss') !== -1 ? '0' + seconds : `${seconds}`;

      return format
        .replace('hh', formattedHour)
        .replace('h', formattedHour)
        .replace('HH', formattedHour)
        .replace('H', formattedHour)
        .replace('mm', formattedMinute)
        .replace('m', formattedMinute)
        .replace('ss', formattedSeconds)
        .replace('s', formattedSeconds)
        .replace('tt', amPM);
    }
  }
}
