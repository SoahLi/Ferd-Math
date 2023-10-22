import React, { useState } from 'react';
import { addStyles, EditableMathField} from 'react-mathquill';
import { importInputToSketch } from './Sketch.js';
import { importExpression } from "./Solve.js";
// inserts the required css to the <head> block.
// you can skip this, if you want to do that by yourself.
addStyles()

function convertLatex(input) {
  return input
    .replace(/\\frac{([^{}]+)}{([^{}]+)}/g, '{$1}/{$2}')
    .replace(/\\cdot/g, '*')
    .replace(/{/g, '(')
    .replace(/}/g, ')')
    .replace(/xp/g, ' ^ ')
    .replace(/\\left|\\right/g, '')
    .replace(/\\(sin|cos|tan|sec|cot|csc)/g, "$1")
    .replace(/\\pi/g, "π")
    .replace(/\\ /g, "");
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