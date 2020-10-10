import { Directive, HostBinding, Input } from '@angular/core';

let nextUniqueId = 0;

@Directive({
  selector: '[simError],[sim-error],sim-error',
  host: {
    class: 'sim-error',
    role: 'alert'
  }
})
export class SimErrorDirective {
  @Input()
  @HostBinding('attr.id')
  id = `sim-error-${nextUniqueId++}`;
}
