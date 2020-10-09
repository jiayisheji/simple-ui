import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SimSortComponent, SimSortDirective } from './sort.component';

@NgModule({
  declarations: [SimSortComponent, SimSortDirective],
  imports: [CommonModule],
  exports: [SimSortComponent, SimSortDirective]
})
export class SimSortModule {}
