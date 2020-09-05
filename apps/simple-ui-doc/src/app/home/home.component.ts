import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  loading: boolean = false;
  size: string = 'medium';

  /* skeleton = [
    {
      space: 1,
      cols: [
        { type: 'title', width: '3rem' },
        { type: 'title', span: 4 },
        { type: 'title', span: 6 },
        { type: 'title', span: 4 },
        { type: 'title', span: 10 }
      ]
    },
    {
      space: 1,
      cols: [{ width: '3rem' }, { span: 4 }, { span: 6 }, { span: 4 }, { span: 10 }]
    },
    {
      space: 1,
      cols: [{ width: '3rem' }, { span: 4 }, { span: 6 }, { span: 4 }, { span: 10 }]
    },
    {
      space: 1,
      cols: [{ width: '3rem' }, { span: 4 }, { span: 6 }, { span: 4 }, { span: 10 }]
    },
    {
      space: 1,
      cols: [{ width: '3rem' }, { span: 4 }, { span: 6 }, { span: 4 }, { span: 10 }]
    }
  ]; */

  skeleton = [
    {
      space: 1,
      cols: [
        { type: 'avatar', width: '3rem', height: '3rem' },
        {
          rows: [
            { cols: [{ type: 'title', width: '10rem' }] },
            { cols: [{}] },
            { cols: [{}] },
            { cols: [{ span: 16 }] },
            {
              space: 1,
              cols: [{ width: '3rem' }, { width: '3rem' }, { width: '3rem' }, { type: 'empty' }, { width: '9rem' }]
            }
          ]
        },
        { type: 'img', width: '10rem', height: '9rem' }
      ]
    }
  ];

  constructor() {}

  ngOnInit(): void {}
}
