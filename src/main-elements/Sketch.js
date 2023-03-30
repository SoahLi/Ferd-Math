import React from "react";
import Sketch from 'react-p5';
import { evaluateTex } from 'tex-math-parser';

let functionInput = "";

export function setFunctionInput(input) {
  functionInput = String.raw`${input}`;
  handleInput();
}

const excess = 10;
const h = 550;
const w = 550;
let xSet = {mainSet: [-5,-4,-3,-2,-1,0,1,2,3,4,5], subSet: [], factorCount: 1};
let subXSet = []
let ySet = {mainSet: [-5,-4,-3,-2,-1,0,1,2,3,4,5], subSet: [], factorCount: 1};
let subYSet = []
let xSetFactorCount = 1;
let ySetFactorCount = 1;
let intervals = 11;
const origin = (w+excess)/2;
const graphLength = ((origin*2)-(excess*2));
let singleYSize = graphLength/Math.abs((ySet.mainSet[0]-ySet.mainSet[ySet.mainSet.length-1]));
let singleXSize = graphLength/Math.abs((xSet.mainSet[0]-xSet.mainSet[xSet.mainSet.length-1]));
let intervalDistance = graphLength/(intervals-1);
let isGraph = true;
let texts = [];
let xPoints = []
let yPoints = [];
var plotPoints = [];

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
  if (set.mainSet[0]%2 == 0) {
    subCount = 4;
  } else {
    subCount = 5;
  }
  let scalar = Math.abs((set.mainSet[0] - set.mainSet[1])/subCount);
  for(var i=0; i<set.mainSet.length-1; i++) {
    for(var j=1; j<subCount; j++) {
      set.subSet.push(Math.round((100*(set.mainSet[i]+(scalar*j))))/100);
    }
  }
}


function setSingleSizes() {
  singleYSize = graphLength/Math.abs((ySet.mainSet[0]-ySet.mainSet[ySet.mainSet.length-1]));
  singleXSize = graphLength/Math.abs((xSet.mainSet[0]-xSet.mainSet[xSet.mainSet.length-1]));
}

function iterate(equation) {
  let dataSet = [];
  for(let i=0; i<xSet.mainSet.length; i++) {
    dataSet.push(calculate(equation, xSet.mainSet[i]));
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
    xPoints.push(xSet.mainSet[i] * singleXSize);
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
      //subSet lines;
      p5.stroke(220,220,220);
      for(let i=0; i<xSet.subSet.length; i++) {
        let xDistance = xSet.subSet[i]*singleXSize+origin;
        let yDistance = ySet.subSet[i]*singleYSize+origin;
        //console.log(distance);
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
      //draw plotpoints
      p5.stroke(0);
      for(let i=0; i<plotPoints.length; i++) {
        //p5.rect(plotPoints[i][0]+origin, origin-(plotPoints[i][1]),5,5);
        if(i != plotPoints.length-1) {
          p5.line(plotPoints[i][0]+origin, origin-(plotPoints[i][1]), plotPoints[i+1][0]+origin, origin-(plotPoints[i+1][1]) );
        }
      }
  
      for(let i=0; i<ySet.length; i++) {
        let distance = intervalDistance*i+excess;
      }
      isGraph = false;
      console.log(xSet.subSet);
    }
  };

  return (
    <Sketch setup={setup} draw={draw} />
  )
};

export default Canv;