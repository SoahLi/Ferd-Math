import React from "react";
import Sketch from 'react-p5';
import { evaluateTex } from 'tex-math-parser';

let functionInput = "";

export function setFunctionInput(input) {
  functionInput = String.raw`${input}`;
  handleInput();
}

const excess = 100;
const h = 1000;
const w = 1000;
let xSet = [-5,-4,-3,-2,-1,0,1,2,3,4,5];
let ySet = [-5,-4,-3,-2,-1,0,1,2,3,4,5];
let xSetFactorCount = 1;
let ySetFactorCount = 1;
let intervals = 11;
const origin = (w+excess)/2;
const graphLength = ((origin*2)-(excess*2));
let singleYSize = graphLength/Math.abs((ySet[0]-ySet[ySet.length-1]));
let singleXSize = graphLength/Math.abs((xSet[0]-xSet[xSet.length-1]));
let intervalDistance = graphLength/(intervals-1);
let isGraph = true;
let texts = [];
let xPoints = []
let yPoints = [];
var plotPoints = [];

function increaseSet(set, factorCount) {
  let factor;
  if(factorCount < 2) {
    factor = 2;
    factorCount++;
  } else {
    factor = 2.5;
    factorCount = 0;
  }
  for(let i=6; i<set.length; i++) {
    set[i] *= factor;
  }
  for(let i=0; i<5; i++) {
    set[i] *= factor;
  }
  setSingleSizes();
  handleInput();
  console.log(factorCount);
  return factorCount;
}

function decreaseSet(set, factorCount) {
  let factor;
  if(factorCount > 0) {
    factor = 2;
    factorCount--;
  } else {
    factor = 2.5;
    factorCount = 2;
  }
  for(let i=6; i<set.length; i++) {
    set[i] /= factor;
  }
  for(let i=0; i<5; i++) {
    set[i] /= factor;
  }
  setSingleSizes();
  handleInput();
  console.log(factorCount);
  return factorCount;
}


function setSingleSizes() {
  singleYSize = graphLength/Math.abs((ySet[0]-ySet[ySet.length-1]));
  singleXSize = graphLength/Math.abs((xSet[0]-xSet[xSet.length-1]));
}

function iterate(equation) {
  let dataSet = [];
  for(let i=0; i<xSet.length; i++) {
    dataSet.push(calculate(equation, xSet[i]));
  }
  return dataSet;
}

function calculate(input, v = 0) {
  const scope = {x: v};
  try {
    const result = evaluateTex(input, scope).evaluated;
    return result;
  }
  catch {
    //console.log("this ain't a function yo");
    return undefined;
  }
}


const plot = (dataSet) => {
  for(let i=0; i<dataSet.length; i++) {
    xPoints.push(xSet[i] * singleXSize);
    yPoints.push(dataSet[i] * singleYSize);
    plotPoints.push([xPoints[i], yPoints[i]]);
  }
}


function handleInput() {
  if(calculate(functionInput) != undefined) {
    plotPoints = [];
    xPoints = [];
    yPoints = [];
    plot(iterate(functionInput));
  }
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
    plusYButton.addEventListener("click", () => ySetFactorCount = increaseSet(ySet, ySetFactorCount));
    let minusYButton = document.getElementById("minus-y-button");
    minusYButton.addEventListener("click", () => ySetFactorCount = decreaseSet(ySet, ySetFactorCount));
    let plusXButton = document.getElementById("plus-x-button");
    plusXButton.addEventListener("click", () => xSetFactorCount = increaseSet(xSet, xSetFactorCount));
    let minusXButton = document.getElementById("minus-x-button");
    minusXButton.addEventListener("click", () => xSetFactorCount = decreaseSet(xSet, xSetFactorCount));
  };




  const draw = (p5) => {
    if(isGraph == true) {
      p5.clear();
      p5.background(255,0,0);
      p5.rectMode(p5.CENTER);
      p5.textAlign(p5.CENTER);
      p5.strokeWeight(w/350);
      p5.stroke(100,200,60);
      p5.textSize(w/50)
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
      for(let i=0; i<intervals; i++) {
        let distance = intervalDistance*i+excess;
        if(i!=5) {
          p5.stroke(211,211,211);
          p5.line(distance,excess,distance,h);
          p5.line(excess,distance,w,distance);
          p5.noStroke();
          p5.text(xSet[i],distance,origin+20);
          p5.text(ySet[(intervals-(i+1))],origin-15,distance+7);
        }
      }
      //draw plotpoints
      p5.stroke(211,211,211);
      for(let i=0; i<plotPoints.length; i++) {
        p5.rect(plotPoints[i][0]+origin, origin-(plotPoints[i][1]),5,5);
        if(i != plotPoints.length-1) {
          p5.line(plotPoints[i][0]+origin, origin-(plotPoints[i][1]), plotPoints[i+1][0]+origin, origin-(plotPoints[i+1][1]) );
        }
      }
  
      for(let i=0; i<ySet.length; i++) {
        let distance = intervalDistance*i+excess;
      }
      isGraph = false;
    }
  };

  return (
    <Sketch setup={setup} draw={draw} />
  )
};

export default Canv;