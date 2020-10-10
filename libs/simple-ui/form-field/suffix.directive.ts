import { Directive } from '@angular/core';

@Directive({
  selector: '[simSuffix], [sim-suffix]',
  host: {
    class: 'sim-suffix'
  }
})
export class SimSuffixDirective {}
