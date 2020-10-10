import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Directive, Input } from '@angular/core';

@Directive({
  selector: 'textarea[sim-autosize], textarea[simTextareaAutosize]',
  exportAs: 'simTextareaAutosize',
  host: {
    class: 'cdk-textarea-autosize sim-autosize',
    rows: '1'
  }
})
export class SimTextareaAutosizeDirective extends CdkTextareaAutosize {
  @Input() cdkAutosizeMinRows: number;
  @Input() cdkAutosizeMaxRows: number;

  @Input()
  get simAutosizeMinRows(): number {
    return this.minRows;
  }
  set simAutosizeMinRows(value: number) {
    this.minRows = value;
  }

  @Input()
  get simAutosizeMaxRows(): number {
    return this.maxRows;
  }
  set simAutosizeMaxRows(value: number) {
    this.maxRows = value;
  }

  @Input('sim-autosize')
  get simAutosize(): boolean {
    return this.enabled;
  }
  set simAutosize(value: boolean) {
    this.enabled = value;
  }

  @Input()
  get simTextareaAutosize(): boolean {
    return this.enabled;
  }
  set simTextareaAutosize(value: boolean) {
    this.enabled = value;
  }
}
