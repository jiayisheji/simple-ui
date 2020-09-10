import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NprogressComponent } from './nprogress.component';

@NgModule({
  declarations: [NprogressComponent],
  imports: [CommonModule],
  exports: [NprogressComponent]
})
export class SimNprogressModule {}
