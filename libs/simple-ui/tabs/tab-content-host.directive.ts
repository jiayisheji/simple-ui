import { CdkPortalOutlet } from '@angular/cdk/portal';
import { ComponentFactoryResolver, Directive, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { SimTabBodyComponent } from './tab-body.component';

@Directive({
  selector: '[simTabContentHost]'
})
export class SimTabContentHostDirective extends CdkPortalOutlet implements OnInit, OnDestroy {
  /** 订阅标签正文开始居中时的事件订阅。 */
  private _centeringSub: Subscription;
  /** 订阅标签正文离开中心位置时的事件订阅。 */
  private _leavingSub: Subscription;

  constructor(
    _componentFactoryResolver: ComponentFactoryResolver,
    _viewContainerRef: ViewContainerRef,
    private _host: SimTabBodyComponent
  ) {
    super(_componentFactoryResolver, _viewContainerRef);
  }

  /** 设置初始可见性或设置更改可见性的订阅。 */
  ngOnInit(): void {
    if (this._host._isCenterPosition(this._host._position)) {
      this.attach(this._host.content);
    }
    this._centeringSub = this._host._beforeCentering
      .pipe(startWith(this._host._isCenterPosition(this._host._position)))
      .subscribe((isCentering: boolean) => {
        if (isCentering && !this.hasAttached()) {
          this.attach(this._host.content);
        }
      });

    this._leavingSub = this._host._afterLeavingCenter.subscribe(() => {
      this.detach();
    });
  }

  /** 清理中心订阅。 */
  ngOnDestroy(): void {
    super.ngOnDestroy();
    this._centeringSub.unsubscribe();
    this._leavingSub.unsubscribe();
  }
}
