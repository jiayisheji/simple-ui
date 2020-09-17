import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SimSpinnerComponent } from './spinner.component';

@NgModule({
  declarations: [SimSpinnerComponent],
  imports: [CommonModule],
  exports: [SimSpinnerComponent]
})
export class SimSpinnerModule {}
