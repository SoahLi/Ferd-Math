import React from "react";
import Sketch from 'react-p5';
import { evaluateTex, parseTex } from 'tex-math-parser';
//import * as math from 'mathjs';
import {derivative, evaluate, compile} from 'mathjs';
// let test = parseTex('x^3');
// test = derivative(derivative(test, 'x'), 'x');
// console.log(test);
// console.log(test.evaluate({x: 2}));

let functionInput = "";

export function setFunctionInput(input) {
  functionInput = String.raw`${input}`;
  handleInput();
}

const excess = 10;
const h = 550;
const w = 550;
let xSet = {mainSet: [-5,-4,-3,-2,-1,0,1,2,3,4,5], subSet: [], derivSet: [], secondDerivSet: [], factorCount: 1};
let ySet = {mainSet: [-5,-4,-3,-2,-1,0,1,2,3,4,5], subSet: [], derivSet: [], secondDerivSet: [], factorCount: 1};
let intervals = 11;
const origin = (w+excess)/2;
const graphLength = ((origin*2)-(excess*2));
let singleYSize = graphLength/Math.abs((ySet.mainSet[0]-ySet.mainSet[ySet.mainSet.length-1]));
let singleXSize = graphLength/Math.abs((xSet.mainSet[0]-xSet.mainSet[xSet.mainSet.length-1]));
let intervalDistance = graphLength/(intervals-1);
let isGraph = true;
let texts = [];
let xPoints = {firstDeriv: [], secondDeriv: [], thirdDeriv: []};
let yPoints = {firstDeriv: [], secondDeriv: [], thirdDeriv: []};
var plotPoints = {firstDeriv: [], secondDeriv: [], thirdDeriv: []};

function increaseSet(set) {
  let factor;
  if(set.factorCount < 2) {
    factor = 2;
    set.factorCount++;
  } else {
    factor = 2.5;
    set.factorCount = 0;
  }
  for(let i=0; i<set.mainSet.length; i++) {
    set.mainSet[i] *= factor;
    if(i != 0) {
    }
  }
  setSingleSizes();
  handleInput();
}

function decreaseSet(set) {
  let factor;
  if(set.factorCount > 0) {
    factor = 2;
    set.factorCount--;
  } else {
    factor = 2.5;
    set.factorCount = 2;
  }
  for(let i=0; i<set.mainSet.length; i++) {
    set.mainSet[i] /= factor;
  }
  setSingleSizes();
  handleInput();
}

function createsubSet(set) {
  set.subSet = [];
  let subCount;
  if (set.mainSet[set.mainSet.length-1]%2 == 0) {
    subCount = 4;
  } else {
    subCount = 5;
  }
  let scalar = Math.abs(Math.round((1000*(set.mainSet[0] - set.mainSet[1])/subCount))/1000);
  for(var i=0; i<set.mainSet.length; i++) {
    for(var j=0; j<subCount; j++) {
      set.subSet.push(Math.round((1000*(set.mainSet[i]+(scalar*j))))/1000);
    }
  }
}


function setSingleSizes() {
  singleYSize = graphLength/Math.abs((ySet.mainSet[0]-ySet.mainSet[ySet.mainSet.length-1]));
  singleXSize = graphLength/Math.abs((xSet.mainSet[0]-xSet.mainSet[xSet.mainSet.length-1]));
}

function iterate(eq) {
  const equation = parseTex(eq);
  let firstDerivSet = [];
  let secondDerivSet = [];
  let thirdDerivSet = [];
  for(let i=0; i<xSet.subSet.length; i++) {
    firstDerivSet.push(Math.round(calculate(equation, xSet.subSet[i])*1000)/1000);
    secondDerivSet.push(Math.round((calculate(derivative(equation, 'x'),xSet.subSet[i]))*1000)/1000);
    thirdDerivSet.push(Math.round((calculate(derivative(derivative(equation, 'x'), 'x'),xSet.subSet[i]))*1000)/1000);
  }
  return [firstDerivSet, secondDerivSet, thirdDerivSet];
}

function calculate(input, v = 0) {
  const scope = {x: v};
  try {
    const result = input.evaluate(scope);
    return result;
  }
  catch {
    return undefined;
  }
}


const plot = (sets) => {
  const setLength = sets[0].length;
  for(let i=0; i<setLength; i++) {
    xPoints.firstDeriv.push(Math.round((xSet.subSet[i] * singleXSize)*1000)/1000);
    yPoints.firstDeriv.push(Math.round((sets[0][i] * singleYSize)*1000)/1000);
    yPoints.secondDeriv.push(Math.round((sets[1][i] * singleYSize)*1000)/1000);
    yPoints.thirdDeriv.push(Math.round((sets[2][i] * singleYSize)*1000)/1000);
    plotPoints.firstDeriv.push([xPoints.firstDeriv[i], yPoints.firstDeriv[i]]);
    plotPoints.secondDeriv.push([xPoints.firstDeriv[i], yPoints.secondDeriv[i]]);
    plotPoints.thirdDeriv.push([xPoints.firstDeriv[i], yPoints.thirdDeriv[i]]);
  }
}

function handleInput() {
  try {
      plotPoints.firstDeriv = [];
      plotPoints.secondDeriv = [];
      plotPoints.thirdDeriv = [];
      xPoints.firstDeriv = [];
      xPoints.secondDeriv = [];
      xPoints.thirdDeriv = [];
      yPoints.firstDeriv = [];
      yPoints.secondDeriv = [];
      yPoints.thirdDeriv = [];
      plot(iterate(functionInput));
  } catch {
    console.log("this aint it bro");  
  }
  createsubSet(xSet);
  createsubSet(ySet);
  isGraph = true;
}


const Canv = (props) => {
  const setup = (p5, canvasParentRef) => {
    // use parent to render the canvas in this ref
    // (without that p5 will render the canvas outside of your component)
    p5.createCanvas(w+excess, h+excess).parent(canvasParentRef);
    //functionInput.addEventListener("input", () => handleInput());  
    //functionInput.addEventListener("keydown", () => handleInput());
    let plusYButton = document.getElementById("plus-y-button");
    plusYButton.addEventListener("click", () => increaseSet(ySet));
    let minusYButton = document.getElementById("minus-y-button");
    minusYButton.addEventListener("click", () => decreaseSet(ySet));
    let plusXButton = document.getElementById("plus-x-button");
    plusXButton.addEventListener("click", () => increaseSet(xSet));
    let minusXButton = document.getElementById("minus-x-button");
    minusXButton.addEventListener("click", () => decreaseSet(xSet));
    createsubSet(xSet);
    createsubSet(ySet);
  };




  const draw = (p5) => {
    if(isGraph == true) {
      p5.clear();
      p5.rectMode(p5.CENTER);
      p5.textAlign(p5.CENTER);
      p5.strokeWeight(w/600);
      p5.textSize(w/50)
      //subSet lines;
      p5.stroke(220,220,220);
      p5.strokeWeight(w/350);
      let subLength = xSet.subSet.length > ySet.subSet.length ? xSet.subSet.length : ySet.subSet.length;
      for(let i=0; i<subLength; i++) {
        let xDistance = xSet.subSet[i]*singleXSize+origin;
        let yDistance = ySet.subSet[i]*singleYSize+origin;
        p5.line(xDistance,excess,xDistance,h);
        p5.line(excess,yDistance,w,yDistance);
      }
      for(let i=0; i<intervals; i++) {
        let distance = intervalDistance*i+excess;
        if(i!=5) {
          p5.stroke(128,128,128);
          p5.line(distance,excess,distance,h);
          p5.line(excess,distance,w,distance);
          p5.noStroke();
          p5.text(xSet.mainSet[i],distance,origin+20);
          p5.text(ySet.mainSet[(intervals-(i+1))],origin-15,distance+7);
        }
      }
      p5.stroke(100,200,60);
      //x-origin
      p5.line(origin,excess,origin,h);
      //y-origin
      p5.line(excess,origin,w,origin);
      //left-border
      p5.line(excess,excess,excess,h);
      //bottom_border
      p5.line(excess,h,w,h);
      //right-border
      p5.line(w,excess,h,w);
      //top-border
      p5.line(excess,excess,w,excess);  
      p5.noStroke();
      p5.text(0, origin-15, origin+20);
      //draw plotpoints
      for(let i=0; i<plotPoints.firstDeriv.length; i++) {
        //p5.rect(plotPoints[i][0]+origin, origin-(plotPoints[i][1]),5,5);
        if(i != plotPoints.firstDeriv.length-1) {
          p5.stroke(0);
          p5.line(plotPoints.firstDeriv[i][0]+origin, origin-(plotPoints.firstDeriv[i][1]), plotPoints.firstDeriv[i+1][0]+origin, origin-(plotPoints.firstDeriv[i+1][1]) );
          p5.stroke(0,0,139)
          p5.line(plotPoints.secondDeriv[i][0]+origin, origin-(plotPoints.secondDeriv[i][1]), plotPoints.secondDeriv[i+1][0]+origin, origin-(plotPoints.secondDeriv[i+1][1]) );
          p5.stroke(255,0,0);
          p5.line(plotPoints.thirdDeriv[i][0]+origin, origin-(plotPoints.thirdDeriv[i][1]), plotPoints.thirdDeriv[i+1][0]+origin, origin-(plotPoints.thirdDeriv[i+1][1]) );

        }
      }
      isGraph = true; 
    }
  };

  return (
    <Sketch setup={setup} draw={draw} />
  )
};

export default Canv;