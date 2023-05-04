import MySketch from '/Users/owenturnbull/ferd-math/ferd-math/src/main-elements/Sketch.js';
import Input from '/Users/owenturnbull/ferd-math/ferd-math/src/main-elements/Input.js';
import Buttons from '/Users/owenturnbull/ferd-math/ferd-math/src/main-elements/Buttons.js';
import Answer from '/Users/owenturnbull/ferd-math/ferd-math/src/main-elements/Answer.js';
import { MathComponent } from "mathjax-react";
import { useState } from 'react';

const Main = (props) => {

  const [steps, setSteps] = useState([]);
  const [overlayOn, setOverlayOn] = useState(true);
  function off() {
    document.getElementById("overlay").style.display = "none";
  }
  function on() {
    document.getElementById("overlay").style.display = "block";
  }

  return (
    <div>
    <nav>
      <div class="nav-left">
        {/* <img class="hamburger-menu" src="hamburger-menu2.png"/> */}
        <ul class="breadcrumb">
          <li><button>Home</button></li>
          <li><button>About</button></li>
          <li><button onClick={() => on()}>Help</button></li>
        </ul>

      </div>
      <div class="nav-middle">
        <img class="logo" src="Ferd-math-white.png"/>
      </div>
    </nav>
      <div className="overlay" id="overlay" onClick={() => off()}>
        <div id="overlay-text">
          <p>example equations</p>
          <MathComponent tex={"2x+5"}/>
          <MathComponent tex={"\\frac{(x^2+2x)}{(3x+4)}"}/>
        </div>
      </div>
      <div className="content">
        <div className="p5">
          <MySketch id="my-sketch"></MySketch>
        </div>
        <div className="left-side">
          <div className='main-page-event-handlers'>
            <div>
              <Input steps={steps} setSteps={setSteps}/>
            </div>
            <div className="zoom-buttons">
              <Buttons></Buttons>
            </div>
          </div>
          <div className="answer-div">
            <Answer steps={steps}/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Main