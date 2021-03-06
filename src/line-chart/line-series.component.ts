import {
  Component,
  Input,
  OnChanges,
  ChangeDetectionStrategy
} from '@angular/core';
import d3 from '../d3';
import * as moment from 'moment';
import { sortLinear } from '../utils/sort';

@Component({
  selector: 'g[lineSeries]',
  template: `
    <svg:g line
      [data]="data"
      [path]="path"
      [stroke]="color"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LineSeries implements OnChanges {

  path: string;

  @Input() data;
  @Input() xScale;
  @Input() yScale;
  @Input() color;
  @Input() scaleType;
  @Input() curve: string;

  ngOnChanges() {
    this.update();
  }

  update() {
    let line = d3.line()
      .x(d => {
        let label = d.name;
        let value;
        if (this.scaleType === 'time') {
          value = this.xScale(moment(label).toDate());
        } else if (this.scaleType === 'linear') {
          value = this.xScale(Number(label));
        } else {
          value = this.xScale(label);
        }
        return value;
      })
      .y(d => this.yScale(d.value))
      .curve(this.curve);

    let data = this.data.series;
    if (this.scaleType === 'time' || this.scaleType === 'linear') {
      data = sortLinear(data, 'name');
    }

    this.path = line(data) || '';
  }
}
