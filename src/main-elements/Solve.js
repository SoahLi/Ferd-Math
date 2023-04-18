import {OperatorNode, ConstantNode, SymbolNode, ParenthesisNode, parse, derivative, evaluate, compile, simplify} from 'mathjs';

var steps = [];
export function importFunction() {
  // try { 
  //   solve(parse(document.getElementById('input-field').value));
  // } catch {
  //   console.log("error");
  // }
  solve(simplify(parse("(x^2+2x)/(-3x-4)")));
}

function powerRule(leftNode, rightNode) {
  let right_equation = rightNode.toString();
  let left_equation = leftNode.toString();
  return (right_equation+"*("+left_equation+"^("+(right_equation+"-1")+"))*("+derivative(left_equation, "x")+")");
}


function productRule(left_node, right_node) {
  let left_equation = left_node.toString();
  let right_equation = right_node.toString();
  return "("+left_equation+")*("+solve(right_node)+")+("+right_equation+")*("+solve(left_node)+")";
}


function quotientRule(left_node, right_node) {
  let left_equation = left_node.toString();
  let right_equation = right_node.toString();
  return ("(("+right_equation+")*("+solve(left_node)+"))-(("+left_equation+")*("+solve(right_node)+"))/("+right_equation+")^2");
}

const difRules = {"^": powerRule, "/": quotientRule, "*": productRule};

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
      if(tree.args[i] instanceof ConstantNode) {
        console.log("constant found");
        statements.push("0");
      } else if(tree.args[i] instanceof SymbolNode) {
        console.log("symbol found");
        statements.push("1");
      } else {
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
      result = difRules[operator](left_node, right_node);
    } else {
      for(let i=0; i<tree.args.length; i++) {
        if(tree.args[i] instanceof ConstantNode) {
          console.log("constant found");
          statements.push(tree.args[i]);
        } else if(tree.args[i] instanceof SymbolNode) {
          console.log("symbol found");
          statements.push("1");
        } else {
          console.log("going deeper");
          statements.push(solve(tree.args[i]));
        }
      }
      if(statements.length == 2) {
        result = statements[0] +operator+ statements[1];
      } else {
        result = operator + statements[0];
      }
    }
  }
  console.log(result);
  result = simplify(result).toString();
  console.log(result);
  return result;
}

/*
MORE CODE FOR SOLVE
*/
//let len = tree.args.length;
// console.log(tree);
// console.log(tree.toString());
// tree = simplify(tree);
// console.log(tree);
// console.log(tree.toString());
// for (let i=0; i<len; i++) {
//     let left_node = solve(tree.args[0]);
//     let right_node = solve(tree.args[1]);
//     let operator = tree.op;
//     difRules[operator](left_node, right_node);
//     console.log(difRules[operator](left_node, right_node));
//     console.log("check 2");
//   }