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
    name: '数据展示',
    children: [
      // {
      //   path: 'tabs',
      //   name: '标签页'
      // }
    ]
  }
];
