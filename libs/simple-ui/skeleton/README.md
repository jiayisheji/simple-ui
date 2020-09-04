# Skeleton 骨架屏

在需要等待加载内容的位置提供一个占位图形组合。

## Dependencies

```ts
import { SimSkeletonModule } from '@ngx-simple/simple-ui/skeleton';
```

## Usage

模块中导入：

```ts
...
import { SimSkeletonModule } from '@ngx-simple/simple-ui/skeleton';
@NgModule({
    ...
    imports: [..., SimSkeletonModule],
    ...
})
export class DemoModule {}
```

模板中使用：

```html
<sim-skeleton>sim-skeleton</sim-skeleton>
```

请参阅详细文档 [https://jiayisheji.github.io/simple-ui/components/skeleton](https://jiayisheji.github.io/simple-ui/components/skeleton)
