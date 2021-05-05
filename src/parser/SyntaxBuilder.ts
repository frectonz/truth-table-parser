import { Builder } from "./Builder";
import { TTP, Node, BinOpNode, UnaryOpNode, VariableNode } from "./TTPSyntax";
import { TTPError, ErrorType } from "./Error";

export class SyntaxBuilder implements Builder {
  private tokens: string[];
  private varName: string;
  private ttp: TTP;
  constructor() {
    this.tokens = [];
    this.varName = "";
    this.ttp = new TTP();
  }

  createVar() {
    this.tokens.push(this.varName);
  }
  setVarName(name: string) {
    this.varName = name;
  }

  addNegation() {
    this.tokens.push("!");
  }

  addConjunction() {
    this.tokens.push("&");
  }
  addDisjunction() {
    this.tokens.push("|");
  }
  addImplication() {
    this.tokens.push("=>");
  }
  addBiImplication() {
    this.tokens.push("<=>");
  }

  startProp() {
    this.tokens.push("(");
  }
  endProp() {
    this.tokens.push(")");
  }

  done() {
    if (this.ttp.errors.length > 0) {
      return;
    }
    this.generateBinaryExpressionTree();
  }

  getTTP(): TTP {
    return this.ttp;
  }

  syntaxError(line: number, pos: number) {
    this.ttp.errors.push(
      new TTPError(
        ErrorType.SYNTAX,
        `Syntax Error at line ${line} and character ${pos}.`,
        line,
        pos
      )
    );
  }
  unaryError(line: number, pos: number) {
    this.ttp.errors.push(
      new TTPError(
        ErrorType.UNARY,
        `Unary Connective Error at line ${line} and character ${pos}.`,
        line,
        pos
      )
    );
  }
  binaryError(line: number, pos: number) {
    this.ttp.errors.push(
      new TTPError(
        ErrorType.BINARY,
        `Binary Connective Error at line ${line} and character ${pos}.`,
        line,
        pos
      )
    );
  }
  variableError(line: number, pos: number) {
    this.ttp.errors.push(
      new TTPError(
        ErrorType.VARIABLE,
        `Variable Error at line ${line} and character ${pos}.`,
        line,
        pos
      )
    );
  }
  propositionError(line: number, pos: number) {
    this.ttp.errors.push(
      new TTPError(
        ErrorType.PROPOSITION,
        `Proposition Error at line ${line} and character ${pos}.`,
        line,
        pos
      )
    );
  }

  private getConnPrecedence(conn: string) {
    switch (conn) {
      case "!":
        return 1;
      case "&":
        return 2;
      case "|":
        return 3;
      case "=>":
        return 4;
      case "<=>":
        return 5;
      default:
        return 0;
    }
  }

  private generatePrefixNotation() {
    const output: string[] = [];
    const operators: string[] = [];

    this.tokens.forEach((token) => {
      if (this.tokenIsAName(token)) {
        output.push(token);
      } else if (this.tokenIsABinaryConnective(token)) {
        while (
          operators.length > 0 &&
          this.getConnPrecedence(token) <=
            this.getConnPrecedence(operators[operators.length - 1])
        ) {
          let operator = operators.pop();
          if (operator) output.push(operator);
        }
        operators.push(token);
      } else if (token === "(") {
        operators.push(token);
      } else if (token === ")") {
        while (
          operators.length > 0 &&
          operators[operators.length - 1] !== "("
        ) {
          let operator = operators.pop();
          if (operator) output.push(operator);
        }

        operators.pop();
      } else if (this.tokenIsAUnaryConnective(token)) {
        operators.push(token);
      }
    });

    while (operators.length > 0) {
      let operator = operators.pop();
      if (operator) output.push(operator);
    }

    return output;
  }

  private generateBinaryExpressionTree() {
    let postfixNotation = this.generatePrefixNotation();
    let stack: Node[] = [];

    postfixNotation.forEach((notation) => {
      if (this.tokenIsAName(notation)) {
        stack.push(new VariableNode(notation));
        this.ttp.variables.add(notation);
      } else if (this.tokenIsABinaryConnective(notation)) {
        let right = stack.pop();
        let left = stack.pop();
        if (left && right) {
          let binOp = new BinOpNode(left, notation, right);
          stack.push(binOp);
        }
      } else if (this.tokenIsAUnaryConnective(notation)) {
        let node = stack.pop();
        if (node) {
          let unaryOp = new UnaryOpNode(notation, node);
          stack.push(unaryOp);
        }
      }
    });

    const lastNode = stack.pop();

    if (lastNode) {
      this.ttp.root = lastNode;
    }
  }

  private tokenIsAName(token: string) {
    return !(
      token === "!" ||
      token === "&" ||
      token === "|" ||
      token === "=>" ||
      token === "<=>" ||
      token === "(" ||
      token === ")"
    );
  }

  private tokenIsABinaryConnective(token: string) {
    return token === "&" || token === "|" || token === "=>" || token === "<=>";
  }

  private tokenIsAUnaryConnective(token: string) {
    return token === "!";
  }
}
