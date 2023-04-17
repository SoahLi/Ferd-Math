import {OperatorNode, ConstantNode, SymbolNode, ParenthesisNode, parse, derivative, evaluate, compile, simplify, planckMassDependencies} from 'mathjs';

var steps = [];

export function importFunction() {
  // try { 
  //   solve(parse(document.getElementById('input-field').value));
  // } catch {
  //   console.log("error");
  // }
  solve(simplify(parse("(x^2+3)*(x^2+4)")));
}

function powerRule(leftNode, rightNode) {
  return "powerRule   " + [leftNode, rightNode];
}


function productRule(left_node, right_node) {
  let left_equation = left_node.toString();
  let right_equation = right_node.toString();
  //return simplify(left_equation+"*"+derivative(right_equation,"x")+"+"+right_equation+"*"+derivative(left_equation,"x")).toString();
  return (("("+left_node.toString()+")*("+derivative(right_node, "x").toString()+")+("+right_node.toString()+")*("+derivative(left_node, "x").toString()+")"));
}


function quotientRule(leftNode, rightNode) {
  let left_equation = leftNode.toString();
  let right_equation = rightNode.toString();
  console.log("("+right_equation+"*"+derivative(left_equation, "x")+"-"+left_equation+"*"+derivative(right_equation, "x")+")"+"/"+right_equation+"^2");
  return simplify("("+right_equation+"*"+derivative(left_equation, "x")+"-"+left_equation+"*"+derivative(right_equation, "x")+")"+"/"+right_equation+"^2");
}

const difRules = {"^": powerRule, "/": quotientRule, "*": productRule};

/*  
DOES NOT WORK FOR EXPONENTS
*/
function solve(mathTree) {
  let tree = mathTree;
  let result;
  if(!(tree.hasOwnProperty('args'))) {
    tree = mathTree.content;
  }
  console.log("equation")
  console.log(mathTree.toString())
  console.log("tree");
  console.log(tree);
  let left_node = tree.args[0];
  let right_node = tree.args[1];
  let operator = tree.op;
  let statements = [];
  //console.log('constant or symbol node');
  if(operator == "+" || operator == "-") {
    console.log("non rule");
    for(let i=0; i<2; i++) {
      if(tree.args[i] instanceof ConstantNode) {
        console.log("constant found");
        statements.push("0");
      } else {
        console.log("going deeper");
        statements.push(solve(tree.args[i]));
      }
    }
    result = statements[0] +operator+ statements[1];
  } else {
    console.log("rules apply");
    if((tree.args[0] instanceof OperatorNode || tree.args[0] instanceof ParenthesisNode) && (tree.args[1] instanceof OperatorNode || tree.args[1] instanceof ParenthesisNode)) {
      console.log("double op");
      result = difRules[operator](left_node, right_node);
    } else {
      for(let i=0; i<2; i++) {
        if(tree.args[i] instanceof ConstantNode) {
          console.log("constant found");
          statements.push(tree.args[i]);
        } else {
          console.log("going deeper");
          statements.push(solve(tree.args[i]));
        }
      }
      result = statements[0] +operator+ statements[1];
    }
  }
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