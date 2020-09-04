import {
  AfterContentInit,
  Attribute,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  Optional,
  Renderer2,
  Self
} from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkWithHref } from '@angular/router';
import {
  CanDisable,
  HasTabIndex,
  mixinDisabled,
  MixinElementRefBase,
  mixinTabIndex,
  mixinUnsubscribe,
  untilUnmounted
} from '@ngx-simple/simple-ui/core/common-behaviors';
import { filter } from 'rxjs/operators';
import { SimTabNavBarComponent } from './tab-nav-bar.component';

const _TabLinkMixinBase = mixinUnsubscribe(mixinTabIndex(mixinDisabled(MixinElementRefBase)));

@Directive({
  selector: '[simTabLink],[sim-tab-link]'
})
export class SimTabLinkDirective extends _TabLinkMixinBase implements AfterContentInit, OnDestroy, CanDisable, HasTabIndex {
  /** 焦点索引 */
  tabIndex: number;

  /** 是否禁用 */
  @Input()
  @HostBinding('class.sim-tab-link-disabled')
  disabled: boolean;

  /** 当前是否选中 */
  @Input()
  @HostBinding('class.sim-tab-link-active')
  get active(): boolean {
    return this._isActive;
  }
  set active(value: boolean) {
    this._isActive = Boolean(value);
    if (this._supportRouterLink) {
      return;
    }
    if (value) {
      this._tabNavBar.updateActiveLink(this._elementRef);
    }
  }
  private _isActive: boolean;

  private _supportRouterLink: boolean;

  private _init: boolean;

  constructor(
    _elementRef: ElementRef,
    renderer: Renderer2,
    private _tabNavBar: SimTabNavBarComponent,
    private router: Router,
    @Attribute('tabindex') tabIndex: string,
    @Optional() @Self() public routerLink?: RouterLink,
    @Optional() @Self() public routerLinkWithHref?: RouterLinkWithHref
  ) {
    super(_elementRef);
    renderer.addClass(_elementRef.nativeElement, 'sim-tab-link');
    this.tabIndex = parseInt(tabIndex, 10) || 0;
    this._supportRouterLink = !!(routerLink || routerLinkWithHref);
    if (this._supportRouterLink) {
      this.router.events
        .pipe(
          filter(e => e instanceof NavigationEnd && this._init),
          untilUnmounted(this)
        )
        .subscribe(() => {
          this.updateRouterActive();
        });
    }
  }

  ngAfterContentInit(): void {
    if (this._supportRouterLink) {
      this._init = true;
      this.updateRouterActive();
    }
  }

  @HostListener('click', ['$event'])
  _handleClick(event: MouseEvent) {
    if (this.disabled) {
      event.preventDefault();
    }
  }

  private updateRouterActive() {
    if (!this._supportRouterLink || !this.router.navigated) {
      return;
    }

    Promise.resolve().then(() => {
      const hasActiveLinks = this.hasActiveLinks();
      this.active = hasActiveLinks;
      if (hasActiveLinks) {
        this._tabNavBar.updateActiveLink(this._elementRef);
      }
    });
  }

  private isLinkActive(router: Router): (link: RouterLink | RouterLinkWithHref) => boolean {
    return (link: RouterLink | RouterLinkWithHref) => router.isActive(link.urlTree, false);
  }

  private hasActiveLinks(): boolean {
    const isActiveCheckFn = this.isLinkActive(this.router);
    return (this.routerLink && isActiveCheckFn(this.routerLink)) || (this.routerLinkWithHref && isActiveCheckFn(this.routerLinkWithHref));
  }
}
