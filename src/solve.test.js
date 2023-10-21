// const mathjs = require('mathjs');
// const nerdamer = require("nerdamer/all.min");
// const Algebrite = require('algebrite');

// function parseTheTree(mathString) {
//     let InParenthises = false
//     let openParens = 0
//     let char;
//     let unadded_idx = 0
//     let args = []
//     let operators = []
//     for( let i = 0; i < mathString.length; i++) {
//         char = mathString[i]
//         if ( char == "(") {
//             openParens++
//         }
//         else if (char == ")") {
//             if (!openParens) {
//                 args.push(mathString.substring(unadded_idx+1, i+1))
//                 unadded_idx = i+1
//             }   else {
//                 openParens--;
//             }
//         }
  
//         else if (char == "+" || char == "-") {
//             if (!openParens) {
//                 args.push(mathString.substring(unadded_idx, i))
//                 unadded_idx = i+1
//                 operators.push(char)
//             }
//         }
//     }
//     if (unadded_idx != mathString.length-1) {
//         args.push(mathString.substring(unadded_idx, mathString.length))
//     }
//     return [args, operators]
//   }

// //console.log(parse("3x^4 - 2x^3 + 5x^2 - x + 7")); // returns [ '3x^4 ', ' 2x^3 ', ' 5x^2 ', ' x ', ' 7' ]
// let [ya, yeet] = parseTheTree("cos(e^x)") // returns [ '((x^2+4)⋅(3x^3−1)⋅(11x^2+2))/(6x+2' ]
// console.log(ya)
// console.log(yeet)
// console.log(mathjs.parse("cos(e^x)"))
// console.log(mathjs.parse("3x^3/"))

import { solve } from "./testSolve.js";
var Algebrite = require("algebrite")

describe('Derivative Solver', () => {
  it('calculates the derivative of a basic polynomial correctly', () => {
    const result = (solve('3*x^4-2*x^3+5*x^2-x+7'));
    expect(result).toBe('12*x^3-6*x^2+10*x-1');
  });

  it('calculates the derivative of a constant function correctly', () => {
    const result = solve('10');
    expect(result).toBe('0');
  });

  it('calculates the derivative of a linear function correctly', () => {
    const result = solve('2*x + 3');
    expect(result).toBe('2');
  });

  it('calculates the derivative of a quadratic function correctly', () => {
    const result = solve('x^2 + 4*x - 6');
    expect(result).toBe('2*(x+2)');
  });

  it('calculates the derivative of a trigonometric function correctly', () => {
    const result = solve('sin(2*x)');
    expect(result).toBe('2*cos(2*x)');
  });

  it('calculates the derivative of an exponential function correctly', () => {
    const result = solve('e^(3*x)');
    expect(result).toBe('3*e ^ (3*x)');
  });

  it('calculates the derivative of a composite function correctly', () => {
    const result = solve('(2*x^2 + 3*x)^3');
    expect(result).toBe('3 * (2 * x ^ 2 + 3 * x) ^ 2 * (4 * x + 3)');
  });

  it('calculates the derivative using the chain rule with trigonometric function correctly', () => {
    const result = solve('sin(x^2)');
    expect(result).toBe('2 * x * cos(x ^ 2)');
  });

  it('calculates the derivative using the quotient rule correctly', () => {
    const result = solve('(x^2 + 2*x) / (x + 1)');
    expect(result).toBe('(x ^ 2 + 2 * x + 2) / (x + 1) ^ 2');
  });

  it('calculates the derivative using the power rule with fractional exponent correctly', () => {
    const result = solve('x^(1/2)');
    expect(result).toBe('0.5 * x^(-0.5)');
  });

  it('calculates the dertivate of a double composit function', () => {
    const result = solve("sin((5*x+3)^2)");
    expect(result).toBe('cos((5x+3)^2 * 2(5x+3) * 5');
  });
});


