import { FocusMonitor } from '@angular/cdk/a11y';
import {
  AfterContentInit,
  Attribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  Input,
  OnDestroy,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { toBoolean } from '@ngx-simple/core/coercion';
import {
  CanColor,
  CanDisable,
  HasTabIndex,
  mixinColor,
  mixinDisabled,
  MixinElementRefBase,
  mixinTabIndex,
  ThemePalette
} from '@ngx-simple/core/common-behaviors';
import { InputBoolean } from '@ngx-simple/core/decorators';
import { OnChangeType, OnTouchedType } from '@ngx-simple/core/types';

let nextUniqueId = 0;

/**
 * 标签显示的位置
 */
export type SwitchLabelPosition = 'before' | 'after';

/** 更改SimSwitch发出的事件对象 */
export class SimSwitchChange {
  constructor(
    /** 事件的源 */
    public source: SimSwitchComponent,
    /** 新`checked`值 */
    public checked: boolean
  ) {}
}

const _SimSwitchMixinBase = mixinTabIndex(mixinDisabled(mixinColor(MixinElementRefBase, 'primary')));

@Component({
  selector: 'sim-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sim-switch',
    role: 'switch',
    '[id]': 'id',
    '[class.sim-switch-toggle]': 'true',
    '[attr.tabindex]': 'disabled ? null : -1'
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SimSwitchComponent),
      multi: true
    }
  ]
})
export class SimSwitchComponent extends _SimSwitchMixinBase
  implements OnDestroy, AfterContentInit, ControlValueAccessor, CanDisable, CanColor, HasTabIndex {
  /** switch是否必填 */
  @Input()
  @InputBoolean<SimSwitchComponent, 'required'>()
  required: boolean;

  /** 切换动作是否在switch中触发值变化。 */
  @Input()
  @InputBoolean<SimSwitchComponent, 'disableToggleValue'>()
  disableToggleValue: boolean = false;

  /** 切换动作是否触发加载中动画 */
  @Input()
  @HostBinding('class.sim-switch-loading')
  @InputBoolean<SimSwitchComponent, 'loading'>()
  loading: boolean;

  /** switch滑块 */
  @Input()
  @InputBoolean<SimSwitchComponent, 'slider'>()
  slider: boolean = false;

  /** switch是否选中 */
  @Input()
  @HostBinding('class.sim-switch-checked')
  get checked(): boolean {
    return this._checked;
  }
  set checked(value: boolean) {
    const newCheckedState = toBoolean(value);
    if (this._checked !== newCheckedState) {
      this._checked = newCheckedState;
      this._changeDetectorRef.markForCheck();
    }
  }
  private _checked: boolean;

  @Input()
  @HostBinding('class.sim-switch-disabled')
  disabled: boolean;

  @Input() color: ThemePalette;

  /** switch的唯一id。如果没有提供，它将自动生成。 */
  @Input() id: string;

  /** Name值将应用于<input type="checkbox"> */
  @Input() name: string | null = null;

  /**
   * 标签文本应该显示在switch按钮after还是before。默认: after
   */
  @Input() labelPosition: SwitchLabelPosition = 'after';

  /** 每次switch切换其值时都会调用change事件 */
  // tslint:disable-next-line: no-output-native
  @Output() readonly change: EventEmitter<SimSwitchChange> = new EventEmitter<SimSwitchChange>();

  /**
   * 每当switch的<input>元素被切换时，就会分配一个事件。
   * 此事件总是在用户切换switch时发出，但这并不意味着switch的值已经改变。
   */
  @Output() readonly toggleChange: EventEmitter<void> = new EventEmitter<void>();

  /** 对<input type="checkbox">的引用 */
  @ViewChild('input') _inputElement: ElementRef<HTMLInputElement>;

  /**
   * Implemented as part of ControlValueAccessor
   */
  _onTouched: OnTouchedType = () => {};

  /**
   * Implemented as part of ControlValueAccessor
   */
  private _controlValueAccessorChangeFn: OnChangeType = () => {};

  /** 返回视觉隐藏input的唯一ID */
  get inputId(): string {
    return `${this.id || 'sim-switch-' + nextUniqueId++}-input`;
  }

  /** 自动生成唯一id */
  protected _uniqueId: string = `sim-switch-${nextUniqueId++}`;

  constructor(
    _elementRef: ElementRef,
    private _focusMonitor: FocusMonitor,
    protected _changeDetectorRef: ChangeDetectorRef,
    @Attribute('tabindex') tabIndex: string
  ) {
    super(_elementRef);
    this.tabIndex = parseInt(tabIndex, 10) || 0;
    this.id = this._uniqueId;
  }

  ngAfterContentInit() {
    this._focusMonitor.monitor(this._elementRef, true).subscribe(focusOrigin => {
      // 当通过编程或通过键盘接收时，只能手动向前聚焦。我们不应该这样做鼠标/触摸焦点有两个原因:
      // 1. 它可以阻止点击在Chrome上登陆
      // 2. 它们已经被包装的“label”元素处理了。
      if (focusOrigin === 'keyboard' || focusOrigin === 'program') {
        this._inputElement.nativeElement.focus();
      } else if (!focusOrigin) {
        // 当一个被聚焦的元素被禁用时，浏览器会“立即”触发一个 blur 事件。
        // Angular不希望在变更检测期间引发事件，所以任何状态的变更(比如表单控件的“ng-touched”)都会导致检查后的变更错误。
        // See https://github.com/angular/angular/issues/17793.
        // 为了解决这个问题，我们将告诉表单控件它已经被触摸推迟到下一个tick。
        Promise.resolve().then(() => this._onTouched());
      }
    });
  }

  ngOnDestroy() {
    this._focusMonitor.stopMonitoring(this._elementRef);
  }

  /**
   * Implemented as part of ControlVueAccessor
   */
  writeValue(value: boolean): void {
    const newCheckedState = toBoolean(value);
    // 如果输入一样就直接返回
    if (this.checked === newCheckedState) {
      return;
    }
    this.checked = value;
  }
  /**
   * Implemented as part of ControlVueAccessor
   */
  registerOnChange(fn: OnChangeType): void {
    this._controlValueAccessorChangeFn = fn;
  }

  /**
   * Implemented as part of ControlVueAccessor
   */
  registerOnTouched(fn: OnTouchedType): void {
    this._onTouched = fn;
  }

  /**
   * Implemented as part of ControlVueAccessor
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this._changeDetectorRef.markForCheck();
  }

  onChangeEvent(event: Event) {
    event.stopPropagation();

    /** 如果禁用或者加载中都不需要继续操作 */
    if (this.disabled || this.loading) {
      return;
    }

    const nativeElement = this._inputElement.nativeElement;

    if (this.disableToggleValue) {
      nativeElement.checked = this.checked;
      return;
    }

    // 将<input type="checkbox">值同步到组件上
    this.checked = nativeElement.checked;

    // 仅当<input type="checkbox">发出更改事件时，才发出我们的自定义更改事件。
    // 这确保了当检查的状态以编程方式更改时，不存在change事件。
    this._emitChangeEvent();
  }

  onInputClick(event: Event) {
    event.stopPropagation();
  }

  /** 聚焦 */
  focus(options?: FocusOptions): void {
    this._focusMonitor.focusVia(this._inputElement, 'keyboard', options);
  }

  toggle(): void {
    this.checked = !this.checked;
    this._controlValueAccessorChangeFn(this.checked);
  }

  /**
   * 在“change”输出上发出更改事件。并通知FormControl有关更改的信息。
   */
  private _emitChangeEvent() {
    this._controlValueAccessorChangeFn(this.checked);
    this.change.emit(new SimSwitchChange(this, this.checked));
  }
}

let nextUniqueId2 = 0;

@Component({
  selector: 'sim-slide-toggle',
  templateUrl: './slide-toggle.component.html',
  styleUrls: ['./switch.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sim-slide-toggle',
    '[class.sim-switch-toggle]': 'false',
    '[class.sim-switch-label-before]': 'labelPosition == "before"'
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SimSwitchComponent),
      multi: true
    }
  ]
})
export class SimSlideToggleComponent extends SimSwitchComponent {
  /** 返回视觉隐藏input的唯一ID */
  get inputId(): string {
    return `${this.id || this._uniqueId}-input`;
  }

  _uniqueId = `sim-slide-toggle-${nextUniqueId2++}`;

  /** 每当标签文本更改时调用 */
  _onLabelTextChange() {
    // 由于“cdkObserveContent”指令的事件运行在区域之外，switch切换组件将只被标记为检查，但是没有实际的变化检测自动运行。
    // 我们没有返回到区域去触发一个导致所有组件被检查的变更检测(如果显式标记或不使用OnPush)，
    // 而是只触发一个switch切换视图及其子视图的显式变更检测。
    this._changeDetectorRef.detectChanges();
  }
}
