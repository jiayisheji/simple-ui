# Outlet 模板插槽

增强 `NgTemplateOutlet` 功能

## Dependencies

```ts
import { SimOutletModule } from '@ngx-simple/simple-ui/outlet';
```

## Usage

模块中导入：

```ts
...
import { SimOutletModule } from '@ngx-simple/simple-ui/outlet';
@NgModule({
    ...
    imports: [
      ...,
      SimOutletModule
    ],
    ...
})
export class DemoModule {}
```

app 根主组件模板中使用：

```html
<ng-container *simTemplateOutlet="template">template</ng-container>
<ng-template #template><span>Hello</span></ng-template>
```

请参阅详细文档 [https://jiayisheji.github.io/simple-ui/components/outlet](https://jiayisheji.github.io/simple-ui/components/outlet)
