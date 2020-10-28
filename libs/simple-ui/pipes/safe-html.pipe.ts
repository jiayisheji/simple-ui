import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * 安全的html
 *
 * @example
 * {{ '<div>div</div>' | safeHtml }}
 * // <div>div</div>
 */
@Pipe({
  name: 'safeHtml'
})
export class SimSafeHtmlPipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) {}
  transform(value: null | undefined): null;
  transform(value: string): SafeHtml {
    // 处理异常情况
    if (value == null || value === '' || value !== value) {
      return null;
    }
    return this.sanitized.bypassSecurityTrustHtml(value);
  }
}
