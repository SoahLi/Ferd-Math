import React, { useState } from 'react';
import { addStyles, EditableMathField} from 'react-mathquill';
import { importInputToSketch } from './Sketch.js';
import { importExpression } from "./Solve.js";
import {latexParser} from "latex-parser"
import { replace } from 'lodash';
// inserts the required css to the <head> block.
// you can skip this, if you want to do that by yourself.
addStyles()

function convertLatex(input) {
  // Replace fractions
  input = input.replace(/\\frac{([^{}]+)}{([^{}]+)}/g, '{$1}/{$2}');
  
  // Replace names
  input = input.replace(/\\cdot/g, '*');
  input = input.replace(/{/g, '(');
  input = input.replace(/}/g, ')');
  input = input.replace(/xp/g, ' ^ ');
  input = input.replace(/\\left/g, '');
  input = input.replace(/\\right/g, '');
  input = input.replace(/\\sin/g, "sin");
  input = input.replace(/\\cos/g, "cos");
  input = input.replace(/\\tan/, "tan");
  input = input.replace(/\\sec/g, "sec");
  input = input.replace(/\\pi/g, "π")
  input = input.replace(/\\ /g, "");

  
  return input;
}

//problems with spaces. e.g 2^2+3 works but 2^2 + 3 does not work
function Input({setSteps}) {
  const [text, setText] = useState('');
  const [latex, setLatex] = useState('');
  
  const handleButtonClick = () => {
    if(importInputToSketch(text)){
      let newSteps = importExpression(convertLatex(latex), latex);
      setSteps(newSteps);
    } else {
      alert("please type a valid expression");
    }
  };

  return (
    <div className='input-with-enter-button'>    
      <EditableMathField 
        id="my-input"
        latex={latex}
        text={latex}
        onChange={(mathField) => {
            setText(mathField.text());
            setLatex(mathField.latex());
          }
        }
      />
      <button className="enter-button" onClick={handleButtonClick}>
        Go
      </button>
    </div>
  );
}

export default Input;