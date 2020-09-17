# Expansion 折叠面板

可以折叠/展开的内容区域。

## Dependencies

```ts
import { SimExpansionModule } from '@ngx-simple/simple-ui/expansion';
```

## Usage

模块中导入：

```ts
...
import { SimExpansionModule } from '@ngx-simple/simple-ui/expansion';
@NgModule({
    ...
    imports: [..., SimExpansionModule],
    ...
})
export class DemoModule {}
```

模板中使用：

```html
<sim-expansion>
  <sim-expansion-panel [expanded]="expanded === 0">
    <sim-expansion-panel-header>
      <sim-panel-title>我是标题1</sim-panel-title>
      <sim-panel-description>我是描述</sim-panel-description>
    </sim-expansion-panel-header>
    <p>This is the primary content of the panel.</p>
  </sim-expansion-panel>
  <sim-expansion-panel [expanded]="expanded === 1">
    <sim-expansion-panel-header>
      <sim-panel-title>我是标题2</sim-panel-title>
      <sim-panel-description>我是描述</sim-panel-description>
    </sim-expansion-panel-header>
    <p>This is the primary content of the panel.</p>
  </sim-expansion-panel>
  <sim-expansion-panel [expanded]="expanded === 2">
    <sim-expansion-panel-header>
      <sim-panel-title>我是标题3</sim-panel-title>
      <sim-panel-description>我是描述</sim-panel-description>
    </sim-expansion-panel-header>
    <p>This is the primary content of the panel.</p>
  </sim-expansion-panel>
</sim-expansion>
```

请参阅详细文档 [https://jiayisheji.github.io/simple-ui/components/expansion](https://jiayisheji.github.io/simple-ui/components/expansion)
