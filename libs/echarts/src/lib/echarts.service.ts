import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import { fromJson, toJson } from '@ngx-simple/core/coercion';
import { SafeAny } from '@ngx-simple/core/types';
import { ECharts } from 'echarts';
import { Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { SimEChartsDefaultOptions, SimEChartsRegisterMapOption } from './default-options';
import { SimEChartsLoaderService } from './echarts-loader.service';
import { SIM_ECHARTS_OPTIONS } from './echarts.token';

/**
 * 实现原生
 */
class InternalStorage implements Storage {
  private _storage: Map<string, string>;

  get length(): number {
    return this._storage.size;
  }

  getItem(key: string): string | null {
    return this._storage.get(key);
  }
  removeItem(key: string) {
    this._storage.delete(key);
  }

  setItem(key: string, value: string): void {
    this._storage.set(key, value);
  }

  clear() {
    this._storage.clear();
  }

  key(index: number): string | null {
    return null;
  }
}

/**
 * 注册地图服务 自动缓存请求过的 geoJson
 */
@Injectable({
  providedIn: 'root'
})
export class SimEChartsRegisterMapService {
  private _mapOption: SimEChartsRegisterMapOption;
  private _storage: Storage;

  constructor(
    @Inject(DOCUMENT) doc: SafeAny,
    private _echartsService: SimEChartsService,
    @Optional() private _httpClient: HttpClient,
    @Optional()
    @Inject(SIM_ECHARTS_OPTIONS)
    private _options: SimEChartsDefaultOptions
  ) {
    this._mapOption = _options?.registerMap ?? {};
    this._storage = this._supportStorage(doc?.defaultView);
  }

  /**
   * 注册地图
   * @param mapName 地图
   * @param path 地图 `geoJson` 的请求路径 供 `httpClient.get` 使用，如果不提供需要配置 `assets` 目录地址
   */
  registerMap(mapName: string, path?: string) {
    const url = this.getUrl(mapName, path);
    if (!url.endsWith('.json')) {
      throw Error('need to provide a geo with a JSON file');
    }
    return this.getCache(mapName).pipe(
      switchMap(geoJson => {
        if (!geoJson) {
          return this._httpClient.get(url, { responseType: 'json', withCredentials: this._mapOption.withCredentials === true }).pipe(
            tap((results: object) => {
              this.setCache(mapName, results);
            })
          );
        }
        return of(geoJson);
      }),
      switchMap(geoJson => this._echartsService.registerMap(mapName, geoJson))
    );
  }

  /** 清除缓存 */
  clearCache() {
    if (this._storage instanceof InternalStorage) {
      this._storage.clear();
    } else {
      const cacheKeyPrefix = this._mapOption.cacheKeyPrefix ?? 'registerMap';
      for (const key of Object.keys(this._storage)) {
        if (key.startsWith(cacheKeyPrefix)) {
          this._storage.removeItem(key);
        }
      }
    }
  }

  private getCache(mapName: string): Observable<object> {
    const data = toJson<object>(this._storage.getItem(this.getKey(mapName)));
    return of(data);
  }

  private setCache(mapName: string, geoJson: object) {
    const data = fromJson(geoJson);
    if (data) {
      this._storage.setItem(this.getKey(mapName), data);
    }
  }

  private getKey(mapName: string) {
    const cacheKeyPrefix = this._mapOption.cacheKeyPrefix ?? 'registerMap';
    return (cacheKeyPrefix + '_' + mapName).toUpperCase();
  }

  /** 获取url */
  private getUrl(mapName: string, url?: string): string {
    if (url) {
      return url;
    }
    const { assets } = this._mapOption;
    if (assets) {
      return `${assets}/${mapName}.json`;
    }
    return '';
  }

  /**
   * 检查是否支持 localStorage 和 sessionStorage 如果不支持，将使用内存存储
   */
  private _supportStorage(win: Window) {
    if (win) {
      const cacheType = this._mapOption.cacheType ?? 'localStorage';
      if (['localStorage', 'sessionStorage'].includes(cacheType) && cacheType in win) {
        return win[cacheType];
      }
    }
    return new InternalStorage();
  }
}

/**
 * Wrapper for echarts
 * @see https://echarts.apache.org/zh/api.html#echarts
 */
@Injectable({
  providedIn: 'root'
})
export class SimEChartsService {
  constructor(
    private _loader: SimEChartsLoaderService,
    @Optional()
    @Inject(SIM_ECHARTS_OPTIONS)
    private _options: SimEChartsDefaultOptions
  ) {}

  /**
   * Wrapper for echarts.init
   *
   * 创建一个 ECharts 实例，返回 echartsInstance，不能在单个容器上初始化多个 ECharts 实例。
   * @param dom 实例容器，通常是定义了高度和宽度的`div`元素。
   * @param theme 应用主题
   * @param opts 图表的配置
   */
  init(
    dom: HTMLDivElement | HTMLCanvasElement,
    theme?: object | string,
    opts?: {
      devicePixelRatio?: number;
      renderer?: string;
      width?: number | string;
      height?: number | string;
    }
  ) {
    return this._loader.ready.pipe(map(chart => chart.init(dom, theme, opts)));
  }

  /**
   * Wrapper for echarts.connect
   *
   * 多个图表实例实现联动
   * @param group group 的 id，或者图表实例的数组。
   */
  connect(group: string | ECharts[]) {
    return this._loader.ready.pipe(map(chart => chart.connect(group)));
  }

  /**
   * Wrapper for echarts.disconnect
   *
   * 解除图表实例的联动，如果只需要移除单个实例，可以将通过将该图表实例 group 设为空。
   * @param group group 的 id
   */
  disConnect(group: string) {
    return this._loader.ready.pipe(map(chart => chart.disConnect(group)));
  }

  /**
   * Wrapper for echarts.dispose
   *
   * 销毁实例，实例销毁后无法再被使用
   * @param target 图表实例或容器
   */
  dispose(target: ECharts | HTMLDivElement | HTMLCanvasElement) {
    return this._loader.ready.pipe(map(chart => chart.dispose(target)));
  }

  /**
   * Wrapper for echarts.getInstanceByDom
   *
   * 获取 dom 容器上的实例
   * @param target 图表容器
   */
  getInstanceByDom(target: HTMLDivElement | HTMLCanvasElement) {
    return this._loader.ready.pipe(map(chart => chart.getInstanceByDom(target)));
  }

  /**
   * Wrapper for echarts.registerMap
   *
   * 注册可用的地图，必须在包括 geo 组件或者 map 图表类型的时候才能使用。
   * @param mapName 地图名称，在 geo 组件或者 map 图表类型中设置的 map 对应的就是该值。
   * @param geoJson GeoJson 格式的数据，具体格式见 @see https://geojson.org/。
   * @param specialAreas 可选。将地图中的部分区域缩放到合适的位置，可以使得整个地图的显示更加好看。
   */
  registerMap(mapName: string, geoJson: object, specialAreas?: object) {
    return this._loader.ready.pipe(map(chart => chart.registerMap(mapName, geoJson, specialAreas)));
  }

  /**
   *  Wrapper for echarts.getMap
   *
   * 获取已注册的地图
   * @param mapName
   */
  getMap(mapName: string) {
    return this._loader.ready.pipe(map(chart => chart.getMap(mapName)));
  }

  /**
   * Wrapper for echarts.registerTheme
   *
   * 注册主题，用于初始化实例的时候指定 定制主题 @see https://echarts.apache.org/zh/theme-builder.html
   *
   * @param themeName 主题名称
   * @param theme 主题配置
   */
  registerTheme(themeName: string, theme: object) {
    return this._loader.ready.pipe(map(chart => chart.registerTheme(themeName, theme)));
  }

  /**
   * Wrapper for echarts.graphic
   *
   * 图形相关帮助方法
   */
  graphic() {
    return this._loader.ready.pipe(map(chart => chart.graphic));
  }
}
