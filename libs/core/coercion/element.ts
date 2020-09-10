import { ElementRef } from '@angular/core';

/**
 * 将`ElementRef`或`Element`强制转换为`Element`.
 * 对于可以接受ref或原生`Element`本身的API很有用。
 */
export function toElement<T>(elementOrRef: ElementRef<T> | T): T {
  return elementOrRef instanceof ElementRef ? elementOrRef.nativeElement : elementOrRef;
}
