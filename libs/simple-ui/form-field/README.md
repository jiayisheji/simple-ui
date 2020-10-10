# FormField 表单字段

具有数据收集、校验和提交功能的表单，包含复选框、单选框、输入框、下拉选择框等元素。

## Usage

模块中导入：

```ts
...
import { FormFieldModule } from 'simple-ui/form-field';
@NgModule({
    ...
    imports: [..., FormFieldModule],
    ...
})
export class DemoModule {}
```

模板中使用：

```html
<form sim-form [formGroup]="validateForm" (ngSubmit)="onSubmit()">
  <sim-form-field>
    <sim-form-label>用户名</sim-form-label>
    <input simInput required formControlName="username" />
    <sim-error *simHasError="'minlength'">最小长度是5</sim-error>
    <sim-error *simHasError="'maxlength'">最大长度是20</sim-error>
    <sim-error *simHasError="'required'">用户名必填的</sim-error>
  </sim-form-field>
  <sim-form-field>
    <sim-form-label>密码</sim-form-label>
    <input type="password" simInput required formControlName="password" />
    <sim-error *simHasError="'minlength'">最小长度是6</sim-error>
    <sim-error *simHasError="'maxlength'">最大长度是18</sim-error>
    <sim-error *simHasError="'required'">密码必填的</sim-error>
  </sim-form-field>
  <sim-form-field>
    <sim-form-label>性别</sim-form-label>
    <sim-radio-group required formControlName="gender">
      <sim-radio value="0">男</sim-radio>
      <sim-radio value="1">女</sim-radio>
      <sim-radio value="2">未知</sim-radio>
    </sim-radio-group>
    <sim-error *simHasError="'required'">性别必填的</sim-error>
  </sim-form-field>
  <sim-form-field>
    <sim-form-label>爱好</sim-form-label>
    <sim-checkbox-group required formControlName="hobby">
      <sim-checkbox value="1">1</sim-checkbox>
      <sim-checkbox value="2">2</sim-checkbox>
      <sim-checkbox value="3">3</sim-checkbox>
      <sim-checkbox value="4">4</sim-checkbox>
      <sim-checkbox value="5">5</sim-checkbox>
    </sim-checkbox-group>
    <sim-error *simHasError="'required'">爱好必填的</sim-error>
    <sim-error *simHasError="'simCheckboxMaxLength'">爱好最多选3项</sim-error>
    <sim-error *simHasError="'simCheckboxMinLength'">爱好最少选2项</sim-error>
  </sim-form-field>
  <sim-form-field>
    <sim-form-label>城市</sim-form-label>
    <sim-select required formControlName="city">
      <sim-option *ngFor="let item of ['北京', '上海', '深圳']" [value]="item">
        {{ item }}
      </sim-option>
    </sim-select>
    <sim-error *simHasError="'required'">城市必填的</sim-error>
  </sim-form-field>
  <sim-form-field>
    <sim-checkbox required formControlName="agreement">同意注册协议</sim-checkbox>
    <sim-error *simHasError="'required'">协议必选的</sim-error>
  </sim-form-field>
  <sim-form-actions>
    <button type="submit" [loading]="submitted$ | async" sim-flat-button color="primary">注册</button>
  </sim-form-actions>
</form>
```

请参阅详细文档 [https://jiayisheji.github.io/simple-ui/components/form-field](https://jiayisheji.github.io/simple-ui/components/form-field)
