# Timepicker 时间选择器

输入或选择时间的控件。

## Dependencies

```ts
import { SimTimepickerModule } from '@ngx-simple/simple-ui/timepicker';
```

## Usage

模块中导入：

```ts
...
import { SimTimepickerModule } from '@ngx-simple/simple-ui/timepicker';
@NgModule({
    ...
    imports: [..., SimTimepickerModule],
    ...
})
export class DemoModule {}
```

模板中使用：

```html
<input [simTimepicker]="picker" />
<sim-timepicker #picker></sim-timepicker>
```

请参阅详细文档 [https://jiayisheji.github.io/simple-ui/components/timepicker](https://jiayisheji.github.io/simple-ui/components/timepicker)
