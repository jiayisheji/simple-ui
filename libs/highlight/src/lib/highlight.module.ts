import { NgModule } from '@angular/core';
import { CodeFromUrlPipe } from './code-from-url.pipe';
import { SimHighlightDirective } from './highlight.directive';

@NgModule({
  declarations: [SimHighlightDirective, CodeFromUrlPipe],
  exports: [SimHighlightDirective, CodeFromUrlPipe]
})
export class SimHighlightModule {}
