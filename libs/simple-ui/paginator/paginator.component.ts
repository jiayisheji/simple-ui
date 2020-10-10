import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  HostBinding,
  Inject,
  InjectionToken,
  Input,
  OnInit,
  Optional,
  Output,
  Renderer2,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { toNumber } from '@ngx-simple/core/coercion';
import {
  CanDisable,
  CanSize,
  mixinDisabled,
  MixinElementRefBase,
  mixinInitialized,
  mixinSize,
  ThemePalette,
  ThemeSize
} from '@ngx-simple/core/common-behaviors';
import { InputBoolean } from '@ngx-simple/core/decorators';
import { SafeAny } from '@ngx-simple/core/types';
import { SimPaginatorIntl } from './paginator-intl';

/**
 * 更改事件对象，当用户选择不同的每页条数或当前页数时，该对象将被释放。
 */
export class SimPageEvent {
  /** 当前页数 */
  pageIndex: number;
  /** 上一次选择的页数 */
  previousPageIndex?: number;
  /** 每页条数  */
  pageSize: number;
  /** 当前被分页的项的总数 */
  pageTotal: number;
}

const enum PageItemType {
  First = 'first',
  Prev = 'prev',
  Prev_5 = 'prev_5',
  Page = 'page',
  Next_5 = 'next_5',
  Next = 'next',
  Last = 'last'
}

interface PageItem {
  title: string;
  type: PageItemType;
  index?: number;
  text: string;
  disabled?: boolean;
}

/** 可用于配置分页器模块的默认选项 */
export interface SimPaginatorDefaultOptions {
  /** 每页条数。默认设置为10 */
  pageSize?: number;

  /** 提供给用户显示的一组每页条数选项 */
  pageSizeOptions?: number[];

  /** 是否对用户隐藏每页条数选择UI */
  hidePageSize?: boolean;

  /** 是否对用户隐藏输入快速跳转页数UI */
  hideJumperPage?: boolean;

  /** 是否向用户显示第一个/最后一个按钮的UI */
  showFirstLastButtons?: boolean;
}

/** 注入令牌，可用于为分页器模块提供默认选项 */
export const SIM_PAGINATOR_DEFAULT_OPTIONS = new InjectionToken<SimPaginatorDefaultOptions>('SIM_PAGINATOR_DEFAULT_OPTIONS');

const _SimPaginatorBase = mixinDisabled(mixinInitialized(mixinSize(MixinElementRefBase, 'medium')));

@Component({
  selector: 'sim-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SimPaginatorComponent extends _SimPaginatorBase implements OnInit, CanDisable, CanSize {
  @Input() color: ThemePalette;

  @Input()
  @HostBinding('class.sim-paginator-disabled')
  disabled: boolean;

  @Input()
  size: ThemeSize;

  /**
   * 显示当前页数
   * @default 1
   */
  @Input()
  get pageIndex(): number {
    return this._pageIndex;
  }
  set pageIndex(value: number) {
    if (this._pageIndex === value) {
      return;
    }
    const pageIndex = toNumber(value, 1);
    this._pageIndex = this._validatePageIndex(pageIndex, this._lastIndex);
    if (this._initialized) {
      this._buildIndexes();
    }
    this._changeDetectorRef.markForCheck();
  }

  /**
   * 一页显示的条数
   * @default 10
   */
  @Input()
  get pageSize(): number {
    return this._pageSize;
  }
  set pageSize(value: number) {
    if (this._pageSize === value) {
      return;
    }
    this._pageSize = toNumber(value, 10);
    this._updateDisplayedPageSizeOptions();
  }

  /** 分页的总数 */
  @Input()
  get pageTotal(): number {
    return this._pageTotal;
  }
  set pageTotal(value: number) {
    if (this._pageTotal === value) {
      return;
    }
    this._pageTotal = toNumber(value, 0);
    if (this._initialized) {
      this._buildIndexes();
    }
    this._changeDetectorRef.markForCheck();
  }

  /**
   * 每页条数选择配置
   * @default [10, 20, 30, 40, 50]
   */
  @Input()
  pageSizeOptions: number[] = [10, 20, 30, 40, 50];

  /**
   * 是否隐藏每页条数选择。
   * @default true
   */
  @Input()
  @InputBoolean<SimPaginatorComponent, 'hidePageSize'>()
  hidePageSize: boolean = true;

  /**
   * 是否隐藏快速跳转页数。
   * @default true
   */
  @Input()
  @InputBoolean<SimPaginatorComponent, 'hideJumperPage'>()
  hideJumperPage: boolean = true;

  /**
   * 是否显示第一个/最后一个按钮。
   * @default false
   */
  @Input()
  @InputBoolean<SimPaginatorComponent, 'showFirstLastButtons'>()
  showFirstLastButtons: boolean;

  /** 当分页器更改每页条数或当前页数时发出的事件。 */
  @Output() readonly pageChange: EventEmitter<SimPageEvent> = new EventEmitter<SimPageEvent>();

  @ContentChild('simPaginatorTotal') simPaginatorTotal: TemplateRef<SafeAny>;
  @ContentChild('simPaginatorItem') simPaginatorItem: TemplateRef<SafeAny>;

  /** 当前分页的区间 */
  ranges: number[] = [0, 0];
  /** 分页按钮列表 */
  pages: PageItem[];

  _displayedPageSizeOptions: number[] = [];

  _rangeLabel: string;
  /** 第一页索引 */
  private readonly _firstIndex: number = 1;
  private _lastIndex: number;
  private _initialized: boolean;
  private _pageIndex: number = this._firstIndex;
  private _pageSize: number = 10;
  private _pageTotal: number = null;

  constructor(
    elementRef: ElementRef,
    renderer: Renderer2,
    private _intl: SimPaginatorIntl,
    private _changeDetectorRef: ChangeDetectorRef,
    @Optional()
    @Inject(SIM_PAGINATOR_DEFAULT_OPTIONS)
    defaults?: SimPaginatorDefaultOptions
  ) {
    super(elementRef);
    renderer.addClass(elementRef.nativeElement, 'sim-paginator');
    if (defaults) {
      const { pageSize, pageSizeOptions, hidePageSize, showFirstLastButtons, hideJumperPage } = defaults;

      if (pageSize != null) {
        this._pageSize = pageSize;
      }

      if (pageSizeOptions != null) {
        this.pageSizeOptions = pageSizeOptions;
      }

      if (hidePageSize != null) {
        this.hidePageSize = hidePageSize;
      }

      if (hideJumperPage != null) {
        this.hideJumperPage = hideJumperPage;
      }

      if (showFirstLastButtons != null) {
        this.showFirstLastButtons = showFirstLastButtons;
      }
    }
  }

  ngOnInit() {
    this._initialized = true;
    this._buildIndexes();
    this._updateDisplayedPageSizeOptions();
    this.markInitialized();
  }

  _trackByPageItem(_: number, value: PageItem): string {
    return `${value.type}-${value.index}`;
  }

  _onPageIndexChange(page: PageItem) {
    const index = {
      first: this._firstIndex,
      last: this._lastIndex,
      page: page.index,
      next: this.pageIndex + 1,
      prev: this.pageIndex - 1,
      prev_5: this.pageIndex - 5,
      next_5: this.pageIndex + 5
    }[page.type];
    this._goToPage(index);
  }

  _onPageSizeChange(pageSize: number) {
    // 当前页面需要更新以反映新的页面大小。导航到包含前一个页面的第一项的页面。
    const startIndex = this.pageIndex * this.pageSize;
    const previousPageIndex = this.pageIndex;
    this.pageSize = pageSize;
    this.pageIndex = Math.floor(startIndex / pageSize) || this._firstIndex;
    this._emitPageEvent(previousPageIndex);
    if (this.pageIndex === previousPageIndex) {
      this._buildIndexes();
    }
  }

  // 处理输入跳转的键盘事件
  _handleKeyDown(event: KeyboardEvent, input: HTMLInputElement) {
    if (event) {
      event.stopPropagation();
    }
    const index = toNumber(input.value, this.pageIndex);
    this._goToPage(index);
    input.value = '';
  }

  private _updateDisplayedPageSizeOptions() {
    if (!this._initialized) {
      return;
    }

    // 如果没有提供每页条数，使用每页条数选项或默认每页条数
    if (!this.pageSize) {
      this._pageSize = this.pageSizeOptions.length !== 0 ? this.pageSizeOptions[0] : 10;
    }

    this._displayedPageSizeOptions = this.pageSizeOptions.slice();

    // 使用特定于数字的排序函数对数字进行排序
    this._displayedPageSizeOptions = Array.from(new Set([...this._displayedPageSizeOptions, this.pageSize])).sort((a, b) => a - b);
    this._changeDetectorRef.markForCheck();
  }

  private _goToPage(index: number) {
    let pageIndex = this.pageIndex;
    if (index === pageIndex) {
      return;
    }
    const previousPageIndex = this.pageIndex;
    if (index < this._firstIndex) {
      pageIndex = this._firstIndex;
    } else if (index > this._lastIndex) {
      pageIndex = this._lastIndex;
    } else {
      pageIndex = index;
    }
    this.pageIndex = pageIndex;
    this._emitPageEvent(previousPageIndex);
  }

  private _buildIndexes() {
    this._lastIndex = this.pageTotal === 0 ? 1 : this._getLastIndex(this.pageTotal, this.pageSize);
    this.ranges = this._getRange(this.pageIndex, this.pageSize, this.pageTotal);
    this.pages = this._getListOfPageItem(this.pageIndex, this._lastIndex);
    this._rangeLabel = this._intl.getRangeLabel(this.pageIndex, this.pageSize, this.pageTotal);
  }

  private _getLastIndex(total: number, pageSize: number): number {
    return Math.ceil(total / pageSize);
  }

  private _getListOfPageItem(pageIndex: number, lastIndex: number): PageItem[] {
    const { nextPageLabel, previousPageLabel, firstPageLabel, lastPageLabel, increaseFivePageLabel, decreaseFivePageLabel } = this._intl;

    const concatWithFirstLast = (listOfPage: PageItem[]): PageItem[] => {
      const first = {
        type: PageItemType.First,
        title: firstPageLabel,
        text: firstPageLabel,
        disabled: pageIndex === this._firstIndex
      };
      const last = {
        type: PageItemType.Last,
        title: lastPageLabel,
        text: lastPageLabel,
        disabled: pageIndex === lastIndex
      };
      return [first, ...listOfPage, last];
    };
    const concatWithPrevNext = (listOfPage: PageItem[]): PageItem[] => {
      const prev = {
        type: PageItemType.Prev,
        title: previousPageLabel,
        text: previousPageLabel,
        disabled: pageIndex === this._firstIndex
      };
      const next = {
        type: PageItemType.Next,
        title: nextPageLabel,
        text: nextPageLabel,
        disabled: pageIndex === lastIndex
      };
      return [prev, ...listOfPage, next];
    };
    const generatePage = (start: number, end: number): PageItem[] => {
      const pages = [];
      for (let index = start; index <= end; index++) {
        pages.push({
          index,
          type: PageItemType.Page,
          text: index + ''
        });
      }
      return pages;
    };

    const generateRangeItem = (selected: number, last: number): PageItem[] => {
      if (last <= 9) {
        return generatePage(this._firstIndex, last);
      }
      let listOfRange = [];
      const prevFiveItem = {
        type: PageItemType.Prev_5,
        title: decreaseFivePageLabel,
        text: decreaseFivePageLabel
      };
      const nextFiveItem = {
        type: PageItemType.Next_5,
        title: increaseFivePageLabel,
        text: increaseFivePageLabel
      };
      const firstPageItem = generatePage(this._firstIndex, this._firstIndex);
      const lastPageItem = generatePage(lastIndex, lastIndex);
      if (selected < 4) {
        listOfRange = [...generatePage(2, 5), nextFiveItem];
      } else if (selected < last - 3) {
        listOfRange = [prevFiveItem, ...generatePage(selected - 2, selected + 2), nextFiveItem];
      } else {
        listOfRange = [prevFiveItem, ...generatePage(last - 4, last - 1)];
      }
      return [...firstPageItem, ...listOfRange, ...lastPageItem];
    };

    if (this.showFirstLastButtons) {
      return concatWithFirstLast(concatWithPrevNext(generateRangeItem(pageIndex, lastIndex)));
    }

    return concatWithPrevNext(generateRangeItem(pageIndex, lastIndex));
  }

  /** 验证当前索引是否越界 */
  private _validatePageIndex(value: number, lastIndex: number): number {
    if (value > lastIndex) {
      return lastIndex;
    } else if (value < this._firstIndex) {
      return this._firstIndex;
    } else {
      return value;
    }
  }

  /** 获取当前页面的区间 */
  private _getRange(page: number, pageSize: number, length: number) {
    if (length === 0 || pageSize === 0) {
      return [0, 0];
    }
    return [(page - 1) * pageSize + 1, Math.min(page * pageSize, length)];
  }

  /** 发出一个事件，通知已触发paginator属性的更改。 */
  private _emitPageEvent(previousPageIndex: number) {
    this.pageChange.emit({
      previousPageIndex,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      pageTotal: this.pageTotal
    });
  }
}
