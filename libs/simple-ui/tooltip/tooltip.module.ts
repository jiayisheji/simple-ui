import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SimOutletModule } from '@ngx-simple/core/outlet';
import { SimTooltipComponent } from './tooltip.component';
import { SimTooltipDirective } from './tooltip.directive';

@NgModule({
  declarations: [SimTooltipComponent, SimTooltipDirective],
  imports: [CommonModule, SimOutletModule, OverlayModule],
  exports: [SimTooltipDirective],
  entryComponents: [SimTooltipComponent]
})
export class SimTooltipModule {}
