import { AnimationEvent } from '@angular/animations';
import { UniqueSelectionDispatcher } from '@angular/cdk/collections';
import { TemplatePortal } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  HostBinding,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  SimpleChanges,
  SkipSelf,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import { toBoolean } from '@ngx-simple/core/coercion';
import { InputBoolean } from '@ngx-simple/core/decorators';
import { SafeAny } from '@ngx-simple/core/types';
import { Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, startWith, take } from 'rxjs/operators';
import { SimExpansionPanelDefaultOptions, SIM_EXPANSION_PANEL_DEFAULT_OPTIONS } from './default-options';
import { simExpansionAnimations } from './expansion-animations';
import { SimExpansionBase, SIM_EXPANSION } from './expansion-base';
import { SimExpansionPanelContentDirective } from './expansion.directive';
import { SimExpansionPanelState, SimExpansionTogglePosition } from './expansion.typings';

/** 用于生成唯一元素id的计数器 */
let uniqueId = 0;
/** 用于生成唯一元素id的计数器 */
let nextId = 0;

@Component({
  selector: 'sim-expansion-panel',
  templateUrl: './expansion-panel.component.html',
  styleUrls: ['./expansion.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [simExpansionAnimations.bodyExpansion],
  providers: [{ provide: SIM_EXPANSION, useValue: undefined }],
  host: {
    class: 'sim-expansion-panel'
  }
})
export class SimExpansionPanelComponent implements OnChanges, OnInit, AfterContentInit, OnDestroy {
  /** ExpansionPanel是否已展开 */
  @Input()
  @HostBinding('class.sim-expansion-panel-expanded')
  get expanded(): boolean {
    return this._expanded;
  }
  set expanded(expanded: boolean) {
    expanded = toBoolean(expanded);

    // 如果值更改，则仅发出事件并更新内部值
    if (this._expanded !== expanded) {
      this._expanded = expanded;
      this.expandedChange.emit(expanded);

      if (expanded) {
        this.opened.emit();
        /**
         * 在唯一选择调度程序中，id参数是ExpansionPanel的id， name值是Expansion的id。
         */
        const expansionId = this.expansion ? this.expansion.id : this.id;
        this._expansionDispatcher.notify(this.id, expansionId);
      } else {
        this.closed.emit();
      }
      this._changeDetectorRef.markForCheck();
    }
  }
  /** 是否应同时允许展开多个ExpansionPanel */
  @Input()
  @HostBinding('class.sim-expansion-panel-disabled')
  @InputBoolean<SimExpansionPanelComponent, 'disabled'>()
  disabled: boolean = false;

  /** 是否隐藏切换指示箭头 */
  @Input()
  @InputBoolean<SimExpansionPanelComponent, 'hideToggle'>()
  hideToggle: boolean = (this.expansion && this.expansion.hideToggle) || false;

  /** 指示箭头显示位置 */
  @Input() togglePosition: SimExpansionTogglePosition = (this.expansion && this.expansion.togglePosition) || 'after';

  /** 每次打开ExpansionPanel时发出的事件 */
  @Output() readonly opened: EventEmitter<void> = new EventEmitter<void>();
  /** 每次关闭ExpansionPanel时发出的事件 */
  @Output() readonly closed: EventEmitter<void> = new EventEmitter<void>();

  /**
   * 每当ExpansionPanel的expanded状态更改时发出。
   * 主要用于方便双向绑定。
   */
  @Output() readonly expandedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  /** 在body展开动画发生后发出的事件 */
  @Output() readonly afterExpand = new EventEmitter<void>();

  /** 在body折叠动画发生后发出的事件 */
  @Output() readonly afterCollapse = new EventEmitter<void>();

  @ContentChild(SimExpansionPanelContentDirective)
  _lazyContent: SimExpansionPanelContentDirective;

  /** 包含面板用户提供内容的元素 */
  @ViewChild('body') _body: ElementRef<HTMLDivElement>;

  readonly id: string = `sim-expansion-panel-${nextId++}`;

  /** 关联标题元素的ID。用于a11y标签 */
  readonly _headerId: string = `sim-expansion-panel-header-${uniqueId++}`;

  /** 为`@Input`属性中的更改而发出的流 */
  readonly _inputChanges = new Subject<SimpleChanges>();

  /** 保存用户内容的门户 */
  portal: TemplatePortal;

  @HostBinding('class.sim-expansion-panel-spacing')
  get _hasSpacing(): boolean {
    if (this.expansion) {
      return this.expanded && this.expansion.displayMode === 'default';
    }
    return false;
  }

  /** body动画完成事件流 */
  _bodyAnimationDone = new Subject<AnimationEvent>();

  private _expanded = false;

  private _document: Document;

  /** 订阅`openAll/closeAll`事件 */
  private _openCloseAllSubscription = Subscription.EMPTY;

  /** 取消注册_expansionDispatcher的方法 */
  private _removeUniqueSelectionListener: () => void = () => {};

  constructor(
    @Optional()
    @SkipSelf()
    @Inject(SIM_EXPANSION)
    public expansion: SimExpansionBase,
    private _changeDetectorRef: ChangeDetectorRef,
    protected _expansionDispatcher: UniqueSelectionDispatcher,
    private _viewContainerRef: ViewContainerRef,
    _elementRef: ElementRef,
    @Inject(DOCUMENT) _document: SafeAny,
    @Inject(SIM_EXPANSION_PANEL_DEFAULT_OPTIONS)
    @Optional()
    defaultOptions?: SimExpansionPanelDefaultOptions
  ) {
    this._removeUniqueSelectionListener = _expansionDispatcher.listen((id: string, expansionId: string) => {
      if (this.expansion && !this.expansion.multiple && this.expansion.id === expansionId && this.id !== id) {
        this.expanded = false;
      }
    });

    if (defaultOptions) {
      this.hideToggle = defaultOptions.hideToggle;
    }

    if (this.expansion) {
      this._openCloseAllSubscription = this._subscribeToOpenCloseAllActions();
    }

    this._bodyAnimationDone
      .pipe(
        distinctUntilChanged((x, y) => {
          return x.fromState === y.fromState && x.toState === y.toState;
        })
      )
      .subscribe(event => {
        if (event.fromState !== 'void') {
          if (event.toState === 'expanded') {
            this.afterExpand.emit();
          } else if (event.toState === 'collapsed') {
            this.afterCollapse.emit();
          }
        }
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    this._inputChanges.next(changes);
  }

  ngOnInit(): void {}

  ngAfterContentInit() {
    if (this._lazyContent) {
      // 面板打开后立即渲染内容。
      this.opened
        .pipe(
          startWith(null as void),
          filter(() => this.expanded && !this.portal),
          take(1)
        )
        .subscribe(() => {
          this.portal = new TemplatePortal(this._lazyContent._template, this._viewContainerRef);
        });
    }
  }

  ngOnDestroy(): void {
    this.opened.complete();
    this.closed.complete();
    this._removeUniqueSelectionListener();
    this._openCloseAllSubscription.unsubscribe();
  }

  /** 获取展开的状态字符串 */
  _getExpandedState(): SimExpansionPanelState {
    return this.expanded ? 'expanded' : 'collapsed';
  }

  /** 切换ExpansionPanel的`expanded`状态 */
  toggle(): void {
    if (!this.disabled) {
      this.expanded = !this.expanded;
    }
  }

  /** 将ExpansionPanel的`expanded`状态设置为false */
  close(): void {
    if (!this.disabled) {
      this.expanded = false;
    }
  }

  /** 将ExpansionPanel的`expanded`状态设置为true */
  open(): void {
    if (!this.disabled) {
      this.expanded = true;
    }
  }

  containsFocus(): boolean {
    if (this._body) {
      const focusedElement = this._document.activeElement;
      const bodyElement = this._body.nativeElement;
      return focusedElement === bodyElement || bodyElement.contains(focusedElement);
    }

    return false;
  }

  private _subscribeToOpenCloseAllActions(): Subscription {
    return this.expansion._openCloseAllActions.subscribe(expanded => {
      // 仅在启用项时更改展开状态
      if (!this.disabled) {
        this.expanded = expanded;
      }
    });
  }
}
