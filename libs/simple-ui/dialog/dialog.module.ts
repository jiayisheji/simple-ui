import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SimDialogComponent } from './dialog.component';
import {
  SimDialogActionsDirective,
  SimDialogCloseDirective,
  SimDialogContentDirective,
  SimDialogHeaderDirective,
  SimDialogTitleDirective
} from './dialog.directive';
import { SimDialogService, SIM_DIALOG_SCROLL_STRATEGY_PROVIDER } from './dialog.service';

@NgModule({
  declarations: [
    SimDialogComponent,
    SimDialogCloseDirective,
    SimDialogContentDirective,
    SimDialogHeaderDirective,
    SimDialogActionsDirective,
    SimDialogTitleDirective
  ],
  imports: [CommonModule, OverlayModule, PortalModule],
  exports: [
    SimDialogCloseDirective,
    SimDialogContentDirective,
    SimDialogHeaderDirective,
    SimDialogActionsDirective,
    SimDialogTitleDirective
  ],
  providers: [SimDialogService, SIM_DIALOG_SCROLL_STRATEGY_PROVIDER],
  entryComponents: [SimDialogComponent]
})
export class SimDialogModule {}
