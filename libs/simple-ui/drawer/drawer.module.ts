import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SimDrawerComponent, SimDrawerContainerComponent, SimDrawerContentComponent } from './drawer.component';

@NgModule({
  declarations: [SimDrawerComponent, SimDrawerContentComponent, SimDrawerContainerComponent],
  imports: [CommonModule],
  exports: [SimDrawerComponent, SimDrawerContentComponent, SimDrawerContainerComponent]
})
export class SimDrawerModule {}
