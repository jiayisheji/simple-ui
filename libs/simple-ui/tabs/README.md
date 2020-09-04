# Tabs 标签页

选项卡切换组件。

## Dependencies

```ts
import { SimButtonModule } from '@ngx-simple/simple-ui/button';
```

## Usage

模块中导入：

```ts
...
import { TabsModule } from '@ngx-simple/simple-ui/tabs';
@NgModule({
    ...
    imports: [..., TabsModule],
    ...
})
export class DemoModule {}
```

基本使用

```html
<sim-tabs>
  <sim-tab label="tab1">tab1</sim-tab>
  <sim-tab label="tab2">tab2</sim-tab>
  <sim-tab label="tab3">tab3</sim-tab>
</sim-tabs>
```

请参阅详细文档 [https://jiayisheji.github.io/simple-ui/components/tabs](https://jiayisheji.github.io/simple-ui/components/tabs)
