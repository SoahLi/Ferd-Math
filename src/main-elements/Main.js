import MySketch from '/Users/owenturnbull/ferd-math/ferd-math/src/main-elements/Sketch.js';
import Input from '/Users/owenturnbull/ferd-math/ferd-math/src/main-elements/Input.js';
import Buttons from '/Users/owenturnbull/ferd-math/ferd-math/src/main-elements/Buttons.js';
import Answer from '/Users/owenturnbull/ferd-math/ferd-math/src/main-elements/Answer.js';
import { useState } from 'react';

const Main = (props) => {

  const [steps, setSteps] = useState([]);
  
  return (
    <div>
    <div className="inputs">
      <Input steps={steps} setSteps={setSteps}/>
      <Buttons></Buttons>
      <Answer className="answer" steps={steps}/>
    </div>
    <div className="p5">
      <MySketch></MySketch>
    </div>
  </div>
  )
}

export default Main