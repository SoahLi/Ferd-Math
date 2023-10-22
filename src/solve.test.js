//tests do not run smoothly, have to test manually
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
    const result = solve('sin(x)');
    expect(result).toBe('cos(x)');
  });

  it('calculates the derivative of a trigonometric function correctly', () => {
    const result = solve('sin(2*x)');
    expect(result).toBe('(2)*cos(2 * x)');
  });

  it('calculates the derivative of an exponential function correctly', () => {
    const result = solve('e^(3*x)');
    expect(result).toBe('3*exp(3*x)');
  });
  
  it('calculates a symbol raised to a function', () => {
    const result = solve('e^sin(x)')
    expect(result).toBe("e^sin(x) * cos(x) * lne")
  })

  it('calculates the derivative of an exponential function with a constant coefficient', () => {
    const result = solve("3^x");
    expect(result).toBe("3^x * ln(3)")
  });


  it('calculates the derivative of a composite function correctly', () => {
    const result = solve('(2*x^2 + 3*x)^3');
    expect(result).toBe('3 * (2 * x ^ 2 + 3 * x) ^ 2 * (4 * x + 3)');
  });

  it('calculates the derivative using the chain rule with trigonometric function correctly', () => {
    const result = solve('sin(x^2)');
    expect(result).toBe('2 * x * cos(x ^ 2)');
  });
  //wrong because of simplification
  it('calculates the derivative using the quotient rule correctly', () => {
    const result = solve('(x^2 + 2*x) / (x + 1)');
    expect(result).toBe('(x ^ 2 + 2 * x + 2) / (x + 1) ^ 2');
  });
  it('calculates quotient rule with two trig functions', () => {
    const result = solve("(sin(x))/(cos(x))");
    expect(result).toBe("(cos(x)^2+sin(x)^2)/(cos(x)^2)")
  })
  //having trouble with fractions
  it('calculates the derivative using the power rule with fractional exponent correctly', () => {
    const result = solve('x^(1/2)');
    expect(result).toBe('0.5 * x^(-0.5)');
  });
  it('calculates the derivative using the product', () => {
    const result = solve("(2x+5)*(3x^2+1)")
    expect(result).toBe('18x^2+30x+2')
  })

  it('calculates the derivate of a double composit function', () => {
    const result = solve("sin((5*x+3)^2)");
    expect(result).toBe('cos((5x+3)^2 * 2(5x+3) * 5');
  });
  it('can calculate pi', () => {
    const result = solve("πx");
    expect(result).toBe('π');
  })
});


