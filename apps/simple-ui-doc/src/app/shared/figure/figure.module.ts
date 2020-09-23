import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FigcaptionComponent, FigcaptionLabelDirective, FigureComponent } from './figure.component';
@NgModule({
  declarations: [FigureComponent, FigcaptionComponent, FigcaptionLabelDirective],
  imports: [CommonModule],
  exports: [FigureComponent, FigcaptionComponent, FigcaptionLabelDirective],
  providers: []
})
export class FigureModule {}
