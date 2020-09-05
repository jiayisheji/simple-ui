# Tooltip 文字提示

提示框提供了一种文本标签，当用户的鼠标悬停或长按某个元素时，它就会显示出来。类似元素 title 属性效果。

## Dependencies

```ts
import { TooltipModule } from '@ngx-simple/simple-ui/tooltip';
```

## Usage

模块中导入：

```ts
...
import { TooltipModule } from '@ngx-simple/simple-ui/tooltip';
@NgModule({
    ...
    imports: [..., TooltipModule],
    ...
})
export class DemoModule {}
```

基本使用

```html
<button sim-tooltip="tooltip">sim-tooltip</button>
```

请参阅详细文档 [https://jiayisheji.github.io/simple-ui/components/tooltip](https://jiayisheji.github.io/simple-ui/components/tooltip)
