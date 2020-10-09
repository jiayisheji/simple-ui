import { Directive } from '@angular/core';

@Directive({
  selector: 'sim-witch-checked',
  host: {
    class: 'sim-witch-checked-children'
  }
})
export class SimWitchCheckedDirective {}

@Directive({
  selector: 'sim-witch-unchecked',
  host: {
    class: 'sim-witch-unchecked-children'
  }
})
export class SimWitchUncheckedDirective {}
