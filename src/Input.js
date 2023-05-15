import React, { useState } from 'react';
import { addStyles, EditableMathField} from 'react-mathquill';
import { importInputToSketch } from './Sketch.js';
import { importExpression } from "./Solve.js";
// inserts the required css to the <head> block.
// you can skip this, if you want to do that by yourself.
addStyles()


function Input({setSteps}) {
  const [text, setText] = useState('');
  const [latex, setLatex] = useState('');
  
  const handleButtonClick = () => {
    if(importInputToSketch(text)){
      let newSteps = importExpression(text);
      console.log(newSteps);
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