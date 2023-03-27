import React from "react";
import { evaluate } from "mathjs";
import Sketch from 'react-p5';




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
  let functionInput = "";

  function increaseySet() {
    for(let i=6; i<ySet.length; i++) {
      ySet[i] *= 2;
    }
    for(let i=0; i<5; i++) {
      ySet[i] *=2;
    }
    setSingleSizes();
    handleInput();
  }
  
  function decreaseySet() {
    for(let i=6; i<ySet.length; i++) {
      ySet[i] /= 2;
    }
    for(let i=0; i<5; i++) {
      ySet[i] /= 2;
    }
    setSingleSizes();
    handleInput();
  }
  
  function increaseXSet() {
    for(let i=6; i<xSet.length; i++) {
      xSet[i] *= 2;
    }
    for(let i=0; i<5; i++) {
      xSet[i] *= 2;
    }
    setSingleSizes();
    handleInput();
  }
  
  function decreaseXSet() {
    for(let i=6; i<xSet.length; i++) {
      xSet[i] /= 2;
    }
    for(let i=0; i<5; i++) {
      xSet[i] /= 2;
    }
    setSingleSizes();
    handleInput();
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
    const scope = { x: v};
    return evaluate(input, scope);
  }
  
  const plot = (dataSet) => {
    for(let i=0; i<dataSet.length; i++) {
      xPoints.push(xSet[i] * singleXSize);
      yPoints.push(dataSet[i] * singleYSize);
      plotPoints.push([xPoints[i], yPoints[i]]);
    }
  }

  function setFunctionInput(input) {
    functionInput = input;
    console.log(functionInput);
  }
  const setup = (p5, canvasParentRef) => {
    // use parent to render the canvas in this ref
    // (without that p5 will render the canvas outside of your component)
    //p5.createCanvas(w+excess, h+excess).parent(canvasParentRef);
    p5.createCanvas(w+excess, h+excess).parent(canvasParentRef);
    // functionInput.addEventListener("input", () => handleInput());  
    // functionInput.addEventListener("keydown", () => handleInput());
    let plusYButton = document.getElementById("plus-y-button");
    plusYButton.addEventListener("click", () => increaseySet());
    let minusYButton = document.getElementById("minus-y-button");
    minusYButton.addEventListener("click", () => decreaseySet());
    let plusXButton = document.getElementById("plus-x-button");
    plusXButton.addEventListener("click", () => increaseXSet());
    let minusXButton = document.getElementById("minus-x-button");
    minusXButton.addEventListener("click", () => decreaseXSet());
  };

  function handleInput() {
    //let userInput = document.getElementById("math-field").getAttribute("latex");
    let userInput = "1/2";
    //let userInput = document.getElementById("input-button").value;
    plotPoints = [];
    xPoints = [];
    yPoints = [];
    plot(iterate(userInput));
    // console.log(plotPoints);
    isGraph = true;
  }

  function drawGraph(p5) {
  }

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

// // // to be added after switching all button inputs to html
// // // //-------------------------------------------------------------
// // // let scalar = 1;

// // // function increaseySet() {
// // //   for(let i=0; i<intervals; i++) {
// // //     ySet[i] += 5;
// // //   }
// // //   console.log(ySet);
// // // }

// // // //---------------------------------------------------------------

// // function setup() {
// //   createCanvas(w+excess, h+excess);
// //   let functionInput = document.getElementById("math-field");
// //   functionInput.addEventListener("input", () => handleInput());  
// //   functionInput.addEventListener("keydown", () => handleInput());
// //   // let functionInput = document.getElementById("input-button");
// //   // functionInput.addEventListener("input", () => handleInput());  
// //   // functionInput.addEventListener("keydown", () => handleInput());
// //   let plusYButton = document.getElementById("plus-y-button");
// //   plusYButton.addEventListener("click", () => increaseySet());
// //   let minusYButton = document.getElementById("minus-y-button");
// //   minusYButton.addEventListener("click", () => decreaseySet());
// //   let plusXButton = document.getElementById("plus-x-button");
// //   plusXButton.addEventListener("click", () => increaseXSet());
// //   let minusXButton = document.getElementById("minus-x-button");
// //   minusXButton.addEventListener("click", () => decreaseXSet());
// // }




// // function draw() {
// //   if(isGraph == true) {
// //     drawGraph();
// //     isGraph = false;
// //   }
// // }