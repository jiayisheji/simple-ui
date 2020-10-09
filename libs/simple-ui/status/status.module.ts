import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SimStatusComponent } from './status.component';

@NgModule({
  declarations: [SimStatusComponent],
  imports: [CommonModule],
  exports: [SimStatusComponent]
})
export class SimStatusModule {}
