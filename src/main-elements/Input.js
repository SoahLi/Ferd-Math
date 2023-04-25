import React, { useState } from 'react';
import { addStyles, EditableMathField, StaticMathField } from 'react-mathquill';
import { parse } from 'mathjs';
import {setFunctionInput} from '/Users/owenturnbull/ferd-math/ferd-math/src/main-elements/Sketch.js';
import mySketch from '/Users/owenturnbull/ferd-math/ferd-math/src/main-elements/Sketch.js';
import { importFunction } from "./Solve";
import { MathComponent } from "mathjax-react";
const nerdamer = require("nerdamer/all.min");
// inserts the required css to the <head> block.
// you can skip this, if you want to do that by yourself.
addStyles()


function Input() {
  const [input, setInput] = useState([]);
  const [steps, setSteps] = useState([]);
  const [method, setMethod] = useState([]);
  const [text, setText] = useState('');
  const [latex, setLatex] = useState('');

  // const parseSteps = (newSteps) => {
  //   let parsedSteps = [];
  //   for (let i=0; i<newSteps.length; i++) {
  //     try {
  //       var LaTeX = nerdamer(newSteps[i]).toTeX();
  //       console.log(LaTeX);
  //       parsedSteps.push(<MathComponent tex={LaTeX}/>);
  //     } catch {
  //       parsedSteps.push(<p>{steps[i]}</p>);
  //     }
  //   }
  //   console.log(parsedSteps);
  //   return parsedSteps;
  // }

  const combine = (mySteps, myExplanations) => {
    const arr1 = mySteps;
    const arr2 = myExplanations;
    
    const maxLength = Math.max(arr1.length, arr2.length);
    
    const result = [];
    
    for (let i = 0; i < maxLength; i++) {
      if (i < arr1.length) {
        result.push(arr1[i]);
      }
      if (i < arr2.length) {
        result.push(arr2[i]);
      }
    }
    console.log(result);
    return result;
  }

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleButtonClick = () => {
    setFunctionInput(text);
    let newSteps = importFunction(text);
    // let newExplanations = newSteps[1];
    // newSteps = newSteps[0];
    // const parsedSteps = parseSteps(newSteps);
    // setSteps(parsedSteps);
    // let completeMethod = combine(parsedSteps, newExplanations);
    setSteps(newSteps);
  };

  return (
    <div>
    <EditableMathField 
      latex={latex}
      text={latex}
      onChange={(mathField) => {
          setText(mathField.text());
        }
      }
    />
      <button className="enter-button" onClick={handleButtonClick}>
        Enter
      </button>
      <Answer className="answer" steps={steps}/>
    </div>
  );
}

const Answer = (props) => {
  return (
    <div>
        {props.steps.map((step, index) => (
            <div className ='answer' key={index}>{step}</div>
        ))}
    </div>
  )
}

export default Input;