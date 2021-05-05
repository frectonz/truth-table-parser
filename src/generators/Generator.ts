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

  private generateVariables() {
    let inputs = [];
    const variables = Array.from(this.ttp.variables.values());
    for (let i = 0; i < Math.max(variables.length ** 2, 2); i++) {
      inputs.push(
        decimalToBinary(i, variables.length).map((num) => (num ? "F" : "T"))
      );
    }
    return inputs;
  }

  private generateVarInputMap() {
    const inputsMap = new Map<string, string[]>();
    const variables = Array.from(this.ttp.variables.values());
    const variableInputs = this.generateVariables();

    variables.forEach((variable, i) => {
      inputsMap.set(variable, []);
      for (const input of variableInputs) {
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

  generate() {
    let outputMap = this.generateVarInputMap();
    const inputVariables = this.generateVariables();

    eval(this.generatePropositionExecutor());

    outputMap.set("result", []);
    inputVariables.forEach((variables) => {
      let result = outputMap.get("result");
      if (result) {
        result.push(executeProp(...variables));
        outputMap.set("result", result);
      }
    });

    let outputObj: any = {};
    for (const key of outputMap.keys()) {
      const values = outputMap.get(key);
      if (values) {
        outputObj[key] = values;
      }
    }

    return outputObj as object;
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
