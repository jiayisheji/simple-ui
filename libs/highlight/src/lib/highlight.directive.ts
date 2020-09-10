import {
  AfterViewInit,
  Directive,
  ElementRef,
  Inject,
  Input,
  OnChanges,
  Optional,
  Renderer2,
  SecurityContext,
  SimpleChanges
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { isArray, isString } from '@ngx-simple/core/typeof';
import { animationFrameScheduler } from 'rxjs';
import { SimHighlightService } from './highlight.service';
import { SimHighlightOptions, SIM_HIGHLIGHT_OPTIONS } from './highlight.type';

@Directive({
  selector: '[simHighlight]'
})
export class SimHighlightDirective implements OnChanges, AfterViewInit {
  /** 突出显示的代码输入 */
  @Input() simHighlight: string;

  @Input()
  get languages(): string[] {
    return this._languages;
  }

  set languages(value: string[]) {
    if (isArray(value)) {
      this._languages = value;
      return;
    }
    if (isString(value)) {
      this._languages = [value];
    }
  }
  private _languages: string[] = [];

  private _nativeElement: HTMLElement;
  private _preElement: HTMLPreElement;
  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private renderer: Renderer2,
    private _sanitizer: DomSanitizer,
    private _highlight: SimHighlightService,
    @Optional()
    @Inject(SIM_HIGHLIGHT_OPTIONS)
    private _options: SimHighlightOptions
  ) {
    this._nativeElement = this.elementRef.nativeElement;
    this.renderer.addClass(this._nativeElement, 'hljs');
    this.renderer.addClass(this._nativeElement, 'sim-highlight-code');
    const pre = this.renderer.parentNode(this._nativeElement) as HTMLPreElement;
    if (pre && pre.nodeName.toLowerCase() === 'pre') {
      this._preElement = pre;
      this.renderer.addClass(this._preElement, 'sim-highlight-pre');
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    const { simHighlight } = changes;
    if (
      simHighlight &&
      typeof simHighlight.currentValue !== 'undefined' &&
      !!simHighlight.currentValue &&
      simHighlight.currentValue !== simHighlight.previousValue
    ) {
      this.highlightElement(this.simHighlight, this.languages);
    }
  }

  ngAfterViewInit(): void {
    // 如果已经输入了，就不要走获取内容了
    if (this.simHighlight && !!this.simHighlight.trim()) {
      return;
    }
    this._nativeElement.innerHTML = this._nativeElement.innerHTML.trim();
    console.log();
    this._highlight.highlightBlock(this._nativeElement).subscribe(() => {
      this.setPreClass(this.languages);
    });
  }

  highlightElement(code: string, languages: string[]): void {
    // 突出显示之前设置代码文本
    this.setTextContent(code);
    this._highlight.highlightAuto(code, languages).subscribe((res: any) => {
      // 设置突出显示的代码
      this.setInnerHTML(res.value);
      this.setPreClass(languages);
    });
  }

  private setTextContent(content: string) {
    animationFrameScheduler.schedule(() => (this._nativeElement.textContent = content));
  }

  private setInnerHTML(content: string) {
    animationFrameScheduler.schedule(() => (this._nativeElement.innerHTML = this._sanitizer.sanitize(SecurityContext.HTML, content)));
  }

  private setPreClass(languages: string[]) {
    if (!this._preElement) {
      return;
    }
    languages.forEach(language => {
      this.renderer.addClass(this._preElement, `language-${language}`);
    });
  }
}
