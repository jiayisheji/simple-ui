# Card 卡片

一个通用内容容器，可以包含文本、图片，并可在其上下文中表现得像一个单一主体。

## Dependencies

```ts
import { SimCardModule } from '@ngx-simple/simple-ui/card';
```

## Usage

模块中导入：

```ts
...
import { SimCardModule } from '@ngx-simple/simple-ui/card';
@NgModule({
    ...
    imports: [..., SimCardModule],
    ...
})
export class DemoModule {}
```

模板中使用：

```html
<sim-card>sim-card</sim-card>
```

请参阅详细文档 [https://jiayisheji.github.io/simple-ui/components/card](https://jiayisheji.github.io/simple-ui/components/card)
