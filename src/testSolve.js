import { MathComponent } from 'mathjax-react';
import {parse, derivative, simplify} from 'mathjs';
const nerdamer = require("nerdamer/all.min");
var Algebrite = require('algebrite')
var steps = [];
//sec not working
function functionRule(node) {
  let equation = node.args[0];
  let difExpression;
  steps.push("The derivative of the function times the derivative of the inside");
  let func = node.name+"(y)";
  steps.push("the derivative of the function")
  func = derivative(func, "y").toString();
  steps.push(<MathComponent tex={nerdamer(func).toTeX()}/>);
  steps.push("the derivative of the inside");
  if(equation.isFunctionNode) {
    difExpression  = functionRule(equation);
  } else {
    difExpression = solve(equation);
  }
  steps.push(<MathComponent tex={nerdamer(difExpression).toTeX()}/>);
  let finalEquation
  //the SymbolNode object does not have .toString(), but does have .toString
  if(equation.isSymbolNode) finalEquation = "("+difExpression+")*"+func.replace(/y/g, equation.toString);
  else finalEquation = "("+difExpression+")*"+func.replace(/y/g, equation.toString());
  finalEquation = simplify(finalEquation).toString()
  steps.push(<MathComponent tex={nerdamer(finalEquation).toTeX()}/>);
  return finalEquation;
}


function powerRule(leftNode, rightNode) {
  if((rightNode.isSymbolNode) || (rightNode.isOperatorNode) || (rightNode.isParenthesisNode)) {
    return exponentRule(leftNode, rightNode);
  } else {
    let right_equation = rightNode.toString();
    let left_equation = leftNode.toString();
    // eslint-disable-next-line
    let equation = (right_equation+"*("+left_equation+"^("+(right_equation+"-1")+"))*("+solve(leftNode)+")");
    steps.push("apply the power rule and don't forget the baby");
    steps.push(<MathComponent tex={nerdamer(equation).toTeX()}/>);
    return equation; 
  }
}

function exponentRule(leftNode, rightNode) {
  steps.push("The original times the ln of the base times the derviative of the exponent");
  let right_equation = rightNode.toString();
  let left_equation = leftNode.toString();
  let equation = (left_equation+"^("+right_equation+")*(ln"+left_equation+")*(("+solve(rightNode)+"))");
  steps.push(<MathComponent tex={nerdamer(equation).toTeX()}/>);
  return equation;
}



function productRule(leftNode, rightNode) {
  let left_equation = leftNode.toString();
  let right_equation = rightNode.toString();
  steps.push("the first guy times the derivative of the second guy plus the second guy times the derivative of the first guy");
  steps.push("the left sides derivative:");
  let left_derivative = solve(leftNode);
  steps.push(<MathComponent tex={nerdamer(left_derivative).toTeX()}/>);
  steps.push("the right sides derivative:");
  let right_derivative = solve(rightNode);
  steps.push(<MathComponent tex={nerdamer(right_derivative).toTeX()}/>);
  let equation = "("+left_equation+")*("+right_derivative+")+("+right_equation+")*("+left_derivative+")";
  steps.push(<MathComponent tex={nerdamer(equation).toTeX()}/>);
  return equation;
}


function quotientRule(leftNode, rightNode) {
  let left_equation = leftNode.toString();
  let right_equation = rightNode.toString();
  steps.push("the denominator times the derivative of the numerator minus the numerator times the derivative of the denominator all over the denominator squared");
  steps.push("the denominator's derivative:");
  console.log(rightNode.toString())
  let right_derivative = solve(rightNode);
  steps.push(<MathComponent tex={nerdamer(right_derivative).toTeX()}/>);
  steps.push("the numerator's derivative:");
  let left_derivative = solve(leftNode);
  steps.push(<MathComponent tex={nerdamer(left_derivative).toTeX()}/>);
  let equation =  ("(("+right_equation+"*("+left_derivative+"))-("+left_equation+"*("+right_derivative+")))/("+right_equation+")^2");
  steps.push(<MathComponent tex={nerdamer(equation).toTeX()}/>);
  return equation;
}

const difFunctionRules = {"^": powerRule, "/": quotientRule, "*": productRule};




function removeParenthesis(mathTree) {
  while (true) {
    if (mathTree.isParenthesisNode) {
      mathTree = mathTree.content;
    } else {
      break
    }
  }
  if(!(mathTree.isOperatorNode) || !(mathTree.isParenthesisNode || mathTree.isFunctionNode)) return mathTree;
  let left_side = mathTree.args[0];
  let right_side = mathTree.args[1];
  if(left_side.isParenthesisNode) {
    left_side = removeParenthesis(left_side);
  }
  if(right_side.isParenthesisNode) {
    right_side = removeParenthesis(right_side);
  } 
  return parse(left_side + mathTree.operator + right_side);
}



//main function
export function solve(mathTree) {
  let tree = mathTree;
  //convert to a mathTree
  if(typeof(tree) == "string") tree = parse(tree);
  let result;
  //remove parenthesis
  while(tree.isParenthesisNode) tree = tree.content
  if(tree.isSymbolNode) {
    if(tree.toString() == "e") return "0";
    else if(tree.toString() == "π") return "0";
    else if(tree.toString = "x") return "1";
  }
  if(tree.isConstantNode) {
    return "0";
  }
  //e.g sin,cos
  if(tree.isFunctionNode) {
    result = functionRule(tree).toString();
    return result;
  }
  /**
   * splits tree by term
   * @example '3*x^4 - 2*x^3 + 5*x^2 - x + 7'
   * @return ['3*x^4 - 2*x^3 + 5*x^2 - x, '7']
   * @example '(2x+5)*(3x^2)'
   * @return ['(2x+5)', (3x^2)]
   */

  //check this
  let leftNode = tree.args[0];
  let rightNode = tree.args[1];
  while(tree.args[0].isParenthesisNode){
    tree.args[0] = tree.args[0].content
  }
  while(tree.args[1].isParenthesisNode){
    tree.args[1] = tree.args[1].content
  }
  let operator = tree.op;
  let terms = [];
  //split terms first
  if(operator === "+" || operator === "-") {
    for(let i=0; i<tree.args.length; i++) {
        terms.push(solve(tree.args[i]));
    }
    // account for "two term" expressions like -3x^2
    if(terms.length === 2) {
      result = terms[0] +operator+ terms[1];
    } else {
      result = operator + terms[0];
    }
  } 
  else {
    //prevent expressions like 5x^4 from executing product rule(5 * x^4)
    if(tree.args[0].isConstantNode && tree.args[1].op == "^"){
      var derivative_now = solve(tree.args[1])
      result = tree.args[0] +"*"+ derivative_now;
      result = simplify(result).toString()
      return result;
    }
    //e.g (1)/(2)
    if(tree.args[0].isConstantNode && tree.args[1].isConstantNode){
      return "0";
    }
    //product, quotient, power rule
    if((tree.args[0].isOperatorNode || tree.args[0].isParenthesisNode || tree.args[0].isFunctionNode) || (tree.args[1].isOperatorNode || tree.args[1].isParenthesisNode || tree.args[1].isFunctionNode) || tree.op == "^") {
        result = difFunctionRules[operator](leftNode, rightNode);
    } 
    else {
      //the expression looks something like 3x
      for(let i=0; i<tree.args.length; i++) {
        if(tree.isFunctionNode) {
          terms.push(functionRule(tree));
        } else if(tree.args[i].isConstantNode) {
          terms.push(tree.args[i]);
        } else if(tree.args[i].isSymbolNode && ((tree.args[i]).toString() == "π")) {
          terms.push("π");
        } else if(tree.args[i].isSymbolNode && ((tree.args[i]).toString() == "e")) {
          terms.push("e");
        } else if(tree.args[i].isSymbolNode && (tree.args[i].toString() == "x")) {
          terms.push("1");
        } else {
          terms.push(solve(tree.args[i]));
        }
      }
      if(terms.length === 2) {
        result = terms[0] +operator+ terms[1];
      } else if(operator !== undefined) {
        result = operator + terms[0];
      } else {
        result = terms[0];
      }
    }
  }
  //simplifying with Algebrite and mathjs can produce better results
  result = simplify(result).toString()
  // result = Algebrite.simplify(result).toString();
  return result;
}