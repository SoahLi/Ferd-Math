/* TODO

*better ui especially for Answer div
*touch up sketch.js
*Components in Wrong order (should be input, plus minus buttons, Answer div)   
*Some constants that are operations(1/2) output derivative as the same as original
*expected raw latex when using nerdamer but tex output is simplified
*/

import { MathComponent } from 'mathjax-react';
import {OperatorNode, ConstantNode, SymbolNode, ParenthesisNode, FunctionNode, parse, derivative, evaluate, compile} from 'mathjs';
const nerdamer = require("nerdamer/all.min");
var Algebrite = require('algebrite')


var steps = [];
export function importFunction(equation) {
  console.log(equation);
  steps = [];
  let deriv;
  try { 
    //let equation = document.getElementById('input-field').value
    if(equation != "") {
      //steps.push("Original Equation");
      steps.push(<MathComponent tex={nerdamer(equation).toTeX({simplify: false})}/>);
      // if (simplify(equation).toString() !== parse(equation).toString()){
      //   steps.push("Simplify the equation");
      //   console.log(equation);
      //   equation = Algebrite.simplify(equation).toString();
      //   console.log(equation);
      //   steps.push(<MathComponent tex={nerdamer(equation).toTeX({simplify: false})}/>);
      // }
      deriv = solve(parse(equation));
    }
  } catch {
    console.log("error");
  }
  if(deriv != undefined) {
    steps.push("the derivative of the equation is");
    deriv = Algebrite.simplify(deriv).toString();
    steps.push(<MathComponent tex={nerdamer(deriv).toTeX({simplify: false})}/>);
  }
  console.log(steps);
  console.log("done");
  return steps;
}

function functionRule(node) {
  let equation = node.args[0];
  let difEquation;
  //PROBLEM SO DO TODO
  if(equation instanceof SymbolNode || equation instanceof ConstantNode) {
    difEquation = "1";
  } else if(equation instanceof FunctionNode) {
    console.log("function found");
    difEquation  = functionRule(equation);
  } else {
    difEquation = solve(equation);
  }
  let func = node.name+"(x)";
  func = derivative(func, "x").toString();
  console.log(func);
  return ("("+difEquation+")*"+func.replace("x", equation));
}

function powerRule(leftNode, rightNode) {
  console.log("executing power rule");
  let right_equation = rightNode.toString();
  let left_equation = leftNode.toString();
  let equation = (right_equation+"*("+left_equation+"^("+(right_equation+"-1")+"))*("+derivative(left_equation, "x")+")");
  steps.push("apply the power rule and don't forget the baby");
  return equation; 
}


function productRule(left_node, right_node) {
  console.log("executing product rule");
  steps.push("applying the product rule");
  let left_equation = left_node.toString();
  let right_equation = right_node.toString();
  steps.push("the left sides derivative:");
  let left_derivative = solve(left_node);
  steps.push(<MathComponent tex={nerdamer(left_derivative).toTeX({simplify: false})}/>);
  steps.push("the rigth sides derivative:");
  let right_derivative = solve(right_node);
  steps.push(<MathComponent tex={nerdamer(right_derivative).toTeX({simplify: false})}/>);
  let equation = "("+left_equation+")*("+left_derivative+")+("+right_equation+")*("+left_derivative+")";
  steps.push("the first guy times the derivative of the second guy plus the second guy times the derivative of the first guy");
  return equation;
}


function quotientRule(left_node, right_node) {
  steps.push("applying the quotient rule");
  let left_equation = left_node.toString();
  let right_equation = right_node.toString();
  steps.push("the denominator's derivative:");
  let right_derivative = solve(right_node);
  steps.push(<MathComponent tex={nerdamer(right_derivative).toTeX({simplify: false})}/>);
  steps.push("the numerator's derivative:");
  let left_derivative = solve(left_node);
  steps.push(<MathComponent tex={nerdamer(left_derivative).toTeX({simplify: false})}/>);
  steps.push("the denominator times the derivative of the numerator minus the numerator times the derivative of the denominator all over the denominator squared");
  let equation =  ("(("+right_equation+"*("+left_derivative+"))-("+left_equation+"*("+right_derivative+")))/("+right_equation+")^2");
  console.log(equation);
  steps.push(<MathComponent tex={nerdamer(equation).toTeX({simplify: false})}/>);
  return equation;
}
//(((x ^ 2 + 10)*7*1+0)-((7 * x + 3)*2*(x^(2-1))*(1)+0))/((x ^ 2 + 10))^2

const difunctionRules = {"^": powerRule, "/": quotientRule, "*": productRule};

/*  
DOES NOT WORK FOR EXPONENTS
*/
function solve(mathTree) {
  let tree = mathTree;
  let result;
  console.log("equation")
  console.log(mathTree.toString());
  console.log(tree.hasOwnProperty('args'));
  while (true) {
    if (tree.hasOwnProperty('args')) {
      break;
    } else {
      tree = tree.content;
    }
  }
  console.log("tree");
  console.log(tree);
  let left_node = tree.args[0];
  let right_node = tree.args[1];
  let operator = tree.op;
  let statements = [];
  console.log('constant or symbol node');
  if(operator == "+" || operator == "-") {
    console.log("non rule");
    for(let i=0; i<tree.args.length; i++) {
      if(tree instanceof FunctionNode) {
        console.log("function found");
        statements.push(functionRule(tree));
      } else if(tree.args[i] instanceof ConstantNode) {
        console.log("constant found");
        statements.push("0");
      } else if(tree.args[i] instanceof SymbolNode) {
        console.log("symbol found");
        statements.push("1");
      }  else {
        console.log("going deeper");
        statements.push(solve(tree.args[i]));
      }
    }
    if(statements.length == 2) {
      result = statements[0] +operator+ statements[1];
    } else {
      result = operator + statements[0];
    }
  } else {
    console.log("rules apply");
    if(((tree.args[0] instanceof OperatorNode || tree.args[0] instanceof ParenthesisNode || tree.args[0] instanceof FunctionNode) && (tree.args[1] instanceof OperatorNode || tree.args[1] instanceof ParenthesisNode || tree.args[1] instanceof FunctionNode)) || (operator == "^")) {
      console.log("double op");
      result = difunctionRules[operator](left_node, right_node);
    } else {
      for(let i=0; i<tree.args.length; i++) {
        if(tree instanceof FunctionNode) {
          console.log("function found");
          statements.push(functionRule(tree));
        } else if(tree.args[i] instanceof ConstantNode) {
          console.log("constant found");
          statements.push(tree.args[i]);
        } else if(tree.args[i] instanceof SymbolNode) {
          console.log("symbol found");
          statements.push("1");
        }  else {
          console.log("going deeper");
          statements.push(solve(tree.args[i]));
        }
      }
      if(statements.length == 2) {
        result = statements[0] +operator+ statements[1];
      } else if(operator !== undefined) {
        result = operator + statements[0];
      } else {
        result = statements[0];
      }
    }
  }
  console.log(result);
  result = (result).toString();
  console.log(result);
  return result;
}