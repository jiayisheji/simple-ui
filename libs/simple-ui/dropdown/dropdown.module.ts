import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SimOptionModule } from '@ngx-simple/simple-ui/option';
import { SimDropdownActionsCloseDirective, SimDropdownActionsComponent } from './dropdown-actions.component';
import { SimDropdownComponent } from './dropdown.component';
import { SimDropdownCloseDirective, SimDropdownDirective } from './dropdown.directive';

@NgModule({
  declarations: [
    SimDropdownCloseDirective,
    SimDropdownComponent,
    SimDropdownDirective,
    SimDropdownActionsComponent,
    SimDropdownActionsCloseDirective
  ],
  imports: [CommonModule, OverlayModule, SimOptionModule],
  exports: [
    SimDropdownCloseDirective,
    SimDropdownComponent,
    SimDropdownDirective,
    SimDropdownActionsComponent,
    SimOptionModule,
    SimDropdownActionsCloseDirective
  ],
  entryComponents: [SimDropdownComponent]
})
export class SimDropdownModule {}
