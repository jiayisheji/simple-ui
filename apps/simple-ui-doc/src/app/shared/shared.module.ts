import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExampleViewerModule } from './example-viewer/example-viewer.module';
import { FigureModule } from './figure/figure.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ExampleViewerModule, FigureModule],
  exports: [CommonModule, FormsModule, ReactiveFormsModule, ExampleViewerModule, FigureModule]
})
export class SharedModule {}
