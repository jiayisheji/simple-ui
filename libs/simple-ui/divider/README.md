# Divider 分割线

区隔内容的分割线。

## Getting Started

- 对不同章节的文本段落进行分割。
- 对行内文字/链接进行分割，例如表格的操作列。

## Dependencies

```ts
import { SimDividerModule } from '@ngx-simple/simple-ui/divider';
```

## Usage

模块中导入：

```ts
...
import { SimDividerModule } from '@ngx-simple/simple-ui/divider';
@NgModule({
    ...
    imports: [..., SimDividerModule],
    ...
})
export class DemoModule {}
```

模板中使用：

```html
text
<sim-divider></sim-divider>
text
<sim-divider></sim-divider>
text
```
