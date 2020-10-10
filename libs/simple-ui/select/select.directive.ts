import { Directive } from '@angular/core';

@Directive({
  selector: '[simSelectTrigger], [sim-select-trigger], sim-select-trigger'
})
export class SimSelectTriggerDirective {}

@Directive({
  selector: '[simSelectHeader], [sim-select-header], sim-select-header',
  exportAs: 'simSelectHeader',
  host: {
    class: 'sim-select-header'
  }
})
export class SimSelectHeaderDirective {}

@Directive({
  selector: '[simSelectFooter], [sim-select-footer], sim-select-footer',
  exportAs: 'simSelectFooter',
  host: {
    class: 'sim-select-footer'
  }
})
export class SimSelectFooterDirective {}
