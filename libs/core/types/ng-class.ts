import { TemplateRef } from '@angular/core';

/** angular ngClass 绑定类型 */
export type NgClassInterface =
  | string
  | string[]
  | Set<string>
  | {
      [className: string]: boolean;
    };

/** angular ngStyle 绑定类型 */
export interface NgStyleInterface {
  [attr: string]: string | number;
}

/** string和TemplateRef<void>的连接类型。 */
export type NgStringOrTemplateRef = string | TemplateRef<void>;
