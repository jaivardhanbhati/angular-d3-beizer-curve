import { AfterViewInit, Component, ElementRef, Host, ViewChild, Input } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import * as d3 from 'd3';

@Component({
  selector: 'beizer-curve',
  template: `
    <div class="sliderSection">
    <input #curveSlider class="curveSlider" type="range" min="1" max="100" value="50">
    <input #pointSlider class="pointSlider" type="range" min="1" max="100" value="50">
    </div>  
    <div class="wrapper">
      <svg #svg>
      </svg>
      <div *ngIf="loading" class="loader">Loading</div>
    </div>
  `,
  styleUrls: ['./beizer-curve.component.css']
})
export class BeizerCurveComponent implements AfterViewInit {
  @Input() numOfCurves: number;
  @Input() numOfPoints: number;
  @ViewChild('svg') svgRef: ElementRef<SVGElement>;
  

  loading = false;

  constructor(@Host() private host: ElementRef<HTMLElement>) {}

  ngAfterViewInit() {
    console.log('getBoundingClientRect()', this.host.nativeElement.getBoundingClientRect());
    const { width } = this.host.nativeElement.getBoundingClientRect();
    console.log("width",width);
    const height = width/ (1.2);
    const margin = Math.min(Math.max(width * 0.1, 20), 50);
    const numberOfPoints = 5;
  
    let svg = d3.select(this.svgRef.nativeElement);
    for(let i =0; i < this.numOfCurves; i++) {
      const data = this.generateData(width, height, numberOfPoints, i);
      this.drawChart(svg, width, height, margin, data);
    }
    fromEvent(window, 'resize')
      .pipe(
        tap(() => this.loading = true),
        debounceTime(300)
      ).subscribe(() => {
        //On resize - if od svg exists - remove all the elements
        if(svg) {
          d3.selectAll("path").remove();
          d3.selectAll("circle").remove();
        }
        svg = d3.select(this.svgRef.nativeElement);
        const { width } = this.host.nativeElement.getBoundingClientRect();
        const height = width / (1.2);
        const margin = Math.min(Math.max(width * 0.1, 20), 50);
        for(let i =0; i < this.numOfCurves; i++) {
            const data = this.generateData(width, height, numberOfPoints, i);
            this.drawChart(svg, width, height, margin, data);
        }
        this.loading = false;
      });
      
  }

  private drawChart(svg: any, width: number, height: number, margin: number, data: any[]) {
    const n = data[0].length;
  
    svg
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMinYMid meet');

    let lineGenerator = d3.line()
    .curve(d3.curveCardinal);
    const pathData = lineGenerator(data);

    //d3.select('path').style("stroke", "red").attr('d', pathData);

    // d3.select('path')
    //  .data([data])
    //   .style("fill", "none")
    //   .attr("class", "line")
    //   .attr("d", pathData);

    svg.append("path")
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

  private generateData(minValue, maxValue, numOfPoints, index) {

    const interval = maxValue / numOfPoints;

    // let points = [];
    // points.push([10, 10]);
    // for (let i=0; i < 5; i++) {
    //   points.push([10*interval, 10*interval]);
    // }
  
  let points = [
      [10, 10],
      [100, 100],
      [200, 180],
      [300, 280],
      [400, 300],
      [500, 350],
      [550, 420]
    ];

    let newPoints = [];
    newPoints.push([5,5]);

    points.forEach((point) => {
        newPoints.push([point[0] + 10*index, point[1]  + interval]);
    });
    console.log('newpoints', newPoints);
    console.log('index', index);
    console.log('interval', interval);
    return newPoints;


    //return new Array(n).fill(null).map(() => ({data: Math.random() * maxValue }))
  }
  private getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}