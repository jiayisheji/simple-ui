import { Directive, ElementRef, Host, HostListener, Input } from '@angular/core';
import { SimTimeViewComponent } from './time-view.component';

export type TimeItemView = 'hours' | 'minutes' | 'seconds' | 'ampm';

@Directive({
  selector: '[simTimeList]',
  exportAs: 'simTimeList',
  host: {
    class: 'sim-time-view-column',
    '[class.sim-time-view-column-active]': 'isActive',
    '[attr.tabIndex]': '0'
  }
})
export class SimTimeListDirective<D> {
  @Input() simTimeList: TimeItemView;

  isActive: boolean;

  constructor(@Host() public timeView: SimTimeViewComponent<D>, private elementRef: ElementRef) {}

  @HostListener('focus')
  _onFocus() {
    this.isActive = true;
  }

  @HostListener('blur')
  _onBlur() {
    this.isActive = false;
  }

  @HostListener('keydown.arrowdown', ['$event'])
  onKeydownArrowDown(event: KeyboardEvent) {
    event.preventDefault();

    this.nextItem();
  }

  @HostListener('keydown.arrowup', ['$event'])
  onKeydownArrowUp(event: KeyboardEvent) {
    event.preventDefault();

    this.prevItem();
  }

  @HostListener('keydown.arrowright', ['$event'])
  onKeydownArrowRight(event: KeyboardEvent) {
    event.preventDefault();

    const listName = (event.target as HTMLElement).className;

    // if (listName.indexOf('hourList') !== -1) {
    //   this.timeView.minuteList.nativeElement.focus();
    // } else if (listName.indexOf('minuteList') !== -1 && this.timeView._secondItems.length !== 0) {
    //   this.timeView.secondList.nativeElement.focus();
    // }
  }

  @HostListener('keydown.arrowleft', ['$event'])
  onKeydownArrowLeft(event: KeyboardEvent) {
    event.preventDefault();

    const listName = (event.target as HTMLElement).className;

    // if (listName.indexOf('minuteList') !== -1) {
    //   this.timeView.hourList.nativeElement.focus();
    // } else if (listName.indexOf('secondList') !== -1) {
    //   this.timeView.minuteList.nativeElement.focus();
    // } else if (listName.indexOf('ampmList') !== -1) {
    //   this.timeView.ampmList.nativeElement.focus();
    // }
  }

  @HostListener('keydown.enter', ['$event'])
  onKeydownEnter(event: KeyboardEvent) {
    event.preventDefault();

    // this.timeView.okButtonClick();
  }

  @HostListener('keydown.escape', ['$event'])
  onKeydownEscape(event: KeyboardEvent) {
    event.preventDefault();
    // this.timeView.cancelButtonClick();
  }

  @HostListener('mouseover')
  onHover() {
    this.elementRef.nativeElement.focus();
  }

  @HostListener('wheel', ['$event'])
  onScroll(event: WheelEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (event.deltaY > 0) {
      this.nextItem();
    } else if (event.deltaY < 0) {
      this.prevItem();
    }
  }

  private nextItem(): void {
    this.timeView.nextItem(this.simTimeList);
  }

  private prevItem(): void {
    this.timeView.prevItem(this.simTimeList);
  }
}
