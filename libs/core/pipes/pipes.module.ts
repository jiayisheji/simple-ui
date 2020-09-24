import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SimFallbackPipe } from './fallback.pipe';
import { SimFilterPipe } from './filter.pipe';
import { SimMapperPipe } from './mapper.pipe';
import { SimSafeHtmlPipe } from './safe-html.pipe';
import { SimSecretPipe } from './secret.pipe';
import { StrategyPipe } from './strategy.pipe';
import { SimTimeRangePipe } from './time-range.pipe';
import { SimTimesPipe } from './times.pipe';
import { SimWeekPipe } from './week.pipe';

@NgModule({
  declarations: [
    SimFilterPipe,
    StrategyPipe,
    SimMapperPipe,
    SimFallbackPipe,
    SimSafeHtmlPipe,
    SimSecretPipe,
    SimTimeRangePipe,
    SimTimesPipe,
    SimWeekPipe
  ],
  imports: [CommonModule],
  exports: [
    SimFilterPipe,
    StrategyPipe,
    SimMapperPipe,
    SimFallbackPipe,
    SimSafeHtmlPipe,
    SimSecretPipe,
    SimTimeRangePipe,
    SimTimesPipe,
    SimWeekPipe
  ]
})
export class SimPipesModule {}
