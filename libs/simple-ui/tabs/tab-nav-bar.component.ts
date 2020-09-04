import { ViewportRuler } from '@angular/cdk/scrolling';
import {
  AfterContentChecked,
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  NgZone,
  Renderer2,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { CanColor, mixinColor, MixinElementRefBase, mixinUnsubscribe, ThemePalette } from '@ngx-simple/simple-ui/core/common-behaviors';
import { merge } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TabInkBarComponent } from './tab-ink-bar.component';

const _TabNavBarMixinBase = mixinUnsubscribe(mixinColor(MixinElementRefBase, 'primary'));

@Component({
  selector: 'sim-tab-nav-bar, nav[sim-tab-nav-bar]',
  templateUrl: './tab-nav-bar.component.html',
  styleUrls: ['./tabs.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SimTabNavBarComponent extends _TabNavBarMixinBase implements AfterContentInit, AfterContentChecked, CanColor {
  @Input() color: ThemePalette;

  /** 选中的 */
  _activeLinkChanged: boolean;
  _activeLinkElement: ElementRef;

  @ViewChild(TabInkBarComponent) _inkBar: TabInkBarComponent;

  constructor(
    private _ngZone: NgZone,
    private _changeDetectorRef: ChangeDetectorRef,
    private _viewportRuler: ViewportRuler,
    _elementRef: ElementRef,
    renderer: Renderer2
  ) {
    super(_elementRef);
    renderer.addClass(_elementRef.nativeElement, 'sim-tab-nav-bar');
  }

  /** 通知组件活动链接已经改变。 */
  updateActiveLink(element: ElementRef) {
    this._activeLinkChanged = this._activeLinkElement !== element;
    this._activeLinkElement = element;

    if (this._activeLinkChanged) {
      this._changeDetectorRef.markForCheck();
    }
  }

  ngAfterContentInit(): void {
    this._ngZone.runOutsideAngular(() => {
      return merge(this._viewportRuler.change(10))
        .pipe(takeUntil(this.simUnsubscribe$))
        .subscribe(() => this.alignInkBar());
    });
  }

  /** 检查活动链接是否已经改变，如果是，则更新墨迹条。 */
  ngAfterContentChecked(): void {
    if (this._activeLinkChanged) {
      this.alignInkBar();
      this._activeLinkChanged = false;
    }
  }

  /** 将sim-tab-ink-bar与活动链接对齐。 */
  alignInkBar(): void {
    if (this._activeLinkElement) {
      this._inkBar.alignToElement(this._activeLinkElement.nativeElement);
    }
  }
}
