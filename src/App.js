import './App.css';
import MySketch from '/Users/owenturnbull/ferd-math/ferd-math/src/main-elements/Sketch.js';
import Input from '/Users/owenturnbull/ferd-math/ferd-math/src/main-elements/Input.js';
import Buttons from '/Users/owenturnbull/ferd-math/ferd-math/src/main-elements/Buttons.js';

function App() {
  return (
    <div>
      <div className="inputs">
        <Input></Input>
        <Buttons></Buttons>
      </div>
      <div className="p5">
        <MySketch></MySketch>
      </div>
    </div>
  );
}

export default App;
