import { TemplatePortal } from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ElementRef,
  HostBinding,
  Inject,
  InjectionToken,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import { CanDisable, mixinDisabled, MixinElementRefBase } from '@ngx-simple/core/common-behaviors';
import { SafeAny } from '@ngx-simple/core/types';
import { Subject } from 'rxjs';
import { SimTabContentDirective } from './tab-content.directive';
import { SimTabLabelDirective } from './tab-label.directive';

const _TabMixinBase = mixinDisabled(MixinElementRefBase);

/** 用于在不引起循环依赖的情况下向标签页提供标签页组。 */
export const SIM_TAB_GROUP = new InjectionToken<SafeAny>('SIM_TAB_GROUP');

@Component({
  selector: 'sim-tab',
  template: '<ng-template><ng-content></ng-content></ng-template>',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SimTabComponent extends _TabMixinBase implements OnChanges, OnInit, OnDestroy, CanDisable {
  /** 自定义标签的内容 `<ng-template sim-tab-label>` */
  @ContentChild(SimTabLabelDirective)
  get templateLabel(): SimTabLabelDirective {
    return this._templateLabel;
  }
  set templateLabel(value: SimTabLabelDirective) {
    // 如果确实找到SimTabLabel，则仅通过查询来更新templateLabel。
    // 这可以解决以下问题：用户可能在创建模式期间手动设置了“templateLabel”，
    // 然后当此查询解析时，其会被“undefined”破坏。
    if (value) {
      this._templateLabel = value;
    }
  }
  /** 是否禁用 */
  @Input()
  @HostBinding('class.sim-tab-disabled')
  disabled: boolean;

  /** 标签页的纯文本标签，在没有模板标签时使用 */
  @Input() label: string = '';

  /**
   * 标签页内容中提供的模板（如果存在）将被使用，用于启用延迟加载
   */
  @ContentChild(SimTabContentDirective, { read: TemplateRef, static: true })
  _lazyContent: TemplateRef<SafeAny>;

  /** 包含'<ng-content>'的sim-tab视图中的模板 */
  @ViewChild(TemplateRef, { static: true }) _implicitContent: TemplateRef<SafeAny>;

  /** 相对索引的位置，0表示中心，负的表示左，正表示右 */
  position: number | null = null;

  /**
   * 标签页的初始相对索引原点(如果它是在已经有一个选中的标签页之后创建和选中的)。
   * 提供标签页应该源自的位置的上下文。
   */
  origin: number | null = null;

  /** 当前标签页是否处于活动状态 */
  isActive: boolean = false;

  /** 每当标签页的内部状态更改时发出. */
  readonly _stateChanges = new Subject<void>();

  private _templateLabel: SimTabLabelDirective;

  /** 将作为标签页的托管内容的门户 */
  private _contentPortal: TemplatePortal | null = null;

  get content(): TemplatePortal | null {
    return this._contentPortal;
  }

  constructor(
    _elementRef: ElementRef,
    private _viewContainerRef: ViewContainerRef,
    @Optional() @Inject(SIM_TAB_GROUP) public _closestTabGroup: SafeAny
  ) {
    super(_elementRef);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('textLabel') || changes.hasOwnProperty('disabled')) {
      this._stateChanges.next();
    }
  }

  ngOnInit(): void {
    this._contentPortal = new TemplatePortal(this._lazyContent || this._implicitContent, this._viewContainerRef);
  }

  ngOnDestroy(): void {
    this._stateChanges.complete();
  }
}
