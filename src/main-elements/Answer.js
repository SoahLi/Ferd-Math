import React from "react";
import { useState} from 'react';


const Answer = (steps) => {
  let [test, setTest] = useState("hello");
  let node;
  console.log(steps.length);
  let el = []
    for(let i=0; i<steps.length; i++) {
      test = "goodbye";
      el.push(document.createElement("p"));
      node = document.createTextNode("This is new.");
      el[i].appendChild(node);
    }
    console.log(el);
  var stepElements = [];
  var elems = [];
  // for (let i = 0; i < steps.length; i++) {
  //   elems.push(document.createElement('p'));
  //   elems[i].textContent = test[i];
  //   console.log(elems);
  // } 
  // stepElements = elems;
  // console.log("stepElements");
  // console.log(stepElements);
  return (
    <div>
      <div>{test}</div>
    </div>
  )
}

export default Answer;