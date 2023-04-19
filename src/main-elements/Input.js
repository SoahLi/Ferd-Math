import React, { useState } from 'react';
import { addStyles, EditableMathField } from 'react-mathquill';
import { parse } from 'mathjs';
import {setFunctionInput} from '/Users/owenturnbull/ferd-math/ferd-math/src/main-elements/Sketch.js';
import mySketch from '/Users/owenturnbull/ferd-math/ferd-math/src/main-elements/Sketch.js';
import { importFunction } from '/Users/owenturnbull/ferd-math/ferd-math/src/main-elements/Solve.js';

// inserts the required css to the <head> block.
// you can skip this, if you want to do that by yourself.
addStyles()

function Input () {
  //const [latex, setLatex] = useState("");
  const [text, setText] = useState("");
  importFunction();
  return (
    // <div>
    //   <EditableMathField
    //     id="math-field"
    //     latex={latex}
    //     onChange={(mathField) => {
    //       setLatex(mathField.latex());
    //     }}
    //   />
    //   <span>{setFunctionInput(latex)}</span>
    // </div>
    <div>
      <input className="input-field" id="input-field" onChange={()=>{}}></input>
      <button className="enter-button" onClick={() => {setFunctionInput(); importFunction()}}>Enter</button>
    </div>
  )
}

export default Input;