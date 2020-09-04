import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Directive,
  HostBinding,
  HostListener,
  Input,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { InputBoolean } from '@ngx-simple/simple-ui/core/decorators';
import { isArray } from '@ngx-simple/simple-ui/core/typeof';
import { SimSkeletonRow } from '@ngx-simple/simple-ui/skeleton';
import { CardAnimations } from './card-animations';

@Component({
  selector: 'sim-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [CardAnimations.translateCard],
  host: {
    class: 'sim-card'
  }
})
export class SimCardComponent {
  /** 平面的 不需要投影 */
  @Input()
  @InputBoolean<SimCardComponent, 'flat'>()
  @HostBinding('class.sim-card-flat')
  flat: boolean = false;

  /** 鼠标移入投影会提高 不能和flat同时使用 */
  @Input()
  @InputBoolean<SimCardComponent, 'hoverable'>()
  @HostBinding('class.sim-card-hoverable')
  hoverable: boolean = false;

  /** 是否显示透露卡片 默认隐藏 */
  @HostBinding('class.sim-card-revealed')
  _revealed: boolean = false;

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  /** 切换显示透露卡片显示隐藏 */
  toggleRevealed() {
    this._revealed = !this._revealed;
    this._changeDetectorRef.markForCheck();
  }
}

@Component({
  selector: 'sim-card-content',
  templateUrl: './card-content.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sim-card-content'
  }
})
export class SimCardContentComponent implements OnInit {
  // 加载中
  @Input()
  @InputBoolean<SimCardContentComponent, 'loading'>()
  loading: boolean;
  // 加载占位骨架
  @Input() skeleton: SimSkeletonRow[];

  _data: SimSkeletonRow[];

  ngOnInit(): void {
    this._data = this.skeletonToData(this.skeleton);
    console.log(this._data);
  }

  private skeletonToData(skeleton: SimSkeletonRow[]): SimSkeletonRow[] {
    if (!isArray(skeleton) || !skeleton.length) {
      return [
        {
          cols: [
            {
              span: 4
            }
          ]
        },
        {
          cols: [{}]
        },
        {
          cols: [{}]
        },
        {
          cols: [{ span: 16 }]
        }
      ];
    }
    return this.skeleton;
  }
}

@Component({
  selector: 'sim-card-reveal',
  templateUrl: './card-reveal.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sim-card-reveal'
  }
})
export class SimCardRevealComponent {}

@Component({
  selector: 'sim-card-title-group',
  templateUrl: './card-title-group.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sim-card-title-group'
  }
})
export class SimCardTitleGroupComponent {}

@Component({
  selector: 'sim-card-header',
  templateUrl: './card-header.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sim-card-header'
  }
})
export class SimCardHeaderComponent {}

@Directive({
  selector: '[simCardTitle], [sim-card-title], sim-card-title',
  host: {
    class: 'sim-card-title'
  }
})
export class SimCardTitleDirective {}

@Directive({
  selector: '[simCardSubtitle], [sim-card-subtitle], sim-card-subtitle',
  host: {
    class: 'sim-card-subtitle'
  }
})
export class SimCardSubtitleDirective {}

@Directive({
  selector: '[simCardRevealButton], [sim-card-reveal-button], sim-card-reveal-button',
  host: {
    class: 'sim-card-reveal-button'
  }
})
export class SimCardRevealButtonDirective {
  constructor(protected _parentCard: SimCardComponent) {}

  @HostListener('click', ['$event'])
  toggle(event: Event) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    this._parentCard.toggleRevealed();
  }
}

@Directive({
  selector: '[simCardFooter], [sim-card-footer], sim-card-footer',
  host: {
    class: 'sim-card-footer'
  }
})
export class SimCardFooterDirective {}

@Directive({
  selector: '[simCardActions], [sim-card-actions], sim-card-actions',
  host: {
    class: 'sim-card-actions'
  }
})
export class SimCardActionsDirective {
  @Input() align: 'start' | 'end' = 'start';

  @HostBinding('class.sim-card-actions-align-end')
  get cardActionsAlign() {
    return this.align === 'end';
  }
}

@Directive({
  selector: '[simCardAvatar], [sim-card-avatar]',
  host: {
    class: 'sim-card-avatar'
  }
})
export class SimCardAvatarDirective {}

@Directive({
  selector: '[simCardExtra], [sim-card-extra], sim-card-extra',
  host: {
    class: 'sim-card-extra'
  }
})
export class SimCardExtraDirective {}

@Directive({
  selector: 'img[simCardImage], img[sim-card-image]',
  host: {
    class: 'sim-card-image'
  }
})
export class SimCardImageDirective {}
