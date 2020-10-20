import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Directive,
  DoCheck,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { SafeAny } from '@ngx-simple/core/types';
import { EChartOption, ECharts, EChartsLoadingOption } from 'echarts';
import { fromEvent, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';
import { ChangeFilter } from './change-filter';
import { SimEChartsDefaultOptions } from './default-options';
import { SimEChartsService } from './echarts.service';
import { SIM_ECHARTS_OPTIONS } from './echarts.token';

@Directive({
  selector: 'div[simEcharts], canvas[simEcharts], sim-echarts',
  exportAs: 'simEcharts',
  host: {
    class: 'sim-echarts',
    role: 'img',
    // 注意：使用 `sim-echarts` 时，Angular 表现是 inline 元素，我们需要表现一致，这里强制转换成 block 元素
    '[style.display]': '"block"'
  }
})
export class SimEchartsDirective implements OnChanges, OnInit, DoCheck, AfterViewInit, OnDestroy {
  /**
   * 配置项 @see https://echarts.apache.org/zh/option.html
   */
  @Input() options: EChartOption;
  @Input() theme: string;
  /**
   * 切换loading加载效果
   * @see https://echarts.apache.org/zh/api.html#echartsInstance.showLoading
   * @see https://echarts.apache.org/zh/api.html#echartsInstance.hideLoading
   */
  @Input() loading: boolean;
  /**
   * loading加载效果类型
   * @see https://echarts.apache.org/zh/api.html#echartsInstance.showLoading
   */
  @Input() loadingType = 'default';
  /**
   * loading加载效果配置
   * @see https://echarts.apache.org/zh/api.html#echartsInstance.showLoading
   */
  @Input() loadingOpts: EChartsLoadingOption;

  /**
   * 图表初始化配置
   * @see https://echarts.apache.org/zh/api.html#echarts.init
   *
   * - devicePixelRatio  设备像素比，默认取浏览器的值window.devicePixelRatio。
   * - renderer  渲染器，支持 'canvas' 或者 'svg'。
   * - width  可显式指定实例宽度，单位为像素。如果传入值为 null/undefined/'auto'，则表示自动取 dom（实例容器）的宽度。
   * - height 可显式指定实例高度，单位为像素。如果传入值为 null/undefined/'auto'，则表示自动取 dom（实例容器）的高度。
   */
  @Input() initOpts: {
    devicePixelRatio?: number;
    renderer?: string;
    width?: number | string;
    height?: number | string;
  };

  @Input() merge: EChartOption;
  /**
   * 当窗口发生变化自动调整图表
   * @see https://echarts.apache.org/zh/api.html#echartsInstance.resize
   */
  @Input() autoResize = true;

  // sim-echarts events
  @Output() chartInit = new EventEmitter<ECharts>();
  @Output() chartOptionsError = new EventEmitter<Error>();

  /**
   * echarts events
   * @see https://echarts.apache.org/zh/api.html#events
   */
  // echarts mouse events
  @Output() chartClick = this.createLazyEvent('click');
  @Output() chartDblClick = this.createLazyEvent('dblclick');
  @Output() chartMouseDown = this.createLazyEvent('mousedown');
  @Output() chartMouseMove = this.createLazyEvent('mousemove');
  @Output() chartMouseUp = this.createLazyEvent('mouseup');
  @Output() chartMouseOver = this.createLazyEvent('mouseover');
  @Output() chartMouseOut = this.createLazyEvent('mouseout');
  @Output() chartGlobalOut = this.createLazyEvent('globalout');
  @Output() chartContextMenu = this.createLazyEvent('contextmenu');

  // echarts other events
  @Output() chartLegendSelectChanged = this.createLazyEvent('legendselectchanged');
  @Output() chartLegendSelected = this.createLazyEvent('legendselected');
  @Output() chartLegendUnselected = this.createLazyEvent('legendunselected');
  @Output() chartLegendScroll = this.createLazyEvent('legendscroll');
  @Output() chartDataZoom = this.createLazyEvent('datazoom');
  @Output() chartDataRangeSelected = this.createLazyEvent('datarangeselected');
  @Output() chartTimelineChanged = this.createLazyEvent('timelinechanged');
  @Output() chartTimelinePlayChanged = this.createLazyEvent('timelineplaychanged');
  @Output() chartRestore = this.createLazyEvent('restore');
  @Output() chartDataViewChanged = this.createLazyEvent('dataviewchanged');
  @Output() chartMagicTypeChanged = this.createLazyEvent('magictypechanged');
  @Output() chartPieSelectChanged = this.createLazyEvent('pieselectchanged');
  @Output() chartPieSelected = this.createLazyEvent('pieselected');
  @Output() chartPieUnselected = this.createLazyEvent('pieunselected');
  @Output() chartMapSelectChanged = this.createLazyEvent('mapselectchanged');
  @Output() chartMapSelected = this.createLazyEvent('mapselected');
  @Output() chartMapUnselected = this.createLazyEvent('mapunselected');
  @Output() chartAxisAreaSelected = this.createLazyEvent('axisareaselected');
  @Output() chartFocusNodeAdjacency = this.createLazyEvent('focusnodeadjacency');
  @Output() chartUnfocusNodeAdjacency = this.createLazyEvent('unfocusnodeadjacency');
  @Output() chartBrush = this.createLazyEvent('brush');
  @Output() chartBrushSelected = this.createLazyEvent('brushselected');
  @Output() chartRendered = this.createLazyEvent('rendered');
  @Output() chartFinished = this.createLazyEvent('finished');

  /** echartsInstance */
  private _chart: ECharts;
  private currentOffsetWidth = 0;
  private currentOffsetHeight = 0;
  private currentWindowWidth: number;
  private resizeSub: Subscription;
  private _element: HTMLDivElement | HTMLCanvasElement;

  /** 当部件被销毁时放射出来 */
  private readonly _destroyed = new Subject<void>();

  private _window: Window;

  constructor(
    @Inject(DOCUMENT) doc: SafeAny,
    private _elementRef: ElementRef,
    private _ngZone: NgZone,
    private _echartsService: SimEChartsService,
    @Inject(SIM_ECHARTS_OPTIONS) private _options: SimEChartsDefaultOptions
  ) {
    this._window = doc?.defaultView;
    this._element = this._elementRef.nativeElement;
    if (_options) {
      const { initOpts, loadingOpts, themes } = _options;
      if (initOpts) {
        this.initOpts = initOpts;
      }
      if (loadingOpts) {
        const { type, ...opts } = loadingOpts;
        this.loadingType = type;
        this.loadingOpts = opts;
      }
      if (themes && themes.length) {
        this.theme = themes[0].name;
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    const filter = ChangeFilter.of(changes);
    filter
      .notFirstAndEmpty<EChartOption>('options')
      .pipe(takeUntil(this._destroyed))
      .subscribe((opt: EChartOption) => this.onOptionsChange(opt));
    filter
      .notFirstAndEmpty<EChartOption>('merge')
      .pipe(takeUntil(this._destroyed))
      .subscribe((opt: EChartOption) => this.setOption(opt));
    filter
      .has<boolean>('loading')
      .pipe(takeUntil(this._destroyed))
      .subscribe((v: boolean) => this.toggleLoading(!!v));
    filter
      .notFirst<string>('theme')
      .pipe(takeUntil(this._destroyed))
      .subscribe(() => this.refreshChart());
  }

  ngOnInit() {
    if (this._window) {
      this.resizeSub = fromEvent(this._window, 'resize')
        .pipe(debounceTime(50))
        .subscribe(() => {
          if (this.autoResize && this._window.innerWidth !== this.currentWindowWidth) {
            this.currentWindowWidth = this._window.innerWidth;
            const { offsetWidth, offsetHeight } = this._element;
            this.currentOffsetWidth = offsetWidth;
            this.currentOffsetHeight = offsetHeight;
            this.resize();
          }
        });
    }
  }

  ngDoCheck() {
    if (this._chart && this.autoResize) {
      const { offsetWidth, offsetHeight } = this._element;

      if (this.currentOffsetWidth !== offsetWidth || this.currentOffsetHeight !== offsetHeight) {
        this.currentOffsetWidth = offsetWidth;
        this.currentOffsetHeight = offsetHeight;
        this.resize();
      }
    }
  }

  ngAfterViewInit() {
    const timer = setTimeout(() => {
      this.initChart();
      clearTimeout(timer);
    }, 0);
  }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
    this.dispose();
    this.resizeSub.unsubscribe();
  }

  /**
   * 销毁实例，销毁后实例无法再被使用
   */
  private dispose() {
    if (this._chart) {
      this._chart.dispose();
      this._chart = null;
    }
  }

  /**
   * 改变图表尺寸，在容器大小发生改变时需要手动调用
   */
  private resize() {
    if (this._chart) {
      this._chart.resize();
    }
  }

  /**
   * 切换loading加载效果
   * @see https://echarts.apache.org/zh/api.html#echartsInstance.showLoading
   * @see https://echarts.apache.org/zh/api.html#echartsInstance.hideLoading
   * @param loading
   */
  private toggleLoading(loading: boolean) {
    if (this._chart) {
      loading ? this._chart.showLoading(this.loadingType, this.loadingOpts) : this._chart.hideLoading();
    }
  }

  /**
   *
   * @param option
   * @param notMerge
   */
  private setOption(option: EChartOption, notMerge?: boolean) {
    if (this._chart) {
      try {
        this._chart.setOption(option, notMerge);
      } catch (e) {
        console.error(e);
        this.chartOptionsError.emit(e);
      }
    }
  }

  /**
   * 刷新图表
   */
  private refreshChart() {
    this.dispose();
    this.initChart();
  }

  /**
   * 创建图表
   */
  private createChart() {
    this.currentWindowWidth = this._window?.innerWidth;
    const dom = this._element;
    this.currentOffsetWidth = dom.offsetWidth;
    this.currentOffsetHeight = dom.offsetHeight;

    if (this._window && this._window.getComputedStyle) {
      const prop = this._window.getComputedStyle(dom, null).getPropertyValue('height');
      if ((!prop || prop === '0px') && (!dom.style.height || dom.style.height === '0px')) {
        dom.style.height = '400px';
      }
    }

    this._ngZone.runOutsideAngular(() => {
      this._echartsService.init(dom, this.theme, this.initOpts).subscribe(chart => {
        this._chart = chart;
        this.chartInit.emit(chart);
        if (this.options) {
          this.setOption(this.options, true);
        }
      });
    });
  }

  /**
   * 初始化图表
   */
  private initChart() {
    this.onOptionsChange(this.options);

    if (this.merge && this._chart) {
      this.setOption(this.merge);
    }
  }

  private onOptionsChange(opt: EChartOption) {
    if (opt) {
      if (this._chart) {
        this._chart.setOption(this.options, true);
      } else {
        this.createChart();
      }
    }
  }

  /**
   * 允许只延迟绑定到父组件通过' @Output '请求的事件
   * @param eventName 事件名称
   * @see https://stackoverflow.com/questions/51787972/optimal-reentering-the-ngzone-from-eventemitter-event
   */
  private createLazyEvent<T>(eventName: string): EventEmitter<T> {
    return this.chartInit.pipe(
      switchMap(
        (chart: ECharts) =>
          new Observable(observer => {
            chart.on(eventName, (data: T) => this._ngZone.run(() => observer.next(data)));
            return null; // 只要在ngOnDestroy中调用"dispose()"，就不需要在退订时做出反应
          })
      )
    ) as EventEmitter<T>;
  }
}
