import { Directive } from '@angular/core';

@Directive({
  selector: '[simPrefix], [sim-prefix]',
  host: {
    class: 'sim-prefix'
  }
})
export class SimPrefixDirective {}
