import { Component, Directive, Input, OnInit, Pipe, PipeTransform } from '@angular/core';

@Component({
  selector: 'doc-example-viewer',
  templateUrl: './example-viewer.component.html',
  styleUrls: ['./example-viewer.component.scss']
})
export class ExampleViewerComponent implements OnInit {
  @Input() path: string;

  isSourceShow: boolean;

  sources: Array<{
    label: string;
    languages: string;
    suffix: string;
    code: string;
  }> = [];

  constructor() {}

  ngOnInit(): void {}

  copied($event: boolean) {}

  toggleSourceShow() {
    this.isSourceShow = !this.isSourceShow;
  }
}

@Directive({
  selector: '[docExampleViewerLabel], doc-example-viewer-label'
})
export class ExampleViewerLabelDirective {}

@Pipe({ name: 'exampleUrl' })
export class ExampleUrlPipe implements PipeTransform {
  transform(value: string, suffix: string): string {
    if (!value) {
      return undefined;
    }
    return `/assets/examples/${value}.${suffix}`;
  }
}
