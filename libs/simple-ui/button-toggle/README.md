# ButtonToggle 切换按钮

从一小部分选项列表中选择一个选项或者一小部分时使用，类似于“Radio”和“Checkbox”组件。

## Dependencies

```ts
import { SimButtonToggleModule } from '@ngx-simple/simple-ui/button-toggle';
```

## Usage

模块中导入：

```ts
...
import { SimButtonToggleModule } from '@ngx-simple/simple-ui/button-toggle';
@NgModule({
    ...
    imports: [..., SimButtonToggleModule],
    ...
})
export class DemoModule {}
```

模板中使用：

```html
<sim-button-toggle-group>
  <sim-button-toggle value="left">
    format_align_left
  </sim-button-toggle>
  <sim-button-toggle value="center">
    format_align_center
  </sim-button-toggle>
  <sim-button-toggle value="right">
    format_align_right
  </sim-button-toggle>
  <sim-button-toggle value="justify" disabled>
    format_align_justify
  </sim-button-toggle>
</sim-button-toggle-group>
```

请参阅详细文档 [https://jiayisheji.github.io/simple-ui/components/button-toggle](https://jiayisheji.github.io/simple-ui/components/button-toggle)
