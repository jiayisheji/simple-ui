import { NgModule } from '@angular/core';
import { SimDateAdapter } from './date-adapter';
import { SimNativeDate } from './native-date';

@NgModule({
  providers: [{ provide: SimDateAdapter, useClass: SimNativeDate }]
})
export class SimDateModule {}
