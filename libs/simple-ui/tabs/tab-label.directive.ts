import { CdkPortal } from '@angular/cdk/portal';
import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: 'ng-template[simTabLabel],ng-template[sim-tab-label]'
})
export class SimTabLabelDirective extends CdkPortal {
  constructor(templateRef: TemplateRef<HTMLElement>, viewContainerRef: ViewContainerRef) {
    super(templateRef, viewContainerRef);
  }
}
