import { OverlayModule } from '@angular/cdk/overlay';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SimEmptyModule } from '@ngx-simple/simple-ui/empty';
import { SimOptionModule } from '@ngx-simple/simple-ui/option';
import { SimPseudoCheckboxModule } from '@ngx-simple/simple-ui/pseudo-checkbox';
import { SimSelectComponent, SIM_SELECT_SCROLL_STRATEGY_PROVIDER } from './select.component';
import { SimSelectFooterDirective, SimSelectHeaderDirective, SimSelectTriggerDirective } from './select.directive';

@NgModule({
  declarations: [SimSelectTriggerDirective, SimSelectHeaderDirective, SimSelectFooterDirective, SimSelectComponent],
  imports: [CommonModule, SimOptionModule, ScrollingModule, OverlayModule, SimPseudoCheckboxModule, SimEmptyModule],
  exports: [SimSelectTriggerDirective, SimSelectHeaderDirective, SimSelectFooterDirective, SimSelectComponent, SimOptionModule],
  providers: [SIM_SELECT_SCROLL_STRATEGY_PROVIDER]
})
export class SimSelectModule {}
