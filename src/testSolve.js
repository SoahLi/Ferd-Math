import {parse, derivative, simplify} from 'mathjs';
var Algebrite = require("algebrite")
var steps = [];

function functionRule(node) {
  let equation = node.args[0];
  let difEquation;
  steps.push("The derivative of the function times the derivative of the inside");
  steps.push("the derivative of the function")
  let func = node.name+"(t)";
  func = derivative(func, "t").toString();
  steps.push("the derivative of the inside");
  if(equation.isFunctionNode) {
    difEquation  = functionRule(equation);
  } else {
    difEquation = solve(equation);
  }
  let finalEquation = "("+difEquation+")*"+func.replace("t", equation);
  return (finalEquation);
}

function powerRule(leftNode, rightNode) {
  if((rightNode.isSymbolNode) || (rightNode.isOperatorNode) || (rightNode.isParenthesisNode)) {
    return exponentRule(leftNode, rightNode);
  } else {
    //console.log("executing power rule");
    let right_equation = rightNode.toString();
    let left_equation = leftNode.toString();
    // eslint-disable-next-line
    let equation = (right_equation+"*("+left_equation+"^("+(right_equation+"-1")+"))*("+solve(leftNode)+")");

    steps.push("apply the power rule and don't forget the baby");
    return equation; 
  }
}

function exponentRule(leftNode, rightNode) {
  steps.push("The original times the ln of the base times the derviative of the exponent");
  let right_equation = rightNode.toString();
  let left_equation = leftNode.toString();
  let equation = (left_equation+"^("+right_equation+")*log("+left_equation+")*(("+solve(rightNode)+"))");
  //console.log("this the equation");
  //console.log(equation);
  return equation;
}



function productRule(left_node, right_node) {
  steps.push("the first guy times the derivative of the second guy plus the second guy times the derivative of the first guy");
  let left_equation = left_node.toString();
  let right_equation = right_node.toString();
  steps.push("the left sides derivative:");
  let left_derivative = solve(left_node);
  steps.push("the rigth sides derivative:");
  let right_derivative = solve(right_node);
  let equation = "("+left_equation+")*("+right_derivative+")+("+right_equation+")*("+left_derivative+")";
  return equation;
}


function quotientRule(left_node, right_node) {
  steps.push("the denominator times the derivative of the numerator minus the numerator times the derivative of the denominator all over the denominator squared");
  steps.push("the denominator's derivative:");
  let left_equation = left_node.toString();
  let right_equation = right_node.toString();
  let right_derivative = solve(right_node);
  steps.push("the numerator's derivative:");
  let left_derivative = solve(left_node);
  let equation =  ("(("+right_equation+"*("+left_derivative+"))-("+left_equation+"*("+right_derivative+")))/("+right_equation+")^2");
  //console.log(equation);
  return equation;
}

const difunctionRules = {"^": powerRule, "/": quotientRule, "*": productRule};




function removeParenthesis(mathTree) {
  //console.log("removing parenthesis");
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
  //console.log()
  //console.log(left_side + mathTree.operator + right_side);
  return parse(left_side + mathTree.operator + right_side);
}
function parseTheTree(mathString) {
  let InParenthises = false
  let openParens = 0
  let char;
  let unadded_idx = 0
  let args = []
  let operators = []
  for( let i = 0; i < mathString.length; i++) {
      char = mathString[i]
      if ( char == "(") {
          openParens++
      }
      else if (char == ")") {
          if (!openParens) {
              args.push(mathString.substring(unadded_idx+1, i+1))
              unadded_idx = i+1
          }   else {
              openParens--;
          }
      }

      else if (char == "+" || char == "-") {
          if (!openParens) {
              args.push(mathString.substring(unadded_idx, i))
              unadded_idx = i+1
              operators.push(char)
          }
      }
      //console.log(args)
  }
  if (unadded_idx != mathString.length-1) {
      args.push(mathString.substring(unadded_idx, mathString.length))
  }
  return args, operators
}

function isAFunction(mathString) {
  if ("*" in mathString || "^" in mathString || "/" in mathString) {
    return true
  }
  return false
}

function replace(string) {
  return string.replace(/xp/g, ' ^ ');
}



//main function
export function solve(mathTree) {
  let tree = mathTree;
  //console.log(parseTheTree(tree.toString()))
  if(typeof(tree) == "string") {
    tree = parse(tree);
  }
  //let [components, symbols] = parseTheTree(tree.toString())
  let result;
  if(tree.isSymbolNode) {
    if(tree.toString() == "e") return "0";
    return "1";
  }
  if(tree.isConstantNode) {
    return "0";
  }
  if(tree.isFunctionNode) {
    result = functionRule(tree).toString();
    return result;
  }
  /*
  *this is not true
  *splits tree by middle operator
  *example 2x+5 splits to 2x and 5
  */
  // if (tree.operator == "*" || tree.operator == "^") {
    
  // }
  //'3*x^4 - 2*x^3 + 5*x^2 - x + 7'
  while(tree.isParenthesisNode){
    tree = tree.content
  }
  let left_node = tree.args[0];
  let right_node = tree.args[1];
  let operator = tree.op;
  let statements = [];
  //split terms first
  if(operator === "+" || operator === "-") {
    for(let i=0; i<tree.args.length; i++) {
        statements.push(solve(tree.args[i]));
    }
    if(statements.length === 2) {
      result = statements[0] +operator+ statements[1];
    } else {
      result = operator + statements[0];
    }
  } else {
    // if(tree.args[0].isConstantNode && tree.args[1].isConstantNode) {
    //   return "0";
    // }
    if(((tree.args[0].isOperatorNode || tree.args[0].isParenthesisNode || tree.args[0].isFunctionNode) || (tree.args[1].isOperatorNode || tree.args[1].isParenthesisNode || tree.args[1].isFunctionNode)) || (operator == "^") ) {
      result = difunctionRules[operator](left_node, right_node);
    } 

    else {
      for(let i=0; i<tree.args.length; i++) {
        if(tree.isFunctionNode) {
          statements.push(functionRule(tree));
        } else if(tree.args[i].isConstantNode) {
          statements.push(tree.args[i]);
        } else if(tree.args[i].isSymbolNode) {
          statements.push("1");
        }  else {
          statements.push(solve(tree.args[i]));
        }
      }
      if(statements.length === 2) {
        result = statements[0] +operator+ statements[1];
      } else if(operator !== undefined) {
        result = operator + statements[0];
      } else {
        result = statements[0];
      }
    }
  }
  // result = simplify(result).toString()
  // result = Algebrite.simplify(result).toString();
  // result = Algebrite.simplify(result).toString();
  // result = replace(result)
  //result = Algebrite.simplify(Algebrite.simplify(simplify(result).toString()).toString()).toString();
  return result;
}
