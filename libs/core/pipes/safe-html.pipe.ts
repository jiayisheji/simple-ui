import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
@Pipe({
  name: 'safeHtml'
})
export class SimSafeHtmlPipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) {}
  transform(value: string): SafeHtml {
    // 处理异常情况
    if (value == null || value === '') {
      return null;
    }
    return this.sanitized.bypassSecurityTrustHtml(value);
  }
}
