import React, { useState } from 'react';

const Answer = (props) => {
  return (
    <div>
        {props.steps.map((step, index) => (
            <div className ='answer' key={index}>{step}</div>
        ))}
    </div>
  )
}

export default Answer;