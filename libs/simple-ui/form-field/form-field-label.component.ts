import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewEncapsulation } from '@angular/core';
import { SimFormFieldControl } from './form-field-control';

@Component({
  selector: 'sim-form-label',
  templateUrl: './form-field-label.component.html',
  styleUrls: ['./form-field.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sim-form-label',
    '[class.sim-form-field-required]': '_control && _control.required && !_control.disabled'
  }
})
export class SimFormFieldLabelComponent {
  _control: SimFormFieldControl<unknown>;
  _hideRequiredMarker: boolean;

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  markForCheck(): void {
    this._changeDetectorRef.markForCheck();
  }
}
