import { ObserversModule } from '@angular/cdk/observers';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SimSwitchRequiredValidator } from './switch-required-validator';
import { SimSlideToggleComponent, SimSwitchComponent } from './switch.component';
import { SimWitchCheckedDirective, SimWitchUncheckedDirective } from './switch.directive';

@NgModule({
  declarations: [
    SimSwitchComponent,
    SimSlideToggleComponent,
    SimWitchCheckedDirective,
    SimWitchUncheckedDirective,
    SimSwitchRequiredValidator
  ],
  imports: [CommonModule, ObserversModule],
  exports: [SimSwitchComponent, SimSlideToggleComponent, SimWitchCheckedDirective, SimWitchUncheckedDirective, SimSwitchRequiredValidator]
})
export class SimSwitchModule {}
