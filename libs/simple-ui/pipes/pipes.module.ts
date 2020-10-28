import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SimFallbackPipe } from './fallback.pipe';
import { SimFilterPipe } from './filter.pipe';
import { SimMapperPipe } from './mapper.pipe';
import { SimSafeHtmlPipe } from './safe-html.pipe';
import { StrategyPipe } from './strategy.pipe';
import { SimTimeAgoPipe } from './time-ago.pipe';
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
    SimTimeRangePipe,
    SimTimesPipe,
    SimWeekPipe,
    SimTimeAgoPipe
  ],
  imports: [CommonModule],
  exports: [
    SimFilterPipe,
    StrategyPipe,
    SimMapperPipe,
    SimFallbackPipe,
    SimSafeHtmlPipe,
    SimTimeRangePipe,
    SimTimesPipe,
    SimWeekPipe,
    SimTimeAgoPipe
  ]
})
export class SimPipesModule {}
