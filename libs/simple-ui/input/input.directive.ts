import { Platform } from '@angular/cdk/platform';
import { AutofillMonitor } from '@angular/cdk/text-field';
import {
  Directive,
  DoCheck,
  ElementRef,
  HostBinding,
  HostListener,
  Inject,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Self
} from '@angular/core';
import { FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { toBoolean } from '@ngx-simple/core/coercion';
import { CanSize, ErrorStateMatcher, mixinErrorState, mixinSize, ThemeSize } from '@ngx-simple/core/common-behaviors';
import { InputBoolean } from '@ngx-simple/core/decorators';
import { isString } from '@ngx-simple/core/typeof';
import { SimFormFieldControl } from '@ngx-simple/simple-ui/form-field';
import { SIM_INPUT_VALUE_ACCESSOR } from './input-value-accessor';

class SimInputBase {
  constructor(
    public _elementRef: ElementRef<HTMLInputElement | HTMLTextAreaElement>,
    public _defaultErrorStateMatcher: ErrorStateMatcher,
    public _parentForm: NgForm,
    public _parentFormGroup: FormGroupDirective,
    public ngControl: NgControl
  ) {}
}

const _SimInputMixinBase = mixinSize(mixinErrorState(SimInputBase), 'medium');

let nextUniqueId = 0;

@Directive({
  selector: 'input[simInput], textarea[simInput]',
  exportAs: 'simInput',
  providers: [{ provide: SimFormFieldControl, useExisting: SimInputDirective }],
  host: {
    class: 'sim-input',
    /** 自动补全关闭 */
    '[attr.autocomplete]': '"off"'
  }
})
export class SimInputDirective extends _SimInputMixinBase
  implements OnChanges, OnInit, DoCheck, OnDestroy, CanSize, SimFormFieldControl<string> {
  @Input() size: ThemeSize;

  /**
   * ignore white spaces/empty spaces。
   * fix validate Successful, content display error
   */
  @Input()
  @InputBoolean<SimInputDirective, 'ignoreWhitespace'>()
  ignoreWhitespace: boolean = true;

  @Input()
  get value(): string {
    return this._inputValueAccessor.value;
  }
  set value(value: string) {
    if (value !== this.value) {
      this._inputValueAccessor.value = value;
      this.stateChanges.next();
    }
  }

  @Input()
  @HostBinding('disabled')
  get disabled(): boolean {
    if (this.ngControl && this.ngControl.disabled !== null) {
      return this.ngControl.disabled;
    }
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = toBoolean(value);
    console.log(this);
    // 如果输入被快速禁用，浏览器可能不会触发模糊事件。
    // 从这里重置，以确保元素不会被卡住。
    if (this.focused) {
      this.focused = false;
      this.stateChanges.next();
    }
  }

  /** 控件是否为空 */
  get empty(): boolean {
    return !this._elementRef.nativeElement.value.trim();
  }

  @Input()
  @HostBinding('attr.id')
  id: string = `sim-input-${nextUniqueId++}`;

  /** 提示占位符 */
  @Input()
  @HostBinding('attr.placeholder')
  placeholder: string;

  /** 是否只读 */
  @Input()
  @InputBoolean<SimInputDirective, 'readonly'>()
  @HostBinding('attr.readonly')
  readonly: boolean;

  /** 是否必填 */
  @Input()
  @InputBoolean<SimInputDirective, 'required'>()
  @HostBinding('required')
  required: boolean;

  /** 控件是否聚焦 */
  focused: boolean = false;

  controlType: string = 'sim-input';

  autofilled: boolean = false;

  private _disabled = false;
  private _previousNativeValue: string;

  private _inputValueAccessor: { value: string };

  constructor(
    _elementRef: ElementRef<HTMLInputElement | HTMLTextAreaElement>,
    _platform: Platform,
    @Optional() @Self() public ngControl: NgControl,
    @Optional() _parentForm: NgForm,
    @Optional() _parentFormGroup: FormGroupDirective,
    _defaultErrorStateMatcher: ErrorStateMatcher,
    private _autofillMonitor: AutofillMonitor,
    @Optional()
    @Self()
    @Inject(SIM_INPUT_VALUE_ACCESSOR)
    inputValueAccessor: any,
    ngZone: NgZone
  ) {
    super(_elementRef, _defaultErrorStateMatcher, _parentForm, _parentFormGroup, ngControl);
    // 如果没有显式指定输入值访问器，则使用元素作为输入值访问器。
    this._inputValueAccessor = inputValueAccessor || _elementRef.nativeElement;
    this._previousNativeValue = this.value;
    // 在没有指定id的情况下调用强制设置。
    this.id = this.id;

    /**
     * 在 iOS 的某些版本中, 当按住 delete 键时, 插入符号会卡在错误的位置。
     * 为了绕过这个, 我们需要 "摇动" 插入符号松散。
     * 因为这个 bug 只存在于 ios 上, 所以我们只会在 ios 上安装监听器。
     */
    if (_platform.IOS) {
      ngZone.runOutsideAngular(() => {
        _elementRef.nativeElement.addEventListener('keyup', (event: Event) => {
          const el = event.target as HTMLInputElement;
          if (!el.value && !el.selectionStart && !el.selectionEnd) {
            // 注意:仅仅设置“0,0”并不能解决问题。
            // 设置“1,1”将第一次修改为您输入文本，然后保存delete。
            // 切换到' 1,1 '然后回到' 0,0 '似乎完全修复了它。
            el.setSelectionRange(1, 1);
            el.setSelectionRange(0, 0);
          }
        });
      });
    }
  }

  ngOnChanges() {
    this.stateChanges.next();
  }

  ngOnInit() {
    this._autofillMonitor.monitor(this._elementRef.nativeElement).subscribe(event => {
      this.autofilled = event.isAutofilled;
      this.stateChanges.next();
    });
  }

  ngDoCheck() {
    if (this.ngControl) {
      // 我们需要在每个变更检测周期中重新评估，因为有一些
      // 我们不能订阅的错误触发器(例如父表单提交)。这意味着
      // 无论这里的逻辑是什么，都必须非常精简，否则我们就有可能破坏性能。
      this.updateErrorState();
    }

    // 我们需要对原生元素的值进行脏检查，
    // 因为在某些情况下，更改时我们不会收到通知
    // (例如，使用者没有使用表单，或者他们正在使用“emitEvent: false”更新值)。
    this._dirtyCheckNativeValue();
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this._autofillMonitor.stopMonitoring(this._elementRef.nativeElement);
  }

  /** 为了同时支持Ivy和ViewEngine，我们必须使用一个“HostListener”。在Ivy中，当这个类被扩展时，“host”绑定会被合并，而在ViewEngine中，它们会被覆盖。 */
  @HostListener('input')
  _onInput() {
    // 这是一个noop函数，用于在值发生变化时让Angular知道。
    // 每当“input”事件被发送时，Angular都会运行一个新的变更检测。
    // 当输入使用FormsModule或ReactiveFormsModule时，监听输入事件就没有必要了，因为Angular表单也监听输入事件。
  }

  @HostListener('focus', ['true'])
  @HostListener('blur', ['false'])
  _focusChanged(isFocused: boolean) {
    if (isFocused !== this.focused && (!this.readonly || !isFocused)) {
      this.focused = isFocused;

      // 处理空白字符串问题
      if (!isFocused && this.ignoreWhitespace && isString(this.value)) {
        this._elementRef.nativeElement.value = this._elementRef.nativeElement.value.trim();
        this.value = this.value.trim();

        if (this.ngControl && this.ngControl.value !== null) {
          // 处理值
          const value = this.value === '' ? null : this.value;
          // 更新angular/form值
          this.ngControl.control.setValue(value);
          // 清空验证错误
          this.ngControl.control.setErrors(null);
          // 强制检查值更新并检查错误问题
          const timer = setTimeout(() => {
            this.ngControl.control.markAsDirty();
            this.ngControl.control.updateValueAndValidity();
            clearTimeout(timer);
          }, 1);
        }
      }
      this.stateChanges.next();
    }
  }

  focus(options?: FocusOptions): void {
    this._elementRef.nativeElement.focus(options);
  }

  setDescribedByIds(ids: string[]) {}

  onContainerClick(event: MouseEvent) {
    if (!this.focused) {
      this.focus();
    }
  }

  clearValue() {
    this.value = null;
    this.ngControl.control.setValue(null);
    this.ngControl.control.setErrors(null);
  }

  /** 对原生input的value属性进行一些手动脏检查。 */
  private _dirtyCheckNativeValue() {
    const newValue = this._elementRef.nativeElement.value;
    if (this._previousNativeValue !== newValue) {
      this._previousNativeValue = newValue;
      this.stateChanges.next();
    }
  }
}
