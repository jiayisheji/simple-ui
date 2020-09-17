import { FocusKeyManager } from '@angular/cdk/a11y';
import { END, hasModifierKey, HOME } from '@angular/cdk/keycodes';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  ElementRef,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  QueryList,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import { toBoolean } from '@ngx-simple/core/coercion';
import { InputBoolean } from '@ngx-simple/core/decorators';
import { Subject } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { SIM_EXPANSION } from './expansion-base';
import { SimExpansionPanelHeaderComponent } from './expansion-panel-header.component';
import { SimExpansionDisplayMode, SimExpansionTogglePosition } from './expansion.typings';

let nextId = 0;

@Component({
  selector: 'sim-expansion',
  template: '<ng-content></ng-content>',
  styleUrls: ['./expansion.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: SIM_EXPANSION,
      useExisting: SimExpansionComponent
    }
  ],
  host: {
    class: 'sim-expansion'
  }
})
export class SimExpansionComponent implements OnChanges, AfterContentInit, OnDestroy {
  /** 全局展开/收起所有面板 */
  @Input()
  get expanded(): boolean {
    return this._expanded;
  }
  set expanded(value: boolean) {
    const newExpandedState = toBoolean(value);
    if (this._expanded !== newExpandedState) {
      if (this._headers) {
        this._headers.forEach(item => {
          item.panel.expanded = newExpandedState;
        });
      }
    }
  }
  /**
   * 用于Expansion中所有ExpansionPanel的显示模式。 目前两个显示模式存在：
   * default 在任何ExpansionPanel周围都放置一个类似于沟槽的间距，将ExpansionPanel放置在与Expansion其他部分不同的高度上。
   * flat ExpansionPanel周围没有间隔，显示所有面板在同一高度
   */
  @Input() displayMode: SimExpansionDisplayMode = 'default';

  /** 是否应同时允许展开多个ExpansionPanel */
  @Input()
  @HostBinding('class.sim-expansion-multiple')
  @InputBoolean<SimExpansionComponent, 'multiple'>()
  multiple: boolean = false;

  /** 是否隐藏切换指示箭头 */
  @Input()
  @InputBoolean<SimExpansionComponent, 'hideToggle'>()
  hideToggle: boolean = false;

  /** 指示箭头显示位置 */
  @Input() togglePosition: SimExpansionTogglePosition = 'after';

  /** Expansion内所有标题 */
  @ContentChildren(SimExpansionPanelHeaderComponent, { descendants: true })
  _headers: QueryList<SimExpansionPanelHeaderComponent>;

  /** 触发`openAll/closeAll`时发出`true/false`的流 */
  readonly _openCloseAllActions: Subject<boolean> = new Subject<boolean>();

  /** 当Expansion的状态改变时发出 */
  readonly _stateChanges = new Subject<SimpleChanges>();

  readonly id = `sim-expansion-${nextId++}`;
  private _expanded: boolean = false;

  private _keyManager: FocusKeyManager<SimExpansionPanelHeaderComponent>;

  /** 属于当前Expansion的所有标题 */
  private _ownHeaders = new QueryList<SimExpansionPanelHeaderComponent>();

  constructor(_elementRef: ElementRef) {}

  ngOnChanges(changes: SimpleChanges) {
    this._stateChanges.next(changes);
  }

  ngAfterContentInit() {
    this._headers.changes.pipe(startWith(this._headers)).subscribe((headers: QueryList<SimExpansionPanelHeaderComponent>) => {
      this._ownHeaders.reset(headers.filter(header => header.panel.expansion === this));
      this._ownHeaders.notifyOnChanges();
    });

    this._keyManager = new FocusKeyManager(this._headers).withWrap();
  }

  ngOnDestroy(): void {
    this._stateChanges.complete();
  }

  /** 处理来自面板标题的键盘事件 */
  _handleHeaderKeydown(event: KeyboardEvent) {
    // tslint:disable-next-line: deprecation
    const { keyCode } = event;
    const manager = this._keyManager;

    if (keyCode === HOME) {
      if (!hasModifierKey(event)) {
        manager.setFirstItemActive();
        event.preventDefault();
      }
    } else if (keyCode === END) {
      if (!hasModifierKey(event)) {
        manager.setLastItemActive();
        event.preventDefault();
      }
    } else {
      this._keyManager.onKeydown(event);
    }
  }

  _handleHeaderFocus(header: SimExpansionPanelHeaderComponent) {
    this._keyManager.updateActiveItem(header);
  }

  /** 在启用multi时中打开所有启用的ExpansionPanel */
  openAll(): void {
    this._openCloseAll(true);
  }

  /** 在启用multi时中关闭所有启用的ExpansionPanel */
  closeAll(): void {
    this._openCloseAll(false);
  }

  private _openCloseAll(expanded: boolean): void {
    if (this.multiple) {
      this._openCloseAllActions.next(expanded);
    }
  }
}
