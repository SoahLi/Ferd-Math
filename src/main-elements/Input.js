import React, { useState } from 'react';
import { addStyles, EditableMathField} from 'react-mathquill';
import { importInputToSketch } from '/Users/owenturnbull/ferd-math/ferd-math/src/main-elements/Sketch.js';
import { importExpression } from "/Users/owenturnbull/ferd-math/ferd-math/src/main-elements/Solve.js";
// inserts the required css to the <head> block.
// you can skip this, if you want to do that by yourself.
addStyles()


function Input({setSteps}) {
  const [input, setInput] = useState([]);
  const [text, setText] = useState('');
  const [latex, setLatex] = useState('');
  console.log(      <EditableMathField 
    id="my-input"
    latex={latex}
    text={latex}
    onChange={(mathField) => {
        setText(mathField.text());
        setLatex(mathField.latex());
      }
    }
  />);
  
  const handleButtonClick = () => {
    if(importInputToSketch(text)){
      let newSteps = importExpression(text);
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