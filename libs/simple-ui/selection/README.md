# Selection 中文

描述。

## Dependencies

```ts
import { SimSelectionModule } from '@ngx-simple/simple-ui/selection';
```

## Usage

模块中导入：

```ts
...
import { SimSelectionModule } from '@ngx-simple/simple-ui/selection';
@NgModule({
    ...
    imports: [..., SimSelectionModule],
    ...
})
export class DemoModule {}
```

模板中使用：

```html
<ul simSelection [dataSource]="data" [simSelectionMultiple]="true" (simSelectionChange)="selected1 = getCurrentSelected($event)">
  <input
    type="checkbox"
    simSelectionAll
    #allToggler="simSelectionAll"
    [checked]="allToggler.checked | async"
    [indeterminate]="allToggler.indeterminate | async"
    (click)="allToggler.toggle($event)"
  />
  <li *ngFor="let item of data">
    <input
      type="checkbox"
      simSelectionToggle
      #toggler="simSelectionToggle"
      [simSelectionToggleValue]="item"
      [checked]="toggler.checked | async"
      (click)="toggler.toggle()"
    />
    {{item}}
  </li>
</ul>
```

请参阅详细文档 [https://jiayisheji.github.io/simple-ui/components/selection](https://jiayisheji.github.io/simple-ui/components/selection)
