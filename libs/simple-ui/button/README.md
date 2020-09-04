# Button 按钮

标记了一个（或封装一组）操作命令，响应用户点击行为，触发相应的业务逻辑。

## Dependencies

```ts
import { SimButtonModule } from '@ngx-simple/simple-ui/simple-ui/button';
```

## Usage

模块中导入：

```ts
...
import { SimButtonModule } from 'simple-ui/button';
@NgModule({
    ...
    imports: [..., SimButtonModule],
    ...
})
export class DemoModule {}
```

模板中使用：

```html
<button sim-button>sim-button</button>
```

请参阅详细文档 [https://jiayisheji.github.io/simple-ui/components/button](https://jiayisheji.github.io/simple-ui/components/button)
