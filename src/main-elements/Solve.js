import { MathComponent } from 'mathjax-react';
import {OperatorNode, ConstantNode, SymbolNode, ParenthesisNode, FunctionNode, parse, derivative, evaluate, compile} from 'mathjs';
const nerdamer = require("nerdamer/all.min");
var Algebrite = require('algebrite')


var steps = [];
export function importFunction(equation) {
  steps = [];
  let deriv;
  try { 
    if(equation != "") {
      steps.push(<MathComponent tex={nerdamer(equation).toTeX({simplify: false})}/>);
      deriv = solve(parse(equation));
    }
  } catch {
    console.log("er");
  }
  if(deriv != undefined) {
    //deriv = Algebrite.simplify(deriv).toString();
    steps.push("the derivative is");
    steps.push(<MathComponent tex={nerdamer(deriv).toTeX({simplify: false})}/>);
    steps.push("Donde Esta!")
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
  if((rightNode instanceof SymbolNode) || (rightNode instanceof OperatorNode) || (rightNode instanceof ParenthesisNode)) {
    return exponentRule(leftNode, rightNode);
  } else {
    console.log("executing power rule");
    let right_equation = rightNode.toString();
    let left_equation = leftNode.toString();
    let equation = (right_equation+"*("+left_equation+"^("+(right_equation+"-1")+"))*("+derivative(left_equation, "x")+")");
    steps.push("apply the power rule and don't forget the baby");
    steps.push(<MathComponent tex={nerdamer(equation).toTeX({simplify: false})}/>);
    return equation; 
  }
}

function exponentRule(leftNode, rightNode) {
  console.log("executing exponent rule")
  let right_equation = rightNode.toString();
  let left_equation = leftNode.toString();
  let equation = (left_equation+"^("+right_equation+")*log("+left_equation+")*(("+solve(rightNode)+"))");
  console.log("this the equation");
  console.log(equation);
  steps.push("The original times the ln of the base times the derviative of the exponent");
  steps.push(<MathComponent tex={nerdamer(equation).toTeX({simplify: false})}/>)
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
  steps.push(<MathComponent tex={nerdamer(equation).toTeX({simplify: false})}/>);
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

function removeParenthesis(mathTree) {
  console.log("removing parenthesis");
  while (true) {
    if (mathTree.isParenthesisNode) {
      mathTree = mathTree.content;
    } else {
      break
    }
  }
  if(!(mathTree instanceof OperatorNode) || !(mathTree instanceof ParenthesisNode)) return mathTree;
  let left_side = mathTree.args[0];
  let right_side = mathTree.args[1];
  if(left_side instanceof ParenthesisNode) {
    left_side = removeParenthesis(left_side);
  }
  if(right_side instanceof ParenthesisNode) {
    right_side = removeParenthesis(right_side);
  } 
  return parse(left_side + mathTree.operator + right_side);
}

function solve(mathTree) {
  let tree = mathTree;
  let result;
  console.log("equation")
  console.log(mathTree.toString());
  console.log(tree.hasOwnProperty('args'));
  // while (true) {
  //   if (tree.isParenthesisNode) {
  //     tree = tree.content;
  //   } else {
  //     break
  //   }
  // }
  tree = removeParenthesis(tree);
  if(tree.isSymbolNode) {
    return "1";
  }
  if(tree.isConstantNode) {
    return "0";
  }
  console.log("tree");
  console.log(tree);

  let left_node = tree.args[0];
  let right_node = tree.args[1];
  let operator = tree.op;
  let statements = [];
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
    if(tree.args[0] instanceof ConstantNode && tree.args[1] instanceof ConstantNode) {
      console.log("you made it");
      return "0"
    }
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