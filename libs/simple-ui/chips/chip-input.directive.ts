import { ENTER, hasModifierKey, TAB } from '@angular/cdk/keycodes';
import { Directive, ElementRef, EventEmitter, HostListener, Input, OnChanges, Output } from '@angular/core';
import { BooleanInput, toBoolean } from '@ngx-simple/core/coercion';
import { SimChipListComponent } from './chip-list.component';
import { SimChipTextControl } from './chip-text-control';

/** simChipInput 上的输入事件。 */
export interface SimChipInputEvent {
  /** 正在为其触发事件的'<input>'元素 */
  input: HTMLInputElement;

  /** input的值 */
  value: string;
}

// 递增整数，用于生成惟一id
let nextUniqueId = 0;

/**
 * 向'<sim-form-field'中的输入元素添加特定于芯片的行为的指令。可以放在'<sim-chip-list>'的内部或外部。
 */
@Directive({
  selector: 'input[simChipInputFor]',
  exportAs: 'simChipInput',
  host: {
    class: 'sim-chip-input sim-input',
    '[id]': 'id',
    '[attr.placeholder]': 'placeholder || null'
  }
})
export class SimChipInputDirective implements SimChipTextControl, OnChanges {
  /** 兼容ivy编译 */
  static ngAcceptInputType_simChipInputAddOnBlur: BooleanInput;
  static ngAcceptInputType_disabled: BooleanInput;

  /** input控件是否被聚焦 */
  focused: boolean = false;
  _chipList: SimChipListComponent<string>;

  /** 为芯片列表注册input */
  @Input('simChipInputFor')
  set chipList(value: SimChipListComponent<string>) {
    if (value) {
      this._chipList = value;
      this._chipList.registerInput(this);
    }
  }

  /**
   * 当input失去焦点，芯片组事件是否会被发出。
   */
  @Input()
  get simChipInputAddOnBlur(): boolean {
    return this._addOnBlur;
  }
  set simChipInputAddOnBlur(value: boolean) {
    this._addOnBlur = toBoolean(value);
  }
  _addOnBlur: boolean = false;

  /** input 是否被禁用 */
  @Input()
  get disabled(): boolean {
    return this._disabled || (this._chipList && this._chipList.disabled);
  }
  set disabled(value: boolean) {
    this._disabled = toBoolean(value);
  }
  private _disabled: boolean = false;

  /** input 的 placeholder */
  @Input() placeholder: string = '';

  /** input的惟一id */
  @Input() id: string = `sim-chip-list-input-${nextUniqueId++}`;

  /**
   * 将触发添加芯片事件的键码列表 默认 `[ENTER]`
   */
  @Input() simChipInputSeparatorKeyCodes: readonly number[] | ReadonlySet<number> = [ENTER];

  /** 当要添加芯片时发出 */
  @Output() readonly simChipInputTokenEnd: EventEmitter<SimChipInputEvent> = new EventEmitter<SimChipInputEvent>();

  /** input是否为空 */
  get empty(): boolean {
    return !this._inputElement.value;
  }

  /** 附加此指令的原生input元素 */
  protected _inputElement: HTMLInputElement;

  constructor(protected _elementRef: ElementRef<HTMLInputElement>) {
    this._inputElement = this._elementRef.nativeElement as HTMLInputElement;
  }

  ngOnChanges() {
    this._chipList.stateChanges.next();
  }

  /** input框触发键盘事件 */
  @HostListener('keydown', ['$event'])
  _keydown(event?: KeyboardEvent) {
    // 允许用户的焦点转义时，他们的标签前进。注意，我们不想在向后走的时候这样做，因为焦点应该回到第一个芯片。
    // tslint:disable-next-line: deprecation
    if (event && event.keyCode === TAB && !hasModifierKey(event, 'shiftKey')) {
      this._chipList._allowFocusEscape();
    }

    this._emitChipEnd(event);
  }

  /** 失去焦点，检查是否应该发出(芯片组)事件 */
  @HostListener('blur', [])
  _blur() {
    if (this.simChipInputAddOnBlur) {
      this._emitChipEnd();
    }
    this.focused = false;
    // 如果芯片列表没有聚焦，芯片列表失去焦点
    if (!this._chipList.focused) {
      this._chipList._blur();
    }
    this._chipList.stateChanges.next();
  }

  /** 处理自定义按键 */
  @HostListener('focus', [])
  _focus() {
    this.focused = true;
    this._chipList.stateChanges.next();
  }

  /** 检查是否需要发出(chipEnd)事件 */
  _emitChipEnd(event?: KeyboardEvent) {
    if (!this._inputElement.value && !!event) {
      this._chipList._keydown(event);
    }
    if (!event || this._isSeparatorKey(event)) {
      this.simChipInputTokenEnd.emit({ input: this._inputElement, value: this._inputElement.value });

      if (event) {
        event.preventDefault();
      }
    }
  }

  /** input输入事件 */
  @HostListener('input', [])
  _onInput() {
    // 让芯片列表知道每当值改变
    this._chipList.stateChanges.next();
  }

  /** 获取焦点 */
  focus(options?: FocusOptions): void {
    this._inputElement.focus(options);
  }

  /** 检查键码是否是配置的分隔符之一 */
  private _isSeparatorKey(event: KeyboardEvent): boolean {
    // tslint:disable-next-line: deprecation
    return !hasModifierKey(event) && new Set(this.simChipInputSeparatorKeyCodes).has(event.keyCode);
  }
}
