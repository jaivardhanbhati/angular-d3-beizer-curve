import { AfterViewInit, Component, ElementRef, Host, ViewChild, Input } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import * as d3 from 'd3';

//<svg width="500" height="400" #svg>
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
export class BeizerCurveComponent implements AfterViewInit {
  @Input() numOfCurve: number = 2;
  @Input() numOfPoints: number = 5;
  @ViewChild('svg') svgRef: ElementRef<SVGElement>;
  

  loading = false;

  constructor(@Host() private host: ElementRef<HTMLElement>) {}

  ngAfterViewInit() {
      //this.generateData(20, 10)
    console.log('getBoundingClientRect()', this.host.nativeElement.getBoundingClientRect());
    const { width } = this.host.nativeElement.getBoundingClientRect();
    console.log("width",width);
    const height = width/ (1.2);
    const margin = Math.min(Math.max(width * 0.1, 20), 50);
    const numberOfPoints = 5;
  
    debugger;

    const svg = d3.select(this.svgRef.nativeElement)
    for(let i =0; i < 3; i++) {
      const data = this.generateData(width, height, numberOfPoints, i);
      this.drawChart(svg, width, height, margin, data);
    }
    fromEvent(window, 'resize')
      .pipe(
        tap(() => this.loading = true),
        debounceTime(300)
      ).subscribe(() => {
        const { width } = this.host.nativeElement.getBoundingClientRect();
        const height = width / (1.2);
        const margin = Math.min(Math.max(width * 0.1, 20), 50);
        this.drawChart(svg, width, height, margin, data);
        // console.log("1 width",width);
        // console.log("1 height",height);
        // console.log("1 margin", margin);
        this.loading = false;
      });
      
  }

  private drawChart(svg: any, width: number, height: number, margin: number, data: any[]) {
    const chartWidth = width - 2 * margin;
    const chartHeight = height - 2 * margin;
    // const n = data[0].length;
    // const maxValue = this.getMaxValue(data);

    

    svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMinYMid');

    svg.selectAll('g').remove();
    
    // const xScale = d3.scaleLinear()
    //   .domain([0, n-1])
    //   .range([0, chartWidth]);

    // const yScale = d3.scaleLinear()
    //   .domain([0, maxValue])
    //   .range([chartHeight, 0]);

    
    let lineGenerator = d3.line()
    .curve(d3.curveCardinal);

    var pathData = lineGenerator(data);

    //d3.select('path').attr('d', pathData);

    //d3.select('path')
    //  .data([data])
      //.style("fill", "none")
      //.attr("class", "line")
      //.attr("d", pathData);

      svg.append("path")
      .data([data])
      .attr("class", "line")
      .style("stroke", "red")
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
    

    

    // const line = d3.line()
    //   .defined(d => !isNaN(d.data))
    //   .x((d, i) => xScale(i))
    //   .y(d => yScale(d.data))
    //   .curve(d3.curveCardinal)

    // svg.append('g')
    //   .attr('class', 'x axis')
    //   .attr('transform', `translate(${margin}, ${chartHeight + margin})`)
    //   .call(d3.axisBottom(xScale).ticks(Math.min(Math.floor(chartWidth / 25), n)));

    // svg.append('g')
    //   .attr('class', 'y axis')
    //   .attr('transform', `translate(${margin}, ${margin})`)
    //   .call(d3.axisLeft(yScale).ticks(Math.min(Math.floor(chartHeight / 15), maxValue)));

    // const colors = ['steelblue', 'orange'];
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
      [550, 450]
    ];

    let newPoints = [];

    points.forEach((point) => {
        newPoints.push([point[0] - 10*index, point[1]  + 10*index]);
    });
    console.log('newpoints', newPoints);
    console.log('index', index);
    return newPoints;


    //return new Array(n).fill(null).map(() => ({data: Math.random() * maxValue }))
  }
  private getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}