import { ChangeDetectionStrategy, Component, Directive, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { InputBoolean } from '@ngx-simple/core/decorators';

@Component({
  selector: 'doc-figure',
  templateUrl: './figure.component.html',
  styleUrls: ['./figure.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    class: 'doc-figure'
  }
})
export class FigureComponent implements OnInit {
  @Input()
  @InputBoolean<FigureComponent, 'media'>()
  media: boolean;
  @Input()
  @InputBoolean<FigureComponent, 'bordered'>()
  bordered: boolean;

  constructor() {}

  ngOnInit(): void {}
}

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'figcaption',
  templateUrl: './figcaption.component.html',
  styleUrls: ['./figure.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    class: 'doc-figcaption',
    '[class.doc-figure-recommend]': '!!recommend',
    '[class.doc-figure-recommend-do]': 'recommend == "do"',
    '[class.doc-figure-recommend-dont]': 'recommend == "dont"',
    '[class.doc-figure-recommend-caution]': 'recommend == "caution"'
  }
})
export class FigcaptionComponent implements OnInit {
  /**
   * 推荐级别
   * - do 推荐
   * - dont 禁止
   * - caution 警告
   */
  @Input() recommend: 'do' | 'dont' | 'caution';

  constructor() {}

  ngOnInit(): void {}
}

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: 'doc-figcaption-label',
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    class: 'doc-figcaption-label'
  }
})
export class FigcaptionLabelDirective {}
