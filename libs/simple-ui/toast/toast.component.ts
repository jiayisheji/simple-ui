import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, ViewEncapsulation } from '@angular/core';
import { simToastAnimations } from './toast-animations';
import { SimToastConfig, SIM_TOAST_DATA } from './toast-config';
import { SimToastRef } from './toast-ref';
import { ToastData } from './toast.typings';

export interface TextOnlyToast {
  data: ToastData;
  simToastRef: SimToastRef<TextOnlyToast>;
}

@Component({
  selector: 'sim-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [simToastAnimations.toastState]
})
export class SimToastComponent implements TextOnlyToast {
  icon: string;

  state: 'enter' | 'leave' = 'enter';

  data: ToastData;

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

  private _duration: number = 0;

  private _toastConfig: SimToastConfig<ToastData>;

  constructor(public simToastRef: SimToastRef<SimToastComponent>, @Inject(SIM_TOAST_DATA) data: ToastData, private cdr: ChangeDetectorRef) {
    this.icon = this._messageIcon[data.type];
    this.data = data;
    this._toastConfig = this.simToastRef.containerInstance.toastConfig;
    this.simToastRef.beforeDismissed().subscribe(() => {
      this.state = 'leave';
      this.cdr.detectChanges();
    });
  }

  onMouseEnter() {
    // 如果提供了延迟关闭，鼠标移入把延迟时间保持起来
    if (this._toastConfig.duration && this._toastConfig.duration > 0) {
      this._duration = this.simToastRef._dismissSuspend();
    }
  }

  onMouseLeave() {
    // 如果提供了延迟关闭，鼠标移出把延迟时间保持起来
    if (this._toastConfig.duration && this._toastConfig.duration > 0 && this._duration > 0) {
      this.simToastRef._dismissAfter(this._duration);
    }
  }
}
