# Input 输入框

`simInput` 是一个指令，它能让原生的 `<input>` 和 `<textarea>` 元素与 `<sim-form-field>` 协同工作。

## Usage

模块中导入：

```ts
...
import { SimInputModule } from '@ngx-simple/simple-ui/input';
@NgModule({
    ...
    imports: [..., SimInputModule],
    ...
})
export class DemoModule {}
```

模板中使用：

```html
<input simInput />
```

请参阅详细文档 [https://jiayisheji.github.io/simple-ui/components/input](https://jiayisheji.github.io/simple-ui/components/input)
