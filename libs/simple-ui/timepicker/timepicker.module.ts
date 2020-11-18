import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SimDateModule } from '@ngx-simple/core/datetime';
import { SimButtonModule } from '@ngx-simple/simple-ui/button';
import { SimInputModule } from '@ngx-simple/simple-ui/input';
import { SimTimeViewComponent } from './time-view.component';
import { SimTimepickerContentComponent } from './timepicker-content.component';
import { SimTimepickerDirective } from './timepicker-input.directive';
import { SimTimepickerComponent, SIM_TIMEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER } from './timepicker.component';
import { SimTimeListDirective } from './timepicker.directive';

@NgModule({
  declarations: [SimTimepickerDirective, SimTimepickerComponent, SimTimepickerContentComponent, SimTimeViewComponent, SimTimeListDirective],
  imports: [CommonModule, SimDateModule, A11yModule, OverlayModule, PortalModule, SimButtonModule],
  exports: [SimInputModule, SimTimepickerDirective, SimTimepickerComponent, SimTimeViewComponent],
  providers: [SIM_TIMEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER]
})
export class SimTimepickerModule {}
