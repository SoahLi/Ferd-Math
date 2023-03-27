import React, { useState } from 'react'
import { addStyles, EditableMathField } from 'react-mathquill'
import mySketch from '/Users/owenturnbull/ferd-math/ferd-math/src/main-elements/Sketch.js';

// inserts the required css to the <head> block.
// you can skip this, if you want to do that by yourself.
addStyles()

function Input () {
  const [latex, setLatex] = useState("");

  return (
    <div>
      <EditableMathField
        id="math-field"
        latex={latex}
        onChange={(mathField) => {
          setLatex(mathField.latex());
          
        }}
      />
    </div>
  )
}

export default Input;