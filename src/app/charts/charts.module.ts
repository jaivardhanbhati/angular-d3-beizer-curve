import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BeizerCurveComponent } from './beizer-curve/beizer-curve.component';

@NgModule({
  imports: [CommonModule],
  declarations: [BeizerCurveComponent],
  exports: [BeizerCurveComponent]
})
export class ChartsModule {}