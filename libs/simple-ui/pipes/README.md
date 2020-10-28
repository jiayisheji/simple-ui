# Pipes 管道集合

常用管道集合

## Dependencies

```ts
import { SimPipesModule } from '@ngx-simple/simple-ui/pipes';
```

## Usage

模块中导入：

```ts
...
import { SimPipesModule } from '@ngx-simple/simple-ui/pipes';
@NgModule({
    ...
    imports: [
      ...,
      SimPipesModule
    ],
    ...
})
export class DemoModule {}
```

app 根主组件模板中使用：

```html
{{ name | fallback }}
```

请参阅详细文档 [https://jiayisheji.github.io/simple-ui/components/pipes](https://jiayisheji.github.io/simple-ui/components/pipes)
