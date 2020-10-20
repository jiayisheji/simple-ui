import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { SimEChartsDefaultOptions } from './default-options';
import { SimEchartsDirective } from './echarts.directive';
import { SIM_ECHARTS_OPTIONS } from './echarts.token';

@NgModule({
  imports: [CommonModule],
  declarations: [SimEchartsDirective],
  exports: [SimEchartsDirective]
})
export class SimEchartsModule {
  static forRoot(config: SimEChartsDefaultOptions): ModuleWithProviders<SimEchartsModule> {
    return {
      ngModule: SimEchartsModule,
      providers: [
        {
          provide: SIM_ECHARTS_OPTIONS,
          useValue: config
        }
      ]
    };
  }
}
