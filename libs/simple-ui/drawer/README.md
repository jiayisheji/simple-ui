# Drawer 抽屉

抽屉从父窗体边缘滑入，覆盖住部分父窗体内容。用户在抽屉内操作时不必离开当前任务，操作完成后，可以平滑地回到到原任务。

## Dependencies

```ts
import { SimDrawerModule } from '@ngx-simple/simple-ui/drawer';
```

## Usage

模块中导入：

```ts
...
import { SimDrawerModule } from '@ngx-simple/simple-ui/drawer';
@NgModule({
    ...
    imports: [..., SimDrawerModule],
    ...
})
export class DemoModule {}
```

模板中使用：

```html
<sim-drawer-container class="example-container" hasBackdrop>
  <sim-drawer #drawer>
    <div class="example-drawer">
      <button (click)="drawer.close()">close drawer</button>
    </div>
  </sim-drawer>
  <sim-drawer-content>
    <p>overview works!</p>
  </sim-drawer-content>
</sim-drawer-container>
```

请参阅详细文档 [https://jiayisheji.github.io/simple-ui/components/drawer](https://jiayisheji.github.io/simple-ui/components/drawer)
