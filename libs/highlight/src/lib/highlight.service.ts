import { Inject, Injectable, Optional } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { SimHighlightLoaderService } from './highlight-loader.service';
import {
  AutoHighlightResult,
  HighlightConfig,
  HighlightJSApi,
  HighlightResult,
  Language,
  LanguageFn,
  Mode,
  SimHighlightOptions,
  SIM_HIGHLIGHT_OPTIONS
} from './highlight.type';

@Injectable({
  providedIn: 'root'
})
export class SimHighlightService {
  private _hljs: HighlightJSApi;

  get hljs(): HighlightJSApi | null {
    return this._hljs;
  }

  constructor(
    private _loader: SimHighlightLoaderService,
    @Optional()
    @Inject(SIM_HIGHLIGHT_OPTIONS)
    private _options: SimHighlightOptions
  ) {
    // 加载highlight.js库 初始化
    _loader.ready.pipe().subscribe((hljs: HighlightJSApi) => {
      this._hljs = hljs;
      if (_options && _options.config) {
        // 如果存在，设置全局配置
        hljs.configure(_options.config);
        if (hljs.listLanguages().length < 1) {
          console.error('[HighlightJS]: No languages were registered!');
        }
      }
    });
  }

  /**
   * 核心高亮功能
   * @param name 接受语言名称或别名
   * @param value 带有代码高亮显示的字符串
   * @param ignore_illegals 如果存在并求值为真值，则即使检测到该语言的语法非法，也不会强制抛出异常，而是强制突出显示完成。
   * @param continuation 延续表示未完成的分析的可选模式堆栈。如果存在，该函数将从该状态重新开始解析，而不是初始化一个新状态
   */
  highlight(name: string, value: string, ignore_illegals: boolean, continuation?: Mode): Observable<HighlightResult> {
    return this._loader.ready.pipe(map((hljs: HighlightJSApi) => hljs.highlight(name, value, ignore_illegals, continuation)));
  }

  /**
   * 将突出显示应用于包含代码的DOM节点
   * @param element 要应用高亮显示的元素。
   */
  highlightBlock(element: HTMLElement): Observable<void> {
    return this._loader.ready.pipe(map((hljs: HighlightJSApi) => hljs.highlightBlock(element)));
  }

  /**
   * 通过语言检测突出显示
   * @param code 接受带有要突出显示的代码的字符串
   * @param languageSubset 可选的语言名称和别名数组，将检测限制为仅针对这些语言。也可以使用configure来设置子集，但是如果设置，则本地参数将覆盖该选项。
   */
  highlightAuto(code: string, languageSubset?: string[]): Observable<AutoHighlightResult> {
    return this._loader.ready.pipe(map((hljs: HighlightJSApi) => hljs.highlightAuto(code, languageSubset)));
  }

  /**
   * 突出显示的标记的后处理。
   * 当前包括替换缩进TAB字符并使用<br>标记代替换行字符。
   * 使用configure全局设置选项
   * @param value 接受带有突出显示的标记的字符串
   */
  fixMarkup(value: string): Observable<string> {
    return this._loader.ready.pipe(map((hljs: HighlightJSApi) => hljs.fixMarkup(value)));
  }

  /**
   * 配置全局选项
   * @param config HighlightJs 配置参数
   */
  configure(config: HighlightConfig): Observable<void> {
    return this._loader.ready.pipe(map((hljs: HighlightJSApi) => hljs.configure(config)));
  }

  /**
   * 将突出显示应用于页面上的所有`<pre><code> ... </code></pre>`块
   */
  initHighlighting(): Observable<void> {
    return this._loader.ready.pipe(map((hljs: HighlightJSApi) => hljs.initHighlighting()));
  }

  /**
   * 将新语言添加到指定名称下的库中。主要是在内部使用
   * @param name 一个包含被注册语言名称的字符串
   * @param language 返回代表语言定义的对象的函数。该函数传递给hljs对象，以便能够使用其中定义的公共正则表达式
   */
  registerLanguage(name: string, language: LanguageFn): Observable<HighlightJSApi> {
    return this._loader.ready.pipe(tap((hljs: HighlightJSApi) => hljs.registerLanguage(name, language)));
  }

  /**
   * @return 语言名称列表.
   */
  listLanguages(): Observable<string[]> {
    return this._loader.ready.pipe(map((hljs: HighlightJSApi) => hljs.listLanguages()));
  }

  /**
   * 通过名称或别名查找语言
   * @param name 语言名称
   * @returns 如果找到该语言对象，则未定义
   */
  getLanguage(name: string): Observable<Language | undefined> {
    return this._loader.ready.pipe(map((hljs: HighlightJSApi) => hljs.getLanguage(name)));
  }
}
