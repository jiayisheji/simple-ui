import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SimSelectionAllDirective } from './selection-all.directive';
import { SimSelectionToggleDirective } from './selection-toggle.directive';
import { SimSelectionDirective } from './selection.directive';

@NgModule({
  declarations: [SimSelectionDirective, SimSelectionToggleDirective, SimSelectionAllDirective],
  imports: [CommonModule],
  exports: [SimSelectionDirective, SimSelectionToggleDirective, SimSelectionAllDirective]
})
export class SimSelectionModule {}
