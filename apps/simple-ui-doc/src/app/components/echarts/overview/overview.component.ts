import { Component, OnInit } from '@angular/core';
import { SimEChartsRegisterMapService } from '@ngx-simple/echarts';

@Component({
  selector: 'doc-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  options: any;

  theme: string = 'roma';

  constructor(private eChartsRegisterMapService: SimEChartsRegisterMapService) {}

  ngOnInit(): void {
    const xAxisData = [];
    const data1 = [];
    const data2 = [];

    for (let i = 0; i < 100; i++) {
      xAxisData.push('category' + i);
      data1.push((Math.sin(i / 5) * (i / 5 - 10) + i / 6) * 5);
      data2.push((Math.cos(i / 5) * (i / 5 - 10) + i / 6) * 5);
    }

    this.eChartsRegisterMapService.registerMap('china').subscribe(() => {
      console.log('ok');
    });

    this.options = {
      legend: {
        data: ['bar', 'bar2'],
        align: 'left'
      },
      tooltip: {},
      xAxis: {
        data: xAxisData,
        silent: false,
        splitLine: {
          show: false
        }
      },
      yAxis: {},
      series: [
        {
          name: 'bar',
          type: 'bar',
          data: data1,
          animationDelay: idx => idx * 10
        },
        {
          name: 'bar2',
          type: 'bar',
          data: data2,
          animationDelay: idx => idx * 10 + 100
        }
      ],
      animationEasing: 'elasticOut',
      animationDelayUpdate: idx => idx * 5
    };
  }
}
