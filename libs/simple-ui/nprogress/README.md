# Nprogress 页面顶部加载进度条

页面顶部加载进度条

## Dependencies

```ts
import { SimNprogressModule } from '@ngx-simple/simple-ui/nprogress';
```

## Usage

模块中导入：

```ts
...
import { SimNprogressHttpModule, SimNprogressModule, SimNprogressRouterModule } from '@ngx-simple/simple-ui/nprogress';
@NgModule({
    ...
    imports: [...,
        SimNprogressModule,
        SimNprogressRouterModule,
        SimNprogressHttpModule
    ],
    ...
})
export class AppModule {}
```

app 根主组件模板中使用：

```html
<sim-nprogress></sim-nprogress>
```

请参阅详细文档 [https://jiayisheji.github.io/simple-ui/components/nprogress](https://jiayisheji.github.io/simple-ui/components/nprogress)
