import { TTPError } from "./Error";

export class Node {
  left: Node | null;
  right: Node | null;
  conn: string | null;
  name: string | null;

  constructor() {
    this.left = null;
    this.right = null;
    this.conn = null;
    this.name = null;
  }
}

export class VariableNode extends Node {
  constructor(name: string) {
    super();
    this.name = name;
  }
}

export class BinOpNode extends Node {
  constructor(left: Node, conn: string, right: Node) {
    super();
    this.left = left;
    this.conn = conn;
    this.right = right;
  }
}

export class UnaryOpNode extends Node {
  constructor(conn: string, node: Node) {
    super();
    this.conn = conn;
    this.left = node;
  }
}

export class TTP {
  root: Node | null;
  variables: Set<string>;
  errors: TTPError[];
  constructor() {
    this.root = null;
    this.variables = new Set();
    this.errors = [];
  }

  toString(): string {
    let output: string[] = [];
    const infix = (tree: Node) => {
      if (!tree) {
        return;
      }

      if (this.tokenIsAUnaryConnective(tree.conn)) {
        output.push("!");
      } else if (this.tokenIsABinaryConnective(tree.conn)) {
        output.push("(");
      } else {
        tree.name && output.push(tree.name);
      }
      tree.left && infix(tree.left);
      if (this.tokenIsABinaryConnective(tree.conn)) {
        tree.conn && output.push(tree.conn);
      }
      tree.right && infix(tree.right);
      if (this.tokenIsABinaryConnective(tree.conn)) {
        output.push(")");
      }
    };

    this.root && infix(this.root);
    return output.join("");
  }

  private tokenIsABinaryConnective(token: string | null) {
    return token === "&" || token === "|" || token === "=>" || token === "<=>";
  }

  private tokenIsAUnaryConnective(token: string | null) {
    return token === "!";
  }
}
