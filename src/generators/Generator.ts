import { TTP, Node } from "../parser/TTPSyntax";
import { decimalToBinary } from "../utils/decimalToBinary";

let executeProp: (...args: string[]) => string;

export class Generator {
  private ttp: TTP;
  constructor(ttp: TTP) {
    this.ttp = ttp;
  }

  private not(p: string): string {
    if (p === "T") {
      return "F";
    } else {
      return "T";
    }
  }

  private and(p: string, q: string): string {
    if (p === "T" && q === "T") {
      return "T";
    } else {
      return "F";
    }
  }

  private or(p: string, q: string): string {
    if (p === "F" && q === "F") {
      return "F";
    } else {
      return "T";
    }
  }

  private impl(p: string, q: string): string {
    if (p === "T" && q === "F") {
      return "F";
    } else {
      return "T";
    }
  }

  private biImpl(p: boolean, q: boolean) {
    if (p === q) {
      return "T";
    } else {
      return "F";
    }
  }

  private generateVariablesTable() {
    const variables = Array.from(this.ttp.variables.values());
    return new Array(2 ** variables.length)
      .fill(null)
      .map((_, i) =>
        decimalToBinary(i, variables.length).map((val) =>
          val === 0 ? "T" : "F"
        )
      );
  }

  private generateVarInputMap() {
    const inputsMap = new Map<string, string[]>();
    const variables = Array.from(this.ttp.variables.values());
    const variablesTable = this.generateVariablesTable();

    variables.forEach((variable, i) => {
      inputsMap.set(variable, []);
      for (const input of variablesTable) {
        let inputs = inputsMap.get(variable);
        if (inputs) {
          inputs.push(input[i]);
          inputsMap.set(variable, inputs);
        }
      }
    });

    return inputsMap;
  }

  private generatePropositionExecutor() {
    let funcCombination = "";
    const infix = (tree: Node) => {
      if (!tree) {
        return;
      }

      if (this.tokenIsAUnaryConnective(tree.conn)) {
        funcCombination += "this.not(";
      } else if (this.tokenIsABinaryConnective(tree.conn)) {
        switch (tree.conn) {
          case "|":
            funcCombination += "this.or(";
            break;
          case "&":
            funcCombination += "this.and(";
            break;
          case "=>":
            funcCombination += "this.impl(";
            break;
          case "<=>":
            funcCombination += "this.biImpl(";
            break;
        }
      } else {
        funcCombination += tree.name;
      }
      tree.left && infix(tree.left);

      if (this.tokenIsABinaryConnective(tree.conn)) {
        funcCombination += ",";
      }

      tree.right && infix(tree.right);
      if (
        this.tokenIsABinaryConnective(tree.conn) ||
        this.tokenIsAUnaryConnective(tree.conn)
      ) {
        funcCombination += ")";
      }
    };

    this.ttp.root && infix(this.ttp.root);

    const js = `executeProp = (${Array.from(this.ttp.variables.values()).join(
      ","
    )}) => { return ${funcCombination} }`;

    return js;
  }

  generate(): any {
    let outputMap = this.generateVarInputMap();
    const variablesTable = this.generateVariablesTable();
    const variables = Array.from(this.ttp.variables.values());
    const prop = this.ttp.toString();

    eval(this.generatePropositionExecutor());

    outputMap.set(prop, []);

    variablesTable.forEach((variables) => {
      let result = outputMap.get(prop);
      if (result) {
        result.push(executeProp(...variables));
        outputMap.set(prop, result);
      }
    });

    let obj = new Array(2 ** variables.length).fill(null).map((_, i) => {
      const obj: any = {};

      variables.forEach((variable) => {
        const values = outputMap.get(variable);
        if (values) {
          obj[variable] = values[i];
        }
      });

      const result = outputMap.get(prop);
      if (result) {
        obj[prop] = result[i];
      }

      return obj;
    });

    return obj;
  }

  getErrors() {
    return this.ttp.errors;
  }

  private tokenIsABinaryConnective(token: string | null) {
    return token === "&" || token === "|" || token === "=>" || token === "<=>";
  }

  private tokenIsAUnaryConnective(token: string | null) {
    return token === "!";
  }
}
