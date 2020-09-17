import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { simDropdownAnimations } from './dropdown-animations';
import { DropdownVisibility } from './dropdown.typings';

@Component({
  selector: 'sim-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [simDropdownAnimations.dropdownState],
  exportAs: 'simDropdownMenu'
})
export class SimDropdownComponent implements AfterContentInit {
  overlayClass: string | string[] | Set<string> | { [key: string]: boolean };
  overlayVisible$ = new BehaviorSubject<boolean>(false);
  dismissOverlay$ = new BehaviorSubject<boolean>(false);
  _visibility: DropdownVisibility = 'bottom';

  @ViewChild(TemplateRef)
  templateRef: TemplateRef<string>;

  constructor(private _elementRef: ElementRef, private _changeDetectorRef: ChangeDetectorRef, private renderer: Renderer2) {}

  ngAfterContentInit(): void {
    const nativeElement = this._elementRef.nativeElement;
    this.renderer.removeChild(this.renderer.parentNode(nativeElement), nativeElement);
  }

  setInput<V extends keyof SimDropdownComponent>(key: V, value: this[V]): void {
    this[key] = value;
  }

  onVisible(visible: boolean) {
    this.overlayVisible$.next(visible);
  }

  /**
   * 在面板里面实现关闭效果
   */
  dismiss() {
    this.dismissOverlay$.next(false);
  }

  /**
   * 标记在下一次变更检测运行中需要检查
   * 解决使用OnPush更改检测的组件中可能存在问题
   */
  _markForCheck(): void {
    this._changeDetectorRef.markForCheck();
  }
}
