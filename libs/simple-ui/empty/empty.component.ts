import { ChangeDetectionStrategy, Component, Directive, Inject, Input, Optional, ViewEncapsulation } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { NgStringOrTemplateRef } from '@ngx-simple/core/types';
import { SimEmptyDefaultOptions, SIM_EMPTY_DEFAULT_OPTIONS } from './default-options';

@Component({
  selector: 'sim-empty',
  templateUrl: './empty.component.html',
  styleUrls: ['./empty.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sim-empty'
  }
})
export class SimEmptyComponent {
  @Input() src: SafeResourceUrl;
  @Input() content: NgStringOrTemplateRef = '暂无数据';

  constructor(
    @Inject(SIM_EMPTY_DEFAULT_OPTIONS)
    @Optional()
    defaultOptions?: SimEmptyDefaultOptions
  ) {
    if (defaultOptions) {
      this.content = defaultOptions.content;
      this.src = defaultOptions.src;
    }
  }
}

@Directive({
  selector: 'sim-empty-footer',
  host: {
    class: 'sim-empty-footer'
  }
})
export class SimEmptyFooterDirective {}
