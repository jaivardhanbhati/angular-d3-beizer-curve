import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LineChartComponent } from './line-chart/line-chart.component';
import { BeizerCurveComponent } from './beizer-curve/beizer-curve.component';

@NgModule({
  imports: [CommonModule],
  declarations: [LineChartComponent, BeizerCurveComponent],
  exports: [LineChartComponent, BeizerCurveComponent]
})
export class ChartsModule {}