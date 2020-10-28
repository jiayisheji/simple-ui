import { Directive, EmbeddedViewRef, Input, OnChanges, SimpleChange, SimpleChanges, TemplateRef, ViewContainerRef } from '@angular/core';
import { SafeAny } from '@ngx-simple/core/types';

/**
 * <ng-container *simTemplateOutlet="template; context: contextExp">template</ng-container>
 * <ng-template #template><span>Hello</span></ng-template>
 * 参考NgTemplateOutlet写法 唯一区别 自动处理String和Template 优先处理Template
 */
@Directive({
  selector: '[simTemplateOutlet]',
  exportAs: 'simTemplateOutlet'
})
export class SimTemplateOutletDirective implements OnChanges {
  /** 一个字符串，定义模板引用以及模板的上下文对象（可选）。 */
  @Input() simTemplateOutlet: TemplateRef<SafeAny> | null = null;

  /**
   * 要附加到{@link EmbeddedViewRef}的上下文对象。
   * 这应该是一个对象，对象的键可以通过本地模板`let`声明进行绑定。
   * 在上下文对象中使用`$implicit`将把它的值设置为默认值。
   */
  @Input() simTemplateOutletContext: object | null = null;

  private _viewRef: EmbeddedViewRef<SafeAny> | null = null;

  constructor(private _viewContainerRef: ViewContainerRef, private templateRef: TemplateRef<SafeAny>) {}

  ngOnChanges(changes: SimpleChanges) {
    const recreateView = this._shouldRecreateView(changes);
    if (recreateView) {
      const viewContainerRef = this._viewContainerRef;

      if (this._viewRef) {
        viewContainerRef.remove(viewContainerRef.indexOf(this._viewRef));
      }
      // 检查是否是模板 TemplateRef
      const isTemplateRef = this.simTemplateOutlet instanceof TemplateRef;
      // 如果不是模板，就创建 TemplateRef
      const templateRef = isTemplateRef ? this.simTemplateOutlet : this.templateRef;
      this._viewRef = templateRef ? viewContainerRef.createEmbeddedView(templateRef, this.simTemplateOutletContext) : null;
    } else if (this._viewRef && this.simTemplateOutletContext) {
      this._updateExistingContext(this.simTemplateOutletContext);
    }
  }

  private _shouldRecreateView(changes: SimpleChanges): boolean {
    const ctxChange = changes['simTemplateOutletContext'];
    return !!changes['simTemplateOutlet'] || (ctxChange && this._hasContextShapeChanged(ctxChange));
  }

  private _hasContextShapeChanged(ctxChange: SimpleChange): boolean {
    const prevCtxKeys = Object.keys(ctxChange.previousValue || {});
    const currCtxKeys = Object.keys(ctxChange.currentValue || {});

    if (prevCtxKeys.length === currCtxKeys.length) {
      for (const propName of currCtxKeys) {
        if (prevCtxKeys.indexOf(propName) === -1) {
          return true;
        }
      }
      return false;
    }
    return true;
  }

  private _updateExistingContext(ctx: object): void {
    for (const propName of Object.keys(ctx)) {
      (this._viewRef.context as SafeAny)[propName] = (this.simTemplateOutletContext as SafeAny)[propName];
    }
  }
}
