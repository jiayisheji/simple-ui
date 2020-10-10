export interface ComponentLink {
  path?: string;
  name: string;
  link?: string;
  children?: ComponentLink[];
}

export const PLAYGROUND_COMPONENTS: ComponentLink[] = [
  {
    path: '',
    name: '通用',
    children: [
      {
        path: 'button',
        name: '按钮'
      },
      {
        path: 'button-group',
        name: '按钮组'
      },
      {
        path: 'divider',
        name: '分割线'
      }
      // {
      //   path: 'icon',
      //   name: '图标'
      // }
    ]
  },
  {
    path: '',
    name: '导航',
    children: [
      {
        path: 'paginator',
        name: '分页器'
      }
    ]
  },
  {
    path: '',
    name: '数据展示',
    children: [
      // {
      //   path: 'table',
      //   name: '表格'
      // }
    ]
  },
  {
    path: '',
    name: '表单控件',
    children: [
      {
        path: 'form-field',
        name: '表单字段'
      },
      {
        path: 'input',
        name: '输入框'
      },
      {
        path: 'select',
        name: '选择器'
      }
    ]
  },
  {
    path: '',
    name: '反馈',
    children: [
      {
        path: 'alert',
        name: '警告提示'
      }
    ]
  }
];
