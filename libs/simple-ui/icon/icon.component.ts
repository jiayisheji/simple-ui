import { DOCUMENT } from '@angular/common';
import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ErrorHandler,
  HostBinding,
  inject,
  Inject,
  InjectionToken,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Renderer2,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import { CanColor, mixinColor, MixinElementRefBase, ThemePalette } from '@ngx-simple/core/common-behaviors';
import { InputBoolean } from '@ngx-simple/core/decorators';
import { take } from 'rxjs/operators';
import { SimIconService } from './icon.service';

const _IconMixinBase = mixinColor(MixinElementRefBase);

/** 接受的SVG属性(例如：“url(<something>)”)。 */
const funcIriAttributes = [
  'clip-path',
  'color-profile',
  'src',
  'cursor',
  'fill',
  'filter',
  'marker',
  'marker-start',
  'marker-mid',
  'marker-end',
  'mask',
  'stroke'
];

/** 选择器，可以用来找到所有的元素是使用一个'FuncIRI'。 */
const funcIriAttributeSelector = funcIriAttributes.map(attr => `[${attr}]`).join(', ');

/** 可以用来从'FuncIRI'中提取id的正则表达式。 */
const funcIriPattern = /^url\(['"]?#(.*?)['"]?\)$/;

/**
 * 定义location。
 */
export interface SimIconLocation {
  getPathname: () => string;
}

/**
 * 注入令牌用于向“SImIcon”提供当前位置。用于在单元测试期间处理服务器端呈现和存根。
 */
export const SIM_ICON_LOCATION = new InjectionToken<SimIconLocation>('sim-icon-location', {
  providedIn: 'root',
  factory: SIM_ICON_LOCATION_FACTORY
});

export function SIM_ICON_LOCATION_FACTORY(): SimIconLocation {
  const _document = inject(DOCUMENT);
  const _location = _document ? _document.location : null;
  return {
    // 注意：这需要是一个函数，而不是一个属性，因为Angular只会解析它一次，但我们希望每次调用都有当前路径。
    getPathname: () => (_location ? _location.pathname + _location.search : '')
  };
}

/**
 * @example
 * ```html
 * <sim-icon svgIcon="user"></sim-icon>
 * ```
 */
@Component({
  selector: 'sim-icon',
  template: '',
  styleUrls: ['./icon.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SimIconComponent extends _IconMixinBase implements OnChanges, OnInit, AfterViewChecked, OnDestroy, CanColor {
  /** 字体集中图标的名称 */
  @Input()
  get fontIcon(): string {
    return this._fontIcon;
  }
  set fontIcon(value: string) {
    this._fontIcon = this._cleanupFontValue(value);
  }

  /** 图标字体所属的字体集 */
  @Input()
  get fontSet(): string {
    return this._fontSet;
  }
  set fontSet(value: string) {
    this._fontSet = this._cleanupFontValue(value);
  }

  /** 给图标添加样式 默认是父级颜色 */
  @Input() color: ThemePalette;

  /** 给图标设置字体大小 默认是父级字体大小  */
  @Input()
  @HostBinding('style.font-size')
  fontSize: string;

  /**
   * 是否应该内联图标，自动调整图标的大小以匹配图标所在元素的字体大小。
   * 默认是自动调整图标的字体大小，宽高指定的为1em。
   */
  @Input()
  @InputBoolean<SimIconComponent, 'inline'>()
  @HostBinding('class.sim-icon-inline')
  inline: boolean;

  /** SVG图标集中图标的名称 */
  @Input() svgIcon: string;

  /** 跟踪我们用当前路径作为前缀的元素和属性。 */
  private _elementsWithExternalReferences?: Map<Element, Array<{ name: string; value: string }>>;
  private _fontIcon: string;
  private _fontSet: string;
  /** 缓存上一个图标字体名称class */
  private _previousFontIconClass: string;

  /** 缓存上一个图标字体集class */
  private _previousFontSetClass: string;
  /** 跟踪当前页面路径。 */
  private _previousPath: string;

  constructor(
    elementRef: ElementRef,
    private renderer: Renderer2,
    private simIconService: SimIconService,
    @Inject(SIM_ICON_LOCATION) private _location: SimIconLocation,
    private readonly _errorHandler: ErrorHandler
  ) {
    super(elementRef);
    renderer.addClass(elementRef.nativeElement, 'sim-icon');
    renderer.setAttribute(elementRef.nativeElement, 'role', 'img');
  }

  ngAfterViewChecked() {
    const cachedElements = this._elementsWithExternalReferences;

    if (cachedElements && this._location && cachedElements.size) {
      const newPath = this._location.getPathname();

      // 我们需要在每次改变检测时检查URL是否改变了，
      // 因为浏览器没有API让我们在点击链接时做出反应，而且我们不能依赖Angular路由器。
      // 需要更新引用，因为尽管大多数浏览器在第一次呈现后并不关心URL是否正确，
      // 但如果用户导航到另一个页面而SVG没有重新呈现，Safari就会崩溃。
      if (newPath !== this._previousPath) {
        this._previousPath = newPath;
        this._prependPathToReferences(newPath);
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // 如果输入改变了，只更新内联SVG图标，以避免不必要的DOM操作。
    const { svgIcon } = changes;
    if (svgIcon) {
      if (this.svgIcon) {
        const [namespace, iconName] = this._splitIconName(this.svgIcon);
        this.simIconService
          .getNamedBySvgIcon(iconName, namespace)
          .pipe(take(1))
          .subscribe(
            svg => this._setSvgElement(svg),
            (err: Error) => {
              const errorMessage = `Error retrieving icon ${namespace}:${iconName}! ${err.message}`;
              this._errorHandler.handleError(new Error(errorMessage));
            }
          );
      }
    }
    // 更新字体图标
    if (this._usingFontIcon()) {
      this._updateFontIconClasses();
    }
  }

  ngOnDestroy() {
    if (this._elementsWithExternalReferences) {
      this._elementsWithExternalReferences.clear();
    }
  }

  ngOnInit() {
    if (this._usingFontIcon()) {
      this._updateFontIconClasses();
    }
  }

  /**
   * 缓存具有“url()”引用的SVG元素的子元素，我们需要用当前路径作为前缀。
   */
  private _cacheChildrenWithExternalReferences(element: SVGElement) {
    const elementsWithFuncIri = element.querySelectorAll(funcIriAttributeSelector);
    const elements: Map<Element, Array<{ name: string; value: string }>> = (this._elementsWithExternalReferences =
      this._elementsWithExternalReferences || new Map());

    const length = elementsWithFuncIri.length;
    let i = 0;
    while (i < length) {
      funcIriAttributes.forEach(attr => {
        const elementWithReference = elementsWithFuncIri[i];
        const value = elementWithReference.getAttribute(attr);
        const match = value ? value.match(funcIriPattern) : null;

        if (match) {
          let attributes = elements.get(elementWithReference);

          if (!attributes) {
            attributes = [];
            elements.set(elementWithReference, attributes);
          }

          attributes.push({ name: attr, value: match[1] });
        }
      });

      i++;
    }
  }

  /**
   * 处理传入fontIcon或fontSet的值。
   * 由于该值最终被赋值为一个CSS class，所以我们必须处理收尾空格和有空格分隔的值。
   */
  private _cleanupFontValue(value: string): string {
    return typeof value === 'string' ? value.trim().split(' ')[0] : value;
  }

  private _clearSvgElement() {
    const layoutElement: HTMLElement = this._elementRef.nativeElement;
    let childCount = layoutElement.childNodes.length;

    if (this._elementsWithExternalReferences) {
      this._elementsWithExternalReferences.clear();
    }

    // 删除现有的非元素子节点和SVG，并添加新的SVG元素。注意，我们不能使用innerHTML，因为如果元素有数据绑定，IE会丢弃。
    while (childCount--) {
      const child = layoutElement.childNodes[childCount];

      // 1对应于Node.ELEMENT_NODE。
      // 我们删除所有的非元素节点，以摆脱任何松散的文本节点，以及任何SVG元素，以删除任何旧的图标。
      if (child.nodeType !== 1 || child.nodeName.toLowerCase() === 'svg') {
        layoutElement.removeChild(child);
      }
    }
  }

  /**
   * 将当前路径添加到所有具有指向“FuncIRI”引用的属性的元素。
   * 注意：WebKit浏览器要求引用以当前路径为前缀，如果页面有一个<base>。
   */
  private _prependPathToReferences(path: string) {
    const elements = this._elementsWithExternalReferences;

    if (elements) {
      elements.forEach((attrs, element) => {
        attrs.forEach(attr => {
          element.setAttribute(attr.name, `url('${path}#${attr.value}')`);
        });
      });
    }
  }

  private _setSvgElement(svg: SVGElement) {
    this._clearSvgElement();

    // 解决IE11会忽略style标签内动态创建的SVG。
    // See: https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/10898469/
    // 在将元素插入DOM之前执行此操作，以避免重新计算样式。
    const styleTags = svg.querySelectorAll('style') as NodeListOf<HTMLStyleElement>;

    const length = styleTags.length;
    let i = 0;
    while (i < length) {
      styleTags[i].textContent += ' ';
      i++;
    }

    // 注意:我们在这里做这个修复，而不是图标注册表，因为在创建图标时引用必须指向URL。
    if (this._location) {
      const path = this._location.getPathname();
      this._previousPath = path;
      this._cacheChildrenWithExternalReferences(svg);
      this._prependPathToReferences(path);
    }

    this._elementRef.nativeElement.appendChild(svg);
  }

  /**
   * 将一个svgIcon绑定值拆分为它的图标集和图标名称。
   * 返回一个数组[(图标集)，(图标名称)]。
   * 这两个字段的分隔符是':'。如果没有分隔符，则为空
   * 将为图标集返回字符串，并为其返回整个值
   * 图标名称。如果参数是假的，返回一个由两个空字符串组成的数组。
   * 如果名称包含两个或多个':'分隔符，则引发错误。
   * Examples:
   *   `'social:cake' -> ['social', 'cake']
   *   'penguin' -> ['', 'penguin']
   *   null -> ['', '']
   *   'a:b:c' -> (throws Error)`
   */
  private _splitIconName(iconName: string): [string, string] {
    if (!iconName) {
      return ['', ''];
    }
    const parts = iconName.split(':');
    switch (parts.length) {
      case 1:
        return ['', parts[0]]; // 使用默认名称空间。
      case 2:
        return parts as [string, string];
      default:
        throw Error(`Invalid icon name: "${iconName}"`);
    }
  }

  /**
   * 更新fontIcon的class
   */
  private _updateFontIconClasses() {
    if (!this._usingFontIcon()) {
      return;
    }

    const elem: HTMLElement = this._elementRef.nativeElement;
    const fontSetClass = this.fontSet
      ? this.simIconService.classNameForFontAlias(this.fontSet)
      : this.simIconService.getDefaultFontSetClass();

    if (fontSetClass !== this._previousFontSetClass) {
      if (this._previousFontSetClass) {
        elem.classList.remove(this._previousFontSetClass);
      }
      if (fontSetClass) {
        elem.classList.add(fontSetClass);
      }
      this._previousFontSetClass = fontSetClass;
    }

    if (this.fontIcon !== this._previousFontIconClass) {
      if (this._previousFontIconClass) {
        elem.classList.remove(this._previousFontIconClass);
      }
      if (this.fontIcon) {
        elem.classList.add(this.fontIcon);
      }
      this._previousFontIconClass = this.fontIcon;
    }
  }

  /**
   * 是否使用字体图标
   */
  private _usingFontIcon(): boolean {
    return !this.svgIcon;
  }
}
