import {OperatorNode, ConstantNode, SymbolNode, ParenthesisNode, FunctionNode, parse, derivative, evaluate, compile, simplify} from 'mathjs';
import Answer from './Answer';

var steps = [];
export function importFunction() {
  steps = [];
  let deriv;
  try { 
    deriv = solve(parse(document.getElementById('input-field').value));
  } catch {
    console.log("error");
  }
  if(deriv != undefined) {
    steps.push(deriv);
  }
  console.log(steps.length);
  Answer(steps);
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
  return (right_equation+"*("+left_equation+"^("+(right_equation+"-1")+"))*("+derivative(left_equation, "x")+")");
}


function productRule(left_node, right_node) {
  console.log("executing product rule");
  let left_equation = left_node.toString();
  let right_equation = right_node.toString();
  return "("+left_equation+")*("+solve(right_node)+")+("+right_equation+")*("+solve(left_node)+")";
}


function quotientRule(left_node, right_node) {
  console.log("executing quotient rule");
  let left_equation = left_node.toString();
  let right_equation = right_node.toString();
  return ("(("+right_equation+")*("+solve(left_node)+"))-(("+left_equation+")*("+solve(right_node)+"))/("+right_equation+")^2");
}

const difunctionRules = {"^": powerRule, "/": quotientRule, "*": productRule};

/*  
DOES NOT WORK FOR EXPONENTS
*/
function solve(mathTree) {
  let tree = mathTree;
  let result;
  console.log("equation")
  console.log(mathTree.toString())
  if(!(tree.hasOwnProperty('args'))) {
    tree = mathTree.content;
  }
  console.log("tree");
  console.log(tree);
  let left_node = tree.args[0];
  let right_node = tree.args[1];
  let operator = tree.op;
  let statements = [];
  //console.log('constant or symbol node');
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
    if(((tree.args[0] instanceof OperatorNode || tree.args[0] instanceof ParenthesisNode) && (tree.args[1] instanceof OperatorNode || tree.args[1] instanceof ParenthesisNode)) || (operator == "^")) {
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
  result = simplify(result).toString();
  console.log(result);
  return result;
}