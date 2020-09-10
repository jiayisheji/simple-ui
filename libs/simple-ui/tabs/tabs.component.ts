import {
  AfterContentChecked,
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  Output,
  QueryList,
  Renderer2,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { toNumber } from '@ngx-simple/core/coercion';
import { CanColor, mixinColor, MixinElementRefBase, ThemePalette } from '@ngx-simple/core/common-behaviors';
import { InputBoolean } from '@ngx-simple/core/decorators';
import { merge, Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { SimTabHeaderComponent } from './tab-header.component';
import { SimTabComponent, SIM_TAB_GROUP } from './tab.component';

/** 聚焦或选择更改发出的change事件 */
export class SimTabChangeEvent {
  /** 当前所选标签页的索引 */
  index: number;
  /** 引用当前选择的标签页 */
  tab: SimTabComponent;
}

/** 用于为每个标签页组件生成唯一的ID */
let nextId = 0;

const _TabGroupMixinBase = mixinColor(MixinElementRefBase);

@Component({
  selector: 'sim-tabset',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: SIM_TAB_GROUP,
      useExisting: SimTabsComponent
    }
  ]
})
export class SimTabsComponent extends _TabGroupMixinBase implements AfterContentInit, AfterContentChecked, OnDestroy, CanColor {
  /** 活动标签页的索引 */
  @Input()
  get selectedIndex(): number | null {
    return this._selectedIndex;
  }
  set selectedIndex(value: number | null) {
    this._indexToSelect = toNumber(value, null);
  }
  @Input() color: ThemePalette;

  @Input()
  @HostBinding('class.sim-tabset-dynamic-height')
  @InputBoolean<SimTabsComponent, 'dynamicHeight'>()
  dynamicHeight: boolean;

  /** 标签页动画的持续时间 */
  @Input() animationDuration: string;

  /** 输出以支持在[(selectedIndex)]上双向绑定 */
  @Output() readonly selectedIndexChange: EventEmitter<number> = new EventEmitter<number>();

  /** 标签页组中聚焦已更改时发出的事件 */
  @Output() readonly focusChange: EventEmitter<SimTabChangeEvent> = new EventEmitter<SimTabChangeEvent>();

  /** 当内容动画完成时发出的事件 */
  @Output() readonly animationDone: EventEmitter<void> = new EventEmitter<void>();

  /** 标签页选择更改时发出的事件 */
  @Output() readonly selectedTabChange: EventEmitter<SimTabChangeEvent> = new EventEmitter<SimTabChangeEvent>(true);

  @ContentChildren(SimTabComponent, { descendants: true }) _allTabs: QueryList<SimTabComponent>;

  @ViewChild('tabContainer') _tabContainer: ElementRef<HTMLDivElement>;
  @ViewChild('tabHeader') _tabHeader: SimTabHeaderComponent;

  _tabs: QueryList<SimTabComponent> = new QueryList<SimTabComponent>();
  private _selectedIndex: number | null = null;

  private _groupId: number;

  /** 标签页索引，应该在内容被选中后选择 */
  private _indexToSelect: number | null = 0;

  /** 订阅要添加/删除的标签页 */
  private _tabsSubscription = Subscription.EMPTY;

  /** 订阅标签页中标签的更改 */
  private _tabLabelSubscription = Subscription.EMPTY;

  /** 在激活另一个标签页之前，标签页正文包装器的高度的快照 */
  private _tabContainerHeightSnapshot: number = 0;

  constructor(_elementRef: ElementRef, private _changeDetectorRef: ChangeDetectorRef, renderer: Renderer2) {
    super(_elementRef);
    renderer.addClass(_elementRef.nativeElement, 'sim-tabset');
    this._groupId = nextId++;
    this.animationDuration = '500ms';
    this.color = 'primary';
  }

  ngAfterContentInit(): void {
    this._subscribeToAllTabChanges();
    this._subscribeToTabLabels();

    // 订阅标签页数量的变化，以便能够在添加或删除新标签页时重新呈现内容。
    this._tabsSubscription = this._tabs.changes.subscribe(() => {
      const indexToSelect = this._clampTabIndex(this._indexToSelect);
      // 如果添加或删除了一个新标签页，并且没有选择其他标签页的显式更改，那么维护以前选择的标签页。
      if (indexToSelect === this._selectedIndex) {
        const tabs = this._tabs.toArray();

        for (let i = 0; i < tabs.length; i++) {
          if (tabs[i].isActive) {
            // 将这两个值赋给'_indexToSelect'和'_selectedIndex'，这样我们就不会触发一个已更改的事件，
            // 否则在某些边缘情况下，使用者可能会陷入无限循环，比如在'selectedIndexChange'事件中添加一个标签页。
            this._indexToSelect = this._selectedIndex = i;
            break;
          }
        }
      }

      this._changeDetectorRef.markForCheck();
    });
  }

  ngAfterContentChecked() {
    // 不要立即将'indexToSelect'放在setter中，因为在实际的更改检测运行之前，tabs的数量可能会发生变化。
    const indexToSelect = (this._indexToSelect = this._clampTabIndex(this._indexToSelect));

    // 如果所选索引中有更改，则发出更改事件。如果所选索引尚未初始化，则不应触发。
    if (this._selectedIndex !== indexToSelect) {
      const isFirstRun = this._selectedIndex == null;
      if (!isFirstRun) {
        this.selectedTabChange.emit(this._createChangeEvent(indexToSelect));
      }
      // 在更改检测运行后更改这些值，因为选中的内容可能包含对它们的引用。
      Promise.resolve().then(() => {
        this._tabs.forEach((tab, index) => (tab.isActive = index === indexToSelect));
        if (!isFirstRun) {
          this.selectedIndexChange.emit(indexToSelect);
        }
      });
    }
    // 设置每个标签页的位置，并可选地在下一个选中的标签页上设置原点。
    this._tabs.forEach((tab: SimTabComponent, index: number) => {
      tab.position = index - indexToSelect;
      // 如果已经存在一个选定的标签页，则为下一个选定的标签页（如果还没有一个）设置一个原点。
      if (this._selectedIndex != null && tab.position === 0 && !tab.origin) {
        tab.origin = indexToSelect - this.selectedIndex;
      }
    });
    if (this._selectedIndex !== indexToSelect) {
      this._selectedIndex = indexToSelect;
      this._changeDetectorRef.markForCheck();
    }
  }

  ngOnDestroy(): void {
    this._tabs.destroy();
    this._tabsSubscription.unsubscribe();
    this._tabLabelSubscription.unsubscribe();
  }

  /** 将tab-ink-bar重新对齐到选定的标签页元素 */
  realignInkBar() {
    if (this._tabHeader) {
      this._tabHeader._alignInkBarToSelectedTab();
    }
  }

  /** 如果dynamicHeight属性为真，则将主体容器的高度设置为激活标签页的高度。 */
  _setTabContainerHeight(tabHeight: number) {
    if (!this.dynamicHeight || !this._tabContainerHeightSnapshot) {
      return;
    }
    const wrapper: HTMLDivElement = this._tabContainer.nativeElement;

    // 这个条件会触发浏览器回流 强制浏览器绘制高度，以便动画到新的高度时可以有一个原点。
    if (wrapper.offsetHeight) {
      wrapper.style.height = tabHeight + 'px';
    }
  }

  /** 移除标签页主体容器的高度 */
  _removeTabContainerHeight(): void {
    const wrapper: HTMLDivElement = this._tabContainer.nativeElement;
    this._tabContainerHeightSnapshot = wrapper.clientHeight;
    wrapper.style.height = '';
    this.animationDone.emit();
  }

  _handleClick(tab: SimTabComponent, tabHeader: SimTabHeaderComponent, index: number) {
    if (!tab.disabled) {
      this.selectedIndex = tabHeader.focusIndex = index;
    }
  }

  _focusChanged(index: number) {
    this.focusChange.emit(this._createChangeEvent(index));
  }

  _getTabLabelId(i: number): string {
    return `sim-tab-label-${this._groupId}-${i}`;
  }

  _getTabContentId(i: number): string {
    return `sim-tab-content-${this._groupId}-${i}`;
  }

  /** 检索标签页的索引 */
  _getTabIndex(tab: SimTabComponent, idx: number): number | null {
    if (tab.disabled) {
      return null;
    }
    return this.selectedIndex === idx ? 0 : -1;
  }

  private _createChangeEvent(index: number): SimTabChangeEvent {
    const event = new SimTabChangeEvent();
    event.index = index;
    if (this._tabs && this._tabs.length) {
      event.tab = this._tabs.toArray()[index];
    }
    return event;
  }

  private _subscribeToTabLabels() {
    if (this._tabLabelSubscription) {
      this._tabLabelSubscription.unsubscribe();
    }

    this._tabLabelSubscription = merge(...this._tabs.map(tab => tab._stateChanges)).subscribe(() => this._changeDetectorRef.markForCheck());
  }

  /** 侦听所有标签页中的更改 */
  private _subscribeToAllTabChanges() {
    this._allTabs.changes.pipe(startWith(this._allTabs)).subscribe((tabs: QueryList<SimTabComponent>) => {
      this._tabs.reset(
        tabs.filter(tab => {
          return tab._closestTabGroup === this;
        })
      );
      this._tabs.notifyOnChanges();
    });
  }

  /** 将给定的索引限制为0和tabs长度 */
  private _clampTabIndex(index: number | null): number {
    // 注意' || 0 '，它确保像NaN这样的值不能通过，否则会将组件扔进一个无限循环(因为Math.max(NaN, 0) === NaN)。
    return Math.min(this._tabs.length - 1, Math.max(index || 0, 0));
  }
}
