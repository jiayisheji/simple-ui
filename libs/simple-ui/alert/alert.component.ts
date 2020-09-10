import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  Directive,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  Inject,
  InjectionToken,
  Input,
  OnInit,
  Optional,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { InputBoolean, InputNumber } from '@ngx-simple/core/decorators';
import { slideAlertMotion } from './alert-animations';

/**
 * alert 支持类型
 * - success 成功消息
 * - info 信息消息
 * - warning 警告消息
 * - danger 错误/失败消息
 */
export type AlertType = 'success' | 'info' | 'warning' | 'danger';
/**
 * alert 支持模式
 * - message 消息模式
 * - notification 通知模式
 * - banner 顶栏模式
 */
/** 用于配置sim-alert默认 */
export interface SimAlertDefaultOptions {
  messageIcon?: {
    danger: string;
    info: string;
    success: string;
    warning: string;
  };
  notificationIcon?: {
    danger: string;
    info: string;
    success: string;
    warning: string;
  };
  showIcon?: boolean;
  type?: AlertType;
}

export const SIM_ALERT_CONFIG = new InjectionToken<SimAlertDefaultOptions>('SIM_ALERT_CONFIG');

@Component({
  selector: 'sim-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [slideAlertMotion],
  host: {
    role: 'alert'
  }
})
export class SimAlertComponent implements OnInit, AfterContentInit {
  @Input()
  closeText: string;

  @Input()
  type: AlertType = 'info';

  /** 是否有关闭按钮出现，可以绑定(closed)事件 */
  @Input()
  @InputBoolean<SimAlertComponent, 'dismissible'>()
  dismissible: boolean;

  /** 是否显示icon 并自定义icon 默认使用配置icon */
  @Input()
  @InputBoolean<SimAlertComponent, 'showIcon'>()
  showIcon: boolean = true;

  /** 自定义icon图标 配合<sim icon svgIcon="icon"></sim>使用 */
  @Input() icon: string;

  /** 持续时间(毫秒)，当设置为 0 时不消失 */
  @Input()
  @InputNumber<SimAlertComponent, 'duration'>()
  duration: number = null;

  /** 是否顶栏模式 */
  @Input()
  @InputBoolean<SimAlertComponent, 'banner'>()
  banner: boolean;

  /** 是否通知模式 */
  @Input()
  @InputBoolean<SimAlertComponent, 'notification'>()
  notification: boolean;

  /** alert被关闭时发出事件 */
  @Output() closed: EventEmitter<void> = new EventEmitter();

  /** 获取sim-alert-icon */
  @ContentChild(forwardRef(() => SimAlertIconDirective))
  _icon: SimAlertIconDirective;

  /** 获取sim-alert-actions */
  @ContentChild(forwardRef(() => SimAlertActionsDirective))
  _actions: SimAlertActionsDirective;

  /** 获取sim-alert-heading */
  @ContentChild(forwardRef(() => SimAlertHeadingDirective))
  _heading: SimAlertHeadingDirective;

  /** 获取sim-alert-icon */
  @ContentChild(forwardRef(() => SimAlertCloseDirective))
  _close: SimAlertCloseDirective;

  /** 是否初始可见 */
  _visible: boolean = true;

  _inferredIconType: {
    danger: string;
    info: string;
    success: string;
    warning: string;
  };

  private _messageIcon: {
    danger: string;
    info: string;
    success: string;
    warning: string;
  } = {
    danger: 'close-circle-full',
    info: 'check-circle-full',
    success: 'info-circle-full',
    warning: 'exclamation-circle-full'
  };

  private _notificationIcon: {
    danger: string;
    info: string;
    success: string;
    warning: string;
  } = {
    danger: 'close-circle',
    info: 'check-circle',
    success: 'info-circle',
    warning: 'exclamation-circle'
  };

  constructor(private changeDetection: ChangeDetectorRef, @Optional() @Inject(SIM_ALERT_CONFIG) defaultOptions?: SimAlertDefaultOptions) {
    if (defaultOptions) {
      this.showIcon = defaultOptions.showIcon;
      this._messageIcon = defaultOptions.messageIcon;
      this._notificationIcon = defaultOptions.notificationIcon;
      this.type = defaultOptions.type;
    }
  }

  ngOnInit(): void {
    // 如果持续时间大于0进行延迟操作
    if (this.duration) {
      const timer = setTimeout(() => {
        this.onClose();
        clearTimeout(timer);
      }, this.duration);
    }
    this._inferredIconType = this._messageIcon;
  }

  ngAfterContentInit(): void {
    if (this.showIcon && this._heading) {
      this._inferredIconType = this._notificationIcon;
    }
  }

  onClose() {
    if (!this._visible) {
      return;
    }
    this._visible = false;
    this.changeDetection.markForCheck();
  }

  onFadeAnimationDone() {
    if (this.dismissible) {
      this.closed.emit();
    }
  }
}

@Directive({
  selector: '[sim-alert-icon], sim-alert-icon',
  host: {
    class: 'sim-alert-icon'
  }
})
export class SimAlertIconDirective {}

@Directive({
  selector: '[sim-alert-heading], sim-alert-heading',
  host: {
    class: 'sim-alert-heading'
  }
})
export class SimAlertHeadingDirective {}

@Directive({
  selector: '[sim-alert-actions], sim-alert-actions',
  host: {
    class: 'sim-alert-actions sim-alert-actions-extend'
  }
})
export class SimAlertActionsDirective {}

@Directive({
  selector: '[sim-alert-close], sim-alert-close',
  host: {
    class: 'sim-alert-close',
    '[attr.aria-label]': 'Close'
  }
})
export class SimAlertCloseDirective {
  constructor(protected _parent: SimAlertComponent, elementRef?: ElementRef<HTMLElement>) {
    if (elementRef && elementRef.nativeElement.nodeName === 'BUTTON') {
      elementRef.nativeElement.setAttribute('type', 'button');
    }
  }

  @HostListener('click', ['$event'])
  _handleClick(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    const parent = this._parent;
    if (parent.dismissible) {
      parent.onClose();
    }
  }
}
