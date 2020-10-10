# Paginator 分页器

为分页信息提供导航功能，通常和表格一起用。

## Dependencies

```ts
import { SimPaginatorModule } from '@ngx-simple/simple-ui/paginator';
```

## Usage

模块中导入：

```ts
...
import { SimPaginatorModule } from '@ngx-simple/simple-ui/paginator';
@NgModule({
    ...
    imports: [..., SimPaginatorModule],
    ...
})
export class DemoModule {}
```

模板中使用：

```html
<sim-paginator [pageIndex]="1" [pageTotal]="500"></sim-paginator>
```

请参阅详细文档 [https://jiayisheji.github.io/simple-ui/components/paginator](https://jiayisheji.github.io/simple-ui/components/paginator)
