import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SimIconModule } from '@ngx-simple/simple-ui/icon';
import { SimChipInputDirective } from './chip-input.directive';
import { SimChipListComponent } from './chip-list.component';
import { SimChipComponent, SimChipRemoveDirective } from './chip.component';

@NgModule({
  declarations: [SimChipRemoveDirective, SimChipComponent, SimChipListComponent, SimChipInputDirective],
  imports: [CommonModule, SimIconModule],
  exports: [SimChipRemoveDirective, SimChipComponent, SimChipListComponent, SimChipInputDirective]
})
export class SimChipsModule {}
