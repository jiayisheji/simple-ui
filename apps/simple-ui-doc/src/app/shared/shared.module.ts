import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ExampleViewerModule } from './example-viewer/example-viewer.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, ExampleViewerModule],
  exports: [CommonModule, ExampleViewerModule]
})
export class SharedModule {}
