import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SimIconModule } from '@ngx-simple/simple-ui/icon';
import {
  SimAlertActionsDirective,
  SimAlertCloseDirective,
  SimAlertComponent,
  SimAlertHeadingDirective,
  SimAlertIconDirective
} from './alert.component';

@NgModule({
  declarations: [SimAlertComponent, SimAlertHeadingDirective, SimAlertCloseDirective, SimAlertActionsDirective, SimAlertIconDirective],
  imports: [CommonModule, SimIconModule],
  exports: [
    SimAlertComponent,
    SimAlertHeadingDirective,
    SimAlertCloseDirective,
    SimAlertActionsDirective,
    SimAlertIconDirective,
    SimIconModule
  ]
})
export class SimAlertModule {}
