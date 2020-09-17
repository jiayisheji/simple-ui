# PseudoCheck 伪检查

描述

## Getting Started

使用说明

## Dependencies

```ts
...
import { PseudoCheckModule } from 'simple-ui/pseudo-check';
@NgModule({
    ...
    imports: [..., PseudoCheckModule],
    ...
})
export class DemoModule {}
```

## API

### Directives

指令描述

- Selector：`[simPseudoCheck],[sim-pseudo-check]`
- Example：
  1. `<div simPseudoCheck></div>`
  2. `<div sim-pseudo-check></div>`
- ExportAs：`SimPseudoCheck`
- Styles:
  1. HostClass：`.sim-pseudo-check`

#### Inputs

| 名称     | 类型              | 说明     | 默认值    |
| :------- | :---------------- | :------- | :-------- |
| `[demo]` | `'start' | 'end'` | 示例描述 | `'start'` |

#### Outputs

| 名称     | 类型              | 说明     | 默认值    |
| :------- | :---------------- | :------- | :-------- |
| `(demo)` | `'start' | 'end'` | 示例描述 | `'start'` |

#### Properties

| 名称   | 类型              | 说明     | 默认值    |
| :----- | :---------------- | :------- | :-------- |
| `demo` | `'start' | 'end'` | 示例描述 | `'start'` |

#### Methods

| 名称   | 类型              | 说明     | 默认值    |
| :----- | :---------------- | :------- | :-------- |
| `demo` | `'start' | 'end'` | 示例描述 | `'start'` |

### Components

组件描述

- Selector：`sim-pseudo-check`
- Example：
  1. `<sim-pseudo-check></sim-pseudo-check>`
- ExportAs：`SimPseudoCheck`
- Styles:
  1. HostClass：`.sim-pseudo-check`

#### Inputs

| 名称      | 类型              | 说明     | 默认值    | 支持配置 |
| :-------- | :---------------- | :------- | :-------- | :------- |
| `[demo]`  | `'start' | 'end'` | 示例描述 | `'start'` | [x]      |
| `[demo2]` | `'start' | 'end'` | 示例描述 | `'start'` | []       |

#### Outputs

| 名称     | 类型              | 说明     | 默认值    |
| :------- | :---------------- | :------- | :-------- |
| `(demo)` | `'start' | 'end'` | 示例描述 | `'start'` |

#### Properties

| 名称   | 类型              | 说明     | 默认值    |
| :----- | :---------------- | :------- | :-------- |
| `demo` | `'start' | 'end'` | 示例描述 | `'start'` |

#### Methods

| 名称   | 类型              | 说明     | 默认值    |
| :----- | :---------------- | :------- | :-------- |
| `demo` | `'start' | 'end'` | 示例描述 | `'start'` |

### services

```ts
...
import { Component, OnInit } from '@angular/core';
import { PseudoCheckService } from 'simple-ui/pseudo-check';

@Component({
  selector: 'app-examples',
  templateUrl: './examples.component.html',
  styleUrls: ['./examples.component.scss'],
})
export class ExamplesComponent implements OnInit {
  constructor(private pseudoCheckService: PseudoCheckService) {}

  public ngOnInit() {}
}
```

#### Properties

| 名称   | 类型              | 说明     | 默认值    |
| :----- | :---------------- | :------- | :-------- |
| `demo` | `'start' | 'end'` | 示例描述 | `'start'` |

#### Methods

| 名称   | 参数              | 说明     | 默认值    |
| :----- | :---------------- | :------- | :-------- |
| `demo` | `'start' | 'end'` | 示例描述 | `'start'` |

#### Classes

| 名称   | 类型              | 说明     |
| :----- | :---------------- | :------- |
| `demo` | `'start' | 'end'` | 示例描述 |

#### Types

```ts
import { PseudoCheckService } from 'simple-ui/pseudo-check';
```

### Config

| 名称   | 类型              | 说明     | 默认值    |
| :----- | :---------------- | :------- | :-------- |
| `demo` | `'start' | 'end'` | 示例描述 | `'start'` |

## Usage

### Example1: 基本使用

```html
<sim-pseudo-check>sim-pseudo-check</sim-pseudo-check>
```

# Dropdown 下拉菜单

向下弹出的列表。

## Dependencies

```ts
import { SimPseudoCheckboxModule } from '@ngx-simple/simple-ui/pseudo-checkbox';
```

## Usage

模块中导入：

```ts
...
import { SimPseudoCheckboxModule } from '@ngx-simple/simple-ui/pseudo-checkbox';
@NgModule({
    ...
    imports: [..., SimPseudoCheckboxModule],
    ...
})
export class DemoModule {}
```

模板中使用：

```html
<div class="sim-primary">
  <sim-option>
    <sim-pseudo-checkbox state="unchecked"></sim-pseudo-checkbox>
    unchecked
  </sim-option>
  <sim-option>
    <sim-pseudo-checkbox state="checked"></sim-pseudo-checkbox>
    checked
  </sim-option>
  <sim-option>
    <sim-pseudo-checkbox state="indeterminate"></sim-pseudo-checkbox>
    indeterminate
  </sim-option>
  <sim-option>
    <sim-pseudo-checkbox state="unchecked" disabled></sim-pseudo-checkbox>
    unchecked
  </sim-option>
  <sim-option>
    <sim-pseudo-checkbox state="checked" disabled></sim-pseudo-checkbox>
    checked
  </sim-option>
  <sim-option>
    <sim-pseudo-checkbox state="indeterminate" disabled></sim-pseudo-checkbox>
    indeterminate
  </sim-option>
</div>
```

请参阅详细文档 [https://jiayisheji.github.io/simple-ui/components/pseudo-checkbox](https://jiayisheji.github.io/simple-ui/components/pseudo-checkbox)
