# Dialog 对话框

模态对话框。

## Dependencies

```ts
import { SimDialogModule } from '@ngx-simple/simple-ui/dialog';
```

## Usage

模块中导入：

```ts
...
import { SimDialogModule } from '@ngx-simple/simple-ui/dialog';
@NgModule({
    ...
    imports: [..., SimDialogModule],
    ...
})
export class DemoModule {}
```

模板中使用：

```html
<button (click)="openDialog()">Open dialog</button>
```

组件中使用：

```ts
import { DialogResolve, SimDialogRef, SimDialogService, SIM_DIALOG_DATA, toDialogResult } from '@ngx-simple/simple-ui/dialog';

@Component({
  selector: 'doc-dialog',
  template: `
    <sim-dialog-header>
      <sim-dialog-title>title</sim-dialog-title>
    </sim-dialog-header>
    <sim-dialog-content>
      content
    </sim-dialog-content>
    <sim-dialog-actions>
      <button sim-button simDialogClose>取消</button>
      <button sim-flat-button (click)="onClose()" color="primary">确认</button>
    </sim-dialog-actions>
  `,
  styles: [``]
})
export class DialogComponent implements OnInit {
  constructor(private dialogRef: SimDialogRef<DialogComponent>, @Inject(SIM_DIALOG_DATA) public data: DialogResolve<any>) {}

  ngOnInit(): void {}

  onClose() {
    this.dialogRef.close({});
  }
}

@Component({})
export class DemoComponent implements OnInit {
  constructor(private dialog: SimDialogService) {}

  openDialog() {
    this.dialog.open(DialogComponent, {}).afterClosed().pipe(toDialogResult()).subscribe(console.log);
  }
}
```

请参阅详细文档 [https://jiayisheji.github.io/simple-ui/components/dialog](https://jiayisheji.github.io/simple-ui/components/dialog)
