import React from "react";
import Sketch from "react-p5";

export default (props) => {
  const excess = 100;
  const h = 1000;
  const w = 1000;
  let xSet = [-5,-4,-3,-2,-1,0,1,2,3,4,5];
  let ySet = [-5,-4,-3,-2,-1,0,1,2,3,4,5];
  let intervals = 11;
  const origin = (w+excess)/2;
  const graphLength = ((origin*2)-(excess*2));
  let singleYSize = graphLength/Math.abs((ySet[0]-ySet[ySet.length-1]));
  let singleXSize = graphLength/Math.abs((xSet[0]-xSet[xSet.length-1]));
  let intervalDistance = graphLength/(intervals-1);
  let isGraph = true;
  let texts = []
  let xPoints = []
  let yPoints = [];
  var plotPoints = []
  const setup = (p5, canvasParentRef) => {
    // use parent to render the canvas in this ref
    // (without that p5 will render the canvas outside of your component)
    //p5.createCanvas(w+excess, h+excess).parent(canvasParentRef);
    p5.createCanvas(w+excess, h+excess);
    // let functionInput = document.getElementById("math-field");
    // functionInput.addEventListener("input", () => handleInput());  
    // functionInput.addEventListener("keydown", () => handleInput());
    // let plusYButton = document.getElementById("plus-y-button");
    // plusYButton.addEventListener("click", () => increaseySet());
    // let minusYButton = document.getElementById("minus-y-button");
    // minusYButton.addEventListener("click", () => decreaseySet());
    // let plusXButton = document.getElementById("plus-x-button");
    // plusXButton.addEventListener("click", () => increaseXSet());
    // let minusXButton = document.getElementById("minus-x-button");
    // minusXButton.addEventListener("click", () => decreaseXSet());
  };

  const draw = (p5) => {
    p5.background(255);
  };

  return <Sketch setup={setup} draw={draw} />;
};

// // to be added after switching all button inputs to html
// // //-------------------------------------------------------------
// // let scalar = 1;

// // function increaseySet() {
// //   for(let i=0; i<intervals; i++) {
// //     ySet[i] += 5;
// //   }
// //   console.log(ySet);
// // }

// // //---------------------------------------------------------------

// function increaseySet() {
//   for(let i=6; i<ySet.length; i++) {
//     ySet[i] *= 2;
//   }
//   for(let i=0; i<5; i++) {
//     ySet[i] *=2;
//   }
//   setSingleSizes();
//   handleInput();
// }

// function decreaseySet() {
//   for(let i=6; i<ySet.length; i++) {
//     ySet[i] /= 2;
//   }
//   for(let i=0; i<5; i++) {
//     ySet[i] /= 2;
//   }
//   setSingleSizes();
//   handleInput();
// }

// function increaseXSet() {
//   for(let i=6; i<xSet.length; i++) {
//     xSet[i] *= 2;
//   }
//   for(let i=0; i<5; i++) {
//     xSet[i] *= 2;
//   }
//   setSingleSizes();
//   handleInput();
// }

// function decreaseXSet() {
//   for(let i=6; i<xSet.length; i++) {
//     xSet[i] /= 2;
//   }
//   for(let i=0; i<5; i++) {
//     xSet[i] /= 2;
//   }
//   setSingleSizes();
//   handleInput();
// }

// function setSingleSizes() {
//   singleYSize = graphLength/Math.abs((ySet[0]-ySet[ySet.length-1]));
//   singleXSize = graphLength/Math.abs((xSet[0]-xSet[xSet.length-1]));
// }

// function iterate(equation) {
//   let dataSet = [];
//   for(let i=0; i<xSet.length; i++) {
//     dataSet.push(calculate(equation, xSet[i]));
//   }
//   return dataSet;
// }

// function calculate(input, v = 0) {
//   const scope = { x: v};
//   return math.evaluate(input, scope);
// }

// function plot(dataSet) {
//   for(let i=0; i<dataSet.length; i++) {
//     xPoints.push(xSet[i] * singleXSize);
//     yPoints.push(dataSet[i] * singleYSize);
//     plotPoints.push([xPoints[i], yPoints[i]]);
//   }
// }

// function setup() {
//   createCanvas(w+excess, h+excess);
//   let functionInput = document.getElementById("math-field");
//   functionInput.addEventListener("input", () => handleInput());  
//   functionInput.addEventListener("keydown", () => handleInput());
//   // let functionInput = document.getElementById("input-button");
//   // functionInput.addEventListener("input", () => handleInput());  
//   // functionInput.addEventListener("keydown", () => handleInput());
//   let plusYButton = document.getElementById("plus-y-button");
//   plusYButton.addEventListener("click", () => increaseySet());
//   let minusYButton = document.getElementById("minus-y-button");
//   minusYButton.addEventListener("click", () => decreaseySet());
//   let plusXButton = document.getElementById("plus-x-button");
//   plusXButton.addEventListener("click", () => increaseXSet());
//   let minusXButton = document.getElementById("minus-x-button");
//   minusXButton.addEventListener("click", () => decreaseXSet());
// }

//   function handleInput() {
//     let userInput = document.getElementById("math-field").getAttribute("equation");
//     //let userInput = document.getElementById("input-button").value;
//     plotPoints = [];
//     xPoints = [];
//     yPoints = [];
//     plot(iterate(userInput));
//     // console.log(plotPoints);
//     isGraph = true;
//   }

// function drawGraph() {
//   clear();
//   background(255,0,0);
//   rectMode(CENTER);
//   textAlign(CENTER);
//   strokeWeight(w/350);
//   stroke(100,200,60);
//   textSize(w/50)
//   //x-origin
//   line(origin,excess,origin,h);
//   //y-origin
//   line(excess,origin,w,origin);
//   //left-border
//   line(excess,excess,excess,h);
//   //bottom_border
//   line(excess,h,w,h);
//   //right-border
//   line(w,excess,h,w);
//   //top-border
//   line(excess,excess,w,excess);  
//   noStroke();
//   text(0, origin-15, origin+20);
//   for(let i=0; i<intervals; i++) {
//     let distance = intervalDistance*i+excess;
//     if(i!=5) {
//       stroke(211,211,211);
//       line(distance,excess,distance,h);
//       line(excess,distance,w,distance);
//       noStroke();
//       text(xSet[i],distance,origin+20);
//       text(ySet[(intervals-(i+1))],origin-15,distance+7);
//     }
//   }
//   //draw plotpoints
//   stroke(211,211,211);
//   for(let i=0; i<plotPoints.length; i++) {
//     rect(plotPoints[i][0]+origin, origin-(plotPoints[i][1]),5,5);
//     if(i != plotPoints.length-1) {
//       line(plotPoints[i][0]+origin, origin-(plotPoints[i][1]), plotPoints[i+1][0]+origin, origin-(plotPoints[i+1][1]) );
//     }
//   }

//   for(let i=0; i<ySet.length; i++) {
//     let distance = intervalDistance*i+excess;
//   }
// }

// function draw() {
//   if(isGraph == true) {
//     drawGraph();
//     isGraph = false;
//   }
// }