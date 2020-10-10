# Select 选择器

下拉选择器。

## Dependencies

```ts
import { SimSelectModule } from '@ngx-simple/simple-ui/select';
```

## Usage

模块中导入：

```ts
...
import { SimSelectModule } from '@ngx-simple/simple-ui/select';
@NgModule({
    ...
    imports: [..., SimSelectModule],
    ...
})
export class DemoModule {}
```

模板中使用：

```html
<sim-select>
  <sim-option *ngFor="let item of ['北京', '上海', '深圳']" [value]="item">
    {{ item }}
  </sim-option>
</sim-select>
```

请参阅详细文档 [https://jiayisheji.github.io/simple-ui/components/select](https://jiayisheji.github.io/simple-ui/components/select)
