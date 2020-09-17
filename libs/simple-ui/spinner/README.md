# Spinner 加载中

用于页面和区块的加载中状态。

## Dependencies

```ts
import { SimSpinnerModule } from '@ngx-simple/simple-ui/spinner';
```

## Usage

模块中导入：

```ts
...
import { SimSpinnerModule } from '@ngx-simple/simple-ui/spinner';
@NgModule({
    ...
    imports: [..., SimSpinnerModule],
    ...
})
export class DemoModule {}
```

模板中使用：

```html
<sim-spinner [loading]="true">sim-spinner</sim-spinner>
```

请参阅详细文档 [https://jiayisheji.github.io/simple-ui/components/spinner](https://jiayisheji.github.io/simple-ui/components/spinner)
