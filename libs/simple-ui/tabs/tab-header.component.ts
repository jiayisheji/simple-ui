import { FocusableOption, FocusKeyManager } from '@angular/cdk/a11y';
import { END, ENTER, hasModifierKey, HOME, SPACE } from '@angular/cdk/keycodes';
import { ViewportRuler } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
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
  NgZone,
  OnDestroy,
  Output,
  QueryList,
  Renderer2,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { toNumber } from '@ngx-simple/simple-ui/core/coercion';
import { MixinElementRefBase, mixinUnsubscribe } from '@ngx-simple/simple-ui/core/common-behaviors';
import { merge, Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TabInkBarComponent } from './tab-ink-bar.component';
import { SimTabLabelWrapperDirective } from './tab-label-wrapper.directive';

export type TabHeaderItem = FocusableOption & { elementRef: ElementRef };

export type ScrollDirection = 'after' | 'before';

/**
 * 当将选项卡标签滚动到视图中时，以像素为单位的距离将被覆盖。这有助于为它旁边的标签提供一个小的启示。
 */
const EXAGGERATED_OVER_SCROLL = 60;

/**
 * 开始自动滚动报头前等待的毫秒数。
 * 设置得稍微保守一些，以便处理通过触摸设备发送的虚假事件。
 */
const HEADER_SCROLL_DELAY = 650;

/**
 * 以毫秒为单位的时间间隔，在用户持有指针时滚动报头
 */
const HEADER_SCROLL_INTERVAL = 100;

const _TabHeaderMixinBase = mixinUnsubscribe(MixinElementRefBase);

@Component({
  selector: 'sim-tab-header',
  templateUrl: './tab-header.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SimTabHeaderComponent extends _TabHeaderMixinBase implements AfterContentInit, AfterContentChecked, OnDestroy {
  @Input()
  get selectedIndex(): number {
    return this._selectedIndex;
  }
  set selectedIndex(value: number) {
    value = toNumber(value);
    if (this._selectedIndex !== value) {
      this._selectedIndexChanged = true;
      this._selectedIndex = value;
      if (this._keyManager) {
        this._keyManager.updateActiveItem(value);
      }
    }
  }

  /** 选择该选项时发出的事件 */
  @Output() readonly selectFocusedIndex: EventEmitter<number> = new EventEmitter<number>();

  /** 标签聚焦时发出的事件. */
  @Output() readonly indexFocused: EventEmitter<number> = new EventEmitter<number>();

  @ContentChildren(SimTabLabelWrapperDirective, { descendants: false })
  _items: QueryList<TabHeaderItem>;

  @ViewChild(TabInkBarComponent) _inkBar: TabInkBarComponent;
  @ViewChild('tabListContainer', { static: true })
  _tabListContainer: ElementRef<HTMLDivElement>;
  @ViewChild('tabList', { static: true }) _tabList: ElementRef<HTMLDivElement>;
  @ViewChild('nextPaginator', { static: true }) _nextPaginator: ElementRef<HTMLDivElement>;
  @ViewChild('previousPaginator', { static: true })
  _previousPaginator: ElementRef<HTMLDivElement>;

  /** 是否可以将选项卡列表更多地滚动到选项卡标签列表的末尾 */
  _disableScrollAfter: boolean;
  /** 是否可以将选项卡列表更多地滚动到选项卡标签列表的开头 */
  _disableScrollBefore: boolean;

  /** 是否应该显示分页控件 */
  @HostBinding('class.sim-tab-header-pagination-controls-enabled')
  _showPaginationControls = false;

  private _selectedIndex: number = 0;

  /** 用于管理标签之间的焦点 */
  private _keyManager: FocusKeyManager<TabHeaderItem>;

  /** 将停止自动滚动的流 */
  private _stopScrolling = new Subject<void>();

  /** 标签向左平移的距离(以像素为单位) */
  private _scrollDistance = 0;

  /** 滚动距离是否已更改，并且应在检查视图后应用 */
  private _scrollDistanceChanged: boolean;

  /** 检查视图后，标题是否应滚动到所选索引 */
  private _selectedIndexChanged = false;

  /** 缓存标题的文本内容 */
  private _currentTextContent: string;

  /** 标题上显示的标签页标签的数目。当这个改变时，标题应该重新计算滚动位置 */
  private _tabLabelCount: number;

  /** 跟踪哪个元素具有焦点； 用于键盘导航 */
  get focusIndex(): number {
    return this._keyManager ? this._keyManager.activeItemIndex : 0;
  }

  /** 设置焦点索引后，我们必须手动将焦点发送到正确的标签 */
  set focusIndex(value: number) {
    if (!this._isValidIndex(value) || this.focusIndex === value || !this._keyManager) {
      return;
    }
    this._keyManager.setActiveItem(value);
  }

  get scrollDistance(): number {
    return this._scrollDistance;
  }
  set scrollDistance(value: number) {
    this._scrollTo(value);
  }

  constructor(
    _elementRef: ElementRef,
    private _viewportRuler: ViewportRuler,
    private _changeDetectorRef: ChangeDetectorRef,
    private _ngZone: NgZone,
    private _platform: Platform,
    renderer: Renderer2
  ) {
    super(_elementRef);
    renderer.addClass(_elementRef.nativeElement, 'sim-tab-header');
  }

  ngAfterContentInit() {
    const resize = this._viewportRuler.change(150);
    const realign = () => {
      this.updatePagination();
      this._alignInkBarToSelectedTab();
    };

    this._keyManager = new FocusKeyManager<TabHeaderItem>(this._items).withWrap();

    this._keyManager.updateActiveItem(0);

    typeof requestAnimationFrame !== 'undefined' ? requestAnimationFrame(realign) : realign();

    merge(resize, this._items.changes)
      .pipe(takeUntil(this.simUnsubscribe$))
      .subscribe(() => {
        // 我们需要推迟此操作，以便浏览器有一些时间来重新计算元素尺寸。
        Promise.resolve().then(realign);
      });

    this._keyManager.change.pipe(takeUntil(this.simUnsubscribe$)).subscribe(newFocusIndex => {
      this.indexFocused.emit(newFocusIndex);
      this._setTabFocus(newFocusIndex);
    });
  }

  ngAfterContentChecked(): void {
    // 如果选项卡标签的数量已经改变，检查是否应该启用滚动
    if (this._tabLabelCount !== this._items.length) {
      this.updatePagination();
      this._tabLabelCount = this._items.length;
      this._changeDetectorRef.markForCheck();
    }

    // 如果所选的索引发生了更改，则滚动到标签并检查是否应该禁用滚动控件
    if (this._selectedIndexChanged) {
      this._scrollToLabel(this._selectedIndex);
      this._checkScrollingControls();
      this._alignInkBarToSelectedTab();
      this._selectedIndexChanged = false;
      this._changeDetectorRef.markForCheck();
    }

    // 如果滚动距离已经更改(选项卡选中、聚焦、滚动控件激活)，则转换标题以反映这一点。
    if (this._scrollDistanceChanged) {
      this._updateTabScrollPosition();
      this._scrollDistanceChanged = false;
      this._changeDetectorRef.markForCheck();
    }
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this._stopScrolling.complete();
  }

  /** 将焦点放在标签容器的HTML元素上，并在启用滚动时将其滚动到视图中 */
  _setTabFocus(tabIndex: number) {
    if (this._showPaginationControls) {
      this._scrollToLabel(tabIndex);
    }

    if (this._items && this._items.length) {
      this._items.toArray()[tabIndex].focus();

      // 不要让浏览器管理滚动来聚焦元素，默认应该是0
      const containerEl = this._tabListContainer.nativeElement;

      containerEl.scrollLeft = 0;
    }
  }

  _alignInkBarToSelectedTab(): void {
    const selectedItem = this._items && this._items.length ? this._items.toArray()[this.selectedIndex] : null;
    const selectedLabelWrapper = selectedItem ? selectedItem.elementRef.nativeElement : null;

    if (selectedLabelWrapper) {
      this._inkBar.alignToElement(selectedLabelWrapper);
    } else {
      this._inkBar.hide();
    }
  }

  _scrollToLabel(labelIndex: number) {
    const selectedLabel = this._items ? this._items.toArray()[labelIndex] : null;

    if (!selectedLabel) {
      return;
    }

    // 视图长度是标签的可见宽度
    const viewLength = this._tabListContainer.nativeElement.offsetWidth;
    const { offsetLeft, offsetWidth } = selectedLabel.elementRef.nativeElement;

    let labelBeforePos: number;
    let labelAfterPos: number;
    labelBeforePos = offsetLeft;
    labelAfterPos = labelBeforePos + offsetWidth;

    const beforeVisiblePos = this.scrollDistance;
    const afterVisiblePos = this.scrollDistance + viewLength;

    if (labelBeforePos < beforeVisiblePos) {
      // 滚动标题将标签移动到前方向
      this.scrollDistance -= beforeVisiblePos - labelBeforePos + EXAGGERATED_OVER_SCROLL;
    } else if (labelAfterPos > afterVisiblePos) {
      // 滚动标题将标签移动到后方向
      this.scrollDistance += labelAfterPos - afterVisiblePos + EXAGGERATED_OVER_SCROLL;
    }
  }

  _isValidIndex(index: number): boolean {
    if (!this._items) {
      return true;
    }

    const tab = this._items ? this._items.toArray()[index] : null;
    return !!tab && !tab.disabled;
  }

  _itemSelected(event: KeyboardEvent) {
    event.preventDefault();
  }

  /** 更新视图是否应启用分页 */
  updatePagination() {
    this._checkPaginationEnabled();
    this._checkScrollingControls();
    this._updateTabScrollPosition();
  }

  _checkPaginationEnabled() {
    const isEnabled = this._tabList.nativeElement.scrollWidth > this._elementRef.nativeElement.offsetWidth;

    if (!isEnabled) {
      this.scrollDistance = 0;
    }

    if (isEnabled !== this._showPaginationControls) {
      this._changeDetectorRef.markForCheck();
    }

    this._showPaginationControls = isEnabled;
  }

  /** 在选项卡列表上执行CSS transformation，这将导致列表滚动。 */
  _updateTabScrollPosition() {
    const scrollDistance = this.scrollDistance;
    const platform = this._platform;
    const translateX = -scrollDistance;

    // 不要在这里使用“ translate3d”，因为我们不想创建一个新层。
    // 新的层似乎会导致Internet Explorer中的闪烁和溢出。
    // 例如， ink-bar将超出可见标签分割线的边界。
    // See: https://github.com/angular/components/issues/10276
    // 我们在这里对“ transform”进行四舍五入，因为具有小数像素精度的转换会导致某些浏览器模糊元素的内容。
    this._tabList.nativeElement.style.transform = `translateX(${Math.round(translateX)}px)`;

    // 在IE上设置`transform`会更改父级的滚动偏移量，从而在某些情况下会导致位置偏离。
    // 我们必须自行重置它，以确保它不会被丢弃。 请注意，我们仅将其范围限制在IE和Edge，
    if (platform && (platform.TRIDENT || platform.EDGE)) {
      this._tabListContainer.nativeElement.scrollLeft = 0;
    }
  }

  /**
   * MutationObserver检测到内容已更改时的回调
   */
  _onContentChanges() {
    const textContent = this._elementRef.nativeElement.textContent;

    // 我们需要区分报头的文本内容，因为即使文本内容没有改变，
    // MutationObserver回调也会触发，这是低效的，而且如果传入一个构造糟糕的表达式，
    // 很容易导致无限循环
    if (textContent !== this._currentTextContent) {
      this._currentTextContent = textContent || '';

      // 默认情况下，内容观察器在'NgZone'之外运行，这意味着我们需要自己手动触发回调。
      this._ngZone.run(() => {
        this.updatePagination();
        this._alignInkBarToSelectedTab();
        this._changeDetectorRef.markForCheck();
      });
    }
  }

  /** 停止当前正在运行的分页器间隔 */
  _stopInterval() {
    this._stopScrolling.next();
  }

  _handlePaginatorClick(direction: ScrollDirection) {
    this._stopInterval();
    this._scrollHeader(direction);
  }

  _handlePaginatorPress(direction: ScrollDirection, mouseEvent?: MouseEvent) {
    // 不要开始自动滚动鼠标右键点击。请注意，我们不应该必须对'button'进行null检查，但我们这样做是为了不破坏使用假事件的测试。
    if (mouseEvent && mouseEvent.button != null && mouseEvent.button !== 0) {
      return;
    }

    // 避免重叠的计时器
    this._stopInterval();

    // 在延迟之后启动计时器，并根据间隔持续触发
    timer(HEADER_SCROLL_DELAY, HEADER_SCROLL_INTERVAL)
      .pipe(takeUntil(merge(this._stopScrolling, this.simUnsubscribe$)))
      .subscribe(() => {
        const { maxScrollDistance, distance } = this._scrollHeader(direction);

        // 如果我们到达了开始点或结束点，停止计时器。
        if (distance === 0 || distance >= maxScrollDistance) {
          this._stopInterval();
        }
      });
  }

  _scrollHeader(direction: ScrollDirection) {
    const viewLength = this._tabListContainer.nativeElement.offsetWidth;

    // 将滚动距离移动到标签列表可视区长度的三分之一
    const scrollAmount = ((direction === 'before' ? -1 : 1) * viewLength) / 3;

    return this._scrollTo(this._scrollDistance + scrollAmount);
  }

  /** 处理标签页标题上的键盘事件 */
  _handleKeydown(event: KeyboardEvent) {
    // 我们不使用修饰键来处理任何键绑定
    if (hasModifierKey(event)) {
      return;
    }

    // tslint:disable-next-line: deprecation
    switch (event.keyCode) {
      case HOME:
        this._keyManager.setFirstItemActive();
        event.preventDefault();
        break;
      case END:
        this._keyManager.setLastItemActive();
        event.preventDefault();
        break;
      case ENTER:
      case SPACE:
        if (this.focusIndex !== this.selectedIndex) {
          this.selectFocusedIndex.emit(this.focusIndex);
          this._itemSelected(event);
        }
        break;
      default:
        this._keyManager.onKeydown(event);
    }
  }

  private _checkScrollingControls() {
    // 检查是否应该激活分页箭头
    this._disableScrollBefore = this.scrollDistance === 0;
    this._disableScrollAfter = this.scrollDistance === this._getMaxScrollDistance();
    this._changeDetectorRef.markForCheck();
  }

  private _getMaxScrollDistance(): number {
    const lengthOfTabList = this._tabList.nativeElement.scrollWidth;
    const viewLength = this._tabListContainer.nativeElement.offsetWidth;
    return lengthOfTabList - viewLength || 0;
  }

  /** 将标题滚动到指定位置 */
  private _scrollTo(position: number) {
    const maxScrollDistance = this._getMaxScrollDistance();
    this._scrollDistance = Math.max(0, Math.min(maxScrollDistance, position));

    // 标记滚动距离已经改变，以便在视图被选中后，CSS transformation可以移动标题
    this._scrollDistanceChanged = true;
    this._checkScrollingControls();

    return { maxScrollDistance, distance: this._scrollDistance };
  }
}
