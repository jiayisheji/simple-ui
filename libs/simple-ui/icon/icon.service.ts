import { DOCUMENT } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Inject, Injectable, OnDestroy, Optional, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { SafeAny } from '@ngx-simple/core/types';
import { forkJoin, Observable, of, throwError } from 'rxjs';
import { catchError, finalize, map, share, tap } from 'rxjs/operators';

/** 可用于配置图标或图标集中的图标的显示方式的选项 */
export interface IconOptions {
  /** 要在图标上设置的svg的viewBox属性。 */
  viewBox?: string;

  /** 是否获取图标或使用HTTP credentials设置的图标 */
  withCredentials?: boolean;
}

/**
 * 一个图标的配置，包括安全(angular需要使用SafeResourceUrl处理url)的URL或缓存的‘<svg>’DOM元素
 */
class SvgIconConfig {
  url: SafeResourceUrl | null;
  svgElement: SVGElement | null;
  constructor(data: SafeResourceUrl | SVGElement, public options?: IconOptions) {
    // 注意，我们不能在这里使用'instanceof SVGElement'，因为它会在服务器端呈现期间中断
    if (!!(data as SVGElement).nodeName) {
      this.svgElement = data as SVGElement;
    } else {
      this.url = data as SafeResourceUrl;
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class SimIconService implements OnDestroy {
  private _document: Document;
  /** svgIcon的文件夹目录地址 */
  private _svgIconAssets: Map<string, { path: string; options?: IconOptions }> = new Map();

  /** svgIcon的文件夹目录地址默认别名 */
  private _defaultAssetsByAlias: string = 'sim-icon';

  /** 如果用户使用图标字体集，需要设置一个图标字体集 */
  private _defaultFontSetClass: string = 'sim-icon';

  /** 将字体标识符映射到它们的CSS类名。用于图标字体。 */
  private _fontCssClassesByAlias: Map<string, string> = new Map();

  /** url和缓存的SVG元素用于单个图标。以"[namespace]:[icon]"格式为key */
  private _svgIconConfigs: Map<string, SvgIconConfig> = new Map();

  /** 用于图标集的SvgIconConfig对象和缓存的SVG元素，以名称空间为key。可以在同一个名称空间下注册多个图标集。 */
  private _iconSetConfigs: Map<string, SvgIconConfig[]> = new Map();

  /** 通过url直接缓存加载的图标‘<svg>’DOM元素 */
  private _cachedIconsByUrl: Map<string, SVGElement> = new Map();

  /** 存储正在进行的图标获取。用于将多个请求合并到同一个URL。以url为key */
  private _inProgressUrlFetches = new Map<string, Observable<string>>();

  constructor(
    @Optional() private _httpClient: HttpClient,
    private _sanitizer: DomSanitizer,
    @Optional() @Inject(DOCUMENT) document: SafeAny,
    @Optional() private readonly _errorHandler?: ErrorHandler
  ) {
    this._document = document;
  }

  ngOnDestroy() {
    this._svgIconConfigs.clear();
    this._iconSetConfigs.clear();
    this._cachedIconsByUrl.clear();
    this._svgIconAssets.clear();
  }

  /**
   * 将普通url使用Angular的DomSanitizer服务设置为信任资源URL
   */
  toSafeUrl(url: string): SafeUrl {
    return this._sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  /**
   * 将普通html使用Angular的DomSanitizer服务设置为信任安全的HTML
   */
  toSafeHtml(html: string): SafeHtml {
    return this._sanitizer.bypassSecurityTrustHtml(html);
  }

  /**
   * 在默认名称空间中通过URL注册一个图标
   * iconName 注册图标的名称
   */
  addSvgIcon(iconName: string, url: SafeResourceUrl, options?: IconOptions): ThisType<SimIconService> {
    return this.addSvgIconInNamespace('', iconName, url, options);
  }

  /**
   * 通过URL在指定的名称空间中注册一个图标。
   */
  addSvgIconInNamespace(namespace: string, iconName: string, url: SafeResourceUrl, options?: IconOptions): ThisType<SimIconService> {
    return this._addSvgIconConfig(namespace, iconName, new SvgIconConfig(url, options));
  }

  /**
   * 在默认名称空间中使用HTML字符串注册一个图标。
   */
  addSvgIconLiteral(iconName: string, literal: SafeHtml, options?: IconOptions): ThisType<SimIconService> {
    return this.addSvgIconLiteralInNamespace('', iconName, literal, options);
  }

  /**
   * 使用指定名称空间中的HTML字符串注册图标。
   */
  addSvgIconLiteralInNamespace(namespace: string, iconName: string, literal: SafeHtml, options?: IconOptions): ThisType<SimIconService> {
    const sanitizedLiteral = this._sanitizeHtml(literal);
    const svgElement = this._createSvgElementForSingleIcon(sanitizedLiteral, options);
    return this._addSvgIconConfig(namespace, iconName, new SvgIconConfig(svgElement, options));
  }

  /**
   * 在默认名称空间中注册由URL设置的图标
   */
  addSvgIconSet(url: SafeResourceUrl, options?: IconOptions): ThisType<SimIconService> {
    return this.addSvgIconSetInNamespace('', url, options);
  }

  /**
   * 在默认名称空间中注册使用HTML字符串设置的图标。
   * @param literal SVG source of the icon set.
   */
  addSvgIconSetLiteral(literal: SafeHtml, options?: IconOptions): ThisType<SimIconService> {
    return this.addSvgIconSetLiteralInNamespace('', literal, options);
  }

  /**
   * 在指定的名称空间中注册由URL设置的图标
   */
  addSvgIconSetInNamespace(namespace: string, url: SafeResourceUrl, options?: IconOptions): ThisType<SimIconService> {
    return this._addSvgIconSetConfig(namespace, new SvgIconConfig(url, options));
  }

  /**
   * 在指定的名称空间中注册使用HTML字符串设置的图标。
   */
  addSvgIconSetLiteralInNamespace(namespace: string, literal: SafeHtml, options?: IconOptions): ThisType<SimIconService> {
    const sanitizedLiteral = this._sanitizeHtml(literal);
    const svgElement = this._svgElementFromString(sanitizedLiteral);
    return this._addSvgIconSetConfig(namespace, new SvgIconConfig(svgElement, options));
  }

  /**
   * 提供可以添加svgIcon的目录
   */
  addSvgIconAssets(path: string, options?: IconOptions): ThisType<SimIconService> {
    return this.registerSvgIconAssetsAlias(this._defaultAssetsByAlias, path, options);
  }

  /**
   * 定义用于svgIcon的目录地址的别名
   * 注意：使用别名映射 默认会使用别名为命名空间
   */
  registerSvgIconAssetsAlias(alias: string, path: string, options?: IconOptions): ThisType<SimIconService> {
    // 处理传进来的路径
    path = (path || '').trim();
    // 如果不是空才进行设置，防止出现路径出问题
    if (path) {
      path = preFilterUrl(path + '/');
      this._svgIconAssets.set(alias, {
        path,
        options
      });
    }
    return this;
  }

  /**
   * 定义用于图标字体的CSS class名称的别名。创建一个别名为@Input() fontSet作为css class应用于'<sim-icon>'。
   */
  registerFontClassAlias(alias: string, className: string = alias): ThisType<SimIconService> {
    this._fontCssClassesByAlias.set(alias, className);
    return this;
  }

  /**
   * 通过别名获取指定的图标字体集的class
   * 如果找不到直接返回别名作为图标字体集的class
   */
  classNameForFontAlias(alias: string) {
    return this._fontCssClassesByAlias.get(alias) || alias;
  }

  /**
   * 添加一个默认的图标字体集
   */
  setDefaultFontSetClass(className: string): ThisType<SimIconService> {
    this._defaultFontSetClass = className;
    return this;
  }

  /**
   * 获取默认图标字体集
   */
  getDefaultFontSetClass(): string {
    return this._defaultFontSetClass;
  }

  /**
   * 返回生成指定名称和名称空间的图标(作为'<svg>'DOM元素)的观察对象。
   * 该图标必须是以前在addIcon或addIconSet上注册过的;
   * 如果不是，观察将抛出一个错误。
   */
  getNamedBySvgIcon(name: string, namespace: string = ''): Observable<SVGElement> {
    const key = iconKey(namespace, name);
    // 尝试去配置里面读取缓存svgIcon配置
    const config = this._svgIconConfigs.get(key);

    // 如果存在直接处理
    if (config) {
      return this._getSvgFromConfig(config);
    }

    // 如果未找到缓存的配置 尝试通过设置的svgIcon目录去直接找对应的'.svg'文件
    if (!config && this._svgIconAssets.size) {
      const svgIconAssets = this._svgIconAssets.get(namespace || this._defaultAssetsByAlias);
      // 如果找不到目录直接返回
      if (!svgIconAssets) {
        return;
      }

      const svgUrl = this.toSafeUrl(`${svgIconAssets.path}${name}.svg`);

      // 假装存在，并让它去发生http请求获取图标，如果可以获取到把它添加的字体图标的缓存里面
      return this.getSvgIconFromUrl(svgUrl).pipe(
        tap(() => {
          // 如果带命名空间 就把别名和命名空间设为一个，这样可以防止冲突
          this.addSvgIconInNamespace(namespace, name, svgUrl, svgIconAssets.options);
        })
      );
    }

    // 尝试查看是否为名称空间注册了图标集
    const iconSetConfigs = this._iconSetConfigs.get(namespace);

    if (iconSetConfigs) {
      return this._getSvgFromIconSetConfigs(name, iconSetConfigs);
    }

    return throwError(Error(`无法找到名称为“${name}”的图标`));
  }

  /**
   * 返回一个从给定URL生成图标(作为‘<svg>’DOM元素)的观察对象。
   * 来自URL的响应可能会被缓存，因此这不会总是导致HTTP请求，
   * 生成的元素总是原始获取的图标的新副本(也就是说，它将不包含对先前返回的元素所做的任何修改)。
   */
  getSvgIconFromUrl(safeUrl: SafeResourceUrl): Observable<SVGElement> {
    const url = this._sanitizeUrl(safeUrl);

    const cachedIcon = this._cachedIconsByUrl.get(url);
    // 如果存在缓存，直接返回clone的‘<svg>’DOM元素
    if (cachedIcon) {
      return of(cloneSvg(cachedIcon));
    }
    return this._loadSvgIconFromConfig(new SvgIconConfig(safeUrl)).pipe(
      tap(svg => this._cachedIconsByUrl.set(url, svg)),
      map(svg => cloneSvg(svg))
    );
  }

  /**
   * 如果SvgIconConfig可用，则返回它的缓存图标;如果不可用，则从它的URL获取它。
   */
  private _getSvgFromConfig(config: SvgIconConfig): Observable<SVGElement> {
    if (config.svgElement) {
      // 我们已经有了这个图标的SVG元素，返回一个副本。
      return of(cloneSvg(config.svgElement));
    } else {
      // 从配置的URL获取图标，缓存它，然后返回一个副本。
      return this._loadSvgIconFromConfig(config).pipe(
        tap(svg => (config.svgElement = svg)),
        map(svg => cloneSvg(svg))
      );
    }
  }

  /**
   * 按名称在指定的名称空间中注册图标配置。
   */
  private _addSvgIconConfig(namespace: string, iconName: string, config: SvgIconConfig): ThisType<SimIconService> {
    this._svgIconConfigs.set(iconKey(namespace, iconName), config);
    return this;
  }

  /**
   * 在指定的名称空间中注册设置的图标。
   */
  private _addSvgIconSetConfig(namespace: string, config: SvgIconConfig): ThisType<SimIconService> {
    const configNamespace = this._iconSetConfigs.get(namespace);

    if (configNamespace) {
      configNamespace.push(config);
    } else {
      this._iconSetConfigs.set(namespace, [config]);
    }

    return this;
  }

  /**
   * 尝试在任何SVG图标集中查找具有指定名称的图标。
   * 首先搜索具有匹配名称的嵌套元素的可用缓存图标，如果找到，则将该元素复制到新的'<svg>'元素。
   * 如果没有找到，则获取所有未缓存的图标集，并在所有获取完成后再次搜索。
   * 如果可能，返回的Observable将生成的SVGElement，如果找不到指定名称的图标，则抛出一个错误。
   */
  private _getSvgFromIconSetConfigs(name: string, iconSetConfigs: SvgIconConfig[]): Observable<SVGElement> {
    // 对于我们获取的所有图标集SVG元素，查看是否有包含具有请求名称的图标。
    const namedIcon = this._extractIconWithNameFromAnySet(name, iconSetConfigs);

    if (namedIcon) {
      // 我们可以在_svgIconConfigs中缓存namedIcon，
      // 但是由于无论如何我们每次都必须进行复制，所以与总是从图标集中提取namedIcon相比，这可能没有什么好处。
      return of(namedIcon);
    }

    // 未在任何缓存的图标集中找到。如果有带有url的图标集我们还没有获取，现在就获取它们并在结果中查找iconName。
    const iconSetFetchRequests: Array<Observable<SVGElement | null>> = iconSetConfigs
      .filter(iconSetConfig => !iconSetConfig.svgElement)
      .map(iconSetConfig => {
        return this._loadSvgIconSetFromConfig(iconSetConfig).pipe(
          catchError(
            (err: HttpErrorResponse): Observable<SVGElement | null> => {
              const url = this._sanitizeUrl(iconSetConfig.url);

              // 获取单个url时出现错误，因此合并的观察对象不一定会失败。
              const errorMessage = `加载图标URL: ${url} 失败: ${err.message}`;
              if (this._errorHandler) {
                this._errorHandler.handleError(new Error(errorMessage));
              } else {
                console.error(errorMessage);
              }
              return of(null);
            }
          )
        );
      });

    // 获取所有设置url的图标。当请求完成时，每个IconSet都应该有一个缓存的SVG元素(除非请求失败)，我们可以再次检查图标。
    return forkJoin(iconSetFetchRequests).pipe(
      map(() => {
        const foundIcon = this._extractIconWithNameFromAnySet(name, iconSetConfigs);

        if (!foundIcon) {
          throw Error(`无法找到名称为“${name}”的图标`);
        }

        return foundIcon;
      })
    );
  }

  /**
   * 通过“id”为指定名称匹配查询搜索嵌套图标元素的给定图标集缓存的SVG元素。
   * 如果找到，则将嵌套的元素复制到新的SVG元素并返回它。如果没有找到匹配的元素，则返回null。
   */
  private _extractIconWithNameFromAnySet(iconName: string, iconSetConfigs: SvgIconConfig[]): SVGElement | null {
    // 向后迭代，以便以后添加的图标集具有优先级。
    let i = iconSetConfigs.length;
    while (i-- >= 0) {
      const { svgElement, options } = iconSetConfigs[i];
      if (svgElement) {
        const foundIcon = this._extractSvgIconFromSet(svgElement, iconName, options);
        if (foundIcon) {
          return foundIcon;
        }
      }
    }
    return null;
  }

  /**
   * 通过“id”为指定名称匹配查询搜索嵌套图标元素的给定图标集缓存的SVG元素。
   * 如果找到，则将嵌套的元素复制到新的SVG元素并返回它。如果没有找到匹配的元素，则返回null。
   */
  private _extractSvgIconFromSet(iconSet: SVGElement, iconName: string, options?: IconOptions): SVGElement | null {
    // 使用'[id="iconName]"语法来转义id中的特殊字符(而不是使用'#iconName'语法)。
    const iconSource = iconSet.querySelector(`[id="${iconName}"]`);

    if (!iconSource) {
      return null;
    }

    // 克隆元素并删除ID，以防止将多个元素添加到具有相同ID的页面。
    const iconElement = iconSource.cloneNode(true) as Element;
    iconElement.removeAttribute('id');

    // 如果图标节点本身是一个<svg>节点，则直接克隆并返回它。如果不是，则将其设置为新<svg>节点的内容。
    if (iconElement.nodeName.toLowerCase() === 'svg') {
      return this._setSvgAttributes(iconElement as SVGElement, options);
    }

    // 如果节点是<symbol>，忽略它，因为必须将其转换为<svg>。
    // 注意，可以通过<use href="#id">引用它来实现相同的目的，但是<use>标记在Firefox上是有问题的，因为它需要包含当前的页面路径。
    if (iconElement.nodeName.toLowerCase() === 'symbol') {
      return this._setSvgAttributes(this._toSvgElement(iconElement), options);
    }

    // createElement('SVG')不能正常工作;DOM以正确的节点结束，但是SVG内容没有呈现。
    // 相反，我们必须使用innerHTML创建一个空的SVG节点并附加其内容。
    // 使用DOMParser创建的元素。parseFromString也有同样的问题。
    // 注意，同样的方法可以通过引用它来实现，但是标记在Firefox上是有问题的，因为它需要包含当前的页面路径。
    // http://stackoverflow.com/questions/23003278/svg-innerhtml-in-firefox-can-not-display
    const svg = this._svgElementFromString('<svg></svg>');
    // 克隆该节点，这样我们就不会从父图标集元素中删除它。
    svg.appendChild(iconElement);

    return this._setSvgAttributes(svg, options);
  }

  /**
   * 通过克隆元素的所有子元素将元素转换为SVG节点。
   */
  private _toSvgElement(element: Element): SVGElement {
    const svg = this._svgElementFromString('<svg></svg>');
    const attributes = element.attributes;

    // 将“symbol”中的所有属性复制到新的SVG中，id除外。
    let i = attributes.length;
    while (i--) {
      const { name, value } = attributes[i];

      if (name !== 'id') {
        svg.setAttribute(name, value);
      }
    }
    // 拷贝子节点
    const childNodes = element.childNodes;
    const length = childNodes.length;
    const ELEMENT_NODE = this._document.ELEMENT_NODE;
    let j = 0;
    while (j < length) {
      const childNode = childNodes[j];
      if (childNode.nodeType === ELEMENT_NODE) {
        svg.appendChild(childNode.cloneNode(true));
      }
      j++;
    }
    return svg;
  }

  /**
   * 加载在SvgIconConfig中指定的图标集URL的内容，并从中创建一个SVG元素。
   */
  private _loadSvgIconSetFromConfig(config: SvgIconConfig): Observable<SVGElement> {
    // 如果已经解析了这个图标集的SVG，那么直接返回。
    if (config.svgElement) {
      return of(config.svgElement);
    }

    return this._fetchIcon(config).pipe(
      map(svgText => {
        // 图标集有可能是由以前的请求解析和缓存的，因此仅在缓存尚未取消时才需要进行解析。
        if (!config.svgElement) {
          config.svgElement = this._svgElementFromString(svgText);
        }

        return config.svgElement;
      })
    );
  }

  /**
   * 加载在SvgIconConfig中指定的图标URL的内容，并从中创建一个SVG元素。
   */
  private _loadSvgIconFromConfig(config: SvgIconConfig): Observable<SVGElement> {
    return this._fetchIcon(config).pipe(map(svgText => this._createSvgElementForSingleIcon(svgText, config.options)));
  }

  /** 验证svg资源url合法性 */
  private _sanitizeUrl(safeUrl: SafeResourceUrl): string {
    const url = this._sanitizer.sanitize(SecurityContext.RESOURCE_URL, safeUrl);
    if (!url) {
      throw Error(`尝试提供的URL：${url} 不被Angular的DomSanitizer服务信任为资源URL`);
    }
    return url;
  }

  /** 验证安全html合法性 */
  private _sanitizeHtml(literal: SafeHtml): string {
    const html = this._sanitizer.sanitize(SecurityContext.HTML, literal);
    if (!html) {
      throw Error(`尝试提供的HTML：${literal} 不被Angular的DomSanitizer服务信任为安全的HTML`);
    }
    return html;
  }

  /**
   * 返回一个可观察对象，该对象生成给定图标的字符串内容。结果会被缓存，因此使用相同URL的调用不会重复发送HTTP请求
   */
  private _fetchIcon(iconConfig: SvgIconConfig): Observable<string> {
    const { url: safeUrl, options } = iconConfig;
    const withCredentials = (options && options.withCredentials) || false;

    if (!this._httpClient) {
      throw Error(
        'Could not find HttpClient provider for use with Angular Simple UI icons. ' +
          'Please include the HttpClientModule from @angular/common/http in your ' +
          'app imports.'
      );
    }

    if (safeUrl == null) {
      throw Error(`无法从URL：${safeUrl} 获取图标.`);
    }

    const url = this._sanitizeUrl(safeUrl);

    // 尝试获取存储的请求，以避免在已经有一个URL请求正在处理时发送重复的URL请求。
    // 有必要在http.get()返回的被观察对象上调用share()，这样多个订阅者就不会导致多个xhr。
    const inProgressFetch = this._inProgressUrlFetches.get(url);

    // 如果找到缓存直接返回
    if (inProgressFetch) {
      return inProgressFetch;
    }

    // 找不到缓存，去请求url，假设url有旧的请求，直接删除
    const req = this._httpClient.get(url, { responseType: 'text', withCredentials }).pipe(
      finalize(() => this._inProgressUrlFetches.delete(url)),
      share()
    );

    // 重新设置缓存url和对应的请求
    this._inProgressUrlFetches.set(url, req);
    return req;
  }

  /**
   * 根据给定的SVG字符串创建SVGElement元素，并为其添加默认属性。
   */
  private _createSvgElementForSingleIcon(responseText: string, options?: IconOptions): SVGElement {
    const svg = this._svgElementFromString(responseText);
    this._setSvgAttributes(svg, options);
    return svg;
  }

  /**
   * 从给定的SVG字符串创建一个DOM元素。
   */
  private _svgElementFromString(str: string): SVGElement {
    const div = this._document.createElement('div');
    div.innerHTML = str;
    const svg = div.querySelector('svg') as SVGElement;

    if (!svg) {
      throw Error('<svg> tag not found');
    }

    return svg;
  }

  /**
   * 设置要用作图标的SVG元素的默认属性。
   */
  private _setSvgAttributes(svg: SVGElement, options?: IconOptions): SVGElement {
    svg.setAttribute('fit', '');
    svg.setAttribute('height', '100%');
    svg.setAttribute('width', '100%');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    // 禁用IE11默认行为，使SVG可聚焦..
    svg.setAttribute('focusable', 'false');
    // 设置svg的viewBox属性 https://developer.mozilla.org/zh-CN/docs/Web/SVG/Attribute/viewBox
    if (options && options.viewBox) {
      svg.setAttribute('viewBox', options.viewBox);
    }

    return svg;
  }
}

/**
 * 处理url中多个/为一个/
 * http://www.example.com/user// => http://www.example.com/user/
 * ://www.example.com/user// => ://www.example.com/user/
 * www.example.com/user//123?key=123 => www.example.com/user/123?key=123
 */
function preFilterUrl(url: string): string {
  const results = url.match(/((\w+)?:\/\/)?(.+)/);
  if (results == null) {
    return null;
  }
  return (results[1] || '') + results[3].replace(/[\/]+/g, '/');
}

/** 克隆一个SVGElement，同时保留类型信息。 */
function cloneSvg(svg: SVGElement): SVGElement {
  return svg.cloneNode(true) as SVGElement;
}

/** 返回用于图标名称空间和名称的缓存key。 */
function iconKey(namespace: string, name: string) {
  return namespace + ':' + name;
}
