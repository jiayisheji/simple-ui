# Radio 单选按钮

模拟原生`<input type="radio">`单选框。

## Dependencies

```ts
import { SimRadioModule } from '@ngx-simple/simple-ui/radio';
```

## Usage

模块中导入：

```ts
...
import { SimRadioModule } from '@ngx-simple/simple-ui/radio';
@NgModule({
    ...
    imports: [..., SimRadioModule],
    ...
})
export class DemoModule {}
```

模板中使用：

```html
<sim-radio-group>
  <sim-radio value="left">
    format_align_left
  </sim-radio>
  <sim-radio value="center">
    format_align_center
  </sim-radio>
  <sim-radio value="right">
    format_align_right
  </sim-radio>
  <sim-radio value="justify" disabled>
    format_align_justify
  </sim-radio>
</sim-radio-group>
```

请参阅详细文档 [https://jiayisheji.github.io/simple-ui/components/radio](https://jiayisheji.github.io/simple-ui/components/radio)
