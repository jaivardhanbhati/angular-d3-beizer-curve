import { Component, ElementRef, Host, ViewChild } from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  name = 'Angular';
  curves: number = 5;
  points: number = 5;
  // numOfPoints : number;

  // @ViewChild('curveSlider') curveVal: ElementRef;

  constructor() {

    // this.numOfCurves = 5;
    // this.numOfPoints = 5;

    //console.log('curveVal', this.curveVal);
  }

  updateCurvesCount() {
    console.log('CurvesCount', this.curves);
  }

  updatePointsCount(){
    console.log('CurvesCount', this.points);
  }
  
}
