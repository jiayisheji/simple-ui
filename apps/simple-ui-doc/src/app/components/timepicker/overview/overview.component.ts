import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'doc-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  time = new Date();
  selected = new Date();
  constructor() {}

  ngOnInit(): void {}

  dateFilter(date, time) {
    // console.log(date, time);
    // 禁止选择时间选项
    if (time) {
      // 	禁止选择部分小时选项
      if (time.minutes == null) {
        return [1, 2, 3].includes(time.hours);
      } else if (time.seconds == null && time.hours === 4) {
        // 	禁止选择部分分钟选项
        return [20, 21].includes(time.minutes);
      } else if (time.hours === 4 && time.minutes === 30) {
        // 禁止选择部分秒选项
        return [20, 21, 22, 23, 24, 25].includes(time.seconds);
      }
    }

    return false;
  }

  userSelection(date) {
    console.log(date);
  }

  timeChange(time) {
    console.log(time);
  }
}
