# Sort 排序

用于为表格型数据添加排序状态并显示效果。

## Dependencies

```ts
import { SimSortModule } from '@ngx-simple/sort';
```

## Usage

模块中导入：

```ts
...
import { SimSortModule } from '@ngx-simple/sort';
@NgModule({
    ...
    imports: [..., SimSortModule],
    ...
})
export class DemoModule {}
```

模板中使用：

```html
<table>
  <thead simSort (simSortChange)="sortChange($event)">
    <tr>
      <th>id</th>
      <th>name</th>
      <th sim-sort-header="age">age</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>jiayi</td>
      <td>18</td>
    </tr>
    <tr>
      <td>2</td>
      <td>jack</td>
      <td>28</td>
    </tr>
  </tbody>
</table>
```

请参阅详细文档 [https://jiayisheji.github.io/simple-ui/components/sort](https://jiayisheji.github.io/simple-ui/components/sort)
