import logo from './logo.svg';
import './App.css';
import { evaluate } from 'mathjs';
import { createCanvas, clear, background, rectMode, textAlign, CENTER, strokeWeight, textSize, line, noStroke, text, stroke, rect} from 'p5';
import Sketch from '/Users/owenturnbull/ferd-math/ferd-math/src/main-elements/Sketch.js';

function App() {
  return (
    <div>
      <p>hello</p>
      <Sketch></Sketch> 
    </div>
  );
}

export default App;
