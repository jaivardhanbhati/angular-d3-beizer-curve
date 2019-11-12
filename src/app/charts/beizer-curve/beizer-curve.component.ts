import { OnChanges, Component, ElementRef, Host, ViewChild, Input } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import * as d3 from 'd3';

@Component({
  selector: 'beizer-curve',
  template: `
    <div class="wrapper">
      <svg #svg>
      </svg>
      <div *ngIf="loading" class="loader">Loading</div>
    </div>
  `,
  styleUrls: ['./beizer-curve.component.css']
})
export class BeizerCurveComponent implements OnChanges {
  @Input() numOfCurves: number;
  @Input() numOfPoints: number;
  @ViewChild('svg') svgRef: ElementRef<SVGElement>;
  

  loading = false;

  constructor(@Host() private host: ElementRef<HTMLElement>) {}

  ngOnChanges() {
    this.paintCanvas();
    fromEvent(window, 'resize')
      .pipe(
        tap(() => this.loading = true),
        debounceTime(300)
      ).subscribe(() => {
        this.paintCanvas();
      });
  }

  private paintCanvas() {
    // if old svg exists - remove all the elements
    d3.selectAll("path").remove();
    d3.selectAll("circle").remove();
    const { width } = this.host.nativeElement.getBoundingClientRect();
    const height = width/ (1.2);
    let svg = d3.select(this.svgRef.nativeElement);
    for(let i = 0; i < this.numOfCurves; i++) {
      const data = this.generateData(height, this.numOfPoints, i);
      this.drawChart(svg, width, height , data);
    }
    this.loading = false;
  }

  private drawChart(svg: any, width: number, height: number, data: any[]) {
    svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMinYMid meet');

    let lineGenerator = d3.line()
      .curve(d3.curveCardinal);
      const pathData = lineGenerator(data);

    svg
      .append("path")
      .data([data])
      .attr("class", "line")
      .style("stroke", "black")
      .style("fill", "none")
      .attr("d", pathData);

    svg
      .selectAll('line')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', function(d) {
      return d[0] ;
      })
      .attr('cy', function(d) {
      return d[1] ;
      })
      .attr('r', 4)
      .attr('fill', 'white');
  }

  private generateData(height, numOfPoints, indexOfCurve) {
  const interval = height / numOfPoints;
  const randomVal = this.getRandomInt(-5, 5);
  let points = [[10, 10]];
  for(let n=1; n < numOfPoints; n++) {
      /* Random Algo to generate equidistant points */
      points.push([n * interval + randomVal * n * indexOfCurve, n * interval - 10 * randomVal + interval]);
  }
  return points;
  }
  
  private getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}