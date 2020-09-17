# Option 选择选项

提供列表选项功能，一般用于其他组件子级，例如：`sim-select`

## Dependencies

```ts
import { SimOptionModule } from '@ngx-simple/simple-ui/option';
```

## Usage

模块中导入：

```ts
...
import { SimOptionModule } from '@ngx-simple/simple-ui/option';
@NgModule({
    ...
    imports: [...,
      SimOptionModule
    ],
    ...
})
export class AppModule {}
```

app 根主组件模板中使用：

```html
<sim-optgroup>
  <sim-optgroup-label>optgroup</sim-optgroup-label>
  <sim-option value="value">option</sim-option>
</sim-optgroup>
```

请参阅详细文档 [https://jiayisheji.github.io/simple-ui/components/option](https://jiayisheji.github.io/simple-ui/components/option)
