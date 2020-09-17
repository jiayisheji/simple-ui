import { ENTER, hasModifierKey, SPACE } from '@angular/cdk/keycodes';
import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Inject,
  InjectionToken,
  Input,
  OnDestroy,
  Optional,
  Output,
  QueryList,
  ViewEncapsulation
} from '@angular/core';
import { toBoolean } from '@ngx-simple/core/coercion';
import { SafeAny } from '@ngx-simple/core/types';
import { Subject } from 'rxjs';
import { SimOptgroupComponent } from './optgroup.component';

/** 选项在选择或取消选择时发出的事件对象。 */
export class SimOptionSelectionChange {
  constructor(
    /** 参考发射事件的选项。 */
    public source: SimOptionComponent,
    /** 选项值的更改是否是用户操作的结果。 */
    public isUserInput = false
  ) {}
}

/**
 * 描述管理选项列表的父组件。包含选项可以继承的属性。
 */
export interface SimOptionParentComponent {
  multiple?: boolean;
}

/**
 * 用于向选项提供父组件的注入令牌。
 */
export const SIM_OPTION_PARENT_COMPONENT = new InjectionToken<SimOptionParentComponent>('SIM_OPTION_PARENT_COMPONENT');

/**
 * 选项id需要在组件之间是惟一的，所以这个计数器存在于组件定义之外。
 */
let _uniqueIdCounter = 0;

@Component({
  selector: 'sim-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sim-option',
    role: 'option',
    '[attr.tabindex]': 'disabled ? -1 : 0',
    '[attr.id]': 'id'
  }
})
export class SimOptionComponent implements AfterViewChecked, OnDestroy {
  /** 选项是否处于多选模式 */
  @HostBinding('class.sim-option-multiple')
  get multiple() {
    return this._parent && this._parent.multiple;
  }

  /** 当前是否选择该选项 */
  @HostBinding('class.sim-option-selected')
  get selected(): boolean {
    return this._selected;
  }

  /** 是否禁用该选项 */
  @Input()
  @HostBinding('class.sim-option-disabled')
  get disabled() {
    return (this.group && this.group.disabled) || this._disabled;
  }
  set disabled(value: SafeAny) {
    this._disabled = toBoolean(value);
  }

  /**
   * 该选项当前是否处于活动状态并准备好被选中。
   * 活动选项显示样式，就好像它是聚焦的一样，但焦点实际上保留在其他地方。
   * 这对于自动完成等组件非常有用，其中焦点必须保留在输入上。
   */
  @HostBinding('class.sim-option-active')
  get active(): boolean {
    return this._active;
  }

  /**
   * 选项的显示值。有必要在select的触发器中显示所选的选项。
   */
  get viewValue(): string {
    return (this._getHostElement().textContent || this.value || '').trim();
  }

  /** 选项的唯一ID */
  @Input()
  id: string = `sim-option-${_uniqueIdCounter++}`;

  /** 选项的表单值 */
  @Input() value: SafeAny;

  /** 选项的自定义数据 */
  @Input() data: SafeAny;

  /** 选择或取消选择该选项时发出的事件。 */
  @Output() readonly selectionChange = new EventEmitter<SimOptionSelectionChange>();
  /** 当选项的状态发生变化并且必须通知任何父组件时发出的通知 */
  readonly _stateChanges = new Subject<void>();
  /** 选中的项 */
  private _selected = false;
  /** 激活的项 */
  private _active = false;
  private _mostRecentViewValue = '';
  private _disabled = false;
  constructor(
    private _element: ElementRef<HTMLElement>,
    private _changeDetectorRef: ChangeDetectorRef,
    @Optional()
    @Inject(SIM_OPTION_PARENT_COMPONENT)
    private _parent: SimOptionParentComponent,
    @Optional() readonly group: SimOptgroupComponent
  ) {}

  ngAfterViewChecked() {
    // 由于父组件可以使用选项的标签来显示所选的值（例如`sim-select`），
    // 并且他们无法知道选项的标签是否已更改，我们必须自己检查DOM中的更改并发送 一个事件。
    // 这些检查相对便宜，但是我们仍然只将它们限制在选定的选项中，以避免过于频繁地访问DOM。
    if (this._selected) {
      const viewValue = this.viewValue;

      if (viewValue !== this._mostRecentViewValue) {
        this._mostRecentViewValue = viewValue;
        this._stateChanges.next();
      }
    }
  }

  ngOnDestroy() {
    this._stateChanges.complete();
  }

  /** 选择的选项。 */
  select(): void {
    this._selected = true;
    this._changeDetectorRef.markForCheck();
    this._emitSelectionChangeEvent();
  }

  /** 取消选中的选项。 */
  deselect(): void {
    this._selected = false;
    this._changeDetectorRef.markForCheck();
    this._emitSelectionChangeEvent();
  }

  /** 将焦点集中在此选项上。 */
  focus(): void {
    const element = this._getHostElement();

    if (typeof element.focus === 'function') {
      element.focus();
    }
  }

  /**
   * 此方法在选项上设置显示样式以使其显示为活动状态。
   * 这由ActiveDescendantKeyManager使用，因此关键事件将在箭头键事件上显示正确的选项。
   */
  setActiveStyles(): void {
    if (!this._active) {
      this._active = true;
      this._changeDetectorRef.markForCheck();
    }
  }

  /** 设置禁用 */
  setDisabled(disabled: boolean): void {
    this.disabled = disabled;
    this._changeDetectorRef.markForCheck();
  }

  /**
   * 此方法删除使其显示为活动状态的选项的显示样式。
   * 这由ActiveDescendantKeyManager使用，因此关键事件将在箭头键事件上显示正确的选项。
   */
  setInactiveStyles(): void {
    if (this._active) {
      this._active = false;
      this._changeDetectorRef.markForCheck();
    }
  }

  /** 获取宿主DOM元素。 */
  _getHostElement(): HTMLElement {
    return this._element.nativeElement;
  }

  /** 在确定是否应该集中选项时使用标签。 */
  getLabel(): string {
    return this.viewValue;
  }

  /**
   * 选择该选项，同时指示来自用户的选择。 用于确定是否应该调用select的视图 -> 模型回调
   */
  @HostListener('click', [])
  _selectViaInteraction(): void {
    if (!this.disabled) {
      this._selected = this.multiple ? !this._selected : true;
      this._changeDetectorRef.markForCheck();
      this._emitSelectionChangeEvent(true);
    }
  }

  /** 确保从键盘激活时选择该选项 */
  @HostListener('keydown', ['$event'])
  _handleKeydown(event: KeyboardEvent): void {
    // tslint:disable-next-line: deprecation
    if ((event.keyCode === ENTER || event.keyCode === SPACE) && !hasModifierKey(event)) {
      this._selectViaInteraction();

      // 防止页面向下滚动并形成提交
      event.preventDefault();
    }
  }

  /** 选择更改发出事件。 */
  private _emitSelectionChangeEvent(isUserInput = false): void {
    this.selectionChange.emit(new SimOptionSelectionChange(this, isUserInput));
  }
}
