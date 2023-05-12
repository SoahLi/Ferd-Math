import MySketch from '/Users/owenturnbull/ferd-math/ferd-math/src/main-elements/Sketch.js';
import Input from '/Users/owenturnbull/ferd-math/ferd-math/src/main-elements/Input.js';
import Buttons from '/Users/owenturnbull/ferd-math/ferd-math/src/main-elements/Buttons.js';
import Answer from '/Users/owenturnbull/ferd-math/ferd-math/src/main-elements/Answer.js';
import { useState } from 'react';


const Main = () => {

  const [steps, setSteps] = useState([]);

  function overlayOff() {
    document.getElementById("overlay").style.display = "none";
  }
  function overlayOn() {
    document.getElementById("overlay").style.display = "block";
  }
  function popoverOn() {
    document.getElementById("popover").style.display = "flex";
  }
  function popoverOff() {
    document.getElementById("popover").style.display = "none";
  }

  return (
    <div>
    <nav>
      <div className="nav-left">
        <ul className="breadcrumb">
          <li><button onClick={() => popoverOn()}>Symbol Commands</button></li>
          <li><button onClick={() => overlayOn()}>Help</button></li>
        </ul>
      </div>
      <div className="nav-middle">
        <img alt="logo" className="logo" src="Ferd-math-white.png"/>
      </div>
    </nav>
      <div className="overlay" id="overlay" onClick={() => overlayOff()}>
        <div className="overlay-div">
          <p className="overlay-text">Welcome to Ferd-Math Derivative Calculator!</p>
          <p className="overlay-text">example Expressions</p>
          <img alt="math-example-1" id="overlay-math-example-1" src="math_example_1.png"/>
          <img alt="math-example-2" id="overlay-math-example-2" src="math_example_2.png"/>
          <footer>
            <p className="footer-info">View <a className="git-link" href="https://github.com/SoahLi/Ferd-Math" target="_blank">Code</a></p>
            <p className="footer-info" id="author">Created by Owen Turnbull</p>
          </footer>
        </div>
      </div>
      <div className="content">
        <div className="popover" id="popover">
          <div className="popover-arrow"></div>
            <img alt="close-icon" src="X-icon.png" className="x-icon" onClick={() => popoverOff()}/>
            <p className="symbol-conversions">√ == \sqrt</p>
            <p className="symbol-conversions">ln() == log()</p>
            <p className="symbol-conversions"><sup>n</sup>√ == \nthroot</p>
            <p className="symbol-conversions">π == \pi</p>
        </div>
        <div className="p5">
          <MySketch id="my-sketch"></MySketch>
        </div>
        <div className="left-side">
          <div className='main-page-event-handlers'>
            <div className="math-inputs-and-text-box">      
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