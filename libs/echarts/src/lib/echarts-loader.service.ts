import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { SafeAny } from '@ngx-simple/core/types';
import { BehaviorSubject, EMPTY, from, Observable, of, throwError, zip } from 'rxjs';
import { catchError, filter, map, share, switchMap, take, tap } from 'rxjs/operators';
import { SimEChartsDefaultOptions } from './default-options';
import { EchartsConstructor } from './echarts';
import { SIM_ECHARTS_OPTIONS } from './echarts.token';

@Injectable({
  providedIn: 'root'
})
export class SimEChartsLoaderService {
  // 加载EChartsJS库并准备使用时发出的流
  private readonly _ready = new BehaviorSubject(null);
  readonly ready = this._ready.asObservable().pipe(
    filter((echarts: EchartsConstructor) => !!echarts),
    take(1)
  );
  constructor(
    @Inject(DOCUMENT) doc: SafeAny,
    @Optional() private _httpClient: HttpClient,
    @Inject(PLATFORM_ID) platformId: SafeAny,
    @Optional()
    @Inject(SIM_ECHARTS_OPTIONS)
    private _options: SimEChartsDefaultOptions
  ) {
    // 检查echarts是否已经可用
    if (isPlatformBrowser(platformId) && doc.defaultView.echarts) {
      this._ready.next(doc.defaultView.echarts);
    } else {
      // 加载EChartsJS库
      this._loadLibrary()
        .pipe(
          switchMap((echarts: EchartsConstructor) => {
            doc.defaultView.echarts = echarts;
            this._ready.next(echarts);
            return EMPTY;
          }),
          catchError((e: any) => {
            console.error('[SimEChartsLoader] ', e);
            return EMPTY;
          })
        )
        .subscribe();
    }
  }

  /**
   * 懒加载ECharts.js库
   */
  private _loadLibrary(): Observable<any> {
    if (this._options) {
      if (!this._options.echarts) {
        return throwError('The core library was not imported!');
      }
      if (this._options.echarts) {
        return this.loadCoreLibrary().pipe(switchMap((echarts: EchartsConstructor) => this._loadThemes(echarts)));
      }
    }
    return throwError('ECharts.js library was not imported!');
  }

  /**
   * 懒加载 ECharts.js 主题
   */
  private _loadThemes(echarts: EchartsConstructor): Observable<EchartsConstructor> {
    if (!this._options.themes || !this._options.themes.length) {
      return;
    }

    if (!this._httpClient) {
      throw Error(
        'Could not find HttpClient provider for use with Angular Simple UI icons. ' +
          'Please include the HttpClientModule from @angular/common/http in your ' +
          'app imports.'
      );
    }

    const themes = this._options.themes.map(theme =>
      theme.url.endsWith('.json')
        ? this._httpClient.get(theme.url, { responseType: 'json', withCredentials: theme.withCredentials === true }).pipe(
            share(),
            tap((themeJson: { theme: {} }) => (echarts as any).registerTheme(theme.name, themeJson.theme))
          )
        : of(null)
    );

    return zip(...themes).pipe(map(() => echarts));
  }

  /**
   * 导入 ECharts.js 核心库
   */
  private loadCoreLibrary(): Observable<EchartsConstructor> {
    return from(this._options.echarts()).pipe(
      filter((module: SafeAny) => !!module && !!module.default),
      map((module: SafeAny) => module.default)
    );
  }
}
