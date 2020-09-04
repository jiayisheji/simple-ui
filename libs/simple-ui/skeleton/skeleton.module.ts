import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SimSkeletonComponent, SimSkeletonContentComponent } from './skeleton.component';

@NgModule({
  declarations: [SimSkeletonComponent, SimSkeletonContentComponent],
  imports: [CommonModule],
  exports: [SimSkeletonComponent]
})
export class SimSkeletonModule {}
