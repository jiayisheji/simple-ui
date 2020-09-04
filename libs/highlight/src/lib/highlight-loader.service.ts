import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { SafeAny } from '@ngx-simple/simple-ui/core/types';
import { BehaviorSubject, EMPTY, from, Observable, throwError, zip } from 'rxjs';
import { catchError, filter, map, switchMap, take, tap } from 'rxjs/operators';
import { HighlightJSApi, LanguageFn, SimHighlightOptions, SIM_HIGHLIGHT_OPTIONS } from './highlight.type';

@Injectable({
  providedIn: 'root'
})
export class SimHighlightLoaderService {
  // 加载HighlightJS库并准备使用时发出的流
  private readonly _ready = new BehaviorSubject(null);
  readonly ready = this._ready.asObservable().pipe(
    filter((hljs: HighlightJSApi) => !!hljs),
    take(1)
  );
  constructor(
    @Inject(DOCUMENT) doc: SafeAny,
    @Inject(PLATFORM_ID) platformId: SafeAny,
    @Optional()
    @Inject(SIM_HIGHLIGHT_OPTIONS)
    private _options: SimHighlightOptions
  ) {
    // 检查hljs是否已经可用
    if (isPlatformBrowser(platformId) && doc.defaultView.hljs) {
      this._ready.next(doc.defaultView.hljs);
    } else {
      // 加载HighlightJS库
      this._loadLibrary()
        .pipe(
          switchMap((hljs: HighlightJSApi) => {
            this._ready.next(hljs);
            return EMPTY;
          }),
          catchError((e: any) => {
            console.error('[SimHighlightLoader] ', e);
            return EMPTY;
          })
        )
        .subscribe();
    }
  }

  /**
   * 懒加载HighlightJS库
   */
  private _loadLibrary(): Observable<any> {
    if (this._options) {
      if (this._options.fullLibraryLoader && this._options.coreLibraryLoader) {
        return throwError('The full library and the core library were imported, only one of them should be imported!');
      }
      if (this._options.fullLibraryLoader && this._options.languages) {
        return throwError('The highlighting languages were imported they are not needed!');
      }
      if (this._options.coreLibraryLoader && !this._options.languages) {
        return throwError('The highlighting languages were not imported!');
      }
      if (!this._options.coreLibraryLoader && this._options.languages) {
        return throwError('The core library was not imported!');
      }
      if (this._options.fullLibraryLoader) {
        return this.loadFullLibrary();
      }
      if (this._options.coreLibraryLoader && this._options.languages && Object.keys(this._options.languages).length) {
        return this.loadCoreLibrary().pipe(switchMap((hljs: HighlightJSApi) => this._loadLanguages(hljs)));
      }
    }
    return throwError('Highlight.js library was not imported!');
  }

  /**
   * 懒加载 highlight.js languages
   */
  private _loadLanguages(hljs: HighlightJSApi): Observable<HighlightJSApi> {
    const languages = Object.entries(this._options.languages).map(([langName, langLoader]) =>
      importModule(langLoader()).pipe(tap((langFunc: LanguageFn) => hljs.registerLanguage(langName, langFunc)))
    );
    return zip(...languages).pipe(map(() => hljs));
  }

  /**
   * 导入 highlight.js 核心库
   */
  private loadCoreLibrary(): Observable<HighlightJSApi> {
    return importModule(this._options.coreLibraryLoader());
  }

  /**
   * 导入 highlight.js 库 和 全部语言
   */
  private loadFullLibrary(): Observable<HighlightJSApi> {
    return importModule(this._options.fullLibraryLoader());
  }
}

/**
 * 映射加载器响应模块对象
 */
const importModule = (moduleLoader: Promise<SafeAny>): Observable<SafeAny> => {
  return from(moduleLoader).pipe(
    filter((module: SafeAny) => !!module && !!module.default),
    map((module: SafeAny) => module.default)
  );
};
