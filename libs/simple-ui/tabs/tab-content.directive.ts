import { Directive, TemplateRef } from '@angular/core';
import { SafeAny } from '@ngx-simple/core/types';

@Directive({
  selector: 'ng-template[simTabContent],ng-template[sim-tab-content]'
})
export class SimTabContentDirective {
  constructor(public template: TemplateRef<SafeAny>) {}
}
