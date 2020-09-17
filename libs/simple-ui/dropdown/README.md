# Dropdown 下拉菜单

向下弹出的列表。

## Dependencies

```ts
import { SimDropdownModule } from '@ngx-simple/simple-ui/dropdown';
```

## Usage

模块中导入：

```ts
...
import { SimDropdownModule } from '@ngx-simple/simple-ui/dropdown';
@NgModule({
    ...
    imports: [..., SimDropdownModule],
    ...
})
export class DemoModule {}
```

模板中使用：

```html
  <button sim-button [simDropdown]="dropdown">更多地区</button>
  <sim-dropdown #dropdown>
    <sim-dropdown-actions selectable (selectionChange)="selectionChange($event)">
      <sim-option *ngFor="let item of ['北京', '上海', '深圳']" [value]="item">
        {{ item }}
      </sim-option>
      <sim-divider></sim-divider>
      <sim-option *ngFor="let item of ['武汉', '南京', '重庆']" [value]="item">
        {{ item }}
      </sim-option>
    </sim-dropdown-actions>
  </sim-dropdown>
</div>
```

请参阅详细文档 [https://jiayisheji.github.io/simple-ui/components/dropdown](https://jiayisheji.github.io/simple-ui/components/dropdown)
