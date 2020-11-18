import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  isDevMode,
  Optional,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { SimDateAdapter } from '@ngx-simple/core/datetime';
import { InputBoolean, InputNumber } from '@ngx-simple/core/decorators';
import { createMissingDateImplError } from './timepicker-errors';
import { TimeItemView } from './timepicker.directive';

interface TimeView<V> {
  view: string;
  value: V;
  selected: boolean;
  disabled: boolean;
}

export type DateFilterFn<D> = (date: D | null, time?: { hours: number; minutes?: number; seconds?: number }) => boolean;

@Component({
  selector: 'sim-time-view',
  templateUrl: './time-view.component.html',
  styleUrls: ['./time-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sim-time-view'
  }
})
export class SimTimeViewComponent<D> implements AfterContentInit {
  @Input()
  set activeDate(value: D) {
    const oldActiveDate = this._activeDate;
    const validDate = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value)) || this._dateAdapter.today();
    this._activeDate = this._dateAdapter.clampDatetime(validDate, this.minDate, this.maxDate);
    if (!this._dateAdapter.compareDate(oldActiveDate, this._activeDate)) {
      this._init();
    }
  }
  get activeDate(): D {
    return this._activeDate;
  }
  private _activeDate: D;

  /** 当前选定的日期 */
  @Input()
  get selected(): D | null {
    return this._selected;
  }
  set selected(value: D | null) {
    this._selected = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));
  }
  private _selected: D;

  /** 最小可选日期. */
  @Input()
  get minDate(): D | null {
    return this._minDate;
  }
  set minDate(value: D | null) {
    this._minDate = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));
  }
  private _minDate: D | null;

  /** 最大可选日期. */
  @Input()
  get maxDate(): D | null {
    return this._maxDate;
  }
  set maxDate(value: D | null) {
    this._maxDate = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));
  }
  private _maxDate: D | null;

  /**
   * 格式化input显示的时间字符串样式
   * - h 12小时字段的小时格式，不加零
   * - hh 12小时字段的小时格式，个位补零
   * - H 24小时字段的小时格式，不加零
   * - HH 24小时字段的小时格式，个位补零
   * - m 分钟字段，不加零
   * - mm 分钟字段，个位补零
   * - s 秒钟字段，不加零
   * - ss 秒钟字段，个位补零
   * - a 2个字符串，表示`AM/PM`字段
   */
  @Input()
  @Input()
  get format() {
    return this._format || 'HH:mm:ss';
  }

  set format(formatValue: string) {
    if (!!formatValue && this._format !== formatValue) {
      this._format = formatValue;
      this._setShowList();
      this._generateViewList();
    }
  }
  _format: string = 'HH:mm:ss';

  /** 循环滚动 */
  @Input()
  @InputBoolean<SimTimeViewComponent<D>, 'spinLoop'>()
  spinLoop: boolean = true;

  /** 小时选项间隔  */
  @Input()
  @InputNumber<SimTimeViewComponent<D>, 'hourStep'>(1)
  hourStep: number = 1;

  /** 分钟选项间隔  */
  @Input()
  @InputNumber<SimTimeViewComponent<D>, 'minuteStep'>(1)
  minuteStep: number = 1;

  /** 秒选项间隔  */
  @Input()
  @InputNumber<SimTimeViewComponent<D>, 'secondStep'>(1)
  secondStep: number = 1;

  /** 用于过滤哪些时间可选的函数 */
  @Input() dateFilter: DateFilterFn<D | null>;

  @Output() readonly selectedChange: EventEmitter<D> = new EventEmitter();
  @Output() readonly userSelection: EventEmitter<D> = new EventEmitter();

  /**
   * 显示小时列表 包含 h/H
   */
  _showHoursList: boolean;
  /**
   * 显示分钟列表 包含 m
   */
  _showMinutesList: boolean;
  /**
   * 显示秒钟列表 包含 s
   */
  _showSecondsList: boolean;
  /**
   * 显示秒钟列表 包含 t
   */
  _showAmPmList: boolean;

  /** 当前的小时 */
  _hoursSelected: string;
  /** 当前的分钟 */
  _minutesSelected: string;
  /** 当前的秒钟 */
  _secondsSelected: string;
  /** 当前的am/pm */
  _ampmSelected: string;

  /** 选择的小时 */
  _hours: string;
  /** 选择的分钟 */
  _minutes: string;
  /** 选择的秒钟 */
  _seconds: string;
  /** 选择的am/pm */
  _ampm: string;

  _hoursViewList: TimeView<number>[];
  _minutesViewList: TimeView<number>[];
  _secondsViewList: TimeView<number>[];
  _ampmViewList: TimeView<string>[];

  /** 根据format生成可显示的view列表 */
  private _hoursItems: number[] = [];
  private _minutesItems: number[] = [];
  private _secondsItems: number[] = [];
  private _ampmItems: string[] = [];

  private _hoursListLoop = this.spinLoop;
  private _minutesListLoop = this.spinLoop;
  private _secondsListLoop = this.spinLoop;

  /** 使用12小时值 */
  private _use12Hours: boolean;
  /** 是否补零 */
  private _leadZeroHour: boolean;
  private _leadZeroMinute: boolean;
  private _leadZeroSecond: boolean;

  constructor(private _changeDetectorRef: ChangeDetectorRef, @Optional() public _dateAdapter: SimDateAdapter<D>) {
    if (!this._dateAdapter && isDevMode) {
      throw createMissingDateImplError('SimDateAdapter');
    }
    this._activeDate = this._dateAdapter.today();
  }

  ngAfterContentInit() {
    this._setShowList();
    this._generateViewList();
    this._init();
  }

  _init() {
    if (this.selected) {
      const formattedTime = this._formatTime(this.selected, this.format);
      const sections = formattedTime.split(/[\s:]+/);
      if (this._showHoursList) {
        this._hoursSelected = sections[0];
      }

      if (this._showMinutesList) {
        this._minutesSelected = this._showHoursList ? sections[1] : sections[0];
      }

      if (this._showSecondsList) {
        this._secondsSelected = sections[sections.length - (this._showAmPmList ? 2 : 1)];
      }

      if (this._showAmPmList && this._ampmItems !== null) {
        this._ampmSelected = sections[sections.length - 1];
      }
    }
    // 如果没有选中的值
    if (this._hoursSelected === undefined) {
      this._hoursSelected =
        !this._showHoursList && this.selected
          ? this._dateAdapter.getHours(this.selected).toString()
          : this._showHoursList
          ? `${this._hoursItems[3]}`
          : '0';
    }
    if (this._minutesSelected === undefined) {
      this._minutesSelected = !this._showMinutesList && this.selected ? this._dateAdapter.getMinutes(this.selected).toString() : '0';
    }
    if (this._secondsSelected === undefined) {
      this._secondsSelected = !this._showSecondsList && this.selected ? this._dateAdapter.getSeconds(this.selected).toString() : '0';
    }
    if (this._ampmSelected === undefined && this._ampmItems !== null) {
      this._ampmSelected = this._ampmItems[3];
    }
    // 初始化列表
    const ITEMS_COUNT = 7;
    this._updateHourView(0, ITEMS_COUNT);
    this._updateMinuteView(0, ITEMS_COUNT);
    this._updateSecondView(0, ITEMS_COUNT);
    this._updateAmPmView(0, ITEMS_COUNT);
    // 初始化选择值
    if (this._hoursSelected) {
      this.scrollHoursIntoView(parseInt(this._hoursSelected, 10));
    }
    if (this._minutesSelected) {
      this.scrollMinutesIntoView(parseInt(this._minutesSelected, 10));
    }
    if (this._secondsSelected) {
      this.scrollSecondsIntoView(parseInt(this._secondsSelected, 10));
    }
    if (this._ampmSelected) {
      this.scrollAmPmIntoView(this._ampmSelected);
    }
    this._changeDetectorRef.markForCheck();
  }

  scrollHoursIntoView(item: number, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    const viewItem = this._hoursViewList.find(v => v.value === item);
    // 如果找到视图项，那么表示当前正处在可见
    if (viewItem) {
      // 处理禁用时间
      if (viewItem.disabled) {
        return;
      }
      item = viewItem.value;
    }

    const view = this._scrollItemIntoView(item, this._hoursItems, this._hoursSelected, this._hoursListLoop, 'hours');

    if (view) {
      this._hoursSelected = view.selectedItem;
      this._hours = view.selectedItem;
      this._hoursViewList = this._viewToList(view.view, 'hours');
      this.emitEvent(event != null);
    }
  }

  scrollMinutesIntoView(item: number, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    const viewItem = this._minutesViewList.find(v => v.value === item);
    // 如果找到视图项，那么表示当前正处在可见
    if (viewItem) {
      // 处理禁用时间
      if (viewItem.disabled) {
        return;
      }
      item = viewItem.value;
    }

    const view = this._scrollItemIntoView(item, this._minutesItems, this._minutesSelected, this._minutesListLoop, 'minutes');

    if (view) {
      this._minutesSelected = view.selectedItem;
      this._minutes = view.selectedItem;
      this._minutesViewList = this._viewToList(view.view, 'minutes');
      // 检查小时当前选择是否禁用
      const hoursView = this._hoursViewList.find(v => v.view === this._hoursSelected);
      if (hoursView && hoursView.disabled) {
        this.scrollHoursIntoView(parseInt(this._hours, 10));
      }
      this.emitEvent(event != null);
    }
  }

  scrollSecondsIntoView(item: number, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    const viewItem = this._secondsViewList.find(v => v.value === item);
    // 如果找到视图项，那么表示当前正处在可见
    if (viewItem) {
      // 处理禁用时间
      if (viewItem.disabled) {
        return;
      }
      item = viewItem.value;
    }

    const view = this._scrollItemIntoView(item, this._secondsItems, this._secondsSelected, this._secondsListLoop, 'seconds');

    if (view) {
      this._secondsSelected = view.selectedItem;
      this._seconds = view.selectedItem;
      this._secondsViewList = this._viewToList(view.view, 'seconds');
      // 检查小时当前选择是否禁用
      const minutesView = this._hoursViewList.find(v => v.view === this._minutesSelected);
      if (minutesView && minutesView.disabled) {
        this.scrollMinutesIntoView(parseInt(this._minutes, 10));
      }
      this.emitEvent(event != null);
    }
  }

  scrollAmPmIntoView(item: string, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    const index = this._ampmItems.indexOf(item);

    if (index === -1) {
      return;
    }
    this._ampmSelected = this._ampmItems[index];
    this._ampm = this._ampmItems[index];
    this._updateAmPmView(index - 3, index + 4);
    this.emitEvent(event != null);
  }

  /** 上一个 */
  prevItem(view: TimeItemView) {
    if (view === 'ampm') {
      const selectedIndex = this._ampmItems.indexOf(this._ampmSelected);

      if (selectedIndex + 1 < this._ampmItems.length - 3) {
        this._ampmSelected = this._ampmItems[selectedIndex + 1];
        this._updateAmPmView(selectedIndex - 2, selectedIndex + 5);
      }
    } else {
      const _selected = `_${view}Selected`;
      const _items = `_${view}Items`;
      const _isListLoop = `_${view}ListLoop`;
      const _viewList = `_${view}ViewList`;
      const prev = this._prevItem(this[_items], this[_selected], this[_isListLoop], view);
      this[_selected] = prev.selectedItem;
      this[_viewList] = this._viewToList(prev.view, view);
    }
  }

  /** 下一个 */
  nextItem(view: TimeItemView) {
    if (view === 'ampm') {
      const selectedIndex = this._ampmItems.indexOf(this._ampmSelected);
      if (selectedIndex > 3) {
        this._ampmSelected = this._ampmItems[selectedIndex - 1];
        this._updateAmPmView(selectedIndex - 4, selectedIndex + 3);
      }
    } else {
      const _selected = `_${view}Selected`;
      const _items = `_${view}Items`;
      const _isListLoop = `_${view}ListLoop`;
      const _viewList = `_${view}ViewList`;
      const next = this._nextItem(this[_items], this[_selected], this[_isListLoop], view);
      this[_selected] = next.selectedItem;
      this[_viewList] = this._viewToList(next.view, view);
    }
  }

  private emitEvent(user: boolean) {
    const date = this._getSelectedTime();
    this.selectedChange.emit(date);
    if (user) {
      this.userSelection.emit(date);
    }
  }

  private _scrollItemIntoView(item: number, items: Array<number>, selectedItem: string, isListLoop: boolean, viewType: TimeItemView) {
    const index = items.indexOf(item);

    if (index === -1) {
      return null;
    }
    let itemIntoView: {
      selectedItem: string;
      view: number[];
    };
    if (isListLoop) {
      if (index > 0) {
        selectedItem = this._leadZero(items[index - 1], viewType);
        itemIntoView = this._nextItem(items, selectedItem, isListLoop, viewType);
      } else {
        selectedItem = this._leadZero(items[1], viewType);
        itemIntoView = this._prevItem(items, selectedItem, isListLoop, viewType);
      }
    } else {
      selectedItem = this._leadZero(items[index], viewType);
      itemIntoView = { selectedItem, view: items.slice(index - 3, index + 4) };
    }
    return itemIntoView;
  }

  private _prevItem(items: Array<number>, selectedItem: string, isListLoop: boolean, viewType: TimeItemView) {
    const selectedIndex = items.indexOf(parseInt(selectedItem, 10));
    const itemsCount = items.length;
    let view: number[];
    let selected: number;
    if (selectedIndex === -1) {
      view = items.slice(0, 7);
      selected = items[3];
    } else if (isListLoop) {
      if (selectedIndex - 4 < 0) {
        view = items.slice(itemsCount - (4 - selectedIndex), itemsCount);
        view = view.concat(items.slice(0, selectedIndex + 3));
      } else if (selectedIndex + 4 > itemsCount) {
        view = items.slice(selectedIndex - 4, itemsCount);
        view = view.concat(items.slice(0, selectedIndex + 3 - itemsCount));
      } else {
        view = items.slice(selectedIndex - 4, selectedIndex + 3);
      }

      selected = selectedIndex === 0 ? items[itemsCount - 1] : items[selectedIndex - 1];
    } else if (selectedIndex > 3) {
      view = items.slice(selectedIndex - 4, selectedIndex + 3);
      selected = items[selectedIndex - 1];
    } else if (selectedIndex === 3) {
      view = items.slice(0, 7);
    }
    selectedItem = this._leadZero(selected, viewType);
    return {
      selectedItem,
      view
    };
  }

  private _nextItem(items: Array<number>, selectedItem: string, isListLoop: boolean, viewType: TimeItemView) {
    const selectedIndex = items.indexOf(parseInt(selectedItem, 10));
    const itemsCount = items.length;
    let view: number[];
    let selected: number;
    if (selectedIndex === -1) {
      view = items.slice(0, 7);
      selected = items[3];
    } else if (isListLoop) {
      if (selectedIndex < 2) {
        view = items.slice(itemsCount - (2 - selectedIndex), itemsCount);
        view = view.concat(items.slice(0, selectedIndex + 5));
      } else if (selectedIndex + 4 >= itemsCount) {
        view = items.slice(selectedIndex - 2, itemsCount);
        view = view.concat(items.slice(0, selectedIndex + 5 - itemsCount));
      } else {
        view = items.slice(selectedIndex - 2, selectedIndex + 5);
      }
      selected = selectedIndex === itemsCount - 1 ? items[0] : items[selectedIndex + 1];
    } else if (selectedIndex + 1 < itemsCount - 3) {
      view = items.slice(selectedIndex - 2, selectedIndex + 5);
      selected = items[selectedIndex + 1];
    } else if (selectedIndex === itemsCount - 4) {
      view = items.slice(selectedIndex - 3, itemsCount);
    }
    selectedItem = this._leadZero(selected, viewType);
    return {
      selectedItem,
      view
    };
  }

  /**
   * 根据format处理列表信息
   */
  private _setShowList() {
    this._use12Hours = this.format.indexOf('h') !== -1;
    this._showHoursList = this.format.indexOf('h') !== -1 || this.format.indexOf('H') !== -1;
    this._leadZeroHour = this.format.indexOf('hh') !== -1 || this.format.indexOf('HH') !== -1;
    this._showMinutesList = this.format.indexOf('m') !== -1;
    this._leadZeroMinute = this.format.indexOf('mm') !== -1;
    this._showSecondsList = this.format.indexOf('s') !== -1;
    this._leadZeroSecond = this.format.indexOf('ss') !== -1;
    this._showAmPmList = this.format.indexOf('a') !== -1;
  }

  private _updateHourView(start: number, end: number): void {
    this._hoursViewList = this._viewToList(this._hoursItems.slice(start, end), 'hours');
  }

  private _updateMinuteView(start: number, end: number): void {
    this._minutesViewList = this._viewToList(this._minutesItems.slice(start, end), 'minutes');
  }

  private _updateSecondView(start: number, end: number): void {
    this._secondsViewList = this._viewToList(this._secondsItems.slice(start, end), 'seconds');
  }

  private _updateAmPmView(start: number, end: number): void {
    this._ampmViewList = this._ampmItems.slice(start, end).map((value, index) => {
      const view = value || '';
      return {
        index,
        value,
        view,
        selected: this._ampmSelected === view,
        disabled: false
      };
    });
  }

  /** 补零 */
  private _leadZero(value: number, viewType: TimeItemView): string {
    if (value == null) {
      return '';
    }

    const leadZero = {
      hours: value < 10 && this._leadZeroHour,
      minutes: value < 10 && this._leadZeroMinute,
      seconds: value < 10 && this._leadZeroSecond
    }[viewType];
    return leadZero ? `0${value}` : `${value}`;
  }

  private _viewToList(items: number[], viewType: TimeItemView): TimeView<number>[] {
    const time = {
      hours: null,
      minutes: null,
      seconds: null
    };
    // 分和秒需要有时
    if (['minutes', 'seconds'].includes(viewType)) {
      time.hours = parseInt(this._hoursSelected, 10);
    }
    // 秒需要有分
    if ('seconds' === viewType) {
      time.minutes = parseInt(this._minutesSelected, 10);
    }
    // 根据类型获取当前选中值
    const selected = this[`_${viewType}Selected`];

    return items.map((value, index) => {
      const view = this._leadZero(value, viewType);
      time[viewType] = value;
      return {
        index,
        value,
        view,
        selected: selected === view,
        disabled: this._applyDisabledForItem(time)
      };
    });
  }

  /**
   * 更新过滤时间是否禁用
   */
  private _applyDisabledForItem(time: { hours: number; minutes: number; seconds: number }) {
    if (!this.dateFilter) {
      return false;
    }
    return this.dateFilter(this.activeDate, time);
  }

  /**
   * 生成可显示的列表
   */
  private _generateViewList() {
    if (this._showHoursList) {
      this._generateHours();
    }
    if (this._showMinutesList) {
      this._generateMinutes();
    }
    if (this._showSecondsList) {
      this._generateSeconds();
    }
    if (this._showAmPmList) {
      this._generateAmPm();
    }
  }

  /**
   * 生成时列表 24/12 制
   */
  private _generateHours() {
    let hourItemsCount = 24;
    if (this._use12Hours) {
      hourItemsCount = 13;
    }
    hourItemsCount /= this.hourStep;

    let i = this._use12Hours ? 1 : 0;

    if (hourItemsCount < 7 || !this.spinLoop) {
      this._addEmptyItems(this._hoursItems);
      this._hoursListLoop = false;
    }

    if (hourItemsCount > 1) {
      for (i; i < hourItemsCount; i++) {
        this._hoursItems.push(i * this.hourStep);
      }
    } else {
      this._hoursItems.push(0);
    }

    if (hourItemsCount < 7 || !this.spinLoop) {
      this._addEmptyItems(this._hoursItems);
    }
  }

  /**
   * 生成分列表
   */
  private _generateMinutes() {
    const minuteItemsCount = 60 / this.minuteStep;

    if (minuteItemsCount < 7 || !this.spinLoop) {
      this._addEmptyItems(this._minutesItems);
      this._minutesListLoop = false;
    }

    for (let i = 0; i < minuteItemsCount; i++) {
      this._minutesItems.push(i * this.minuteStep);
    }

    if (minuteItemsCount < 7 || !this.spinLoop) {
      this._addEmptyItems(this._minutesItems);
    }
  }

  /**
   * 生成秒列表
   */
  private _generateSeconds() {
    const secondItemsCount = 60 / this.secondStep;

    if (secondItemsCount < 7 || !this.spinLoop) {
      this._addEmptyItems(this._secondsItems);
      this._secondsListLoop = false;
    }

    for (let i = 0; i < secondItemsCount; i++) {
      this._secondsItems.push(i * this.secondStep);
    }

    if (secondItemsCount < 7 || !this.spinLoop) {
      this._addEmptyItems(this._secondsItems);
    }
  }

  /**
   * 生成am/pm列表
   */
  private _generateAmPm() {
    this._addEmptyItems(this._ampmItems);

    this._ampmItems.push('AM');
    this._ampmItems.push('PM');

    this._addEmptyItems(this._ampmItems);
  }

  /**
   * 补齐空项
   */
  private _addEmptyItems(items: Array<number | string>): void {
    for (let i = 0; i < 3; i++) {
      items.push(null);
    }
  }

  /**
   * 获取选择的时间
   */
  private _getSelectedTime(): D {
    let hours: number, minutes: number, seconds: number;

    if (this._hours) {
      hours = parseInt(this._hours, 10);
    }
    if (this._minutes) {
      minutes = parseInt(this._minutes, 10);
    }
    if (this._seconds) {
      seconds = parseInt(this._seconds, 10);
    }
    // 处理12小时
    if (this._hours && this._use12Hours) {
      if (((this._showHoursList && this._hours !== '12') || (!this._showHoursList && this._hours <= '11')) && this._ampm === 'PM') {
        hours += 12;
      }
      if (!this._showHoursList && this._ampm === 'AM' && this._hours > '11') {
        hours -= 12;
      }
      if (this._ampm === 'AM' && this._hours === '12') {
        hours = 0;
      }
    }

    return this._dateAdapter.createDate(
      this._dateAdapter.getYear(this.activeDate),
      this._dateAdapter.getMonth(this.activeDate),
      this._dateAdapter.getDate(this.activeDate),
      hours,
      minutes,
      seconds
    );
  }

  /** 格式化时间 */
  private _formatTime(value: D, format: string): string {
    if (value == null) {
      return '';
    }
    let hours = this._dateAdapter.getHours(value);
    const minutes = this._dateAdapter.getMinutes(value);
    const seconds = this._dateAdapter.getSeconds(value);
    let formattedSeconds: string, formattedMinutes: string, formattedHours: string;
    const amPM = hours > 11 ? 'PM' : 'AM';

    if (format.indexOf('h') !== -1) {
      if (hours > 12) {
        hours -= 12;
        formattedHours = hours < 10 && format.indexOf('hh') !== -1 ? '0' + hours : `${hours}`;
      } else if (hours === 0) {
        formattedHours = '12';
      } else if (hours < 10 && format.indexOf('hh') !== -1) {
        formattedHours = '0' + hours;
      } else {
        formattedHours = `${hours}`;
      }
    } else {
      formattedHours = this._leadZero(hours, 'hours');
    }

    formattedMinutes = this._leadZero(minutes, 'minutes');

    formattedSeconds = this._leadZero(seconds, 'seconds');

    return format
      .replace('hh', formattedHours)
      .replace('h', formattedHours)
      .replace('HH', formattedHours)
      .replace('H', formattedHours)
      .replace('mm', formattedMinutes)
      .replace('m', formattedMinutes)
      .replace('ss', formattedSeconds)
      .replace('s', formattedSeconds)
      .replace('a', amPM);
  }
}
