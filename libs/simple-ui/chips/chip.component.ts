import { BACKSPACE, DELETE, SPACE } from '@angular/cdk/keycodes';
import {
  Attribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Directive,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  NgZone,
  OnDestroy,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { BooleanInput, NumberInput, toBoolean } from '@ngx-simple/core/coercion';
import { CanColor, CanColorCtor, HasTabIndexCtor, mixinColor, mixinTabIndex, ThemePalette } from '@ngx-simple/core/common-behaviors';
import { InputBoolean } from '@ngx-simple/core/decorators';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';

export class SimChipSelectionChange<T> {
  constructor(
    /** 对发出事件的芯片的引用 */
    public source: SimChipComponent<T>,
    /** 发出事件的芯片是否被选中 */
    public selected: boolean,
    /** 选择更改是否是用户交互的结果 */
    public isUserInput = false
  ) {}
}

export interface SimChipEvent<T> {
  /** 触发事件的芯片 */
  chip: SimChipComponent<T>;
}

/** @docs-private */
abstract class SimChipBase {
  abstract disabled: boolean;
  constructor(public _elementRef: ElementRef) {}
}

const _SimChipMixinBase: CanColorCtor & HasTabIndexCtor & typeof SimChipBase = mixinColor(mixinTabIndex(SimChipBase, -1));

@Component({
  selector: 'sim-chip',
  template: '<ng-content></ng-content>',
  styleUrls: ['./chip.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sim-chip sim-focus-indicator',
    role: 'option',
    '[attr.tabindex]': 'disabled ? null : tabIndex'
  }
})
export class SimChipComponent<T> extends _SimChipMixinBase implements OnDestroy, CanColor {
  /** 兼容ivy编译 */
  static ngAcceptInputType_selected: BooleanInput;
  static ngAcceptInputType_selectable: BooleanInput;
  static ngAcceptInputType_removable: BooleanInput;
  static ngAcceptInputType_disabled: BooleanInput;
  static ngAcceptInputType_tabIndex: NumberInput;

  /** 芯片是否被选中 */
  @Input()
  @HostBinding('class.sim-chip-selected')
  get selected(): boolean {
    return this._selected;
  }
  set selected(value: boolean) {
    const coercedValue = toBoolean(value);

    if (coercedValue !== this._selected) {
      this._selected = coercedValue;
      this._dispatchSelectionChange();
    }
  }
  private _selected: boolean;

  /** 芯片的值 默认为'<sim-chip>'标签内的内容 */
  @Input()
  get value(): T {
    return this._value !== undefined ? this._value : this._elementRef.nativeElement.textContent;
  }
  set value(value: T) {
    this._value = value;
  }
  private _value: T;

  /**
   * 芯片是否可选择。
   * 当芯片不可选择时，对其选择状态的更改总是被忽略。
   * 默认情况下，芯片是可选择的。
   * 如果它的父芯片列表是不可选择的，它就变成不可选择的。
   */
  @Input()
  @HostBinding('class.sim-chip-selectable')
  get selectable(): boolean {
    return this._selectable;
  }
  set selectable(value: boolean) {
    this._selectable = toBoolean(value);

    if (!this.color && this._selectable) {
      this.color = 'primary';
    }
  }
  private _selectable: boolean = false;

  /** 芯片是否被禁用 */
  @Input()
  @HostBinding('class.sim-chip-disabled')
  get disabled(): boolean {
    return this._disabled || this._chipListDisabled;
  }
  set disabled(value: boolean) {
    this._disabled = toBoolean(value);
  }
  private _disabled: boolean = false;

  /** 芯片是否显示删除按钮和发出(已删除)事件 */
  @Input()
  @InputBoolean<SimChipComponent<T>, 'removable'>()
  @HostBinding('class.sim-chip-removable')
  removable: boolean;

  /**
   * 组件的主题颜色调色板
   * - primary 主要的
   * - secondary 次要的
   * - success 成功的
   * - info 信息的
   * - warning 警告的
   * - danger 危险的/错误的
   */
  @Input() color: ThemePalette;

  /** 当芯片被选择或取消选择时发出 */
  @Output() readonly selectionChange: EventEmitter<SimChipSelectionChange<T>> = new EventEmitter();

  /** 当芯片被销毁时发出 */
  @Output() readonly destroyed: EventEmitter<SimChipEvent<T>> = new EventEmitter();

  /** 当要删除芯片时发出 */
  @Output() readonly removed: EventEmitter<SimChipEvent<T>> = new EventEmitter();

  /** 当芯片聚焦时发出 */
  readonly _onFocus: Subject<SimChipEvent<T>> = new Subject();

  /** 当芯片失焦时发出 */
  readonly _onBlur: Subject<SimChipEvent<T>> = new Subject();

  /** 芯片是否有焦点 */
  _hasFocus: boolean = false;

  /** 芯片列表是否处于多选择模式 */
  _chipListMultiple: boolean = false;

  /** 芯片列表作为一个整体是否被禁用 */
  _chipListDisabled: boolean = false;

  constructor(
    _elementRef: ElementRef,
    private _ngZone: NgZone,
    private _changeDetectorRef?: ChangeDetectorRef,
    @Attribute('tabindex') tabIndex?: string
  ) {
    super(_elementRef);
    this.tabIndex = tabIndex != null ? parseInt(tabIndex, 10) || -1 : -1;
  }

  ngOnDestroy() {
    this.destroyed.emit({ chip: this });
  }

  /** 处理芯片上的单击事件 */
  @HostListener('click', ['$event'])
  _handleClick(event: Event) {
    if (this.disabled) {
      event.preventDefault();
    } else {
      event.stopPropagation();
    }
    // 如果我们是可选择的，切换聚焦芯片
    if (this.selectable) {
      this.toggleSelected(true);
    }
  }

  /** 处理自定义按键 */
  @HostListener('keydown', ['$event'])
  _handleKeydown(event: KeyboardEvent): void {
    if (this.disabled) {
      return;
    }

    // tslint:disable-next-line: deprecation
    switch (event.keyCode) {
      case DELETE:
      case BACKSPACE:
        // 如果我们是可移动的，移走聚焦芯片
        this.remove();
        // 阻止默认事件
        event.preventDefault();
        break;
      case SPACE:
        // 如果我们是可选择的，切换聚焦芯片
        if (this.selectable) {
          this.toggleSelected(true);
        }

        // 阻止默认事件
        event.preventDefault();
        break;
    }
  }

  /** 允许编程聚焦芯片 */
  @HostListener('focus', [])
  focus(): void {
    if (!this._hasFocus) {
      this._elementRef.nativeElement.focus();
      this._onFocus.next({ chip: this });
    }
    this._hasFocus = true;
  }

  @HostListener('blur', [])
  _blur(): void {
    // 当启用动画时，Angular可能会比平时更早一点从DOM中删除芯片，导致它失去焦点，并抛弃了转移焦点而不是下一项的芯片列表中的逻辑。
    // 为了解决这个问题，我们推迟标记芯片为不聚焦，直到下一次区域稳定。
    this._ngZone.onStable.pipe(take(1)).subscribe(() => {
      this._ngZone.run(() => {
        this._hasFocus = false;
        this._onBlur.next({ chip: this });
      });
    });
  }

  /** 选择芯片 */
  select(): void {
    if (!this._selected) {
      this._selected = true;
      this._dispatchSelectionChange();
      this._changeDetectorRef.markForCheck();
    }
  }

  /** 取消选择芯片. */
  deselect(): void {
    if (this._selected) {
      this._selected = false;
      this._dispatchSelectionChange();
      this._changeDetectorRef.markForCheck();
    }
  }

  /** 选择此芯片并发出所选事件 */
  selectViaInteraction(): void {
    if (!this._selected) {
      this._selected = true;
      this._dispatchSelectionChange(true);
      this._changeDetectorRef.markForCheck();
    }
  }

  /** 切换此芯片的当前选择状态 */
  toggleSelected(isUserInput: boolean = false): boolean {
    this._selected = !this.selected;
    this._dispatchSelectionChange(isUserInput);
    this._changeDetectorRef.markForCheck();
    return this.selected;
  }

  /** 通知订阅删除请求。不直接从DOM中移除芯片。 */
  remove(): void {
    if (this.removable) {
      this.removed.emit({ chip: this });
    }
  }

  _markForCheck() {
    this._changeDetectorRef.markForCheck();
  }

  private _dispatchSelectionChange(isUserInput = false) {
    this.selectionChange.emit({
      source: this,
      isUserInput,
      selected: this._selected
    });
  }
}

@Directive({
  selector: '[simChipRemove]',
  host: {
    class: 'sim-chip-remove'
  }
})
export class SimChipRemoveDirective {
  constructor(protected _parentChip: SimChipComponent<string>, elementRef?: ElementRef<HTMLElement>) {
    if (elementRef && elementRef.nativeElement.nodeName === 'BUTTON') {
      elementRef.nativeElement.setAttribute('type', 'button');
    }
  }

  @HostListener('click', ['$event'])
  _handleClick(event: Event): void {
    const parentChip = this._parentChip;
    if (parentChip.removable && !parentChip.disabled) {
      parentChip.remove();
    }
    event.stopPropagation();
  }
}
