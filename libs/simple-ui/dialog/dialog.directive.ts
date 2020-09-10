import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Optional,
  Renderer2,
  SimpleChanges
} from '@angular/core';
import { InputBoolean } from '@ngx-simple/core/decorators';
import { SafeAny } from '@ngx-simple/core/types';
import { SimDialogRef, _closeDialogVia } from './dialog-ref';
import { SimDialogService } from './dialog.service';

@Directive({
  selector: '[simDialogClose], [sim-dialog-close]',
  exportAs: 'simDialog',
  host: {
    class: 'sim-dialog-close'
  }
})
export class SimDialogCloseDirective implements OnInit, OnChanges {
  /** 默认为`button`，以防止意外提交表单 */
  @Input()
  @HostBinding('attr.type')
  type: 'submit' | 'button' | 'reset' = 'button';

  /** 对话框关闭输入 */
  @Input('sim-dialog-close') dialogResult: SafeAny;

  @Input() simDialogClose: SafeAny;

  constructor(
    @Optional() public dialogRef: SimDialogRef<any>,
    private _elementRef: ElementRef<HTMLElement>,
    private _dialog: SimDialogService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    const proxyChange = changes['simDialogClose'] || changes['dialogResult'];

    if (proxyChange) {
      this.dialogResult = proxyChange.currentValue;
    }
  }

  ngOnInit() {
    if (!this.dialogRef) {
      this.dialogRef = getClosestDialog(this._elementRef, this._dialog.openDialogs);
    }
  }

  @HostListener('click', ['$event'])
  closeDialog(event: MouseEvent) {
    if (event) {
      event.stopPropagation();
    }
    const interactionType = event.screenX === 0 && event.screenY === 0 ? 'keyboard' : 'mouse';

    _closeDialogVia(this.dialogRef, interactionType, this.dialogResult || undefined);
  }
}

/**
 * 对话框中头部操作标题的容器。滚动时固定在头部
 */
@Directive({
  selector: '[simDialogHeader], [sim-dialog-header], sim-dialog-header',
  host: { class: 'sim-dialog-header' }
})
export class SimDialogHeaderDirective {}

/**
 * 对话框中头部操作标题的容器。滚动时固定在头部
 */
@Directive({
  selector: '[simDialogTitle], [sim-dialog-title], sim-dialog-title',
  host: { class: 'sim-dialog-title' }
})
export class SimDialogTitleDirective {}

/**
 * 对话框的可滚动内容容器
 */
@Directive({
  selector: '[simDialogContent], [sim-dialog-content], sim-dialog-content',
  host: { class: 'sim-dialog-content' }
})
export class SimDialogContentDirective implements OnInit {
  @Input()
  @InputBoolean<SimDialogContentDirective, 'fixed'>()
  @HostBinding('class.sim-dialog-content-fixed')
  fixed: boolean;

  constructor(
    @Optional() private _dialogRef: SimDialogRef<SafeAny>,
    private _elementRef: ElementRef,
    private _dialog: SimDialogService,
    renderer: Renderer2
  ) {
    renderer.addClass(_elementRef.nativeElement, 'sim-dialog-content');
  }

  ngOnInit() {
    if (!this._dialogRef) {
      this._dialogRef = getClosestDialog(this._elementRef, this._dialog.openDialogs);
    }
    this.fixed = !(this._dialogRef._containerInstance.config.contentFixed || false);
  }
}

/**
 * 对话框中底部操作按钮的容器。 滚动时固定在底部。
 */
@Directive({
  selector: '[simDialogActions], [sim-dialog-actions], sim-dialog-actions',
  host: { class: 'sim-dialog-actions' }
})
export class SimDialogActionsDirective implements OnInit {
  @Input()
  @HostBinding('attr.align')
  align: 'start' | 'center' | 'end' = 'start';

  constructor(
    @Optional() private _dialogRef: SimDialogRef<SafeAny>,
    private _elementRef: ElementRef,
    private _dialog: SimDialogService,
    renderer: Renderer2
  ) {}

  ngOnInit() {
    if (!this._dialogRef) {
      this._dialogRef = getClosestDialog(this._elementRef, this._dialog.openDialogs);
    }
    this.align = this._dialogRef._containerInstance.config.actionsAlign || 'start';
  }
}

/**
 * 通过查看DOM来查找元素的最近SimDialogRef。
 * @param element 相对于查找对话框的元素。
 * @param openDialogs 参考当前打开的对话框。
 */
function getClosestDialog(element: ElementRef, openDialogs: Array<SimDialogRef<SafeAny>>) {
  let parent: HTMLElement | null = element.nativeElement.parentElement;

  while (parent && !parent.classList.contains('sim-dialog-container')) {
    parent = parent.parentElement;
  }

  return parent ? openDialogs.find(dialog => dialog.id === (parent && parent.id)) : null;
}
