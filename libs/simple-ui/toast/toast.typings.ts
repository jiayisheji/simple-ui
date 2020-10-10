import { NgStringOrTemplateRef } from '@ngx-simple/core/types';

export type ToastType = 'info' | 'warning' | 'success' | 'danger' | 'blank';

export interface ToastData {
  content: NgStringOrTemplateRef;
  type: ToastType;
}
