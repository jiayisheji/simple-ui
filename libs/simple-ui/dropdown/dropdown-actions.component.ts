import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  NgZone,
  Output,
  QueryList,
  ViewEncapsulation
} from '@angular/core';
import { mixinColor, MixinElementRefBase, mixinUnsubscribe, untilUnmounted } from '@ngx-simple/core/common-behaviors';
import { InputBoolean } from '@ngx-simple/core/decorators';
import { SimOptionComponent, SimOptionSelectionChange, SIM_OPTION_PARENT_COMPONENT } from '@ngx-simple/simple-ui/option';
import { defer, merge, Observable } from 'rxjs';
import { filter, startWith, switchMap, take, takeUntil } from 'rxjs/operators';
import { SimDropdownComponent } from './dropdown.component';

type DropdownActionsValue = string | number;

/** 当选择值发生更改时发出的更改事件对象。 */
export class SimDropdownActionsChange<T extends DropdownActionsValue> {
  constructor(
    /** 引用发出更改事件的select。 */
    public source: SimOptionComponent,
    /** 发出事件的select的当前值。 */
    public value: T
  ) {}
}

const _DropdownActionsMixinBase = mixinUnsubscribe(mixinColor(MixinElementRefBase, 'primary'));

@Component({
  selector: 'sim-dropdown-actions',
  template: '<ng-content></ng-content>',
  styleUrls: ['./dropdown.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: SIM_OPTION_PARENT_COMPONENT, useExisting: SimDropdownActionsComponent }],
  host: {
    class: 'sim-dropdown-actions'
  }
})
export class SimDropdownActionsComponent extends _DropdownActionsMixinBase implements AfterContentInit {
  @Input()
  @InputBoolean<SimDropdownActionsComponent, 'selectable'>()
  selectable: boolean;

  /**
   * 当用户更改所选值时发出的事件
   */
  @Output() readonly selectionChange: EventEmitter<SimDropdownActionsChange<DropdownActionsValue>> = new EventEmitter();

  /** 所有定义的选择选项 */
  @ContentChildren(SimOptionComponent, { descendants: true })
  options: QueryList<SimOptionComponent>;

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

  private _lastSelectionOption: SimOptionComponent;

  constructor(
    _elementRef: ElementRef,
    private _ngZone: NgZone,
    private _changeDetector: ChangeDetectorRef,
    private parentDropdown: SimDropdownComponent
  ) {
    super(_elementRef);
  }

  ngAfterContentInit(): void {
    this.options.changes.pipe(startWith(null as SimOptionComponent), untilUnmounted(this)).subscribe(() => {
      this._resetOptions();
    });
  }

  /** 单击选项时调用 */
  _onSelect(option: SimOptionComponent, isUserInput: boolean): void {
    if (this._lastSelectionOption) {
      this._lastSelectionOption.deselect();
    }
    this.selectionChange.next(new SimDropdownActionsChange(option, option.value));
    if (this.parentDropdown) {
      this.parentDropdown.dismiss();
    }
    this._lastSelectionOption = option;
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
        if (this.selectable) {
          this._onSelect(event.source, event.isUserInput);
        } else {
          // 强制不能选中
          event.source.deselect();
        }
      });

    // 监听选项内部状态的变化并做出相应的反应
    // 处理诸如所选选项的标签更改之类的情况
    merge(...this.options.map(option => option._stateChanges))
      .pipe(takeUntil(changedOrDestroyed))
      .subscribe(() => {
        this._changeDetector.markForCheck();
      });
  }
}

@Directive({
  selector: '[simDropdownActionsClose]',
  host: {
    class: 'sim-dropdown-actions-close'
  }
})
export class SimDropdownActionsCloseDirective {
  @Input()
  @InputBoolean<SimDropdownActionsCloseDirective, 'disabled'>()
  disabled: boolean;

  constructor(private parentDropdown: SimDropdownActionsComponent, private optionComponent: SimOptionComponent) {}

  @HostListener('click', ['$event'])
  _handleClick(event: Event): void {
    event.stopPropagation();
    if (this.parentDropdown && this.optionComponent && !this.disabled) {
      this.optionComponent.select();
      this.parentDropdown._onSelect(this.optionComponent, true);
    }
  }
}
