import React, { useState } from 'react';
import { addStyles, EditableMathField } from 'react-mathquill';
import {setFunctionInput} from '/Users/owenturnbull/ferd-math/ferd-math/src/main-elements/Sketch.js';
import mySketch from '/Users/owenturnbull/ferd-math/ferd-math/src/main-elements/Sketch.js';

// inserts the required css to the <head> block.
// you can skip this, if you want to do that by yourself.
addStyles()

function Input () {
  //const [latex, setLatex] = useState("");
  const [text, setText] = useState("");

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
    <input className="input-field" id="input-field" onChange={()=>setFunctionInput()}></input>
  )
}

export default Input;