# Toast 全局提示

全局展示操作反馈信息。

## Dependencies

```ts
import { SimToastModule } from '@ngx-simple/simple-ui/toast';
```

## Usage

模块中导入：

```ts
...
import { SimToastModule } from '@ngx-simple/simple-ui/toast';
@NgModule({
    ...
    imports: [..., SimToastModule],
    ...
})
export class DemoModule {}
```

模板中使用：

```html
<button (click)="openToast()">Open toast</button>
```

组件中使用：

```ts
import { SimToastService } from '@ngx-simple/simple-ui/toast';

@Component({})
export class DemoComponent implements OnInit {
  constructor(private toast: SimToastService) {}

  openToast() {
    this.toast.open('This is a normal message');
  }
}
```

请参阅详细文档 [https://jiayisheji.github.io/simple-ui/components/toast](https://jiayisheji.github.io/simple-ui/components/toast)
